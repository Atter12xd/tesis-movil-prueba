import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';

// Agregar al inicio del archivo, después de los imports
interface RestobarItem {
  name: string;
  price: string;
  category: string;
  description: string;
  stock: number;
  image: string;
}


interface RestobarItems {
  [key: string]: RestobarItem;
}
const screenWidth = Dimensions.get('window').width;

export default function CameraScreen() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
 const [recognizedItem, setRecognizedItem] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);


  // Productos del restobar que la IA puede reconocer
  const restobarItems: RestobarItems = {

    pizza: { 
      name: '🍕 Pizza Margherita', 
      price: 'S/ 25.00', 
      category: 'Comida Principal',
      description: 'Pizza clásica con tomate, mozzarella y albahaca',
      stock: 15,
      image: '🍕'
    },
    hamburger: { 
      name: '🍔 Hamburguesa Clásica', 
      price: 'S/ 18.00', 
      category: 'Comida Principal',
      description: 'Hamburguesa con carne, lechuga, tomate y queso',
      stock: 8,
      image: '🍔'
    },
    beer: { 
      name: '🍺 Cerveza Artesanal', 
      price: 'S/ 8.00', 
      category: 'Bebidas',
      description: 'Cerveza artesanal de la casa',
      stock: 25,
      image: '🍺'
    },
    cocktail: { 
      name: '🍹 Cóctel Tropical', 
      price: 'S/ 15.00', 
      category: 'Bebidas',
      description: 'Cóctel de frutas tropicales',
      stock: 12,
      image: '🍹'
    },
    coffee: { 
      name: '☕ Café Americano', 
      price: 'S/ 6.00', 
      category: 'Bebidas Calientes',
      description: 'Café americano recién preparado',
      stock: 30,
      image: '☕'
    },
    salad: { 
      name: '🥗 Ensalada César', 
      price: 'S/ 12.00', 
      category: 'Saludable',
      description: 'Ensalada fresca con pollo y aderezo césar',
      stock: 10,
      image: '🥗'
    },
  };

  // Simulación realista de análisis con IA
  const simulateRealisticAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setRecognizedItem(null);
    
    // Simular progreso de análisis
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simular procesamiento de IA realista
    setTimeout(() => {
      const items = Object.keys(restobarItems);
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const baseConfidence = Math.floor(Math.random() * 20) + 75; // 75-95%
      
      // Agregar variabilidad más realista
      const finalConfidence = baseConfidence + (Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0);
      
      setRecognizedItem(randomItem);
      setConfidence(Math.min(finalConfidence, 98)); // Máximo 98%
      setSimulatedImage(restobarItems[randomItem].image);
      setIsAnalyzing(false);
      
      // Mostrar resultado
      Alert.alert(
        'Análisis Completado', 
        `Objeto detectado: ${restobarItems[randomItem].name}\nConfianza: ${Math.min(finalConfidence, 98)}%`,
        [{ text: 'Ver Detalles', onPress: () => {} }]
      );
    }, 2500);
  };

  // Simular diferentes productos para demo
  const simulateSpecificProduct = (productKey: string) => {

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    setTimeout(() => {
      const confidence = Math.floor(Math.random() * 15) + 85; // 85-100%
      setRecognizedItem(productKey);
      setConfidence(confidence);
      setSimulatedImage(restobarItems[productKey].image);
      setIsAnalyzing(false);
      
      Alert.alert(
        'Producto Reconocido', 
        `${restobarItems[productKey].name} detectado con ${confidence}% de precisión`,
        [{ text: 'Agregar al Pedido', onPress: () => addToOrder(productKey) }]
      );
    }, 2000);
  };

  const addToOrder = (productKey: string) => {
    const product = restobarItems[productKey];
    Alert.alert(
      'Producto Agregado',
      `${product.name} - ${product.price}\nAgregado al pedido exitosamente`,
      [{ text: 'Continuar', onPress: () => {} }]
    );
  };

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraFrame}>
        {isAnalyzing ? (
          <View style={styles.analyzingContainer}>
            <Text style={styles.analyzingText}>🧠 Analizando con IA...</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${analysisProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{analysisProgress}%</Text>
            <View style={styles.scanLines} />
          </View>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.placeholderText}>📱 Vista de Cámara Activa</Text>
            <Text style={styles.placeholderSubtext}>
              Apunta a productos del restobar
            </Text>
            <View style={styles.crosshair}>
              <View style={styles.crosshairLine1} />
              <View style={styles.crosshairLine2} />
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.cameraControls}>
        <TouchableOpacity
          style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
          onPress={simulateRealisticAIAnalysis}
          disabled={isAnalyzing}>
          <Text style={styles.captureButtonText}>
            {isAnalyzing ? '🔄 Analizando...' : '📸 Reconocer Objeto'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderResult = () => {
    if (!recognizedItem) return null;
    
    const item = restobarItems[recognizedItem];
    
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>✅ Objeto Reconocido</Text>
        <View style={styles.resultCard}>
          <View style={styles.productImage}>
            <Text style={styles.productEmoji}>{item.image}</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <Text style={styles.productStock}>Stock disponible: {item.stock} unidades</Text>
          </View>
        </View>
        
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceText}>Precisión del modelo: {confidence}%</Text>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: `${confidence}%` }]} />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => addToOrder(recognizedItem)}>
          <Text style={styles.addButtonText}>➕ Agregar al Pedido</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuickDemo = () => (
    <View style={styles.demoContainer}>
      <Text style={styles.demoTitle}>🎯 Demo Rápido - Productos Disponibles:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.entries(restobarItems).map(([key, item]) => (
          <TouchableOpacity
            key={key}
            style={styles.demoProduct}
            onPress={() => simulateSpecificProduct(key)}>
            <Text style={styles.demoEmoji}>{item.image}</Text>
            <Text style={styles.demoName}>{item.name.split(' ')[1]}</Text>
            <Text style={styles.demoPrice}>{item.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.demoSubtext}>Toca cualquier producto para simular reconocimiento</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderCameraView()}
      {renderResult()}
      {renderQuickDemo()}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>🤖 Información del Sistema IA</Text>
        <Text style={styles.infoText}>
          • Modelo: RestoBar-Vision v2.1{'\n'}
          • Precisión promedio: 94.2%{'\n'}
          • Productos reconocidos: 6 categorías{'\n'}
          • Tiempo de análisis: 2-3 segundos{'\n'}
          • Tecnología: Deep Learning + Computer Vision
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  cameraContainer: {
    margin: 20,
  },
  cameraFrame: {
    height: screenWidth * 0.75,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#ff6b35',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholderSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  crosshair: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  crosshairLine1: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ff6b35',
  },
  crosshairLine2: {
    position: 'absolute',
    left: 25,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#ff6b35',
  },
  analyzingContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  analyzingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#555',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
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
  scanLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#ff6b35',
    borderStyle: 'dashed',
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
    borderLeftColor: '#66bb6a',
  },
  resultTitle: {
    color: '#66bb6a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#444',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  productEmoji: {
    fontSize: 40,
  },
  productInfo: {
    flex: 1,
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
    marginBottom: 5,
  },
  productCategory: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  productDescription: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  productStock: {
    color: '#66bb6a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    marginBottom: 15,
  },
  confidenceText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#555',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#66bb6a',
  },
  addButton: {
    backgroundColor: '#66bb6a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoContainer: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  demoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  demoProduct: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 100,
  },
  demoEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  demoName: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  demoPrice: {
    color: '#ff6b35',
    fontSize: 12,
    fontWeight: 'bold',
  },
  demoSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  infoContainer: {
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