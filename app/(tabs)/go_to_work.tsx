import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet, Pressable, Alert, GestureResponderEvent } from "react-native";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle swipe detection
  const handleSwipe = (event: GestureResponderEvent) => {
    Alert.alert("Swiped!", "You swiped inside the popup.");
  };

  return (
    <View style={styles.container}>
      {/* Button to Open Popup */}
      <Button title="Open Popup" onPress={() => setModalVisible(true)} />

      {/* Popup Window */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Android back button closes modal
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>This is a popup window!</Text>

            {/* Pressable region with Long Press & Swipe Detection */}
            <Pressable
              style={styles.pressableRegion}
              onLongPress={() => Alert.alert("Long Press!", "You long-pressed inside the popup.")}
              onResponderMove={handleSwipe} // Detects swipes
              onStartShouldSetResponder={() => true} // Enables responder
            >
              <Text style={styles.pressableText}>Long Press or Swipe Here</Text>
            </Pressable>

            {/* Close Button */}
            <Button title="Close Popup" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  pressableRegion: {
    backgroundColor: "#ddd",
    padding: 20,
    marginVertical: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  pressableText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

