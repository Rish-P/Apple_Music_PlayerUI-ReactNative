import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  Dimensions,
  Image,
  PanResponder,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Slider from 'react-native-slider'


const screen_height = Dimensions.get('window').height
const screen_width = Dimensions.get('window').width
const MusicPlayerScreen = () => {

  const animatedValue = new Animated.ValueXY({ x: 0, y: screen_height - 80 })

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      animatedValue.extractOffset() //starts the panresponder from where we left, taking into account the offset
    },
    onPanResponderMove: (evt, gesture) => {
      animatedValue.setValue({ x: 0, y: gesture.dy })
    },
    onPanResponderRelease: (evt, gesture) => {
      if (gesture.dy < 0) {
        Animated.spring(animatedValue.y, {
          toValue: -screen_height + 100,
          tension: 1
        }).start()
      }
      if (gesture.dy > 0) {
        Animated.spring(animatedValue.y, {
          toValue: screen_height - 100,
          tension: 1
        }).start()
      }
    }
  })
  const animatedImageHeight = animatedValue.y.interpolate({
    inputRange: [0, screen_height - 80],
    outputRange: [150, 45],
    extrapolate: 'clamp'
  })
  const animatedTextOpacity = animatedValue.y.interpolate({
    inputRange: [0, screen_height - 500, screen_height - 80],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  })
  const animatedImageMargin = animatedValue.y.interpolate({
    inputRange: [0, screen_height - 80],
    outputRange: [screen_width / 2 - 70, 10],
    extrapolate: 'clamp'
  })
  const animatedSliderHeight = animatedValue.y.interpolate({
    inputRange: [0, screen_height - 80],
    outputRange: [screen_height / 2, 80],
    extrapolate: 'clamp'
  })
  const animatedSongDetailsOpacity = animatedValue.y.interpolate({
    inputRange: [0, screen_height - 500, screen_height - 80],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  })

  const animatedHeight = {
    transform: animatedValue.getTranslateTransform()
  }
  return (
    <Animated.View style={styles.container}>
      <View style={{ width: screen_width, height: 100, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30, color: 'pink', letterSpacing: 1 }}>MUSIC PLAYER</Text>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[animatedHeight, styles.mainContainer]}>
        <Animated.View style={{ height: animatedSliderHeight, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
          <View style={styles.backdrop}>
            <Animated.View style={{
              height: animatedImageHeight,
              marginLeft: animatedImageMargin,
              width: animatedImageHeight, borderRadius: 4,
            }}>
              <Image source={require('./assets/hotel.jpg')} style={styles.image} />
            </Animated.View>
            <Animated.Text style={{ opacity: animatedTextOpacity, fontSize: 17, letterSpacing: 0.8, marginLeft: 10 }}>Hotel California(Live)</Animated.Text>
          </View>
          <View style={{ width: 300, marginRight: 30, justifyContent: 'space-between', flexDirection: 'row', width: 40, height: 40, alignItems: 'center' }}>
            <Animated.View style={{ marginRight: 5, opacity: animatedTextOpacity }}>
              <TouchableOpacity>
                <Ionicons name="ios-pause" size={40} color="black" />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={{ opacity: animatedTextOpacity }}>
              <TouchableOpacity>
                <AntDesign name="caretright" size={28} color="black" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
        <Animated.View style={{ height: animatedSliderHeight, opacity: animatedSongDetailsOpacity }}>
          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text style={{ fontSize: 22 }}>Hotel California (Live)</Text>
            <Text style={{ fontSize: 18, color: 'pink' }}>Eagles - Hell Freezes Over</Text>
          </View>
          <View style={{ flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={{
            flex: 2, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'
          }}>
            <AntDesign name="stepbackward" size={36} color="black" />
            <Ionicons name="ios-pause" size={64} color="black" />
            <AntDesign name="stepforward" size={36} color="black" />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15 }}>
            <Ionicons name="ios-add" size={36} color="pink" style={{ fontWeight: "bold" }} />
            <Ionicons name="ios-more" size={36} color="pink" style={{ fontWeight: "bold" }} />
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    zIndex: 1
  },
  mainContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    height: screen_height,
  },
  backdrop: {
    flex: 4,
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
    width: 800
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'black',
  }
})

export default MusicPlayerScreen;