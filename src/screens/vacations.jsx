import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const VacationsScreen = () => {
  const [holidaysData, setHolidaysData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('noord'); // Default region

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/2023-2024?output=json');
        
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        setHolidaysData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  const filteredHolidays = holidaysData?.content[0]?.vacations.filter(
    (holiday) => holiday.regions.some((r) => r.region === selectedRegion)
  );

  const renderHolidaysTable = () => {
    if (!holidaysData || !holidaysData.content || !holidaysData.content[0] || !holidaysData.content[0].vacations) {
      return <Text>No data available</Text>;
    }

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Holiday</Text>
          <Text style={styles.headerText}>Start Date</Text>
          <Text style={styles.headerText}>End Date</Text>
          <Text style={styles.headerText}>Compulsory Dates</Text>
        </View>
        {holidaysData.content[0].vacations.map((holiday, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.rowText}>{holiday.type.trim()}</Text>
            <Text style={styles.rowText}>{new Date(holiday.regions[0].startdate).toDateString()}</Text>
            <Text style={styles.rowText}>{new Date(holiday.regions[0].enddate).toDateString()}</Text>
            <Text style={styles.rowText}>{holiday.compulsorydates === 'true' ? 'Yes' : 'No'}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
  <Text style={styles.title}>School Holidays 2023-2024</Text>
  <Picker
    selectedValue={selectedRegion}
    onValueChange={(itemValue) => handleRegionChange(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="Noord" value="noord" />
    <Picker.Item label="Midden" value="midden" />
    <Picker.Item label="Zuid" value="zuid" />
    {/* Add other regions as needed */}
  </Picker>

  {filteredHolidays ? renderHolidaysTable(filteredHolidays) : <Text>Loading...</Text>}
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden', // Ensure the picker doesn't overflow its container
  },
  picker: {
    width: '100%',
    height: 50,
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
  },
});

export default VacationsScreen;
