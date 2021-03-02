import { DogBreedApi, DogPhotoApi } from './../models/dog-photo';
import {API_KEY} from '../constants/Api_Keys'
import { AI_OBJECT } from '../models/ai-results';

export async function getRandomDog():Promise<DogPhotoApi>
{
    return await (await fetch( 'https://dog.ceo/api/breeds/image/random')).json()
}

export async function getDogBreedList():Promise<DogBreedApi>
{
    return await (await fetch('https://dog.ceo/api/breeds/list/all')).json()
}

export async function getRandomDogByBreed(breed:string):Promise<DogPhotoApi>
{
    return await (await fetch(`https://dog.ceo/api/breed/${breed}/images/random`)).json()
}

export async function detectDog(picUrl:string):Promise<AI_OBJECT>
{
    return await (await fetch('https://eastus.api.cognitive.microsoft.com/vision/v3.1/analyze?visualFeatures=Description&details=Landmarks',{
        method:'POST',
        headers:
        {
            'Ocp-Apim-Subscription-Key':API_KEY,
            'Content-Type':'application/json'
        },
        body:JSON.stringify(
        {
            url: picUrl,
        })
    })).json()
}