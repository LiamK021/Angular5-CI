import {Injectable} from "@angular/core";
import {MediaManager, UploadData} from "./MediaManager"
import { Observable } from "rxjs";


@Injectable()
export class MockMediaManager extends MediaManager {
    constructor(){super()}
    uploadFile(data: UploadData){
        return Observable.of(undefined);
    }
    getMediaFiles(){
        return Observable.from([])
    }
    deleteMediaFile(){
        return Observable.of({success: true})
    }
}