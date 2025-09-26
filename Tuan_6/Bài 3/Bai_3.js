import {useState, useEffect} from 'react';
import { Text, View , FlatList, Image, TextInput,Pressable} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


function HomeScreen() {
const[data, setData] = useState([]);

useEffect(()=>{
const fetchData = async ()=>{
  try{
    const res = await fetch('https://68cb5067430c4476c34c82ad.mockapi.io/data_2');
    const product = await res.json();
    setData(product);
  }catch(e){
console.log('Loi: ', e);
  }
}
fetchData();
}, []);

const RenderItem=({item})=>
(
  <View style={{flexDirection: 'row',  borderBottomWidth: 1, marginTop: 15}}>
   
  <Image style={{width: 50, height: 50, borderRadius: 5}}source={{uri: item.hinhAnh}}/>
      <Text>{item.tenSanPham}</Text>
    </View>
  
  );
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <FlatList data={data} 
     renderItem={RenderItem} 
     keyExtractor={(item)=>item.id}/>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 30 }}>
        <View style={{ flexDirection: 'row', gap: 10}}>
      <TextInput placeholder='  Nhập tên sản phẩm cần tìm...' style={{width: 250, height: 50, backgroundColor: 'lightgray'}}/>
      <Pressable style={{backgroundColor: 'lightblue', paddingHorizontal: 5, paddingVertical: 10, borderRadius: 5}}> <Text style={{ fontWeight: 'bold', fontSize: 17}}>Tìm kiếm</Text></Pressable>
    </View>
     </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1,  alignItems: 'center' , marginTop: 30}}>
      <Image style={{width: 200, height: 250, borderRadius: 100}} source={{uri: 'https://res.cloudinary.com/dkzpfo8b2/image/upload/v1758881166/images_qiysbo.jpg'}}/>
      <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 20}}> Lê Hữu Phúc</Text>
    </View>
  );
}


const Tab = createBottomTabNavigator();

export default function TabNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Search') {
              iconName = 'search';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
     
      </Tab.Navigator>
    </NavigationContainer>
  );
}
