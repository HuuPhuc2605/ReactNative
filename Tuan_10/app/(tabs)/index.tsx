
import { View , Text, Image, ActivityIndicator, FlatList, Pressable} from 'react-native';
import {useState, useEffect} from 'react'
import axios from 'axios';
function Card ({card}) {
return(
<View style={{flex: 1, backgroundColor: 'lightyellow', marginTop: 10, marginLeft: 10, borderRadius: 10, borderBottomWidth: 10, gap: 10,  padding: 10}}>
<View style={{flexDirection: 'row', gap: 10}}>
<Image style={{width: 50, height: 50}} source={{uri: card.imageUrl}}/>
<Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}} >{card.brand}</Text>
</View>
<Text style={{color: 'green'}}>Giá sản phẩm: {card.price}. 000 $</Text>
<Text style={{color: 'red'}}>Tồn kho: {card.id}</Text>
<Pressable style={{backgroundColor: 'orange', padding: 10, borderRadius: 5, alignItems: 'center'}}>Thêm giỏ hàng</Pressable>

  </View>
)
}
export default function HomeScreen() {
  const[data, setData] = useState([]);
  const[loading, setLoading] = useState(true);
  useEffect(()=>{
const GetAPI = async()  =>{
  try {
    const res = await axios.get('https://68cb5067430c4476c34c82ad.mockapi.io/vehicles')
setData(res.data);
  } catch (e) {
    console.log("Loi doc API: ", e);
  }finally{
    setLoading(false)
  }

}
GetAPI();
  },[])
  if(loading){
    return(
      <View>
<ActivityIndicator/>
      </View>
    )
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', color: 'blue'}}>Danh sách sản phẩm</Text>
      <FlatList data={data} renderItem={(info)=><Card card={info.item}/>} />
    </View>
);
  }

