import { useMemo } from 'react';
interface categoryObject
{
    name:string,
    score:number
}

interface captionObject
{
    confidence:number,
    text:string
}

interface metadataObject
{
    format:string,
    height:number,
    width:number
}

export interface AI_OBJECT
{
    categories:categoryObject[],
    description:{captions:captionObject[], tags:string[]},
    metadata:metadataObject,
    requestId:string
}