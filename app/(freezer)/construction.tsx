import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '@/components/Header';
import { PickerCard } from '@/components/PickerCard';
import { THERMAL_DATA } from '@/constants/thermalData';

export default function ConstructionScreen() {
  const [construction, setConstruction] = useState({
    insulationType: 'PUF',
    insulationThickness: 150,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [construction]);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('constructionData');
      if (saved) {
        setConstruction(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading construction data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('constructionData', JSON.stringify(construction));
    } catch (error) {
      console.error('Error saving construction data:', error);
    }
  };

  const insulationTypes = [
    { label: 'Polyurethane Foam (PUF)', value: 'PUF' },
    { label: 'Expanded Polystyrene (EPS)', value: 'EPS' },
    { label: 'Rockwool', value: 'Rockwool' },
  ];

  const thicknessOptions = [
    { label: '75mm', value: 75 },
    { label: '100mm', value: 100 },
    { label: '125mm', value: 125 },
    { label: '150mm (Recommended)', value: 150 },
    { label: '200mm', value: 200 },
  ];

  const currentUFactor = THERMAL_DATA.uFactors[construction.insulationType as keyof typeof THERMAL_DATA.uFactors]?.[construction.insulationThickness as keyof typeof THERMAL_DATA.uFactors.PUF] || 0;

  return (
    <LinearGradient colors={['#F8FAFC', '#EBF8FF']} style={styles.container}>
      <Header title="Construction Details" step={3} totalSteps={4} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insulation Specifications</Text>
          
          <PickerCard
            label="Insulation Type"
            value={construction.insulationType}
            options={insulationTypes}
            onValueChange={(value) => setConstruction(prev => ({ ...prev, insulationType: value }))}
          />
          
          <PickerCard
            label="Insulation Thickness"
            value={construction.insulationThickness}
            options={thicknessOptions}
            onValueChange={(value) => setConstruction(prev => ({ ...prev, insulationThickness: value }))}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thermal Performance</Text>
          
          <View style={styles.calculatedCard}>
            <View style={styles.calculatedRow}>
              <Text style={styles.calculatedLabel}>U-Factor:</Text>
              <Text style={styles.calculatedValue}>{currentUFactor.toFixed(3)} W/m²K</Text>
            </View>
            <View style={styles.calculatedRow}>
              <Text style={styles.calculatedLabel}>R-Value:</Text>
              <Text style={styles.calculatedValue}>{(1 / currentUFactor).toFixed(2)} m²K/W</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insulation Comparison</Text>
          
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>Performance Rankings (Best to Good)</Text>
            <View style={styles.rankingItem}>
              <View style={[styles.rankingDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.rankingText}>1. Polyurethane Foam (PUF) - Best thermal performance</Text>
            </View>
            <View style={styles.rankingItem}>
              <View style={[styles.rankingDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.rankingText}>2. Expanded Polystyrene (EPS) - Good performance, cost-effective</Text>
            </View>
            <View style={styles.rankingItem}>
              <View style={[styles.rankingDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.rankingText}>3. Rockwool - Fire resistant, lower thermal performance</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  calculatedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  calculatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calculatedLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  calculatedValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  rankingText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
    lineHeight: 16,
  },
});