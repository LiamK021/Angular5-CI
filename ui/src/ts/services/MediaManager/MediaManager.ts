import {Injectable} from "@angular/core"
import { Observable } from "rxjs";

export type MediaParams = {
    aspectRatio: string,
    resolution: string,
    extension: string
}

export type MediaFile = {
    type: string,
    ref: string,
    url: string,
    params: MediaParams
}

export type UploadData = {
    file: Blob;
    params: MediaParams
}

export class UploadError {
    constructor(readonly msg: string){}
}

@Injectable()
export abstract class MediaManager {
    public abstract uploadFile(data: UploadData) : Observable<MediaFile>
    public abstract getMediaFiles() : Observable<MediaFile> 
    public abstract deleteMediaFile(file: MediaFile) : Observable<{success: boolean}>
}