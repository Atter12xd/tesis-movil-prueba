import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const [activeTab, setActiveTab] = useState('hoy');
  const [salesData, setSalesData] = useState({
    today: 2850,
    week: 18500,
    month: 75200,
    year: 892000
  });

  const [productStats, setProductStats] = useState([
    { name: 'Pizza Margherita', sold: 45, revenue: 1125, trend: '+12%' },
    { name: 'Hamburguesa Clásica', sold: 38, revenue: 684, trend: '+8%' },
    { name: 'Cerveza Artesanal', sold: 67, revenue: 536, trend: '+15%' },
    { name: 'Cóctel Tropical', sold: 28, revenue: 420, trend: '+5%' },
    { name: 'Café Americano', sold: 89, revenue: 534, trend: '+22%' },
    { name: 'Ensalada César', sold: 23, revenue: 276, trend: '-3%' }
  ]);

  const [timeStats, setTimeStats] = useState([
    { hour: '12:00', sales: 150, customers: 12 },
    { hour: '13:00', sales: 280, customers: 18 },
    { hour: '14:00', sales: 320, customers: 22 },
    { hour: '15:00', sales: 190, customers: 14 },
    { hour: '16:00', sales: 240, customers: 16 },
    { hour: '17:00', sales: 380, customers: 25 },
    { hour: '18:00', sales: 450, customers: 32 },
    { hour: '19:00', sales: 520, customers: 38 },
    { hour: '20:00', sales: 310, customers: 24 }
  ]);

  useEffect(() => {
    // Simular actualización en tiempo real
    const interval = setInterval(() => {
      setSalesData(prev => ({
        ...prev,
        today: prev.today + Math.floor(Math.random() * 50)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const renderSalesCards = () => (
    <View style={styles.cardsContainer}>
      <View style={styles.mainCard}>
        <Text style={styles.cardLabel}>Ventas de Hoy</Text>
        <Text style={styles.mainCardValue}>S/ {salesData.today.toLocaleString()}</Text>
        <Text style={styles.cardTrend}>+15.8% vs ayer</Text>
      </View>
      
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.cardLabel}>Esta Semana</Text>
          <Text style={styles.cardValue}>S/ {(salesData.week / 1000).toFixed(1)}K</Text>
          <Text style={styles.cardTrend}>+12.3%</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.cardLabel}>Este Mes</Text>
          <Text style={styles.cardValue}>S/ {(salesData.month / 1000).toFixed(1)}K</Text>
          <Text style={styles.cardTrend}>+8.7%</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.cardLabel}>Pedidos Hoy</Text>
          <Text style={styles.cardValue}>156</Text>
          <Text style={styles.cardTrend}>+9.2%</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.cardLabel}>Ticket Promedio</Text>
          <Text style={styles.cardValue}>S/ 18.30</Text>
          <Text style={styles.cardTrend}>+6.5%</Text>
        </View>
      </View>
    </View>
  );

  const renderChart = () => {
    const maxSales = Math.max(...timeStats.map(t => t.sales));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Ventas por Hora - Hoy</Text>
        <View style={styles.chart}>
          {timeStats.map((stat, index) => {
            const height = (stat.sales / maxSales) * 120;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height }]} />
                <Text style={styles.barValue}>S/ {stat.sales}</Text>
                <Text style={styles.barLabel}>{stat.hour}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderProductStats = () => (
    <View style={styles.productsContainer}>
      <Text style={styles.sectionTitle}>Productos Más Vendidos - Hoy</Text>
      {productStats.map((product, index) => (
        <View key={index} style={styles.productRow}>
          <View style={styles.productRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDetails}>
              {product.sold} vendidos • S/ {product.revenue}
            </Text>
          </View>
          <View style={styles.productTrend}>
            <Text style={[
              styles.trendText,
              { color: product.trend.includes('+') ? '#4caf50' : '#f44336' }
            ]}>
              {product.trend}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderKPIs = () => (
    <View style={styles.kpiContainer}>
      <Text style={styles.sectionTitle}>Indicadores Clave</Text>
      
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>94.2%</Text>
          <Text style={styles.kpiLabel}>Precisión IA</Text>
          <Text style={styles.kpiChange}>+2.1%</Text>
        </View>
        
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>2.3min</Text>
          <Text style={styles.kpiLabel}>Tiempo Servicio</Text>
          <Text style={styles.kpiChange}>-0.4min</Text>
        </View>
        
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>22.5°C</Text>
          <Text style={styles.kpiLabel}>Temperatura</Text>
          <Text style={styles.kpiChange}>Óptima</Text>
        </View>
        
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>4.8★</Text>
          <Text style={styles.kpiLabel}>Satisfacción</Text>
          <Text style={styles.kpiChange}>+0.2</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Dashboard RestoBar</Text>
        <Text style={styles.subtitle}>Análisis en Tiempo Real</Text>
      </View>

      <View style={styles.tabContainer}>
        {['hoy', 'semana', 'mes'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderSalesCards()}
      {renderChart()}
      {renderProductStats()}
      {renderKPIs()}

      <View style={styles.alertsContainer}>
        <Text style={styles.sectionTitle}>🚨 Alertas del Sistema</Text>
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            ✅ Stock de Cerveza Artesanal: Normal (25 unidades)
          </Text>
        </View>
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            ⚠️ Ensalada César: Ventas bajo promedio (-3%)
          </Text>
        </View>
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            🔥 Pizza Margherita: Tendencia alcista (+12%)
          </Text>
        </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    margin: 20,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ff6b35',
  },
  tabText: {
    color: '#ccc',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  mainCard: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 25,
    marginBottom: 15,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#ff6b35',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  smallCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    flex: 0.48,
    alignItems: 'center',
  },
  cardLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  mainCardValue: {
    color: '#ff6b35',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardTrend: {
    color: '#4caf50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chartContainer: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  chartTitle: {
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
    height: 160,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    backgroundColor: '#ff6b35',
    width: 20,
    borderRadius: 2,
    marginBottom: 5,
  },
  barValue: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  barLabel: {
    color: '#ccc',
    fontSize: 10,
  },
  productsContainer: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  productRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  productDetails: {
    color: '#ccc',
    fontSize: 12,
  },
  productTrend: {
    alignItems: 'flex-end',
  },
  trendText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  kpiContainer: {
    margin: 20,
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiValue: {
    color: '#ff6b35',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  kpiLabel: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  kpiChange: {
    color: '#4caf50',
    fontSize: 11,
    fontWeight: 'bold',
  },
  alertsContainer: {
    margin: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
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
});