import { View, Text, StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { cores } from '@/constants/cores';
import { listarProdutos, Produto } from '@/services/produtos';
import { diasParaVencer } from '@/utils/datas';
import { Switch } from 'react-native';

const DIAS = ['1 Dia', '3 Dias', '7 Dias'] as const;
type Dia = (typeof DIAS)[number];

export default function Alertas() {
  const [dias, setDias] = useState<Dia>("1 Dia")
  const [ativo, setAtivo] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([])

  useFocusEffect(
    useCallback(() => {
      listarProdutos().then(setProdutos);
    }, [])
  );

  return (
    <View style={styles.tela}>
      <View style={{width: "100%"}}>
        <Text style={styles.titulo}>Alertas</Text>
        <Text style={styles.texto}>Avisos sobre validade, direto no celular</Text>
      </View>

      <View style={styles.container}>
        <View style={{width: "100%", gap: 8, paddingBottom: 11 }}>
                <Text style={styles.subTitulo}>Avisar com antecedência</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
                {DIAS.map((l) => (
                    <Pressable
                    key={l}
                    style={dias === l ? styles.botaoFiltroAtivo : styles.botaoFiltro}
                    onPress={() => setDias(l)}
                    >
                    <Text style={dias === l ? styles.textoBotaoAtivo : ""}>
                        {l}
                    </Text>
                    </Pressable>
                ))}
                </View>
            </View>
        <View style={styles.lane}>
          <Text style={styles.subTitulo}> Horario do Aviso</Text>
          <Text style={styles.horario}>08:00</Text>
        </View>

        <View style={styles.lane}>
          <Text style={styles.subTitulo}>Avisar itens vencidos</Text>
          <Switch
            value={ativo}
            onValueChange={setAtivo}
            trackColor={{ false: cores.bege, true: cores.verdeClaro }}
            thumbColor={ativo ? cores.verde : cores.branco}
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
          />
        </View>
      </View>

      <View style={{width: '100%', marginTop: 15, gap: 8}}>
        <Text>Proximos avisos</Text>

        {produtos.map((l) => {
         const falta = diasParaVencer(l.validade) - (l.dias_alerta ?? 0);

         return(
          <View style={[styles.container, {padding: 10, flexDirection: 'row', justifyContent: "space-between"}]}>
            <Text style={styles.subTitulo}>{l.nome}</Text>
            <Text>{falta === 1 ? 'Amanhã' : falta + " dias"}, 08:00</Text>
          </View>
        )})}

      </View>
    </View>
  );
}



const styles = StyleSheet.create({
      tela: {
        alignItems: 'center',
        width: "100%",
        backgroundColor: cores.fundo,
        minHeight: '100%',
        padding: 10,
        paddingHorizontal: 18,
        paddingBottom: 40, // folga no final para o último campo não colar na borda
      },

      container: {
        backgroundColor: cores.branco,
        width: "100%",
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: cores.bege,
      },

      lane: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingHorizontal: 0
      },

      botaoFiltro: {
        backgroundColor: cores.branco,
        borderColor: cores.bege,
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 14,
        borderRadius: 30
      },

      botaoFiltroAtivo: {
        backgroundColor: cores.verdeClaro,
        borderColor: cores.verde,
        borderWidth: 1,
        padding: 10,
        paddingHorizontal: 14,
        borderRadius: 30
      },

      textoBotaoAtivo: { color: cores.verde },

      horario: {color: cores.verde, fontSize: 15 , fontWeight: 'bold'},

      titulo: { fontSize: 28, marginBottom: 10, color: cores.preto, fontWeight: 'bold' },
      subTitulo: { fontSize: 16, fontWeight: 'bold' },
      texto: { fontSize: 16, marginBottom: 16, color: cores.text },
})