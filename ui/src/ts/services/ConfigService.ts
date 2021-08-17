import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export type AppConfig = Readonly<{
    takeover: boolean
}>

export type MediaValidation = Readonly<{
    types: string[],
    aspectRatios: string[],
    resolutionLimit: {
        min: string,
        max: string
    },
    resolutionList: string[]
}>

export type Config = Readonly<{
    apiPath: string,
    mediaValidation: MediaValidation
}>

@Injectable()
export class ConfigService {
    private config: AppConfig;
    private baseUrl: string;
    private mediaValidation: MediaValidation;
    constructor(private http: HttpClient){}
    loadAppConfig(){
        return Promise.all([
            this.http.get<AppConfig>('./data/appConfig.json').toPromise(),
            this.http.get<Config>('./data/config.json').toPromise()
        ]).then(([conf, {apiPath, mediaValidation}]) => {
            this.config = conf;
            this.baseUrl = apiPath;
            this.mediaValidation = mediaValidation;
        })
    }
    getConfig(){
        return this.config;
    }
    getBaseUrl(){
        return this.baseUrl;
    }
    getMediaValidationRules(){
        return this.mediaValidation;
    }
}