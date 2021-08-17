import {Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, OnDestroy} from "@angular/core";
import { MediaFile } from "../../services/MediaManager/MediaManager";
import { Subject, Observable, Subscription } from "rxjs";
import {scan, map, filter, tap} from "rxjs/operators";
import {ViewTypes} from "./MediaComponent";
import {arrayObjectIndexOf, isNullable, pixelsToNumber, isRowTheSame} from "./util";
import {GridItem, Orientation, createFromMediaFile, createEmptyItem, getEmptyItemsIDs} from "./GridItem";
import {createHandler, MediaEvent} from "./MediaEvents";

type Dimensions = {width: number, height: number};

type Row = [GridItem, GridItem];

@Component({
    selector: "media-grid",
    templateUrl: './_templates/media-grid.html'
})
export class MediaGridComponent implements OnInit, OnDestroy {
    private loadingRefs: string[] = [];
    @ViewChild('container') container: ElementRef;
    rowLoaded = new Subject<Row>();
    loaded = new Subject<GridItem>();
    renderedRows: Array<[number, number]> = [];
    viewItems: GridItem[] = [];
    subs: {[key: string]: Subscription} = {}
    @Input('view') view$: Observable<ViewTypes>;
    @Input() events: Observable<MediaEvent>;
    @Output() delete = new EventEmitter<MediaFile>();
    @Output() loading = new EventEmitter<boolean>();
    constructor(){
        this.subs.loaded = this.loaded.pipe(
            tap(el => this.checkLoading(el.ref)),
            map(el => arrayObjectIndexOf(this.viewItems, el.ref, "ref")),
            scan((acc, val: number) => {
                let position = Math.trunc(val / 2)
                let subPosition = Number.isInteger(val / 2) ? 0 : 1;
                if(!acc[position]){
                    acc[position] = []
                }
                acc[position][subPosition] = val;
                return acc;
            }, []),
        ).subscribe(rows => {
            for(let row of rows){
                if(row && !isNullable(row[0]) && row.length === 2 && this.renderedRows.every(cmp => !isRowTheSame(row, cmp))){
                    this.renderedRows.push(row);
                    this.rowLoaded.next([this.viewItems[row[0]], this.viewItems[row[1]]])
                }
            }
        })
        this.subs.rowLoaded = this.rowLoaded.subscribe(row => {
            const {width} = this.getContainerOffsets();
            let halfWidth = width / 2;
            let ratioForEach = row.map(el => {
                return halfWidth / pixelsToNumber(el.width)
            })
            row.forEach((el,i) => {
                el.rendered = true
                el.visibility = "visible";
                el.width = `${pixelsToNumber(el.width) * ratioForEach[i] - 3}px`;
                el.height = `auto`;
            });
        })
    }
    onDelete(item: MediaFile){
        this.delete.emit({...item});
    }
    getContainerOffsets(){
        return {width: this.container.nativeElement.offsetWidth, height: this.container.nativeElement.offsetHeight}
    }
    getOrientation({width, height}: Dimensions) : Orientation {
        return (width - height > 0) ? "hoz" : "vert";
    }
    onDimensions(event, item){
    
        item.visibility = "visible";
        
        item.width = event.width + 'px';
        this.loaded.next(item);
    }
    checkLoading(ref: string){
        let index = this.loadingRefs.indexOf(ref);
        if(index !== -1){
            this.loadingRefs.splice(index, 1);
            this.loading.emit(this.loadingRefs.length !== 0);
        }
    }
    trackByRef(index: number, item: MediaFile){
        return item.ref;
    }
    addItem(item: GridItem){
        this.viewItems.push(item)
        this.loadingRefs.push(item.ref);
        this.loading.emit(true);
    }
    deleteItem(item: GridItem){
        let index = arrayObjectIndexOf(this.viewItems, item.ref, "ref");
        if(index !== -1){
            this.viewItems.splice(index, 1);
        }
    }
    ngOnInit(){
        this.subs.events = this.events.pipe(
            map(el => ({...el, payload: createFromMediaFile(el.payload)})),
            tap(_ => {
                let emptyArr = getEmptyItemsIDs(this.viewItems);
                for(let emptyId of emptyArr){
                    this.viewItems.splice(emptyId, 1);
                }
            }),
            tap(createHandler({
                add: this.addItem.bind(this),
                delete: this.deleteItem.bind(this)
            })),
            tap(_ => {
                if(this.viewItems.length % 2 !== 0){
                    this.viewItems.unshift(createEmptyItem())
                }
            })
        ).subscribe(() => {})

        this.subs.view$ = this.view$.subscribe(() => {
            this.viewItems = this.viewItems.map(el => ({...el}));
        });
    }
    ngOnDestroy(){
        for(let key of Object.keys(this.subs)){
            this.subs[key].unsubscribe();
        }
    }
}