import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Animated } from 'react-native';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentScreen, setCurrentScreen] = useState('camera');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [recognizedProduct, setRecognizedProduct] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  
  // Animaciones
  const scanAnimation = new Animated.Value(0);
  const fadeAnimation = new Animated.Value(1);

  const products = [
    { name: 'Pizza Margherita', emoji: '🍕', price: 'S/ 25.00', confidence: 94 },
    { name: 'Hamburguesa Clásica', emoji: '🍔', price: 'S/ 18.00', confidence: 89 },
    { name: 'Cerveza Artesanal', emoji: '🍺', price: 'S/ 8.00', confidence: 96 },
    { name: 'Cóctel Tropical', emoji: '🍹', price: 'S/ 15.00', confidence: 87 },
    { name: 'Café Americano', emoji: '☕', price: 'S/ 6.00', confidence: 92 },
    { name: 'Ensalada César', emoji: '🥗', price: 'S/ 12.00', confidence: 88 }
  ];

  useEffect(() => {
    if (isAnalyzing) {
      // Animación de escaneo
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(scanAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          })
        ])
      ).start();
    } else {
      scanAnimation.setValue(0);
    }
  }, [isAnalyzing]);

  const handleLogin = () => {
    if (username === 'admin' && password === 'restobar123') {
      setIsLoggedIn(true);
      Alert.alert('Bienvenido', 'Login exitoso - Acceso a RestoBar AI');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas\nUsuario: admin\nPassword: restobar123');
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setRecognizedProduct(null);
    setCameraActive(false);

    // Simular progreso de análisis
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Simular reconocimiento después de 2.5 segundos
    setTimeout(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const variableConfidence = randomProduct.confidence + Math.floor(Math.random() * 6) - 3; // ±3%
      
      setRecognizedProduct({
        ...randomProduct,
        confidence: Math.max(80, Math.min(98, variableConfidence))
      });
      setIsAnalyzing(false);
      setCameraActive(true);
      
      // Animación de aparición del resultado
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();

      Alert.alert(
        'Producto Detectado',
        `${randomProduct.name}\nPrecisión: ${Math.max(80, Math.min(98, variableConfidence))}%\nPrecio: ${randomProduct.price}`,
        [
          { text: 'Ver Detalles', onPress: () => {} },
          { text: 'Agregar al Pedido', onPress: () => addToOrder(randomProduct) }
        ]
      );
    }, 2500);
  };

  const simulateSpecificProduct = (product) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setRecognizedProduct(null);
    setCameraActive(false);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 8;
      });
    }, 80);

    setTimeout(() => {
      const confidence = product.confidence + Math.floor(Math.random() * 8) - 4;
      const finalProduct = {
        ...product,
        confidence: Math.max(85, Math.min(98, confidence))
      };
      
      setRecognizedProduct(finalProduct);
      setIsAnalyzing(false);
      setCameraActive(true);

      Alert.alert(
        'Reconocimiento Exitoso',
        `${product.name} identificado\nPrecisión: ${Math.max(85, Math.min(98, confidence))}%\nPrecio: ${product.price}`,
        [
          { text: 'Analizar Otro', onPress: () => setRecognizedProduct(null) },
          { text: 'Agregar al Pedido', onPress: () => addToOrder(finalProduct) }
        ]
      );
    }, 1500);
  };

  const addToOrder = (product) => {
    Alert.alert(
      'Producto Agregado',
      `${product.emoji} ${product.name}\n${product.price}\n\n¡Agregado al pedido exitosamente!`,
      [
        { text: 'Continuar Escaneando', onPress: () => setRecognizedProduct(null) },
        { text: 'Ver Pedido', onPress: () => Alert.alert('Pedido', 'Funcionalidad de pedido completo próximamente') }
      ]
    );
  };

  const renderCamera = () => {
    const scanPosition = scanAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    });

    return (
      <View style={styles.cameraContainer}>
        <View style={styles.cameraFrame}>
          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <Text style={styles.analyzingText}>🧠 Analizando con IA...</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${analysisProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{analysisProgress}%</Text>
              </View>
              
              {/* Línea de escaneo animada */}
              <Animated.View style={[styles.scanLine, { top: scanPosition }]} />
              
              <View style={styles.analysisSteps}>
                <Text style={styles.stepText}>
                  {analysisProgress < 30 ? '📷 Capturando imagen...' :
                   analysisProgress < 60 ? '🔍 Procesando características...' :
                   analysisProgress < 90 ? '🤖 Aplicando modelo IA...' :
                   '✅ Finalizando análisis...'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <View style={styles.cameraOverlay}>
                <Text style={styles.cameraTitle}>📱 Cámara IA RestoBar</Text>
                <Text style={styles.cameraSubtitle}>Apunta a productos para reconocerlos</Text>
                
                {/* Crosshair de enfoque */}
                <View style={styles.focusFrame}>
                  <View style={styles.cornerTL} />
                  <View style={styles.cornerTR} />
                  <View style={styles.cornerBL} />
                  <View style={styles.cornerBR} />
                </View>
                
                {cameraActive && (
                  <View style={styles.statusIndicator}>
                    <View style={styles.activeDot} />
                    <Text style={styles.statusText}>ACTIVA</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
            onPress={startAnalysis}
            disabled={isAnalyzing}>
            <Text style={styles.captureButtonText}>
              {isAnalyzing ? '🔄 Analizando...' : '📸 Tomar Foto y Analizar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderResult = () => {
    if (!recognizedProduct) return null;

    return (
      <Animated.View style={[styles.resultContainer, { opacity: fadeAnimation }]}>
        <Text style={styles.resultTitle}>✅ Producto Reconocido</Text>
        <View style={styles.resultCard}>
          <View style={styles.productIcon}>
            <Text style={styles.productEmoji}>{recognizedProduct.emoji}</Text>
          </View>
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{recognizedProduct.name}</Text>
            <Text style={styles.productPrice}>{recognizedProduct.price}</Text>
            <View style={styles.confidenceBar}>
              <Text style={styles.confidenceLabel}>Precisión: {recognizedProduct.confidence}%</Text>
              <View style={styles.confidenceTrack}>
                <View style={[styles.confidenceFill, { width: `${recognizedProduct.confidence}%` }]} />
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.scanAgainButton} onPress={() => setRecognizedProduct(null)}>
            <Text style={styles.scanAgainText}>🔄 Escanear Otro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addOrderButton} onPress={() => addToOrder(recognizedProduct)}>
            <Text style={styles.addOrderText}>➕ Agregar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.appTitle}>🍽️ RestoBar AI</Text>
        <Text style={styles.appSubtitle}>Sistema Inteligente de Reconocimiento</Text>
        
        <View style={styles.loginForm}>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          
          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>📝 Credenciales de Demo:</Text>
            <Text style={styles.demoText}>Usuario: admin</Text>
            <Text style={styles.demoText}>Contraseña: restobar123</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.mainContainer}>
      {renderCamera()}
      {renderResult()}
      
      <View style={styles.quickScanSection}>
        <Text style={styles.quickScanTitle}>🎯 Demo Rápido - Productos Disponibles</Text>
        <Text style={styles.quickScanSubtitle}>Toca cualquier producto para simular reconocimiento directo</Text>
        
        <View style={styles.productsGrid}>
          {products.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productCard}
              onPress={() => simulateSpecificProduct(product)}>
              <Text style={styles.cardEmoji}>{product.emoji}</Text>
              <Text style={styles.cardName}>{product.name.split(' ')[0]}</Text>
              <Text style={styles.cardPrice}>{product.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>🤖 Tecnología IA</Text>
        <Text style={styles.infoText}>
          • Modelo: RestoBar-Vision v2.1{'\n'}
          • Precisión promedio: 93.8%{'\n'}
          • Tiempo de análisis: 2-3 segundos{'\n'}
          • Deep Learning + Computer Vision{'\n'}
          • Reconocimiento en tiempo real
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 36,
    color: '#ff6b35',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginForm: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 25,
  },
  input: {
    backgroundColor: '#444',
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#ff6b35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoInfo: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  demoTitle: {
    color: '#ff6b35',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    color: '#ccc',
    fontSize: 14,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  cameraContainer: {
    margin: 20,
  },
  cameraFrame: {
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#ff6b35',
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#333',
    position: 'relative',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cameraSubtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  focusFrame: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#ff6b35',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#ff6b35',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#ff6b35',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#ff6b35',
  },
  statusIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginRight: 5,
  },
  statusText: {
    color: '#4caf50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  analyzingContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  analyzingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#555',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff6b35',
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  analysisSteps: {
    marginTop: 20,
  },
  stepText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  cameraControls: {
    marginTop: 15,
  },
  captureButton: {
    backgroundColor: '#ff6b35',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#ff6b3580',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  resultTitle: {
    color: '#4caf50',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  productIcon: {
    width: 70,
    height: 70,
    backgroundColor: '#444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productEmoji: {
    fontSize: 35,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    color: '#ff6b35',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confidenceBar: {
    width: '100%',
  },
  confidenceLabel: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  confidenceTrack: {
    height: 6,
    backgroundColor: '#555',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanAgainButton: {
    flex: 0.48,
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanAgainText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addOrderButton: {
    flex: 0.48,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addOrderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quickScanSection: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  quickScanTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quickScanSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  cardEmoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  cardName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardPrice: {
    color: '#ff6b35',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
  },
  infoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});