import React, { Component, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import { TextInput, TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useCode, cond, set, eq, Easing, interpolate, SpringUtils } from 'react-native-reanimated'
import { timing, useTimingTransition, withTimingTransition, onGestureEvent, spring, withSpringTransition } from 'react-native-redash/lib/module/v1'
import { Ionicons } from '@expo/vector-icons'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const Logo = ({ scale }) => {
  return (
    <Animated.View style={{ ...styles.logo, transform: [{ scale: scale }] }}>
      <Text style={styles.logoText}>
        Uber
      </Text>
    </Animated.View>
  )
}
const Footer = () => {
  return (
    <View style={styles.footer}>

    </View>
  )
}

const App = () => {


  const innerLoginY = interpolate(scaleAnimation, {  //interpolating the login view to move after the transition
    inputRange: [0, 1],
    outputRange: [150, 0],
  })


  //ALL GESTURE HANDLERS
  const gestureState = useRef(new Animated.Value(State.UNDETERMINED))
  const gestureHandler = onGestureEvent({ state: gestureState.current })

  const backarrowstate = useRef(new Animated.Value(State.UNDETERMINED))
  const backarrowhandler = onGestureEvent({ state: gestureState.current })

  //ANIMATIONS
  const isOpen = useRef(new Animated.Value(0))
  const isOpenAnimation = withSpringTransition(isOpen.current, {
    ...SpringUtils.makeDefaultConfig(),
    overshootClamping: true,
    damping: new Animated.Value(20)
  })

  const scale = useRef(new Animated.Value(0)); //define an animated value that maintains the state
  const scaleAnimation = timing(scale.current, {
    duration: 2000,
    from: 0,
    to: 1,
    easing: Easing.linear    //creating the transition effect wrt the animated value
  });

  //useCode Hooks
  //hook to implement this code immediately after screen renders


  useCode(() => cond(eq(gestureState.current, State.END), [
    cond(eq(isOpen.current, 0), set(isOpen.current, 1))
  ]), [gestureState.current])
  useCode(() => cond(eq(backarrowstate, State.END), [ //let the gesture run till the touch is released
    set(gestureState.current, State.UNDETERMINED),  //disable the original touch gesture on the loginview, bring back to normal
    set(isOpen.current, 0) //bring the open action sheet back down
  ]), [backarrowstate.current])

  useCode(() => cond(eq(scale.current, 0), set(scale.current, 1)), [])

  //INTERPOLATIONS
  const outerLoginY = interpolate(isOpenAnimation, {
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT - 150, 75]
  })

  const getmovingOpacity = interpolate(isOpenAnimation, {
    inputRange: [0, 1],
    outputRange: [1, 0]
  })
  const translateX = interpolate(isOpenAnimation, {
    inputRange: [0, 1],
    outputRange: [0, 25]
  })
  const translateY = interpolate(isOpenAnimation, {
    inputRange: [0, 1],
    outputRange: [0, -85]
  })
  const animationOpacity = interpolate(isOpenAnimation, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1]
  })



  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo scale={scaleAnimation} />
      </View>
      <TapGestureHandler {...backarrowhandler}>
        <Animated.View style={styles.iconStyles}>
          <Ionicons name="md-arrow-back" size={24} color="black" />
        </Animated.View>
      </TapGestureHandler>
      <Animated.View
        style={{
          backgroundColor: "white",
          ...StyleSheet.absoluteFill,
          transform: [{ translateY: outerLoginY }],
        }}
      >
        <Animated.View
          style={styles.backdrop}
        >
        </Animated.View>
        <Animated.View>
          <Animated.View
            style={{
              height: 150,
              backgroundColor: "white",
              transform: [{ translateY: innerLoginY }],
            }}
          >
            <Animated.View style={{
              marginLeft: 25,
              marginTop: 20,
              alignItems: 'flex-start',
              opacity: getmovingOpacity
            }}>
              <Text style={{
                fontSize: 21,
              }}>Get moving with Uber</Text>
            </Animated.View>

            <TapGestureHandler {...gestureHandler}>
              <Animated.View>
                <Animated.View style={styles.mobileNumberContainer} pointerEvents="none">
                  <Animated.View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontSize: 18 }}>+91-</Text>
                  </Animated.View>
                  <Animated.View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput keyboardType="number-pad"
                      placeholder="Enter your mobile number"
                      style={styles.numberInput}
                    />
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            </TapGestureHandler>
            <Animated.View style={styles.mobileNumberText}>
              <Text style={{ fontSize: 20, }}>Enter your mobile number</Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2289d6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    fontSize: 30,
    color: 'black'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 100,
    width: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  footer: {
    width: SCREEN_WIDTH,
    backgroundColor: 'white'
  },
  iconStyles: {
    opacity: animationOpacity,
    position: 'absolute',
    top: 40,
    left: 20
  },
  backdrop: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2289d6",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  mobileNumberContainer: {
    flexDirection: 'row',
    marginLeft: 25,
    marginTop: 15,
    alignItems: 'flex-start',
  },
  mobileNumberText: {
    opacity,
    transform: [{
      translateX,
      translateY
    }],
    opacity,
  },
  numberInput: {
    marginLeft: 2,
    padding: 7,
    width: 300,
    fontSize: 17,
    borderWidth: 0.2,
    borderRadius: 5,
    borderColor: 'lightgray'
  },
})

export default App;