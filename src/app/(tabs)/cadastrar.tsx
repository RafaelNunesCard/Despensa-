import { ScrollView, View, Text, Pressable, StyleSheet, TextInput, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { cores } from '@/constants/cores';
import { useState } from 'react';
import { Alert } from 'react-native';
import { salvarProduto } from '@/services/produtos';
import { brParaIso } from '@/utils/datas';
import CameraModal from '@/components/cameraModal';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';


const LOCAIS = ['Geladeira', 'Despensa', 'Limpeza'] as const;
type Local = (typeof LOCAIS)[number];

const ALERTAS = [
  { label: '1 dia antes, às 08:00', dias: 1 },
  { label: '2 dias antes, às 08:00', dias: 2 },
];


export default function Cadastrar() {
    const [local, setLocal] = useState<Local>("Geladeira");
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [validade, setValidade] = useState('');
    const [diasAlerta, setDiasAlerta] = useState(1);
    const [cameraAberta, setCameraAberta] = useState(false);
    const [foto, setFoto] = useState<string | null>(null);

    async function salvar() {
        const validadeIso = brParaIso(validade);

        if (!nome.trim() || !validadeIso || Number(quantidade) < 1) {
            Alert.alert('Confira os campos', 'Preencha nome, quantidade e uma validade válida.');
            return;
        }
        let fotoFinal: string | undefined;

        if (foto) {
        const destino = new File(Paths.document, `produto-${Date.now()}.jpg`);
        new File(foto).copy(destino);
        fotoFinal = destino.uri;
        }

        await salvarProduto({
            foto: fotoFinal,
            nome: nome.trim(),
            local,
            quantidade: Number(quantidade),
            validade: validadeIso,
            diasAlerta,
        });

        setFoto(null);
        setNome('');
        setQuantidade('');
        setValidade('');
        Alert.alert('Salvo!', 'Produto cadastrado.');
    }

    async function escolherDaGaleria() {
    console.log('toquei na galeria');
    try {
        const resultado = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
        console.log('resultado:', resultado);
        if (!resultado.canceled) setFoto(resultado.assets[0].uri);
    } catch (erro) {
        console.log('erro:', erro);
    }
    }


    return (
        <ScrollView
            style={{ backgroundColor: cores.fundo }}   // só a "janela": fundo, tamanho
            contentContainerStyle={styles.container}   // o conteúdo: alignItems, padding, gap
        >
            <View style={styles.conatinerImage}>
                {foto ? (
                    <Image source={{ uri: foto }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                ) : (
                    <>
                    <AntDesign name="camera" size={30} color={cores.preto} />
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Foto do produto</Text>
                    </>
                )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Pressable style={styles.botao} onPress={() => setCameraAberta(true)}>
                    <AntDesign name="camera" size={24} color={cores.branco} />
                    <Text style={{ color: cores.branco }}>Tirar foto</Text>
                </Pressable>
                <Pressable style={[styles.botao, { backgroundColor: cores.branco }]} onPress={escolherDaGaleria}>
                    <FontAwesome name="picture-o" size={24} color={cores.primary} />
                    <Text style={{ color: cores.primary }}>Galeria</Text>
                </Pressable>
            </View>

            <CameraModal
                visivel={cameraAberta}
                aoFechar={() => setCameraAberta(false)}
                aoCapturar={setFoto}
            />

            <View style={{ gap: 8, width: '100%', marginTop: 16 , marginBottom: 16}}>
                <Text style={styles.texto}>Nome do produto</Text>
                <TextInput placeholder="Nome:" style={styles.input} value={nome} onChangeText={setNome}/>
            </View>

            <View style={{width: "100%", gap: 8}}>
                <Text style={styles.texto}>Onde fica guardado</Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                {LOCAIS.map((l) => (
                    <Pressable
                        key={l}
                        style={local === l ? styles.botaoFiltroAtivo : styles.botaoFiltro}
                        onPress={() => setLocal(l)}
                    >
                    <Text style={local === l ? styles.textoBotaoAtivo : styles.textoBotao}>
                        {l}
                    </Text>
                    </Pressable>
                ))}
                </View>
            </View>

            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                 <View style={{ gap: 8, width: '35%', marginTop: 16 , marginBottom: 16}}>
                    <Text style={styles.texto}>Quantidade</Text>
                    <TextInput placeholder="0" style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
                </View>
                <View style={{ gap: 8, width: '60%', marginTop: 16 , marginBottom: 16}}>
                    <Text style={styles.texto}>Validade</Text>
                    <TextInput placeholder="00/00/0000" style={styles.input} value={validade} onChangeText={setValidade} />
                </View>
            </View>

            <View style={{ width: '100%', gap: 8, marginBottom: 10}}>
                <Text style={styles.texto}>Avisar quando</Text>
                <Picker selectedValue={diasAlerta} onValueChange={setDiasAlerta}>
                    {ALERTAS.map((a) => (
                        <Picker.Item key={a.dias} label={a.label} value={a.dias} />
                    ))}
                </Picker>
            </View>

            <View style={{width: '100%'}}>
                <Pressable style={[styles.botao, {flexDirection: 'column', width: '100%'}]} onPress={salvar}>
                    <Text style={[styles.textoBotao, {color: cores.branco}]}>Salvar Item</Text>
                </Pressable>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
      container: {
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 18,
        paddingBottom: 40, // folga no final para o último campo não colar na borda
      },

      conatinerImage: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 170,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: cores.preto,
      },

      botao: {
        flexDirection: 'row',
        backgroundColor: cores.primary,
        padding: 10,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        borderRadius: 10,
      },

      input: {
        width: '100%',
        height: 45,
        fontSize: 18,
        paddingHorizontal: 10,
        backgroundColor: cores.branco,
        color: cores.preto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: cores.bege
      },

      notificacao: {
        width: '100%',
        fontSize: 18,
        backgroundColor: cores.branco,
        color: cores.preto,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: cores.bege
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

      textoBotao: { fontSize: 18 },

      textoBotaoAtivo: { fontSize: 18, color: cores.verde },
      
      texto: { fontWeight: "bold", fontSize: 16, color: cores.text },

})