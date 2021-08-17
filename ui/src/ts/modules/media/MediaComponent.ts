import {Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef} from "@angular/core";
import { Helper, ScrollBarProps } from "../../services/Helper";
import { MediaManager, MediaFile, UploadData, UploadError } from "../../services/MediaManager/MediaManager";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {catchError, tap, map, mergeMap} from "rxjs/operators";
import { MediaValidationService } from "../../services/MediaValidation";
import { loadImageWidthHeight, aspectRatio, loadVideo, WidthHeight } from "./util";
import { MediaEvent, createAddEvent, createDeleteEvent } from "./MediaEvents";
import { VideoProcessingDirective } from "../VideoProcessingDirective";
import { mimeToExtension } from "../util/MimeUtils";

export type ViewTypes = "side-by-side" | "columns" | "list";

@Component({
    selector: 'media',
    templateUrl: './_templates/media.html'
})
export class MediaComponent implements OnInit {
    @ViewChild('videoProcess', {read: ViewContainerRef}) videoProcess: ViewContainerRef;
    private _viewType = new BehaviorSubject<ViewTypes>("columns");
    private uploaded$ = new Subject<MediaFile>();
    private deleted$ = new Subject<MediaFile>();
    uploadError: string | null = null;
    scrollBarProps: ScrollBarProps;
    uploadDialogShow = new BehaviorSubject<boolean>(false);
    showObservable = this.uploadDialogShow.asObservable();
    mediaFiles: Observable<MediaFile>;
    mediaEvents$: Observable<MediaEvent>;
    viewType: Observable<ViewTypes>;
    isGridLoading: boolean;
    constructor(
        private helper: Helper,
        private mediaManager: MediaManager,
        private mediaValidation: MediaValidationService,
        private componentFactoryResolver: ComponentFactoryResolver
    ){
        this.mediaFiles = Observable.merge(this.mediaManager.getMediaFiles(), this.uploaded$)
        const addEvents$ = this.mediaFiles.pipe(map(createAddEvent))
        const deleteEvents$ = this.deleted$.pipe(map(createDeleteEvent));
        this.mediaEvents$ = Observable.merge(addEvents$, deleteEvents$);

        this.viewType = this._viewType.asObservable();
    }
    openUploadDialog(){
        this.uploadDialogShow.next(true);
    }
    onDialogClose(){
        this.uploadDialogShow.next(false);
    }
    changeViewType(val: ViewTypes){
        this._viewType.next(val);
    }
    onGridLoading(loading: boolean){
        this.isGridLoading = loading;
    }
    onItemDelete(item: MediaFile){
        this.mediaManager.deleteMediaFile(item).subscribe(data => {
            if(data.success){
                this.deleted$.next({
                    type: item.type,
                    ref: item.ref,
                    url: item.url,
                    params: { ...item.params }
                });
            }
        })
    }
    loadVideoProcessingComponent(src: string) : Observable<WidthHeight> {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(VideoProcessingDirective);
        let componentRef = this.videoProcess.createComponent(componentFactory);
        (<VideoProcessingDirective>componentRef.instance).src = src;
        (<VideoProcessingDirective>componentRef.instance).processVideoDimensions(src);
        return (<VideoProcessingDirective>componentRef.instance).dimensions
    }
    widthHeightValidator({width, height}: WidthHeight) : null | string {
        const aspectValidation = this.mediaValidation.verifyAspectRatio(aspectRatio(width, height));
        if(aspectValidation !== null){
            return aspectValidation.msg
        }
        const resolutionValidation = this.mediaValidation.verifyResolution({width, height})
        if(resolutionValidation !== null){
            return resolutionValidation.msg;
        }
        return null;
    }
    uploadFactory(data: File) : Observable<[string, WidthHeight]>{
        const typeValidation = this.mediaValidation.verifyType(data.type)
        if(typeValidation !== null){
            return Observable.of([typeValidation.msg, {width: 0, height: 0}] as [string, WidthHeight]);
        }
        return Observable.if(
            () => data.type.replace(/\/.*/, '') === "image",
            loadImageWidthHeight(data),
            loadVideo(data).pipe(
                mergeMap(e => this.loadVideoProcessingComponent(e))
            )
        ).pipe(
            map(el => ([this.widthHeightValidator(el), el] as [string, WidthHeight]))
        )
    }
    onUploadData(data: File){
        this.uploadFactory(data).pipe(
            mergeMap(([v, params]) => {
                if(v === null){
                    const [hoz, vert] = aspectRatio(params.width, params.height)
                    return this.uploadMedia({
                        file: data,
                        params: {
                            extension: mimeToExtension(data.type),
                            aspectRatio: `${hoz}x${vert}`,
                            resolution: `${params.width}x${params.height}`
                        }
                    })
                } else {
                    return Observable.of(new UploadError(v))
                }
            })
        ).subscribe(err => {
            if(err instanceof UploadError){
                this.uploadError = err.msg;
            } else {
                this.uploadError = null;
                this.onDialogClose();
            }
        })
    }
    uploadMedia(data: UploadData){
        return this.mediaManager.uploadFile(data).pipe(
            tap(file => this.uploaded$.next(file)),
            catchError(e => {
                console.log(e);
                return Observable.of(new UploadError("Something went wrong! Not all files were uploaded"))
            })
        )
    }
    ngOnInit(){
        this.scrollBarProps = this.helper.getWidthWithScrollbar(this.helper.defaultViewWidth);
    }
    
}