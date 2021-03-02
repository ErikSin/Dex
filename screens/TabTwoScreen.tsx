import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ActivityIndicator, Modal} from 'react-native';
import { Camera, CameraCapturedPicture, CameraPictureOptions, PermissionResponse } from 'expo-camera';
import * as Parse from 'parse/react-native'
import { detectDog } from '../api/api';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import {Overlay, Text} from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'; 
import { DogBreedModal } from './modals/DogSearch';

enum pageStates
{
  askPermission,
  noPermission, 
  takingPhoto,
  processingPhoto,
  machineAI_Results,
  isError
}

enum dogPhotoState
{
  notChecked,
  hasDog,
  noDog
}


export default function TabTwoScreen() 
{
    const [thisState, setThisState] = useState<pageStates>(pageStates.askPermission)
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null)
    const cam = useRef<Camera | null>(null)
    const [aiResult, setAiResult] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [overlayOpen, setOverlayOpen] = useState(false)
    const [firstPass, setFirstPass] = useState(false)
    const [hasDog, setHasDog] = useState<dogPhotoState>(dogPhotoState.notChecked)
    const [exitModalOpen, setExitModal] =useState(false)
    const [breedModal, setBreedModal] = useState(false)

    useEffect(() => { 
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        status !== 'granted'?setThisState(pageStates.noPermission):setThisState(pageStates.takingPhoto)
      })();
      console.log()
      
    }, []);

    useEffect(()=>{
      if(!!tags && !!aiResult )
      {
        checkForDog()
      }
    }, [tags, aiResult])
  
    function checkForDog()
    {
      if(aiResult.includes('dog'))
      {
        setHasDog(dogPhotoState.hasDog)
      } 
      else if(tags.includes('dog'))
      {
        setHasDog(dogPhotoState.hasDog)
      } 
      else
      {
        setHasDog(dogPhotoState.noDog)
      }
    }

    function reset()
    {
      setThisState(2)
      setPhoto(null)
      setAiResult("")
      setTags([])
      setOverlayOpen(false)
      setFirstPass(false)
      setExitModal(false)
      setHasDog(0)
    }

    function nextModal()
    {
      setOverlayOpen(false)
      setExitModal(true)
    }

    function chooseBreedModal()
    {
      setOverlayOpen(false)
      setBreedModal(true)
    }

    function closeBreedModal()
    {
      setBreedModal(false)
      setOverlayOpen(true)
    }

    function breedSelected()
    {
      setBreedModal(false)
      setExitModal(true)
    }
  
    if (thisState===pageStates.askPermission) {
      return (
        <View style={styles.messageContainer}>
          <Text h2>Permission Needed to Run Camera</Text>
        </View>
      )
    }

    if (thisState===pageStates.noPermission) {
      return (
        
        <View style={styles.messageContainer}>
          <View style={{borderWidth:2, padding:15}}>
            <Text h2>No access to camera</Text>
          </View>
        </View>
      )
    }

    if(thisState === pageStates.takingPhoto)
    {
      const takePicture = () =>
      {
        if(cam.current){
          const options:CameraPictureOptions = 
          {
            quality:.7,
            base64:true,
            exif:true
          }
  
          cam.current.takePictureAsync(options).then(pic =>
          {
            setPhoto(pic)
            setThisState(thisState+1)
            setOverlayOpen(true)
          })
        }

        
      }


      return (
        <View style={styles.container}>
          <Camera ref={cam} style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}>
                <MaterialIcons name="flip-camera-android" size={30} color="#fff" />
              </TouchableOpacity>

              
              
            </View> 
            <TouchableOpacity 
              style={styles.buttonMain}
              onPress={()=>{takePicture()}}
            >
                <Entypo name="picasa" size={40} color="#fff" />
            </TouchableOpacity>
          </Camera>
        </View>
      );
    }
    if(thisState===pageStates.processingPhoto)
    {
      if(!firstPass)
      {
        setFirstPass(true)
        const DogPhoto = Parse.Object.extend("DogPhotos")
        const dogPhoto = new DogPhoto()
        
        const dogFile = new Parse.File('newPhoto.jpg', {base64:photo!.base64!})

        dogPhoto.set('image', dogFile)
        dogPhoto.save().then((results:Parse.Object<Parse.Attributes>)=>
        {
          
          const image:Parse.File = results.get('image')
          detectDog(image._url ).then((results)=>
          {
            console.log(results)
            setTags(results.description.tags)
            setAiResult(results.description.captions[0].text)
          })
          
        })
      }
      
      return(
        <React.Fragment>
          <View >
            <Image style={{height:'100%', width:'100%'}} resizeMode="contain" source={{uri:photo!.uri}}/>
            <Overlay isVisible={overlayOpen} onBackdropPress={()=>{reset()}}>
              <View style={[styles.modal]}>
                {!!aiResult &&
                  <View style={styles.flexClose}>
                    <FontAwesome onPress={()=>reset()} name="close" size={24} color="black" />
                  </View>
                }
  
                {!aiResult &&
                  <React.Fragment>
                    <ActivityIndicator size="large"/>
                    <Text style={{fontFamily:'Oswald_400Regular'}}>Analyzing Photo</Text>
                  </React.Fragment>
                } 
  
                {!!aiResult &&
                  <React.Fragment>
                    <View style={styles.photoDes}>
                      <Text style={{fontFamily:'Oswald_400Regular'}} h4>Photo Description: {aiResult}</Text>
                    </View>
                    
                    { hasDog === dogPhotoState.notChecked &&
                      <React.Fragment>
                        <ActivityIndicator size="large"/>
                        <Text style={styles.serif} h4>Checking for Dogs</Text>
                      </React.Fragment>
                    }
  
                    { hasDog === dogPhotoState.hasDog &&
                      <React.Fragment>
                        <Text style={[{marginTop:15, fontFamily:'Oswald_400Regular'}]} h4>Your dog will be added! Please Choose a breed</Text>
                        <View>
                          <TouchableOpacity onPress={()=>chooseBreedModal()} style={styles.btn}>
                            <Text h4 style={{fontFamily:'Oswald_400Regular'}}>Choose Breed</Text>
                          </TouchableOpacity>
                        </View>
                      </React.Fragment>
                    }
  
                    { hasDog === dogPhotoState.noDog &&
                      <React.Fragment>
                        <Text style={[styles.serif, {marginTop:15, fontSize:18, padding:10}]}>Im sorry, it looks like there is no dog in this photo. Is this a mistake? I can send this to a human to look at if you think so!</Text>
  
                        <View style={styles.btnContainer}>
                          <TouchableOpacity onPress={nextModal} style={[styles.btn, {paddingLeft:25, paddingRight:25}]}>
                            <Text h4 style={styles.serif}>OK</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>{reset()}} style={[styles.btn, {backgroundColor:"#fff", paddingLeft:25, paddingRight:25}]}>
                            <Text h4 style={styles.serif}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </React.Fragment>
                    }                  
                  </React.Fragment>
                }
              </View>
            </Overlay>
            <Overlay transparent isVisible={exitModalOpen} onBackdropPress={reset}>
              <View style={{padding:30, backgroundColor:"#000"}}>
                <Text h3 style={[styles.serif, {color:'#FFF', textAlign:'center'}]}> Great, All taken care of!</Text>
              </View>
            </Overlay>
          </View>
          <Modal animationType="slide"
            visible={breedModal}
            onRequestClose={()=>setBreedModal(!breedModal)}>
            <DogBreedModal dogBreedFunction={breedSelected} closeFunction={closeBreedModal}/>
          </Modal>
        </React.Fragment>
      )
    }

    return (<View/>)

    
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 30
  },
  buttonMain:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center',
    marginBottom:50
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  modal:{
    paddingTop:5
  },
  serif:
  {
    fontFamily:'Prata_400Regular'
  },
  flexClose:
  {
    flexDirection:'row',
    width:"100%",
    justifyContent:'flex-end'
  },
  btn:
  {
    padding:5,
    borderWidth:2,
    backgroundColor:'#a4cfe0',
    alignItems:'center',
    paddingTop:8,
    paddingBottom:8,
    marginTop:20 
  },
  btnContainer:
  {
    flexDirection:"row",
    justifyContent: 'space-evenly'
  },
  photoDes:
  {
    backgroundColor:"#fae66d",
    width:'100%',
    padding:10,
    borderWidth:2
  }
});
