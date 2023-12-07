import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import IconA from 'react-native-vector-icons/FontAwesome';
import IconA5 from 'react-native-vector-icons/FontAwesome5';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';


const VacationsScreen = () => {
  const [holidaysData, setHolidaysData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('noord'); // Default region

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/2023-2024?output=json');
        
        if (!response) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    return `${formattedDay}-${formattedMonth}-${year}`;
  };
  
  const formatHoliday = (holidayString) => {
    const herfstIcon = <><IconA name="leaf" size={15} color="#000" /><Text>   Herfst</Text></>;
    const kerstIcon = <><IconA name="snowflake-o" size={15} color="#000" /><Text>   Kerst</Text></>;
    const voorjaarsIcon = <><IconM name="flower-outline" size={15} color="#000" /><Text>   Voorjaar</Text></>;
    const meiIcon = <><IconF name="sun" size={15} color="#000" /><Text>   Mei</Text></>;
    const zomerIcon = <><IconA5 name="swimming-pool" size={12} color="#000" /><Text>   Zomer</Text></>;
    
    if(holidayString === 'Herfstvakantie') return herfstIcon;
    if(holidayString === 'Kerstvakantie') return kerstIcon;
    if(holidayString === 'Voorjaarsvakantie') return voorjaarsIcon;
    if(holidayString === 'Meivakantie') return meiIcon;
    if(holidayString === 'Zomervakantie') return zomerIcon;
  }

  const calculateDaysLeft = (vacationDateString) => {
    const currentDate = new Date();
    const vacationDate = new Date(vacationDateString);
  
    if (isNaN(vacationDate.getTime())) {
      return 'Invalid date';
    }
  
    const differenceInTime = vacationDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays >= 0 ? differenceInDays : '-';
  };
  
  

  const renderHolidaysTable = () => {
    if (!holidaysData || !holidaysData.content || !holidaysData.content[0] || !holidaysData.content[0].vacations || holidaysData.content[0].vacations.length === 0) {
      return <Text>No holidays available for this region</Text>;
    }
  
    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Holiday</Text>
          <Text style={styles.headerText}>Start Date</Text>
          <Text style={styles.headerText}>End Date</Text>
          <Text style={styles.headerText}>Days Left</Text>
        </View>
        {holidaysData.content[0].vacations.map((holiday, index) => {
          let startDate = "";
          let endDate = "";
          if (holiday.regions.some((r) => r.region === "heel Nederland")) {
            const heelNederlandDates = holiday.regions.find((r) => r.region === "heel Nederland");
            if (heelNederlandDates) {
              startDate = heelNederlandDates.startdate;
              endDate = heelNederlandDates.enddate;
            }
          } else {
            const selectedRegionData = holiday.regions.find((r) => r.region === selectedRegion);
            if (selectedRegionData) {
              startDate = selectedRegionData.startdate;
              endDate = selectedRegionData.enddate;
            }
          }
          
          return (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.rowText}>{formatHoliday(holiday.type.trim())}</Text>
              <Text style={styles.rowText}>{formatDate(startDate)}</Text>
              <Text style={styles.rowText}>{formatDate(endDate)}</Text>
              <Text style={styles.rowText}>{calculateDaysLeft(startDate)}</Text>
            </View>
          );
        })}
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
      </Picker>

      {holidaysData ? renderHolidaysTable() : <Text>Loading...</Text>}
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
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 5,
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
  },
});

export default VacationsScreen;
