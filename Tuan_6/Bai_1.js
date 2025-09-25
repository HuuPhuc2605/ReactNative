import {View, Text, Image,Pressable} from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from "@react-navigation/native-stack";
export default function GiaoDienChinh(){
  const Stack = createNativeStackNavigator();
  function VsmartDo({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_red.png")}/>
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
        <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }

   function VsmartDen({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_black.png")}/>
    <View>
     <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
          <Text>Màu: đỏ</Text>
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
        <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }
   function VsmartBac({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_silver.png")}/>
    <View>
     <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
          <Text>Màu: đỏ</Text>
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
        <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }
     function VsmartXanh({navigation}){
    return(
      <View style={{flex: 1, backgroundColor: 'lightgray'}}>
       <View style={{flex: 1.5, flexDirection: 'row', gap: 10, backgroundColor: 'white'}}>
    <Image  style={{width: 120, height: 130 , marginTop: 9, marginLeft: 2}} resizeMode="center" source={require("./vs_blue.png")}/>
    <View>
     <Text>Điện thoại Vsmart Joy 3 - Hàng chính hãng</Text>
          <Text>Màu: đỏ</Text>
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
        <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: '#4d6dc1', padding: 5, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold'}}>XONG</Text>
    </Pressable>
       </View>
    )
  }
  function Home({navigation}){
    return( 
    <View style={{flex: 1, gap: 10}}> 
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
    <Image  style={{width: 220, height: 270, }}source={require("./vs_blue.png")}/> 
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
    <Pressable style={{backgroundColor: 'lightgray', padding: 5, alignItems: 'center', borderRadius: 5, borderWidth: 1}}><Text style={{fontSize: 13}}>4 MÀU-CHỌN MÀU</Text></Pressable>

    <Pressable onPress={()=> navigation.navigate('VsmartDo')} style={{backgroundColor: 'red', padding: 5,marginTop: 40, alignItems: 'center', borderRadius: 5}}><Text style={{color: 'white', fontWeight: 'bold', }}>CHỌN MUA</Text>
    </Pressable>
       </View>
        
       )
  }
return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home"    component={Home} />
        <Stack.Screen name="VsmartDo" component={VsmartDo} />
        <Stack.Screen name="VsmartDen" component={VsmartDen} />
         <Stack.Screen name="VsmartBac" component={VsmartBac} />
          <Stack.Screen name="VsmartXanh" component={VsmartXanh} />
      </Stack.Navigator>
    </NavigationContainer>
   
  )
}
