import * as React from 'react';
import { StyleSheet, ScrollView, Modal, ActivityIndicator, Image as Oimage } from 'react-native';
import { View } from '../components/Themed';
import { getRandomDog, getRandomDogByBreed} from '../api/api'
import { DogBreedModal, } from './modals/DogSearch';
import {Text, Image} from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const maxHeight = 450
const maxWidth = (Dimensions.get('window').width) * .9;
const placeholderPhoto = 'https://parsefiles.back4app.com/bfyjkEIutoUhOjChbagYxfzpfQF6qQgx5lX2YBO3/864e3823658043926ca4b4e79aee0037_Vest.jpg'

export default function TabOneScreen() {
  
  const [dogBreed, setBreed] = React.useState("")
  const [dogUri, setDogUri] = React.useState<string>("")
  const [modalVisible, setModalVisible] = React.useState(false);
  const [dimensions, setDimesions] = React.useState<{width:number, height:number}>({width:0, height: 0})
  
  function sizePhoto(photoUri:string)
  {
    Oimage.getSize(photoUri, (realWidth, realHeight)=>
    {
      if(realWidth > maxWidth)
      {
        const scaleFactor = maxWidth/realWidth;
        const newHeight = realHeight * scaleFactor;
        setDimesions({height:newHeight, width:maxWidth})
      }
    })
  }

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
    const res= dogBreed.toLowerCase() === 'random' ?
      await getRandomDog() : await getRandomDogByBreed(dogBreed);
    
    sizePhoto(res.message)

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

  if(!dogBreed && !dimensions.width)
  {
    sizePhoto(placeholderPhoto)
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
                style={{ width: dimensions.width, height: dimensions.height }} 
                source={{uri:placeholderPhoto}}></Image>
            </View>
          }
  
          {!!dogBreed &&
            <React.Fragment>
              
              <View style={styles.picContainer}>
                {!dogUri &&
                  <ActivityIndicator size="large"/>
                }

                {!!dogUri &&
                  <Image style={{ width:dimensions.width, height:dimensions.height}} 
                  source={{uri: dogUri}}
                  /> 
                }
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
    backgroundColor:'#fff',
    minHeight:505,
    justifyContent:'center'
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
