import { Injectable } from '@angular/core';
import { ConfigService, MediaValidation } from './ConfigService';

function parseWidthHeight(str: string) : [number, number]{
    const indexOfX = str.indexOf('x');
    if(indexOfX === -1){
        throw new Error('No x in string');
    }
    return [parseInt(str.slice(0, indexOfX), 10), parseInt(str.slice(indexOfX + 1), 10)]
}

function prettyPrintMimeType(mimeType: string): string {
    const capitalizedFirstLetter = mimeType.charAt(0).toUpperCase() + mimeType.substr(1);
    let words = capitalizedFirstLetter.split('/');
    words[1] = words[1].toUpperCase();
    return words.join(' ');
}

function isWildCardMime(str: string): boolean{
    return RegExp('\/\*').test(str)
}

function replaceWildCardResolution(res: string){
    return "0x10000"
}

export type MediaValidationError = {
    msg: string
}

export type ValidatorResult = null | MediaValidationError;

@Injectable()
export class MediaValidationService {
    private rules: MediaValidation;
    constructor(private configService: ConfigService) {
        this.rules = this.trimValues(this.configService.getMediaValidationRules());
    }
    trimValues(data: MediaValidation) : MediaValidation {
        const trimFn = el => el.trim()
        return {
            types: data.types.map(trimFn),
            aspectRatios: data.aspectRatios.map(trimFn),
            resolutionLimit: {
                min: data.resolutionLimit.min.trim(),
                max: data.resolutionLimit.max.trim()
            },
            resolutionList: data.resolutionList.map(trimFn)
        }
    }
    verifyAspectRatio(aspectRatio: [number, number]) : ValidatorResult {

        if(this.rules.types.includes('*')){
            return null;
        }

        for(let item of this.rules.aspectRatios){
            const [x, y] = parseWidthHeight(item);
            if(aspectRatio[0] === x && aspectRatio[1] === y){
                return null;
            }
        }

        return {
            msg: `${aspectRatio[0]}x${aspectRatio[1]} is not valid aspect ratio`
        }
    }
    verifyResolution({width, height}: {width: number, height: number}) : ValidatorResult {

        const resolutionError = {
            msg: `${width}x${height} is not valid resolution`
        }

        const {min, max} = Object.entries(this.rules.resolutionLimit).reduce((acc, [key, value]) => {
            if(value === '*'){
                acc[key] = replaceWildCardResolution(value)
            } else {
                acc[key] = value
            }
            return acc;
        }, {} as {min: string, max: string});

        const [minWidth, minHeight] = parseWidthHeight(min);
        const [maxWidth, maxHeight] = parseWidthHeight(max);

        if(width < minWidth || width > maxWidth){
            return resolutionError
        }
        if(height < minHeight || height > maxHeight){
            return resolutionError
        }

        const listValidation = this.rules.resolutionList.some(v => {
            if(v === '*'){
                return true;
            }
            let [pWidth, pHeight] = parseWidthHeight(v);
            return pWidth === width && pHeight === height;
        })

        return listValidation ? null : resolutionError;
    }
    verifyType(mimeType: string) : ValidatorResult {
        
        const verifyError = {
            msg: `${prettyPrintMimeType(mimeType)} is not supported type`
        }

        if(this.rules.types.includes('*')){
            return null;
        }

        const strictCheck = () => this.rules.types.includes(mimeType) ? null : verifyError

        const origStriped = mimeType.replace(/\/.*/, '');
        const wildCardMimes = this.rules.types.reduce((acc, cur) => {
            if(isWildCardMime(cur)){
                acc.push(cur);
            }
            return acc;
        }, [])

        return wildCardMimes.some(el => el === origStriped) ? null : strictCheck();
    }
}