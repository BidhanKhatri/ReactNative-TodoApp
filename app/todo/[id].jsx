import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../context/ThemeContext.js";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";

const UpdateTodo = () => {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = useState({});
  const { theme, colorScheme } = useContext(ThemeContext);
  const screenHeight = Dimensions.get("window").height;
  const router = useRouter();
  //   console.log(todo);

  const styles = createStyle(theme, colorScheme, screenHeight);

  //get the todo from AsyncStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoData");
        const storgeData = jsonValue !== null ? JSON.parse(jsonValue) : null;
        const findSelectedData = storgeData.find(
          (el) => el.id.toString() === id.toString()
        ); //return a single object which matches the condition
        setTodo(findSelectedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  //update the todo and filter the previous todo logic

  const updateData = async () => {
    try {
      const savedTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem("TodoData");
      const storgeData = jsonValue !== null ? JSON.parse(jsonValue) : null;

      if (storgeData && storgeData.length) {
        const otherTodos = storgeData.filter(
          (todo) => todo.id.toString() !== savedTodo.id.toString()
        );
        const allTodos = [...otherTodos, savedTodo];
        await AsyncStorage.setItem("TodoData", JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem("TodoData", JSON.stringify([savedTodo]));
      }
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  //function to handle cancle
  const handleCancel = () => {
    router.push("/");
  };

  return (
    <View>
      <View style={styles.parent}>
        <Text style={styles.displayTodo}>{todo.title}</Text>

        <View style={styles.mainContainer}>
          <TextInput
            // value={todo?.title || ""}
            onChangeText={(text) =>
              setTodo((prev) => ({ ...prev, title: text }))
            }
            style={styles.textArea}
          >
            {todo?.title}
          </TextInput>
          <Pressable onPress={updateData} style={styles.buttonUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </Pressable>
          <Pressable onPress={handleCancel} style={styles.buttonCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default UpdateTodo;

function createStyle(theme, colorScheme, screenHeight) {
  return StyleSheet.create({
    parent: {
      backgroundColor: theme.background,
      minHeight: screenHeight,
    },
    displayTodo: {
      backgroundColor: theme.card,
      color: theme.completedColor,
      textAlign: "center",
      padding: 20,
      borderRadius: 16,
      fontWeight: "semi-bold",
      flexWrap: "wrap",
      fontSize: 16,
      margin: 10,
      borderColor: "gray",
      borderWidth: 1,
    },
    mainContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "4",
      backgroundColor: "",
      padding: 10,
    },
    textArea: {
      borderColor: "gray",
      backgroundColor: theme.card,
      color: theme.text,
      borderWidth: 1,
      borderRadius: 10,
      padding: 16,
      flex: 1,
    },
    buttonUpdate: {
      backgroundColor: theme.secondary,
      padding: 16,
      borderRadius: 10,
    },
    buttonCancel: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 10,
    },
    buttonText: {
      color: "white",
    },
  });
}
