import { Animated, FlatList, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import SlidesData from '../../assets/SliderImages'
import SlideItems from './SlideItems'
import Pagination from './Pagination'

const Slider = () => {

  const [index, setIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = event => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
    setIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container} >
      <FlatList
        data={SlidesData}
        renderItem={({ item }) => <SlideItems item={item} />}
        horizontal
        pagingEnabled
        snapToAlignment='center'
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination data={SlidesData} index={index} />
    </View>
  )
}

export default Slider

const styles = StyleSheet.create({
  container: {
    // height: 240,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom:8,
  },
})