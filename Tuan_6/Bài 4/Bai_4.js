import {useState, useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {FlatList, View, Image, Text, Pressable} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

 function Products({navigation}){
    const [data, setData]= useState([]);
    useEffect(()=>{
      fetchAPI= async()=>{
      try{
      const res = await fetch('https://68cb5067430c4476c34c82ad.mockapi.io/data');
      const dulieu = await res.json();
      setData(dulieu);
      }catch(e){
        console.log("Loi: ", e);
      }
    }
    fetchAPI();
    }, []);
    const Product=({item})=>(
     <View style={{flexDirection: 'row',  borderBottomWidth: 1, marginTop: 15, justifyContent: 'space-between'}}>
  <Image style={{width: 50, height: 50, borderRadius: 5}}source={{uri: item.hinhAnh}}/>
      <Text>{item.tenSanPham}</Text>
       <Pressable 
        onPress={()=>navigation.navigate('Chi tiết sản phẩm', { id: item.id })} 
        style={{padding: 5, backgroundColor: 'orange', borderRadius: 5, alignSelf:"center"}}
      >  
        <Text style={{fontSize: 15, color: 'white'}}>Chi tiết</Text> 
      </Pressable>
    </View>
    );
  return(
    <View style={{flex: 1}}>
      <View style ={{flex: 4}}>
    <FlatList data = {data} renderItem={Product} keyExtractor={(item)=>item.id}/>
    </View>
      </View>
  
      )
}
// màn hình chi tiết
function ProductDetails({ route, navigation }) {
  const { id } = route.params;
   const [product, setProduct] = useState(null);
 useEffect(()=>{
    const fetchOne = async()=>{
      try{
        const res = await fetch(`https://68cb5067430c4476c34c82ad.mockapi.io/data/${id}`);
        const detail = await res.json();
        setProduct(detail);
      }catch(e){
        console.log("Loi: ", e);
      }
    }
    fetchOne();
  }, [id]);
if(!product) return <Text>Đang tải...</Text>
  return (
    <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
      <Image
        source={{ uri: product.hinhAnh }}
        style={{ width: 150, height: 150, borderRadius: 10 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        {product.tenSanPham}
      </Text>
        <Text style={{ marginTop: 10 }}>Chủ cửa hàng:
        {product.hoTen}
      </Text>
      <Text style={{ marginTop: 5 }}>Email liện hệ: {product.email}</Text>
      <Text style={{ marginTop: 5 }}>Tên shop: {product.shop}</Text>
      <Text style={{ marginTop: 5, color: "green" }}>
        Giá: {product.gia} VND
      </Text>
    </View>
  );
}
      function Favorites({navigation}){
        const [data, setData]= useState([]);
        useEffect(()=>{
      fetchAPI= async()=>{
      try{
      const res = await fetch('https://68cb5067430c4476c34c82ad.mockapi.io/data_2');
      const dulieu = await res.json();
      setData(dulieu);
      }catch(e){
        console.log("Loi: ", e);
      }
    }
    fetchAPI();
    }, []);

    const SanPham=({item})=>(
     <View style={{flexDirection: 'row',  borderBottomWidth: 1, marginTop: 15}}>
    <Image style={{width: 50, height: 50, borderRadius: 5}}source={{uri: item.hinhAnh}}/>
      <Text>{item.tenSanPham}</Text>
    </View>
    );
  return(
    <FlatList data = {data} renderItem={SanPham} keyExtractor={(item)=>item.id}/>
  );   
}
const Tab = createBottomTabNavigator();
function HomeScreen(){
 return(
   <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Products") {
            iconName = "list";
          } else if (route.name === "Favorites") {
            iconName = "heart";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Products" component={Products} />
      <Tab.Screen name="Favorites" component={Favorites} />
    </Tab.Navigator>
 )
}
export default function TabNavTogether() {
  const Stack = createNativeStackNavigator();
return(
  <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chi tiết sản phẩm"
          component={ProductDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
);
}

