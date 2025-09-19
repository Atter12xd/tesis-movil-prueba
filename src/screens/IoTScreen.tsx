import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';

export default function IoTScreen() {
  const [sensors, setSensors] = useState([
    {
      id: 'ESP32_001',
      name: 'Salón Principal',
      temperature: 22.5,
      humidity: 65,
      airQuality: 78,
      connected: true,
      lastUpdate: new Date(),
      battery: 87
    },
    {
      id: 'ESP32_002', 
      name: 'Cocina',
      temperature: 28.3,
      humidity: 58,
      airQuality: 72,
      connected: true,
      lastUpdate: new Date(),
      battery: 92
    },
    {
      id: 'ESP32_003',
      name: 'Almacén',
      temperature: 19.8,
      humidity: 45,
      airQuality: 85,
      connected: false,
      lastUpdate: new Date(Date.now() - 300000), // 5 min ago
      battery: 23
    }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [temperatureHistory, setTemperatureHistory] = useState([
    { time: '14:00', salon: 21.2, cocina: 27.8, almacen: 19.5 },
    { time: '14:30', salon: 22.1, cocina: 28.1, almacen: 19.7 },
    { time: '15:00', salon: 22.8, cocina: 28.5, almacen: 19.9 },
    { time: '15:30', salon: 22.5, cocina: 28.3, almacen: 19.8 },
  ]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        updateSensorReadings();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const updateSensorReadings = () => {
    setSensors(prev => prev.map(sensor => {
      if (!sensor.connected) return sensor;
      
      return {
        ...sensor,
        temperature: sensor.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(80, sensor.humidity + (Math.random() - 0.5) * 5)),
        airQuality: Math.max(50, Math.min(100, sensor.airQuality + (Math.random() - 0.5) * 3)),
        lastUpdate: new Date()
      };
    }));

    // Agregar al historial
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                   now.getMinutes().toString().padStart(2, '0');
    
    setTemperatureHistory(prev => {
      const newReading = {
        time: timeStr,
        salon: sensors[0]?.temperature || 22.5,
        cocina: sensors[1]?.temperature || 28.3,
        almacen: sensors[2]?.temperature || 19.8
      };
      return [...prev.slice(-9), newReading];
    });
  };

  const getTemperatureStatus = (temp: number, location: string) => {
    const ranges = {
      salon: { min: 20, max: 26 },
      cocina: { min: 25, max: 32 },
      almacen: { min: 15, max: 22 }
    };
    
    const range = ranges[location as keyof typeof ranges] || ranges.salon;
    
    if (temp < range.min) return { status: 'Frío', color: '#2196f3', icon: '❄️' };
    if (temp > range.max) return { status: 'Caliente', color: '#f44336', icon: '🔥' };
    return { status: 'Óptimo', color: '#4caf50', icon: '✅' };
  };

  const toggleSensorConnection = (sensorId: string) => {
    setSensors(prev => prev.map(sensor => 
      sensor.id === sensorId 
        ? { ...sensor, connected: !sensor.connected, lastUpdate: new Date() }
        : sensor
    ));
  };

  const resetSensor = (sensorId: string) => {
    Alert.alert(
      'Reiniciar Sensor',
      '¿Estás seguro de que quieres reiniciar este sensor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reiniciar', 
          onPress: () => {
            setSensors(prev => prev.map(sensor => 
              sensor.id === sensorId 
                ? { ...sensor, connected: true, battery: 100, lastUpdate: new Date() }
                : sensor
            ));
            Alert.alert('Éxito', 'Sensor reiniciado correctamente');
          }
        }
      ]
    );
  };

  const renderSensorCard = (sensor: any) => {
    const tempStatus = getTemperatureStatus(sensor.temperature, sensor.name.toLowerCase());
    const batteryColor = sensor.battery > 50 ? '#4caf50' : sensor.battery > 20 ? '#ff9800' : '#f44336';
    
    return (
      <View key={sensor.id} style={[
        styles.sensorCard,
        { borderLeftColor: sensor.connected ? '#4caf50' : '#f44336' }
      ]}>
        <View style={styles.sensorHeader}>
          <View style={styles.sensorInfo}>
            <Text style={styles.sensorName}>{sensor.name}</Text>
            <Text style={styles.sensorId}>{sensor.id}</Text>
          </View>
          <View style={styles.sensorStatus}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: sensor.connected ? '#4caf50' : '#f44336' }
            ]} />
            <Text style={styles.statusText}>
              {sensor.connected ? 'Conectado' : 'Desconectado'}
            </Text>
          </View>
        </View>

        {sensor.connected ? (
          <View style={styles.readingsContainer}>
            <View style={styles.reading}>
              <Text style={styles.readingLabel}>Temperatura</Text>
              <Text style={[styles.readingValue, { color: tempStatus.color }]}>
                {sensor.temperature.toFixed(1)}°C
              </Text>
              <Text style={styles.readingStatus}>
                {tempStatus.icon} {tempStatus.status}
              </Text>
            </View>

            <View style={styles.reading}>
              <Text style={styles.readingLabel}>Humedad</Text>
              <Text style={styles.readingValue}>{sensor.humidity}%</Text>
              <Text style={styles.readingStatus}>
                {sensor.humidity > 70 ? '💧 Alta' : sensor.humidity > 40 ? '✅ Normal' : '🏜️ Baja'}
              </Text>
            </View>

            <View style={styles.reading}>
              <Text style={styles.readingLabel}>Calidad Aire</Text>
              <Text style={styles.readingValue}>{sensor.airQuality}%</Text>
              <Text style={styles.readingStatus}>
                {sensor.airQuality > 80 ? '🟢 Excelente' : sensor.airQuality > 60 ? '🟡 Buena' : '🔴 Regular'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.disconnectedContainer}>
            <Text style={styles.disconnectedText}>❌ Sensor desconectado</Text>
            <Text style={styles.lastSeen}>
              Última conexión: {sensor.lastUpdate.toLocaleTimeString()}
            </Text>
          </View>
        )}

        <View style={styles.sensorFooter}>
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryLabel}>🔋 Batería:</Text>
            <View style={styles.batteryBar}>
              <View style={[
                styles.batteryFill,
                { width: `${sensor.battery}%`, backgroundColor: batteryColor }
              ]} />
            </View>
            <Text style={[styles.batteryText, { color: batteryColor }]}>
              {sensor.battery}%
            </Text>
          </View>

          <View style={styles.sensorActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleSensorConnection(sensor.id)}>
              <Text style={styles.actionButtonText}>
                {sensor.connected ? 'Desconectar' : 'Conectar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={() => resetSensor(sensor.id)}>
              <Text style={styles.actionButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHistoryChart = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>📈 Historial de Temperatura</Text>
      <View style={styles.chart}>
        {temperatureHistory.map((reading, index) => (
          <View key={index} style={styles.chartColumn}>
            <View style={styles.chartBars}>
              <View style={[
                styles.chartBar,
                { height: (reading.salon / 35) * 80, backgroundColor: '#ff6b35' }
              ]} />
              <View style={[
                styles.chartBar,
                { height: (reading.cocina / 35) * 80, backgroundColor: '#f44336' }
              ]} />
              <View style={[
                styles.chartBar,
                { height: (reading.almacen / 35) * 80, backgroundColor: '#2196f3' }
              ]} />
            </View>
            <Text style={styles.chartLabel}>{reading.time}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#ff6b35' }]} />
          <Text style={styles.legendText}>Salón</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f44336' }]} />
          <Text style={styles.legendText}>Cocina</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2196f3' }]} />
          <Text style={styles.legendText}>Almacén</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌡️ Sistema IoT RestoBar</Text>
        <Text style={styles.subtitle}>Monitoreo Ambiental en Tiempo Real</Text>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>🔄 Actualización Automática</Text>
          <Switch
            value={autoRefresh}
            onValueChange={setAutoRefresh}
            trackColor={{ false: '#767577', true: '#ff6b35' }}
            thumbColor={autoRefresh ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>🚨 Alertas Activadas</Text>
          <Switch
            value={alertsEnabled}
            onValueChange={setAlertsEnabled}
            trackColor={{ false: '#767577', true: '#ff6b35' }}
            thumbColor={alertsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={updateSensorReadings}>
          <Text style={styles.refreshButtonText}>🔄 Actualizar Todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sensorsContainer}>
        {sensors.map(renderSensorCard)}
      </View>

      {renderHistoryChart()}

      <View style={styles.alertsContainer}>
        <Text style={styles.alertsTitle}>⚠️ Alertas del Sistema</Text>
        {sensors.some(s => !s.connected) && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              🔴 Sensor desconectado: {sensors.find(s => !s.connected)?.name}
            </Text>
          </View>
        )}
        {sensors.some(s => s.battery < 30) && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              🔋 Batería baja: {sensors.find(s => s.battery < 30)?.name} ({sensors.find(s => s.battery < 30)?.battery}%)
            </Text>
          </View>
        )}
        {sensors.filter(s => s.connected).every(s => s.temperature > 18 && s.temperature < 30) && (
          <View style={[styles.alert, { borderLeftColor: '#4caf50' }]}>
            <Text style={styles.alertText}>
              ✅ Todas las temperaturas dentro del rango óptimo
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Información Técnica</Text>
        <Text style={styles.infoText}>
          • Sensores: ESP32 + DHT22 + MQ-135{'\n'}
          • Conectividad: WiFi 2.4GHz + LoRaWAN{'\n'}
          • Frecuencia: Lecturas cada 30 segundos{'\n'}
          • Precisión: ±0.5°C, ±2%RH{'\n'}
          • Autonomía: 6-12 meses con batería{'\n'}
          • Protocolo: MQTT over TLS{'\n'}
          • Almacenamiento: Base de datos Supabase{'\n'}
          • Alertas: Email + SMS + Push notifications
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
  },
  controlsContainer: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  controlLabel: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#ff6b35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sensorsContainer: {
    paddingHorizontal: 20,
  },
  sensorCard: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  sensorId: {
    color: '#ccc',
    fontSize: 12,
  },
  sensorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  readingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  reading: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  readingLabel: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  readingValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  readingStatus: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
  },
  disconnectedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  disconnectedText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastSeen: {
    color: '#ccc',
    fontSize: 12,
  },
  sensorFooter: {
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 15,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  batteryLabel: {
    color: '#ccc',
    fontSize: 12,
    marginRight: 10,
  },
  batteryBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#555',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
  },
  batteryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sensorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#555',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyContainer: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  historyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 15,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 5,
  },
  chartBar: {
    width: 8,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  chartLabel: {
    color: '#ccc',
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 3,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    color: '#ccc',
    fontSize: 12,
  },
  alertsContainer: {
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
  },
  alertsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  alert: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffa726',
  },
  alertText: {
    color: 'white',
    fontSize: 14,
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