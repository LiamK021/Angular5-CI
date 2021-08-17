import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import { UploadData } from "../../services/MediaManager/MediaManager";
import {Observable, Subscription} from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

declare var $: any;

@Component({
    selector: 'media-upload-modal',
    templateUrl: './_templates/media-upload-modal.html'
})
export class MediaUploadModal implements OnInit, OnDestroy {
    @ViewChild('modal') modal: ElementRef;
    @Input() show: Observable<boolean>;
    @Input() error: string | null = null;
    @Output() data = new EventEmitter<UploadData["file"]>();
    @Output() close = new EventEmitter<void>();
    showSub: Subscription = Subscription.EMPTY;
    dataModel = {
        name: ""
    }
    openModal() {
        // this.modal.nativeElement.className = 'modal fade show';
        $("#upload-modal").modal('show');
    }
    closeModal() {
        // this.modal.nativeElement.className = 'modal hide';
        $("#upload-modal").modal('hide')
    }
    ngOnInit(){
        this.showSub = this.show.subscribe(v => {
            if(v){
                this.openModal()
            } else {
                this.closeModal()
            }
        })
    }
    onClose(){
        this.close.emit();
    }
    handleFileInput(event: any){
        event.preventDefault();
        for(let file of Array.from(event.target.files)){
            this.data.emit(file as Blob);
        }
    }
    onSubmit(){
        console.log(this.dataModel);
        this.data.emit()
    }
    ngOnDestroy(){
        this.showSub.unsubscribe();
    }
}