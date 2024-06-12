import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
const screen = Dimensions.get("window");

const formatNumber = (num: number) => `0${num}`.slice(-2);

const getRemaining = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

const createArray = (length: number) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default function HomeScreen() {
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState("0");
  const [selectedSeconds, setSelectedSeconds] = useState("5");
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      if (remainingSeconds === 0) {
        stop();
      }
      interval = setInterval(() => {
        setRemainingSeconds(remainingSeconds - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      interval = null;
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const start = () => {
    setRemainingSeconds(
      parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10)
    );
    console.log(
      parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10)
    );
    setIsRunning(true);
  };
  const stop = () => {
    setRemainingSeconds(5);
    setIsRunning(false);
  };
  const renderPickers = () => {
    return (
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedMinutes}
          onValueChange={(itemValue) => {
            setSelectedMinutes(itemValue);
          }}
          mode="dropdown"
        >
          {AVAILABLE_MINUTES.map((value) => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>minutes</Text>
        <Picker
          style={styles.picker}
          itemStyle={styles.pickerItem}
          selectedValue={selectedSeconds}
          onValueChange={(itemValue) => {
            setSelectedSeconds(itemValue);
          }}
          mode="dropdown"
        >
          {AVAILABLE_SECONDS.map((value) => (
            <Picker.Item key={value} label={value} value={value} />
          ))}
        </Picker>
        <Text style={styles.pickerItem}>seconds</Text>
      </View>
    );
  };

  const { minutes, seconds } = getRemaining(remainingSeconds);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isRunning ? (
        <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
      ) : (
        renderPickers()
      )}
      {isRunning ? (
        <TouchableOpacity
          onPress={stop}
          style={[styles.button, styles.buttonStop]}
        >
          <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={start} style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  picker: {
    flex: 1,
    maxWidth: 100,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "rgba(92, 92, 92, 0.206)",
      },
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
    ...Platform.select({
      android: {
        marginLeft: 10,
        marginRight: 10,
      },
    }),
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
