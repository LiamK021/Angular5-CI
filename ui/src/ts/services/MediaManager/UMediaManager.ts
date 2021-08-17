import {MediaManager, MediaFile, UploadData} from "./MediaManager";
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { SessionService } from "../SessionService";
import { map, mergeMap } from "rxjs/operators";
import { Observable, pipe } from "rxjs";
import { ConfigService } from "../ConfigService";
import {mimeToExtension, mimeToType} from "../../modules/util/MimeUtils";

type MediaResponseItem = {
    id: number,
    path: string,
    type: string,
    resolution: string,
    aspectRatio: string
}

type MediaResponse = Array<MediaResponseItem>

const transform = (baseUrl: string) => pipe(
    mergeMap((data: MediaResponse) => Observable.from(data)),
    map(({type, id, path, resolution, aspectRatio}) => ({
        type: mimeToType(type),
        ref: id.toString(),
        url: `${baseUrl}/api/media/${path}`,
        params: {
            resolution: resolution,
            aspectRatio: aspectRatio,
            extension: mimeToExtension(type)
        }
    }))
)

@Injectable()
export class UMediaManager extends MediaManager {
    constructor(
        private http: HttpClient,
        private configService: ConfigService, 
        private sessionService: SessionService
    ){
        super();
    }
    uploadFile({file, params}: UploadData){
        console.log(file, params);
        const apiPath = this.configService.getBaseUrl();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('aspectRatio', params.aspectRatio);
        formData.append('resolution', params.resolution);

        return this.http.post<MediaResponse>(`${apiPath}/api/index.php/cms/mediaFiles`, formData, {
            headers: this.sessionService.appendSessionInfo(new HttpHeaders())
        }).pipe(transform(apiPath));
    }
    getMediaFiles(){
        const apiPath = this.configService.getBaseUrl();

        return this.http.get<MediaResponse>(`${apiPath}/api/index.php/cms/mediaFiles`, {
            headers: this.sessionService.appendSessionInfo(new HttpHeaders())
        }).pipe(transform(apiPath))
    }
    deleteMediaFile({ref}: MediaFile){
        const apiPath = this.configService.getBaseUrl();

        return this.http.post<{success: boolean}>(`${apiPath}/api/index.php/cms/deleteMediaFile`, {id: ref} , {
            headers: this.sessionService.appendSessionInfo(new HttpHeaders())
        })
    }

}