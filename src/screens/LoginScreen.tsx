import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

   setLoading(true);

try {
  // Simulación de login (para demo)
  if (username === 'admin' && password === 'restobar123') {
    // Para web compatibility
    if (typeof window !== 'undefined') {
      localStorage.setItem('userToken', 'demo-token');
      localStorage.setItem('userName', username);
    } else {
      await AsyncStorage.setItem('userToken', 'demo-token');
      await AsyncStorage.setItem('userName', username);
    }
    Alert.alert('¡Bienvenido!', 'Login exitoso', [
      { text: 'OK', onPress: onLogin }
    ]);
  } else {
    Alert.alert('Error', 'Credenciales incorrectas\nUsa: admin / restobar123');
  }
} catch (error) {
  Alert.alert('Error', 'Error al iniciar sesión');
} finally {
  setLoading(false);
}
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ RestoBar AI</Text>
        <Text style={styles.subtitle}>Sistema Inteligente de Gestión</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Ingresa tu usuario"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#666"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>

        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>📝 Credenciales de demo:</Text>
          <Text style={styles.demoCredentials}>Usuario: admin</Text>
          <Text style={styles.demoCredentials}>Contraseña: restobar123</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  button: {
    backgroundColor: '#ff6b35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ff6b3580',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoInfo: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  demoText: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoCredentials: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
});