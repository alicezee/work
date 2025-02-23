import React, {Component, useEffect, useState, useRef} from 'react';
import {TouchableOpacity, Text, View, SafeAreaView, Pressable, Modal, Animated} from 'react-native';
import { Image, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Audio } from 'expo-av';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [timeouts, setTimeouts] = useState<ReturnType<typeof setTimeout>[]>([]);
  const opacity = useRef(new Animated.Value(0)).current;
  const times = [8540, 9621,10685, 11579, 12579, 13660, 14724, 15618, 16618, 17699, 18763, 19657, 20657, 21738, 22802, 23696, 24696, 25777, 26841, 27735, 28735, 29816, 30880, 31774]; //adjust to fit beatVisual

  async function playSound(){
    const {sound} = await Audio.Sound.createAsync(
      require('../../assets/audio/Work_game.mp3') 
    );
    setSound(sound);
    await sound.playAsync();
  }

  async function stopSound(){
    if(sound){
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  }

  function beatVisual(){
    Animated.timing(opacity, {
      toValue: 1, // Fully visible
      duration: 100, 
      useNativeDriver: true,
    }).start(() => {
      // Stay visible for 1 second, then fade out
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0, // Fully invisible
          duration: 100,
          useNativeDriver: true,
        }).start();
      }, 300);
    });
  }

  function executeTimeouts(times: number[]){
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    times.forEach((time: number) => {
      const timeoutId = setTimeout(() => {
        beatVisual();
      }, time);
      timeoutIds.push(timeoutId);
    });
    setTimeouts(timeoutIds);
  }

  function stopTimeouts(){
    timeouts.forEach(clearTimeout);
    setTimeouts([]);
  }

  function scoreTracker(){

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
                  onPress={() => [setModalVisible(!modalVisible), stopSound(), stopTimeouts()]}>  
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
                <Animated.Image
                  source={require('@/assets/images/react-logo.png')} 
                  style={[styles.slidingImage, {opacity}]}
                />
              </View>
            </View>
        </Modal>
        
        <Pressable
          onPress={async () => {
            setModalVisible(true); //open the modal
            await playSound(); //play the sound
            executeTimeouts(times); //start timer
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
  },
  slidingImage: {
    width: 100,
    height: 100,
  },
});

