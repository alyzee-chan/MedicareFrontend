import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, ImageBackground, StyleSheet, View } from "react-native";
import { colors, shadows } from "../theme";

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation continue du cercle de chargement
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Apparition du logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onFinish, fadeAnim, scaleAnim, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/LoadingPage.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Animated.View style={[styles.ring, { transform: [{ rotate: rotation }] }]} />

          <Animated.View
            style={[
              styles.logoWrap,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={styles.logo}
            />
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "transparent",
    borderTopColor: colors.primary,
    borderRightColor: "rgba(52, 120, 246, 0.2)",
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 35,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 22,
  },
});
