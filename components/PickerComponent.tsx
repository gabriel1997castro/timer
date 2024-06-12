import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";

const AVAILABLE_MINUTES = Array.from({ length: 10 }, (_, i) => i.toString());
const AVAILABLE_SECONDS = Array.from({ length: 60 }, (_, i) => i.toString());

interface PickerComponentProps {
  selectedMinutes: string;
  selectedSeconds: string;
  setSelectedMinutes: (value: string) => void;
  setSelectedSeconds: (value: string) => void;
}

const PickerComponent: React.FC<PickerComponentProps> = ({
  selectedMinutes,
  selectedSeconds,
  setSelectedMinutes,
  setSelectedSeconds,
}) => {
  const theme = useColorScheme() ?? "light";
  return (
    <View style={styles(theme).pickerContainer}>
      <Picker
        style={styles(theme).picker}
        itemStyle={styles(theme).pickerItem}
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => setSelectedMinutes(itemValue)}
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles(theme).pickerItem}>minutes</Text>
      <Picker
        style={styles(theme).picker}
        itemStyle={styles(theme).pickerItem}
        selectedValue={selectedSeconds}
        onValueChange={(itemValue) => setSelectedSeconds(itemValue)}
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles(theme).pickerItem}>seconds</Text>
    </View>
  );
};

const styles = (theme: "dark" | "light") =>
  StyleSheet.create({
    pickerContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    picker: {
      flex: 1,
      maxWidth: 100,
      color: Colors[theme].contrastColor,
      backgroundColor: "rgba(92, 92, 92, 0.206)",
    },
    pickerItem: {
      color: Colors[theme].contrastColor,
      fontSize: 20,

      marginLeft: 5,
      marginRight: 5,
    },
  });

export default PickerComponent;
