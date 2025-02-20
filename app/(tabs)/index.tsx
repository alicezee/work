import React, {Component, useState} from 'react';
import {TouchableOpacity, Text, View, SafeAreaView, Pressable, Modal} from 'react-native';
import { Image, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Audio } from 'expo-av';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/audio/test.mp3') // Adjust based on your folder structure

    );
    setSound(sound);
    await sound.playAsync();
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  style={[styles.closePopUpPressable]}
                  onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
                <Pressable
                  style={({pressed}) => [
                    {
                      opacity: pressed ? 0.25 : 0.5,
                    },
                    styles.beatRegion,
                  ]}>
                </Pressable>
              </View>
            </View>
        </Modal>
        
        <Pressable
          onPress={async () => {
            setModalVisible(true); // Open the modal
            await playSound(); // Play the sound
          }}
          style={({pressed}) => [
            {
              opacity: pressed ? 0.5 : 1,
            },
            styles.openPopUpPressable,
          ]}>
          <View>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.image} />
          </View>
        </Pressable>
        <ThemedText style={styles.text}>Go To Work</ThemedText>

      </View>
      

    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  beatRegion: {
    backgroundColor: "blue",
    paddingVertical: 100,
    paddingHorizontal: 150,
    borderRadius: 10,
    position: "absolute",
    top: 400,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 325,
    paddingHorizontal: 175,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  safeAreaContainer: {
    flex: 1,
  },
  openPopUpPressable: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10, // Increases touchable area
    borderRadius: 10,
  },
  closePopUpPressable: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10, // Optional rounded corners
  },
});

