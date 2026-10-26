import { useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '@/constants/cores';

type Props = {
  visivel: boolean;
  aoFechar: () => void;
  aoCapturar: (uri: string) => void;
};

export default function CameraModal({ visivel, aoFechar, aoCapturar }: Props) {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [lado, setLado] = useState<'back' | 'front'>('back');
  const camera = useRef<CameraView>(null);

  async function tirar() {
    const foto = await camera.current?.takePictureAsync({ quality: 0.5 });
    if (foto) {
      aoCapturar(foto.uri);
      aoFechar();
    }
  }

  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={aoFechar}>
      {!permissao?.granted ? (
        <View style={styles.centro}>
          <Text style={{ marginBottom: 16 }}>Precisamos da câmera para tirar a foto.</Text>
          <Pressable style={styles.botaoPermissao} onPress={pedirPermissao}>
            <Text style={{ color: '#fff' }}>Permitir</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <CameraView ref={camera} style={{ flex: 1 }} facing={lado} />

          <View style={styles.controles}>
            <Pressable onPress={aoFechar}>
              <Ionicons name="close" size={32} color="#fff" />
            </Pressable>

            <Pressable style={styles.obturador} onPress={tirar} />

            <Pressable onPress={() => setLado(lado === 'back' ? 'front' : 'back')}>
              <Ionicons name="camera-reverse" size={32} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botaoPermissao: { backgroundColor: cores.verde, padding: 12, borderRadius: 8 },
  controles: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  obturador: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: cores.verde,
    borderWidth: 4,
    borderColor: cores.verdeClaro,
  },
});