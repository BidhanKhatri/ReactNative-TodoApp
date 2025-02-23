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

import AsyncStorage from "@react-native-async-storage/async-storage";

import data from "../data/todo.js";
import { useEffect, useState } from "react";
import Animated, { LinearTransition } from "react-native-reanimated"; //Animated ma FlatList already huncha so Animated.FlatList

export default function Index() {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  // console.log(data);

  const [todoData, setTodoData] = useState(data.sort((a, b) => b.id - a.id));
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // console.log(todoData);

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
    if (title.trim() === "") return alert("Please fill the fields");

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

  const renderCom = ({ item }) => (
    <View style={styles.todoMainContainer}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.titleCompleted,
            item.completed && styles.titleInCompleted,
          ]}
          onPress={() => toggleUpdate(item.id)}
        >
          {item.title}
        </Text>
        {/* <Text style={styles.todoDes}>{item.todoDes}</Text> */}
      </View>
      <View>
        <Text style={styles.buttonDel} onPress={() => handleDelete(item.id)}>
          <AntDesign name="delete" size={24} color="red" />
        </Text>
      </View>
    </View>
  );

  return (
    <Container style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <TextInput
          placeholder="Add task"
          placeholderTextColor={"black"}
          style={styles.input}
          onChangeText={setTitle}
          value={title}
        />
        <Pressable>
          <Text title="Add" style={styles.button} onPress={handleSubmit}>
            <AntDesign name="pluscircle" size={24} color="green" />
          </Text>
        </Pressable>
      </View>
      <View>
        <Animated.FlatList
          data={todoData}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <Text>No Todo Found!</Text>}
          renderItem={renderCom}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode={"on-drag"}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    minHeight: "100%",
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "space-between",
  },

  subContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  input: {
    padding: 4,
    backgroundColor: "white",
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
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  titleCompleted: {
    maxWidth: "80%",
    marginBottom: 0,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  titleInCompleted: {
    maxWidth: "80%",
    marginBottom: 0,
    fontSize: 16,

    color: "gray",
    textDecorationLine: "line-through",
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
