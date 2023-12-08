import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React ,{useState}from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";

const ProductItem = ({ item }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  // function for adding items in the cart
  const addItemToCart=(item)=>{
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(()=>{
      setAddedToCart(false);
    },6000)
  }
  const cart = useSelector((state)=>state.cart.cart)
  //  console.log(cart);
   
  return (
    <Pressable style={{ marginHorizontal: 10, marginVertical: 25 }}>
      <Image
        resizeMode="contain"
        style={{ width: 150, height: 150 }}
        source={{ uri: item?.image }}
      />
      <Text numberOfLines={1} style={{ width: 150, marginTop: 15 }}>
        {item.title}
      </Text>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>₹{item?.price}</Text>
        <Text style={{ color: "#FFC72C", fontWeight: "500" }}>
          {item?.rating?.rate} rating
        </Text>
      </View>
      <Pressable
      onPress={()=>addItemToCart(item)}
        style={{
          backgroundColor: "#FFC72C",
          padding: 8,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
       {
        addedToCart? <Text>Added to cart</Text>: <Text>Add to cart</Text>
       }
      </Pressable>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
