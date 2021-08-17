import {Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild, ElementRef} from "@angular/core";
import { GridItem } from "./GridItem";

type DeleteButton = {
    text: string,
    class: "" | "confirm" | "done"
}

const buttonStates: DeleteButton[] = [
    {text: "Delete", class: ""},
    {text: "Are you sure?", class: "confirm"},
    {text: "Deleted", class: "done"}
];



@Component({
    selector: "media-grid-item",
    templateUrl: './_templates/media-grid-item.html'
})
export class MediaGridItemComponent implements OnInit {
    @ViewChild('img') img : ElementRef; 
    @Input() item: GridItem;
    @Input() calcedDimensions: {width: string, height: string};
    @Output() delete = new EventEmitter<GridItem>();
    @Output() origDimensions = new EventEmitter<{width: number, height: number}>();
    deleteButtonState: DeleteButton = buttonStates[0]
    constructor(){}
    onDelete(item: GridItem){
        this.delete.emit({...item});
    }
    deleteBtnClick(){
        const btnClass = this.deleteButtonState.class;
        switch (btnClass) {
            case "":
                this.deleteButtonState = buttonStates[1];
                break;
            case "confirm":
                this.onDelete(this.item);
                this.deleteButtonState = buttonStates[2]; 
                break;
        }
    }
    deleteBtnMouseout(){
        if(this.deleteButtonState.class === "confirm"){
            setTimeout(() => {
                this.deleteButtonState = buttonStates[0]
            }, 1500)
        }
    }
    onDimensions(dimensions){
        this.origDimensions.emit(dimensions);
    }
    onImgLoad(){
        this.onDimensions({
            width: this.img.nativeElement.offsetWidth,
            height: this.img.nativeElement.offsetHeight
        })
    }
    ngOnInit(){
    }
}