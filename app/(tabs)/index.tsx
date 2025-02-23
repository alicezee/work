import React, {Component, useEffect, useState, useRef} from 'react';
import {TouchableOpacity, Text, View, SafeAreaView, Pressable, Modal, Animated} from 'react-native';
import { Image, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Audio } from 'expo-av';
import { setBackgroundColorAsync } from 'expo-system-ui';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [smallModalVisible, setSmallModalVisible] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [timeouts, setTimeouts] = useState<ReturnType<typeof setTimeout>[]>([]);
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(0);
  const [aPoints, setaPoints] = useState(2);
  const beatNum = useRef(-1);
  const [startTime, setStartTime] = useState<number>(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const times = [8540, 9621,10685, 11579, 12579, 13660, 14724, 15618, 16618, 17699, 18763, 19657, 20657, 21738, 22802, 23696, 24696, 25777, 26841, 27735, 28735, 29816, 30880, 31774]; //adjust to fit beatVisual
  const beatOffset = 0;

  async function playSound(){
    const {sound} = await Audio.Sound.createAsync(
      require('../../assets/audio/Work_game.mp3') 
    );
    setSound(sound);
    sound.setOnPlaybackStatusUpdate((status) => {
      if(!status.isLoaded){
        console.error('not loaded', status);
        return;
      }
      if(status.didJustFinish){
        setSmallModalVisible(true);
        stopSound();
      }
    });
    
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
    beatNum.current += 1; 
    console.log(beatNum.current);
    Animated.timing(opacity, {
      toValue: 1, 
      duration: 100, 
      useNativeDriver: true,
    }).start(() => {

      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0, 
          duration: 100,
          useNativeDriver: true,
        }).start();
      }, 300);
    });
  }

  function executeTimeouts(times: number[]){
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    setStartTime(Date.now());
    
    times.forEach((time: number) => {
      const timeoutId = setTimeout(() => {
        beatVisual();
      }, time-beatOffset);
      timeoutIds.push(timeoutId);
    });
    setTimeouts(timeoutIds);
  }

  function stopTimeouts(){
    timeouts.forEach(clearTimeout);
    setTimeouts([]);
    beatNum.current = -1;
  }

  let textLog = '';
  if (aPoints > 0) {
    textLog = 'Activity points: ' + aPoints;
  } else if (aPoints == 0) {
    textLog = 'Go to sleep!';
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
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={smallModalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.smallModalView}>
                      <Text>Finished!</Text>
                      <Pressable
                        style={styles.closeButton}
                        onPress={() => {setModalVisible(!modalVisible); 
                                        setSmallModalVisible(!smallModalVisible); 
                                        setMoney(current => current+score*15); 
                                        setScore(0); 
                                        setaPoints(current => current-1)}}>
                        <Text style={styles.closeButtonText}>CLOSE</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                <Pressable
                  style={[styles.closePopUpPressable]}
                  onPress={() => {setModalVisible(!modalVisible); 
                                  stopSound(); 
                                  stopTimeouts();
                                  setScore(0)}}>  
                    <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
                <Pressable
                  style={({pressed}) => [
                    {
                      opacity: pressed ? 0.25 : 0.5,
                    },
                    styles.beatRegion,
                  ]}
                  onPress={() => {
                    const pressedTime = Date.now();
                    if((times[beatNum.current]-500 < pressedTime-startTime) && (pressedTime-startTime< times[beatNum.current]+500) && beatNum.current%4 !=0){
                      setScore(current => current+1);
                    }
                    
                  }}
                  delayLongPress={400}
                  onLongPress={() => {
                    if(beatNum.current %4 ==0){
                      setScore(current => current+2)
                    }
                  }}>
                </Pressable>
                <Animated.Image
                  source={require('@/assets/images/react-logo.png')} 
                  style={[styles.slidingImage, {opacity}]}
                />
                <Text>
                  Score: {score}
                </Text>
              </View>
            </View>
        </Modal>
        
        <Pressable
          onPress={async () => {
            if(aPoints>0){
              setModalVisible(true);
              await playSound(); 
              executeTimeouts(times); 
            } 
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
        <ThemedText style={styles.text}>Money: {money}</ThemedText>
        <ThemedText style={styles.text}>{textLog}</ThemedText>

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
    top: 420,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 30,

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
    paddingVertical: 275,
    paddingHorizontal: 125,
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
  smallModalView: {
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 10, //!!!!!!
  },
  safeAreaContainer: {
    flex: 1,
  },
  openPopUpPressable: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
    gap: 10,
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
