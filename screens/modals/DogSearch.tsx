 import React, {useState} from 'react';
import {Text, ScrollView, StyleSheet, Button, View } from 'react-native'
import { SearchBar } from 'react-native-elements';
import { getDogBreedList, } from '../../api/api';
import { DogCard } from '../../components/DogCard';
import Fuse from 'fuse.js'

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
    const [fullDogList, setFullDogList] = useState<string[]>([])

    React.useEffect(()=>
    {
        getDogBreedList().then(res =>
        {
            setFullDogList(Object.keys(res.message))
            setDogList(Object.keys(res.message))
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
            setDogList(fullDogList)
        }
        else
        {
            const fuse = new Fuse(fullDogList)
            const results = fuse.search(value)
            if(!results.length)
            {
                setDogList(fullDogList)
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

    if(dogList.length===0)
    {
        return (
            <Text>Loading</Text>
        )
    }
    else
    {
        return (

            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={{paddingTop:40}}>
                    <Button title="Close" onPress={closeFunction} />
                    
                    <SearchBar
                        value={searchValue}
                        onChangeText={(e)=>{updateSearch(e)}}
                    />

                    
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




