import { Animated, StyleSheet,View,} from 'react-native'
import React from 'react'

const Pagination = ({ data, index }) => {
  return (
    <View style={styles.container}>
      {
        data.map((_, idx) => {
          return <Animated.View key={idx.toString()} style={[styles.dot, idx === index && styles.dotActive]} />
        })
      }
    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: 'rgb(102, 179, 255)',
  },
})