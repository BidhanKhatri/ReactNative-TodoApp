import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  Platform,
  ScrollView,
  FlatList,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import data from "../data/todo.js";
import { useContext, useEffect, useState } from "react";
import Animated, { LinearTransition } from "react-native-reanimated"; //Animated ma FlatList already huncha so Animated.FlatList
import { ThemeContext } from "../context/ThemeContext.js";
import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
// import { StatusBar } from "react-native";
import { useRouter } from "expo-router";
export default function Index() {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  // console.log(data);

  const [todoData, setTodoData] = useState(data.sort((a, b) => b.id - a.id));
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { theme, toggleTheme, colorScheme } = useContext(ThemeContext);
  const screenHeight = Dimensions.get("window").height;
  const router = useRouter();
  let isSubmitting = false;

  // console.log(todoData);
  // console.log(theme);

  const styles = createStyleSheet(theme, colorScheme, screenHeight);

  useEffect(() => {
    const getTodoData = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("TodoData");
        if (storedValue !== null) {
          setTodoData(JSON.parse(storedValue));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getTodoData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todoData);
        await AsyncStorage.setItem("TodoData", jsonValue);
      } catch (error) {
        console.error("Error storing data:", error);
      }
    };

    if (todoData.length > 0) {
      storeData();
    }
  }, [todoData]);

  const handleSubmit = () => {
    if (isSubmitting) return;
    isSubmitting = true;

    if (title.trim() === "") {
      alert("Please add a task first");
      isSubmitting = false;
      return;
    }

    const newTodo = {
      id: Date.now(), // Unique ID
      title,
      todoDes: desc,
      completed: false,
    };

    setTodoData((prev) => {
      const updatedList = [newTodo, ...prev];
      return updatedList.sort((a, b) => b.id - a.id);
    });

    setTitle("");
    setDesc("");

    setTimeout(() => {
      isSubmitting = false;
    }, 500);
  };

  const toggleUpdate = (id) => {
    setTodoData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDelete = (id) => {
    setTodoData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRoute = (id) => {
    router.push(`/todo/${id}`);
  };

  const renderCom = ({ item }) => (
    <View style={styles.todoMainContainer}>
      <Pressable
        onPress={() => handleRoute(item.id)}
        onLongPress={() => toggleUpdate(item.id)}
        style={styles.textContainer}
      >
        <Text style={[styles.title, item.completed && styles.titleCompleted]}>
          {item.title}
        </Text>
        {/* <Text style={styles.todoDes}>{item.todoDes}</Text> */}
      </Pressable>
      <Pressable onPress={() => handleDelete(item.id)}>
        <Text style={styles.buttonDel}>
          <AntDesign name="delete" size={24} color="red" />
        </Text>
      </Pressable>
    </View>
  );

  return (
    <>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <Container style={styles.mainContainer}>
        <View style={styles.subContainer}>
          <TextInput
            placeholder="Add a new todo task here"
            placeholderTextColor={theme.primary}
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            backgroundColor="transparent"
          />
          <Pressable onPress={handleSubmit}>
            <Text title="Add" style={styles.button}>
              <AntDesign name="pluscircle" size={24} color={theme.primary} />
            </Text>
          </Pressable>
          <Pressable onPress={toggleTheme}>
            {colorScheme === "light" ? (
              <Octicons name="moon" size={24} color="black" />
            ) : (
              <Octicons name="sun" size={24} color="white" />
            )}
          </Pressable>
        </View>

        <View
          style={{
            maxHeight: screenHeight - 200,
            minHeight: screenHeight - 200,
          }}
        >
          <Animated.FlatList
            data={todoData}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <Text style={{ color: "red", textAlign: "center", margin: 10 }}>
                No Todo Found!
              </Text>
            )}
            renderItem={renderCom}
            itemLayoutAnimation={LinearTransition}
            keyboardDismissMode={"on-drag"}
          />
        </View>
      </Container>
    </>
  );
}

function createStyleSheet(theme, colorScheme, screenHeight) {
  return StyleSheet.create({
    mainContainer: {
      minHeight: screenHeight,
      // display: "flex",
      // flexDirection: "column",
      // justifyContent: "space-between",
      backgroundColor: theme.background,
    },

    subContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: theme.card,
      borderRadius: 10,
      borderColor:
        colorScheme === "dark"
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(15, 109, 223, 0.4)",
      boxShadow: "0px 0px 6px rgba(15, 109, 223, 0.4)",
      borderWidth: 1,
      marginHorizontal: 16,
      marginTop: 16,
    },
    input: {
      padding: 4,
      backgroundColor: theme.background,
      color: theme.text,
      width: "80%",
    },
    button: {
      backgroundColor: "",
      padding: 12,
      borderRadius: 10,
      color: "white",
    },
    todoMainContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: theme.card,
      borderRadius: 10,
      borderColor:
        colorScheme === "dark" ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.2)",
      borderWidth: 1,
      marginHorizontal: 16,
      marginTop: 16,
      boxShadow: "0px 0px 2px rgba(0,0,0,.1)",
    },
    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    titleCompleted: {
      maxWidth: "80%",
      marginBottom: 0,
      fontSize: 16,
      color: theme.completedColor,
      textDecorationLine: "line-through",
    },
    titleInCompleted: {
      maxWidth: "80%",
      marginBottom: 0,
      fontSize: 16,
      fontWeight: "bold",
      color: theme.inCompletedColor,
    },

    todoDes: {
      maxWidth: "90%",
    },
    textContainer: {
      flex: 1,
    },
    buttonDel: {
      backgroundColor: "",
      padding: 12,
      borderRadius: 10,
      color: "white",
    },
  });
}
