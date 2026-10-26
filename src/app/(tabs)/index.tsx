import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFocusEffect } from 'expo-router';
import { cores } from '@/constants/cores';
import { listarProdutos, Produto } from '@/services/produtos';
import { diasParaVencer, brParaIso } from '@/utils/datas';


export default function Index() {
  const [local, setLocal] = useState<"Todos" | "Geladeira" | "Despensa">("Todos");
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useFocusEffect(
    useCallback(() => {
      listarProdutos().then(setProdutos);
    }, [])
  );

  const filtrados = local === "Todos" ? produtos : produtos.filter((item) => item.local === local);
  const vencendo = produtos.filter((p) => diasParaVencer(p.validade) <= 7).length;

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
          <View>
            <Text style={styles.titulo}>Despensa +</Text>
            <Text style={styles.texto}>Sua casa, em dia</Text>
          </View>

        <Pressable style={styles.notificacao}>
          <Ionicons name="notifications" size={24} color="black" margin={8} />
        </Pressable>
      </View>

      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTextoNegrito}>{vencendo} itens vencem essa semana</Text>
          <Text style={styles.bannerTexto}>Usem antes que estraguem</Text>
        </View>
        <Pressable style={styles.bannerBotao}>
          <Text style={{ color: cores.primary }}>Ver alertas</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 20 , width: '100%'}}>
        <Pressable style={local === "Todos" ? styles.botaofiltroAtivo : styles.botaofiltro} onPress={() => setLocal("Todos")}>
          <Text style={local === "Todos" ? styles.textoBotaoAtivo : styles.textoBotao}>Todos</Text>
        </Pressable>
        <Pressable style={local === "Geladeira" ? styles.botaofiltroAtivo : styles.botaofiltro} onPress={() => setLocal("Geladeira")}>
          <Text style={local === "Geladeira" ? styles.textoBotaoAtivo : styles.textoBotao}>Geladeira</Text>
        </Pressable>
        <Pressable style={local === "Despensa" ? styles.botaofiltroAtivo : styles.botaofiltro} onPress={() => setLocal("Despensa")}>
          <Text style={local === "Despensa" ? styles.textoBotaoAtivo : styles.textoBotao}>Despensa</Text>
        </Pressable>
      </View>

      <View style={{width: '100%'}}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Itens {local === "Todos" ? "da sua residência" : local}</Text>
        <FlatList
         data={filtrados}
         keyExtractor={(item) => String(item.id)}
         renderItem={({ item }) => {
          const dias = diasParaVencer(item.validade);

          return(
            <View style={styles.card}>
              <View style={styles.cardIcone}>
                {item.local === 'Geladeira' ? (
                  <FontAwesome6 name="snowflake" size={30} color={cores.vermelho} />
                ) : (
                  <Feather name='box' size={30} color={cores.vermelho} />
                )}
              </View>
              <View>
                <Text style={styles.cardTitulo}>{item.nome}</Text>
                <Text style={styles.cardDescricao}>{item.local} {item.quantidade} unidades</Text>
              </View>
              <View style={styles.cardData}>
                <Text style={styles.cardDataText}>{dias === 1 ? "Amanhã" : `${dias} dias`}</Text>
              </View>
            </View> 
        )}}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: cores.fundo,
    padding: 10,
    paddingHorizontal: 18,
    minHeight: '100%',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  notificacao: {
    borderRadius: "50%",
    backgroundColor: cores.branco,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },


  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: cores.primary,
    padding: 8,
  },
  bannerTexto: {
    fontSize: 16,
    color: cores.branco,
  },
  bannerTextoNegrito: {
    fontSize: 18,
    color: cores.branco,
    fontWeight: 'bold',
  },
  bannerBotao: {
    backgroundColor: cores.branco,
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  botaofiltro:{
    backgroundColor: cores.branco,
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  botaofiltroAtivo: {
    backgroundColor: cores.preto,
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  textoBotaoAtivo: {
    color: cores.branco,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  textoBotao: {
    color: cores.preto,
    fontSize: 16,
    paddingHorizontal: 8, 
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 80,
    backgroundColor: cores.branco,
    borderRadius: 17,
    marginBottom: 10,
    padding: 8,
  },
  cardIcone: {
    width: 60,
    height: 60,
    backgroundColor: cores.vermelhoClaro,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.title,
  },
  cardDescricao: {
    fontSize: 14,
    color: cores.text,
  },
  cardData: {
    backgroundColor: cores.vermelhoClaro,
    padding: 8,
    borderRadius: 10,
  },
  cardDataText: {
    fontSize: 14,
    color: cores.vermelho,
  },

  titulo: { fontSize: 28, marginBottom: 16, color: cores.preto, fontWeight: 'bold' },
  texto: { fontSize: 16, marginBottom: 16, color: cores.text },

});