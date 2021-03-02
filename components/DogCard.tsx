
import React from 'react';
import {TouchableHighlight, View, StyleSheet} from 'react-native'
import {Text} from 'react-native-elements'

type dogFunction = (breed:string) => void
type genFunction = () => void

interface dogCardProp{
    breed:string,
    dogBreedFunction:dogFunction
}

export const DogCard = ({breed, dogBreedFunction}:dogCardProp) =>
{

    function selectBreed()
    {
        dogBreedFunction(breed)
    }

    return(
        <View style={styles.container} key={breed}>
            <TouchableHighlight   
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={selectBreed}
            >
                <View style={styles.button}>
                    <Text h4 style={{fontFamily:'Prata_400Regular'}}>{breed.charAt(0).toUpperCase() + breed.slice(1)}</Text>
                </View>
                
            </TouchableHighlight>
        </View>
    )

    

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
        margin:3,
    },
    button: {
        alignItems: "center",
        backgroundColor:"#fae66d",//'#fae597', "#fae66d",
        padding: 10,
        borderWidth:2
    },
    countContainer: {
        alignItems: "center",
        padding: 10
    },
    countText: {
        color: "#FF00FF"
    }
    });