import {View, Text, Image,Pressable} from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator} from "@react-navigation/native-stack";
export default function GiaoDienChinh(){
  const Stack = createNativeStackNavigator();
  {/*Màn hình điện thoại đỏ*/}
  function VsmartDo({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_red_a1.png")}/>
    <View>
     <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
          <Text>Màu: đỏ</Text>
            <Text>Cung cấp bởi: Tiki Tradding</Text>
             <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
      </View>
       </View>
         <Text>Chọn một màu bên dưới: </Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable onPress={()=>navigation.navigate('VsmartBac')} style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable style={{backgroundColor: 'red', width: 60, height: 60}}/><Pressable   onPress={()=>navigation.navigate('VsmartDen')} style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartXanh')} style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('HomeDo')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }
  function HomeDo({navigation}){
    return( 
    <View style={{flex: 1, gap: 10, alignContent: 'space-between', padding: 10}}> 
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <Image  style={{width: 280, height: 340, marginTop: 30 }}source={require("./vs_red_a1.png")}/> 
    </View>
    <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
    <View style={{flexDirection: "row", gap: 5}}>
    {[...Array(5)].map((_, i)=>(<Ionicons key={i} name="star" size={20} color="gold"/>))}
    <Text>(Xem 828 đánh giá)</Text>
    </View>
      <View style={{flexDirection: "row", gap: 25}}>
    <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
    <Text style={{textDecorationLine: 'line-through', fontSize: 12, color: 'gray'}}>1.790.000 đ</Text>
     
    </View>
       <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable onPress ={()=> navigation.navigate('ChonMua')} style={{backgroundColor: 'red', padding: 5,marginTop: 50, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold', }}>CHỌN MUA</Text>
    </Pressable>
       </View>
        
       )
  }
  {/*Màn hình điện thoại đen*/}
   function VsmartDen({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_black.png")}/>
    <View>
     <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
          <Text>Màu: đen</Text>
            <Text>Cung cấp bởi: Tiki Tradding</Text>
             <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
      </View>
       </View>
         <Text>Chọn một màu bên dưới</Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable onPress={()=>navigation.navigate('VsmartBac')}style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartDo')} style={{backgroundColor: 'red', width: 60, height: 60}}/><Pressable style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartXanh')}style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('HomeDen')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }
    function HomeDen({navigation}){
    return( 
    <View style={{flex: 1, gap: 10, alignContent: 'space-between', padding: 10}}> 
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <Image  style={{width: 270, height: 340, marginTop: 30 }}source={require("./vs_black.png")}/> 
    </View>
    <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
    <View style={{flexDirection: "row", gap: 5}}>
    {[...Array(5)].map((_, i)=>(<Ionicons key={i} name="star" size={20} color="gold"/>))}
    <Text>(Xem 828 đánh giá)</Text>
    </View>
      <View style={{flexDirection: "row", gap: 25}}>
    <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
    <Text style={{textDecorationLine: 'line-through', fontSize: 12, color: 'gray'}}>1.790.000 đ</Text>
     
    </View>
       <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable onPress ={()=> navigation.navigate('ChonMua')} style={{backgroundColor: 'red', padding: 5,marginTop: 50, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold', }}>CHỌN MUA</Text>
    </Pressable>
       </View>
        
       )
  }
    {/*Màn hình điện thoại bạc*/}
   function VsmartBac({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_silver.png")}/>
    <View>
     <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
          <Text>Màu: bạc</Text>
            <Text>Cung cấp bởi: Tiki Tradding</Text>
             <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
      </View>
       </View>
         <Text>Chọn một màu bên dưới</Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartDo')} style={{backgroundColor: 'red', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartDen')} style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartXanh')}style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('HomeBac')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }
      function HomeBac({navigation}){
    return( 
    <View style={{flex: 1, gap: 10, alignContent: 'space-between', padding: 10}}> 
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <Image  style={{width: 270, height: 340, marginTop: 30 }}source={require("./vs_silver.png")}/> 
    </View>
    <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
    <View style={{flexDirection: "row", gap: 5}}>
    {[...Array(5)].map((_, i)=>(<Ionicons key={i} name="star" size={20} color="gold"/>))}
    <Text>(Xem 828 đánh giá)</Text>
    </View>
      <View style={{flexDirection: "row", gap: 25}}>
    <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
    <Text style={{textDecorationLine: 'line-through', fontSize: 12, color: 'gray'}}>1.790.000 đ</Text>
     
    </View>
       <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable onPress ={()=> navigation.navigate('ChonMua')} style={{backgroundColor: 'red', padding: 5,marginTop: 50, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold', }}>CHỌN MUA</Text>
    </Pressable>
       </View>
        
       )
  }
    {/*Màn hình điện thoại xanh*/}
     function VsmartXanh({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_blue.png")}/>
    <View>
     <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
          <Text>Màu: xanh</Text>
            <Text>Cung cấp bởi: Tiki Tradding</Text>
             <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
      </View>
       </View>
         <Text>Chọn một màu bên dưới</Text>
       <View style={{flex: 3,justifyContent: 'center', alignItems: 'center', gap: 10}}>
       <Pressable style={{backgroundColor: '#c5f1fb', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartDo')} style={{backgroundColor: 'red', width: 60, height: 60}}/>
       <Pressable onPress={()=>navigation.navigate('VsmartDen')} style={{backgroundColor: 'black', width: 60, height: 60}}/>
       <Pressable style={{backgroundColor: 'blue', width: 60, height: 60}}/>
       </View>
        <Pressable onPress={()=> navigation.navigate('Home')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }
  function Home({navigation}){
    return( 
    <View style={{flex: 1, gap: 10, alignContent: 'space-between', padding: 10}}> 
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <Image  style={{width: 270, height: 340, marginTop: 30 }}source={require("./vs_blue.png")}/> 
    </View>
    <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
    <View style={{flexDirection: "row", gap: 5}}>
    {[...Array(5)].map((_, i)=>(<Ionicons key={i} name="star" size={20} color="gold"/>))}
    <Text>(Xem 828 đánh giá)</Text>
    </View>
      <View style={{flexDirection: "row", gap: 25}}>
    <Text style={{fontWeight: 'bold'}}>1.790.000 đ</Text>
    <Text style={{textDecorationLine: 'line-through', fontSize: 12, color: 'gray'}}>1.790.000 đ</Text>
     
    </View>
       <Text style={{color: 'red', fontSize: 15, fontWeight: 'bold'}}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable  onPress ={()=> navigation.navigate('ChonMua')} style={{backgroundColor: 'red', padding: 5,marginTop: 50, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold', }}>CHỌN MUA</Text>
    </Pressable>
       </View>
        
       )
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
        <Stack.Screen name="Home"    component={Home} />
        <Stack.Screen name="VsmartDo" component={VsmartDo} />
        <Stack.Screen name="HomeDo"    component={HomeDo} />
        <Stack.Screen name="VsmartDen" component={VsmartDen} />
         <Stack.Screen name="HomeDen"    component={HomeDen} />
         <Stack.Screen name="VsmartBac" component={VsmartBac} />
            <Stack.Screen name="HomeBac"    component={HomeBac} />
          <Stack.Screen name="VsmartXanh" component={VsmartXanh} />
          <Stack.Screen name="ChonMua" component={ChonMua}/>
      </Stack.Navigator>
    </NavigationContainer>
   
  )
}
