import * as React from 'react';
import { Button, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { View } from '../components/Themed';
import { getDogBreedList, getRandomDog, getRandomDogByBreed} from '../api/api'
import { DogBreedModal, } from './modals/DogSearch';
import {Text, Image} from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function TabOneScreen() {
  
  const [dogBreed, setBreed] = React.useState("")
  const [dogUri, setDogUri] = React.useState<string>("")
  const [modalVisible, setModalVisible] = React.useState(false);
  
  React.useEffect(()=>
  {
    setModalVisible(false)
    if(!!dogBreed)
    {
      changePhoto()
    }
  }, [dogBreed])

  async function changePhoto()
  {
    setDogUri("")
    const res = await getRandomDogByBreed(dogBreed)
    setDogUri(res.message)
  }

  function closeModal()
  {
    setModalVisible(false)
  }

  function getBreedFromUser(breed:string)
  {
    setBreed(breed)
    setModalVisible(false)
  }

    return (
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={styles.entireView}>
          { !dogBreed &&
              <View style={styles.container}>
                <Text h3 style={[styles.title, {fontFamily:'Prata_400Regular'}]}>Choose a Dog Breed</Text>
                <Text h4 style={{fontFamily:'Prata_400Regular'}}>Here is a picture of my dog in the mean time...</Text>
              </View>
          }
  
          { !!dogBreed &&
            <React.Fragment>
              <View style={[styles.container, {backgroundColor:"#a4cfe0", justifyContent:'center'}]} >
                <Text style={{fontFamily:'Prata_400Regular'}}h3>{dogBreed.charAt(0).toUpperCase() + dogBreed.slice(1)}</Text>
              </View>
            </React.Fragment>
          } 
  
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.button} onPress={()=>{setModalVisible(!modalVisible)}}>
              <Text style={{color:'#fff', fontFamily:'Oswald_400Regular'}} h3>Choose Breed</Text>
            </TouchableOpacity>
          </View>
  
  
          { !dogBreed &&
            <View style={styles.picContainer}>
              <Image
                style={{ width: 300, height: 450 }} 
                source={{uri:'https://parsefiles.back4app.com/bfyjkEIutoUhOjChbagYxfzpfQF6qQgx5lX2YBO3/7b53eef4b6112daf4bbf11a78c5f7cd8_Vest.jpg'}}></Image>
            </View>
          }
  
          {!!dogBreed &&
            <React.Fragment>
              <View style={styles.picContainer}>
                <Image style={{ width: 300, height: 450 }} 
                source={{uri: dogUri}}
                PlaceholderContent={<ActivityIndicator />}
                /> 
              </View>
  
              <View style={[styles.container]}>
                <TouchableOpacity style={[styles.button, {borderColor:"#000"}]} onPress={changePhoto}>
                  <Text style={{color:'#000', fontFamily:'Prata_400Regular'}} h4>Find Your Match</Text>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          }
        </View>
  
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={()=>setModalVisible(!modalVisible)}
          >
            <DogBreedModal dogBreedFunction={getBreedFromUser} closeFunction={closeModal}/>
  
        </Modal>
  
  
      </ScrollView>
    );
}

  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    padding:20,
    backgroundColor:"#fae66d",
    width:'100%',
    borderBottomWidth:2
  },
  picContainer:
  {
    padding:15,
    borderBottomWidth:1,
    alignItems:'center',
    width:'100%',
    backgroundColor:'#fff'
  },
  buttonView:
  {
    backgroundColor:'#000',
    width:'100%',
    padding:15,
    alignItems:'center'
  },
  button:
  {
    borderWidth:2,
    borderColor:'#fff',
    padding:5
  },
  entireView:{
    flex: 1,
    alignItems: 'center',
    paddingBottom:10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign:'left',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  photo: {
    width: '90%',
    height: '80%',
  },
  buttonText:{
    color:'#fff'
  }

});
