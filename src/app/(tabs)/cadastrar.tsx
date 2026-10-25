import { View, Text, Pressable, StyleSheet, TextInput, FlatList } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { cores } from '@/constants/cores';
import { Link } from 'expo-router';

export default function Cadastrar() {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <AntDesign name="camera" size={24} color="black" />
                <Text>Foto do produto</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Pressable style={styles.botao}>
                    <AntDesign name="camera" size={24} color={cores.branco} />
                    <Text style={{ color: cores.branco }}>Tirar foto</Text>
                </Pressable>
                <Pressable style={[styles.botao, { backgroundColor: cores.branco }]}>
                    <FontAwesome name="picture-o" size={24} color={cores.primary} />
                    <Text style={{ color: cores.primary }}>Galeria</Text>
                </Pressable>
            </View>

            <View>

            </View>

        </View>
    )
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

      botao: {
        backgroundColor: cores.primary,
        padding: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
      },

})