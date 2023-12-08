import { Dimensions, Image, StyleSheet, View } from 'react-native'
import React from 'react'
const { width, height } = Dimensions.get('screen');

const SlideItems = ({ item }) => {


  return (
    <View style={styles.Container}>
      <Image source={{uri : item.img}} style={styles.imageStyles} resizeMode="contain"/>
    </View>
  )
}

export default SlideItems

const styles = StyleSheet.create({
  Container: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyles: {
    width,
    height: 180,
  },
})