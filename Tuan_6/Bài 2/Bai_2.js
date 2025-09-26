//API: https://68cb5067430c4476c34c82ad.mockapi.io/data_2
import {Pressable, Text, View, Image, ActivityIndicator} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useState, useEffect} from 'react';
export default function AppAPI(){
  const [products, setProducts] = useState(null);
  useEffect(()=>{
  const fetchData = async()=>{
    try{
      const res = await fetch('https://68cb5067430c4476c34c82ad.mockapi.io/data_2');
      const data = await res.json();
      setProducts(data);
    }catch(e){
      console.log("Loi: ", e);
    }
  }
  fetchData();}, [])
  const Stack = createNativeStackNavigator();

//Function Home
function Home({navigation}){

  if(!products){
    return  <ActivityIndicator style={{flex:1}} size="large" color="lightblue"/>  
      
  }
const product = products.find(item => Number(item.id) === 7);
  return(
    <View style={{flex: 1, gap: 15, padding: 10}}>
      <View style={{alignItems: 'center' }}>
    <Image style={{width: 250, height: 310, marginTop: 30,}} source={{uri: product.hinhAnh}}/>
    </View>
    <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text>  (Xem {product.reviews} đánh giá) </Text>
       </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
     <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=>navigation.navigate('SmartDo',  { product })} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable onPress={()=>navigation.navigate('ChonMua')}   style={{padding: 5, alignItems: 'center', backgroundColor: 'red', marginTop: 40, borderRadius: 5}}>  <Text style={{fontSize: 20, fontWeight:'bold', color: 'white'}}>  CHỌN MUA </Text> </Pressable>
     </View>
  );
}
//Home đỏ
function HomeDo({navigation}){

  if(!products){
    return  <ActivityIndicator style={{flex:1}} size="large" color="lightblue"/>  
      
  }
const product = products.find(item => Number(item.id) === 8);
  return(
    <View style={{flex: 1, gap: 15, padding: 10}}>
      <View style={{alignItems: 'center' }}>
    <Image style={{width: 250, height: 310, marginTop: 30,}} source={{uri: product.hinhAnh}}/>
    </View>
    <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text>  (Xem {product.reviews} đánh giá) </Text>
       </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
     <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=>navigation.navigate('SmartDo',  { product })} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable onPress={()=>navigation.navigate('ChonMua')}  style={{padding: 5, alignItems: 'center', backgroundColor: 'red', marginTop: 40, borderRadius: 5}}>  <Text style={{fontSize: 20, fontWeight:'bold', color: 'white'}}>  CHỌN MUA </Text> </Pressable>
     </View>
  );
}
//Home đen
function HomeDen({navigation}){

  if(!products){
    return  <ActivityIndicator style={{flex:1}} size="large" color="lightblue"/>  
      
  }
const product = products.find(item => Number(item.id) === 10);
  return(
    <View style={{flex: 1, gap: 15, padding: 10}}>
      <View style={{alignItems: 'center' }}>
    <Image style={{width: 250, height: 310, marginTop: 30,}} source={{uri: product.hinhAnh}}/>
    </View>
    <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text>  (Xem {product.reviews} đánh giá) </Text>
       </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
     <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=>navigation.navigate('SmartDo',  { product })} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable onPress={()=>navigation.navigate('ChonMua')}  style={{padding: 5, alignItems: 'center', backgroundColor: 'red', marginTop: 40, borderRadius: 5}}>  <Text style={{fontSize: 20, fontWeight:'bold', color: 'white'}}>  CHỌN MUA </Text> </Pressable>
     </View>
  );
}
//Home bạc
function HomeBac({navigation}){

  if(!products){
    return  <ActivityIndicator style={{flex:1}} size="large" color="lightblue"/>  
      
  }
const product = products.find(item => Number(item.id) === 9);
  return(
    <View style={{flex: 1, gap: 15, padding: 10}}>
      <View style={{alignItems: 'center' }}>
    <Image style={{width: 250, height: 310, marginTop: 30,}} source={{uri: product.hinhAnh}}/>
    </View>
    <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text>  (Xem {product.reviews} đánh giá) </Text>
       </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
     <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=>navigation.navigate('SmartDo')} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable  onPress={()=>navigation.navigate('ChonMua')}  style={{padding: 5, alignItems: 'center', backgroundColor: 'red', marginTop: 40, borderRadius: 5}}>  <Text style={{fontSize: 20, fontWeight:'bold', color: 'white'}}>  CHỌN MUA </Text> </Pressable>
     </View>
  );
}
// Function đỏ
  function SmartDo({navigation, route}){
const product = products.find(item => Number(item.id) === 8);
  return(
        <View style={{flex: 1, backgroundColor: 'lightgray', padding: 10}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 15, backgroundColor: 'white'}}>
    <Image style={{width: 120, height: 150 , marginTop: 9, marginLeft: 2}} source={{uri: product.hinhAnh}}/>
      <View>
   <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text> (Xem {product.reviews} đánh giá) </Text>
     </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
      </View>
         </View>
 <Text>Chọn một màu bên dưới:</Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable onPress={()=>navigation.navigate('SmartBac')}style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable style={{backgroundColor: 'red', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('SmartDen')}  style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('SmartXanh')}style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('HomeDo', { product })} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
     </View>
       
  );
}
function SmartDen({navigation, route}){
const product = products.find(item => Number(item.id) === 10);
  return(
        <View style={{flex: 1, backgroundColor: 'lightgray', padding: 10}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 15, backgroundColor: 'white'}}>
    <Image style={{width: 120, height: 150 , marginTop: 9, marginLeft: 2}} source={{uri: product.hinhAnh}}/>
      <View>
   <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text> (Xem {product.reviews} đánh giá) </Text>
     </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
      </View>
         </View>
 <Text>Chọn một màu bên dưới:</Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable onPress={()=>navigation.navigate('SmartBac')}style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('SmartDo')} style={{backgroundColor: 'red', width: 60, height: 60}}/><Pressable style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('SmartXanh')}style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('HomeDen', { product })} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
     </View>
       
  );
}
function SmartBac({navigation, route}){
const product = products.find(item => Number(item.id) === 9);
  return(
        <View style={{flex: 1, backgroundColor: 'lightgray', padding: 10}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 15, backgroundColor: 'white'}}>
    <Image style={{width: 120, height: 150 , marginTop: 9, marginLeft: 2}} source={{uri: product.hinhAnh}}/>
      <View>
   <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text> (Xem {product.reviews} đánh giá) </Text>
     </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
      </View>
         </View>
 <Text>Chọn một màu bên dưới:</Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('SmartDo')} style={{backgroundColor: 'red', width: 60, height: 60}}/>        <Pressable onPress={()=>navigation.navigate('SmartDen')} style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('SmartXanh')}style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('HomeBac', { product })} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
     </View>
       
  );
}
function SmartXanh({navigation, route}){
const product = products.find(item => Number(item.id) === 7);
  return(
        <View style={{flex: 1, backgroundColor: 'lightgray', padding: 10}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 15, backgroundColor: 'white'}}>
    <Image style={{width: 120, height: 150 , marginTop: 9, marginLeft: 2}} source={{uri: product.hinhAnh}}/>
      <View>
   <Text>  {product.tenSanPham}  </Text>
    <View style={{flexDirection: 'row', gap: 10}}>
     <Text style={{ fontSize: 16 }}>
      {"⭐".repeat(Math.round(product.rating))}
    </Text>
    <Text> (Xem {product.reviews} đánh giá) </Text>
     </View>
         <View style={{flexDirection: 'row', gap: 15}}>
        <Text style ={{fontWeight: 'bold', fontSize: 17}}>  {product.gia}  </Text>
         <Text style={{fontWeight: 'bold', textDecorationLine: 'line-through',color: 'gray'}}>  {product.gia}  </Text>
    </View>
      </View>
         </View>
 <Text>Chọn một màu bên dưới:</Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable onPress={()=>navigation.navigate('SmartBac')}style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('SmartDo')} style={{backgroundColor: 'red', width: 60, height: 60}}/><Pressable onPress={()=>navigation.navigate('SmartDen')} style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('Home', { product })} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
     </View>
       
  );
}
  function ChonMua({navigation}){
  return(
    <View style={{backgroundColor: 'lightblue', flex: 1, alignItems: 'center', justifyContent: 'center'}}> 
 <Ionicons name="checkmark-circle" size={100} color="green" style={{marginBottom: 20}} />
    <Text style={{fontSize: 30, fontWeight: 'bold',   textAlign: 'center' }}> Bạn đã đặt mua thành công  🎉</Text>
    <Pressable onPress={()=> navigation.navigate('Home')} style={{backgroundColor: 'blue', marginTop: 50 ,  padding: 5, borderRadius: 5}}>    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', alignItems: 'center', justifyContent: 'center'}}> VỀ TRANG CHỦ  </Text></Pressable></View>
  )
  }
  return(
 
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="HomeDo" component={HomeDo} />
     <Stack.Screen name="HomeDen" component={HomeDen} />
      <Stack.Screen name="HomeBac" component={HomeBac} />
     <Stack.Screen name ="SmartDo" component={SmartDo}/>
      <Stack.Screen name ="SmartDen" component={SmartDen}/>
       <Stack.Screen name ="SmartBac" component={SmartBac}/>
        <Stack.Screen name ="SmartXanh" component={SmartXanh}/>
        <Stack.Screen name ="ChonMua" component={ChonMua}/>
     </Stack.Navigator>
     </NavigationContainer>
  )}