import { Picker } from "@react-native-picker/picker";
import { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import PickerComponent from "@/components/PickerComponent";
import { Colors } from "@/constants/Colors";
import { Audio } from "expo-av";
const screen = Dimensions.get("window");

const formatNumber = (num: number) => `0${num}`.slice(-2);

const getRemaining = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

export default function HomeScreen() {
  const theme = useColorScheme() ?? "light";
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState("0");
  const [selectedSeconds, setSelectedSeconds] = useState("5");
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/Audio/alert.mp3") // Path to your downloaded sound file
    );
    setSound(sound);
  };

  useEffect(() => {
    loadSound();
    return () => {
      sound?.unloadAsync(); // Unload sound when component unmounts
    };
  }, []);

  const loopSound = async () => {
    if (sound) {
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
    }
  };

  const showAlert = useCallback(() => {
    loopSound(); // Start looping the sound
    Alert.alert(
      "Time's up!",
      "The timer has finished.",
      [
        {
          text: "OK",
          onPress: () => {
            stopSound(); // Stop the sound when the user presses "OK"
          },
        },
      ],
      { cancelable: false }
    );
  }, [sound]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      if (remainingSeconds === 0) {
        stop();
        showAlert();
      } else {
        interval = setInterval(() => {
          setRemainingSeconds((prev) => prev - 1);
        }, 1000);
      }
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  const start = useCallback(() => {
    const totalSeconds =
      parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10);
    setRemainingSeconds(totalSeconds);
    setIsRunning(true);
  }, [selectedMinutes, selectedSeconds]);

  const stop = useCallback(() => {
    setRemainingSeconds(5);
    setIsRunning(false);
  }, []);

  const { minutes, seconds } = getRemaining(remainingSeconds);
  return (
    <View style={styles(theme).container}>
      <StatusBar barStyle="light-content" />
      {isRunning ? (
        <Text style={styles(theme).timerText}>{`${minutes}:${seconds}`}</Text>
      ) : (
        <PickerComponent
          selectedMinutes={selectedMinutes}
          selectedSeconds={selectedSeconds}
          setSelectedMinutes={setSelectedMinutes}
          setSelectedSeconds={setSelectedSeconds}
        />
      )}
      <TouchableOpacity
        onPress={isRunning ? stop : start}
        style={[styles(theme).button, isRunning && styles(theme).buttonStop]}
      >
        <Text
          style={[
            styles(theme).buttonText,
            isRunning && styles(theme).buttonTextStop,
          ]}
        >
          {isRunning ? "Stop" : "Start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (theme: "dark" | "light") =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      borderWidth: 10,
      borderColor: Colors[theme].primary,
      width: screen.width / 2,
      height: screen.width / 2,
      borderRadius: screen.width / 2,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
    },
    buttonStop: {
      borderColor: Colors[theme].secondary,
    },
    buttonText: {
      fontSize: 45,
      color: Colors[theme].primary,
    },
    buttonTextStop: {
      color: Colors[theme].secondary,
    },
    timerText: {
      color: Colors[theme].contrastColor,
      fontSize: 90,
    },
  });
