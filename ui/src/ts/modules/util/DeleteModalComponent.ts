import {Component, Input, Output, AfterViewInit, EventEmitter, OnDestroy} from "@angular/core";


declare var $: any;

@Component({
    selector: 'delete-modal',
    template: `<div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog" aria-labelledby="confirmDeleteModal" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div class="row">
                                    <div class="offset-2 col-8">{{text}}</div>
                                </div>
                                <div class="row">
                                    <div class="offset-3 col-6">
                                        <div class="playlist_save_entry" (click)="onDelete.emit()" data-dismiss="modal">Delete</div>
                                    </div>
                                    <div class="offset-3 col-6">
                                        <div class="playlist_save_entry" data-dismiss="modal">Cancel</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
})
export class DeleteModalComponent implements AfterViewInit, OnDestroy {
    @Input() text: string;
    @Output() onDelete = new EventEmitter<void>();
    ngAfterViewInit(){
        $('#confirmDeleteModal').modal('show');
    }
    ngOnDestroy(){
        
    }
}