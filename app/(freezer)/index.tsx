import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '@/components/Header';
import { InputCard } from '@/components/InputCard';

export default function RoomScreen() {
  const [dimensions, setDimensions] = useState({
    length: '4.0',
    width: '3.0',
    height: '2.5',
    doorWidth: '1.0',
    doorHeight: '2.0',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [dimensions]);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('roomData');
      if (saved) {
        setDimensions(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading room data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('roomData', JSON.stringify(dimensions));
    } catch (error) {
      console.error('Error saving room data:', error);
    }
  };

  const handleInputChange = (key: keyof typeof dimensions, value: string) => {
    setDimensions(prev => ({ ...prev, [key]: value }));
  };

  const length = parseFloat(dimensions.length) || 0;
  const width = parseFloat(dimensions.width) || 0;
  const height = parseFloat(dimensions.height) || 0;
  const doorWidth = parseFloat(dimensions.doorWidth) || 0;
  const doorHeight = parseFloat(dimensions.doorHeight) || 0;

  const wallArea = 2 * (length + width) * height;
  const ceilingArea = length * width;
  const floorArea = length * width;
  const volume = length * width * height;
  const doorArea = doorWidth * doorHeight;

  return (
    <LinearGradient colors={['#F8FAFC', '#EBF8FF']} style={styles.container}>
      <Header title="Room Specifications" step={1} totalSteps={4} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Dimensions</Text>
          
          <InputCard label="Length" unit="m" value={dimensions.length} onChangeText={(value) => handleInputChange('length', value)} />
          <InputCard label="Width" unit="m" value={dimensions.width} onChangeText={(value) => handleInputChange('width', value)} />
          <InputCard label="Height" unit="m" value={dimensions.height} onChangeText={(value) => handleInputChange('height', value)} />
          
          <InputCard label="Door Width" unit="m" value={dimensions.doorWidth} onChangeText={(value) => handleInputChange('doorWidth', value)} />
          <InputCard label="Door Height" unit="m" value={dimensions.doorHeight} onChangeText={(value) => handleInputChange('doorHeight', value)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculated Areas</Text>
          
          <View style={styles.calculatedCard}>
            <View style={styles.calculatedRow}>
              <Text style={styles.calculatedLabel}>Wall Area:</Text>
              <Text style={styles.calculatedValue}>{wallArea.toFixed(1)} m²</Text>
            </View>
            <View style={styles.calculatedRow}>
              <Text style={styles.calculatedLabel}>Ceiling Area:</Text>
              <Text style={styles.calculatedValue}>{ceilingArea.toFixed(1)} m²</Text>
            </View>
            <View style={styles.calculatedRow}>
              <Text style={styles.calculatedLabel}>Floor Area:</Text>
              <Text style={styles.calculatedValue}>{floorArea.toFixed(1)} m²</Text>
            </View>
            <View style={styles.calculatedRow}>
              <Text style={styles.calculatedLabel}>Door Area:</Text>
              <Text style={styles.calculatedValue}>{doorArea.toFixed(1)} m²</Text>
            </View>
            <View style={[styles.calculatedRow, styles.totalRow]}>
              <Text style={[styles.calculatedLabel, styles.totalLabel]}>Room Volume:</Text>
              <Text style={[styles.calculatedValue, styles.totalValue]}>{volume.toFixed(1)} m³</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#3B82F6',
    marginTop: 8,
    paddingTop: 12,
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
  totalLabel: {
    fontSize: 16,
    color: '#1E3A8A',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '700',
  },
});