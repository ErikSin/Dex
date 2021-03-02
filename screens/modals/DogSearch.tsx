 import React, {useRef, useState} from 'react';
import {Text, ScrollView, StyleSheet, Button, View, ActivityIndicator } from 'react-native'
import { SearchBar } from 'react-native-elements';
import { getDogBreedList, } from '../../api/api';
import { DogCard } from '../../components/DogCard';
import Fuse from 'fuse.js'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'; 

type genFunction = () => void
type breedFunction = (breed:string) =>void

interface dogBreedProp
{
    closeFunction:genFunction,
    dogBreedFunction:breedFunction
}



export const DogBreedModal = ({closeFunction, dogBreedFunction}:dogBreedProp) =>
{
    const [dogList, setDogList] = useState<string[] | string>([])
    const [searchValue, setSearchValue] = useState("")
    const fullDogList = useRef<string[]>([])

    React.useEffect(()=>
    {
        getDogBreedList().then(res =>
        {
            fullDogList.current = ["random", ...Object.keys(res.message)]
            setDogList(fullDogList.current)
        }).catch((err:Error) =>
        {
            console.log(err.message)
        })
    
    }, [])

    function updateSearch(value:string)
    {
        setSearchValue(value)
        if(!value.trim())
        {
            setDogList(fullDogList.current)
        }
        else
        {
            const options:Fuse.IFuseOptions<string> = {
                threshold:0.4
            }
            const fuse = new Fuse(fullDogList.current, options)
            const results = fuse.search(value)
            if(!results.length)
            {
                setDogList(fullDogList.current)
            }
            else
            {
                const searchList:string[]=[]
                for(let result of results)
                {
                    searchList.push(result.item)
                }
                setDogList(searchList)
            }
            
        }
        
        
    }

    if(fullDogList.current.length===0)
    {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
    else
    {
        return (

            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View>
                    <View style={styles.header}>
                        <TouchableOpacity style={{padding:10}} onPress={closeFunction}>
                            <AntDesign name="back"  size={35} color="black" />
                        </TouchableOpacity>
                        
                        <SearchBar
                            style={{flexGrow:1}}
                            value={searchValue}
                            onChangeText={(e)=>{updateSearch(e)}}
                        />
                    </View>

                    
                    {
                        <React.Fragment>
                            {/* 
                            //@ts-ignore */}
                            {dogList.map(dog =>
                            {
                                return(
                                    <DogCard key={dog}  dogBreedFunction={dogBreedFunction} breed={dog}/>
                                )
                            })}
                        </React.Fragment>
                    }
                </View>
            </ScrollView>
            
        )
    }
}

const styles = StyleSheet.create({
    header:{
        backgroundColor:"#a4cfe0",
        paddingTop:40,
        
    }
})


