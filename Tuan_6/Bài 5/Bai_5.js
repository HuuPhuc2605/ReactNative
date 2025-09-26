import * as React from 'react';
import { View, Text, Switch, StyleSheet, Image } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function HomeScreen() {
 
  return (
 <View style={styles.container}> <Text style={styles.text}>Xin chào bạn đến với trang chủ</Text> </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1,  alignItems: 'center' , marginTop: 30}}>
      <Image style={{width: 200, height: 250, borderRadius: 100}}
       source={{uri: 'https://res.cloudinary.com/dkzpfo8b2/image/upload/v1758881166/images_qiysbo.jpg'}}/>
      <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 20}}> Lê Hữu Phúc</Text>
    </View>
  );
}

function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(false)
  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#222' : '#fff' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text style={{ color: darkMode ? '#fff' : '#000' }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} style={{ marginLeft: 10 }} />
      </View>
    </View>
  );
}

export default function DrawerScreen() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ darkMode: false }} />
        <Drawer.Screen name="Profile" component={ProfileScreen} initialParams={{ darkMode: false }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 10 }
});
