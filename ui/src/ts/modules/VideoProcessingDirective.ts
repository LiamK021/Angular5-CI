import { Component,  Output, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { makeid } from './media/util';

@Component({
    selector: 'video-processing',
    template: ``
})
export class VideoProcessingDirective implements OnInit, OnChanges {
    @Input('videoSrc') src: string;
    @Output() dimensions = new EventEmitter<{width: number, height: number}>();
    constructor(private elementRef: ElementRef, private renderer: Renderer2, @Inject(DOCUMENT) private document) { }
    processVideoDimensions(src: string){
        const videoTagRef = this.document.createElement('video');
        this.renderer.appendChild(this.elementRef.nativeElement, videoTagRef);
        videoTagRef.id = "video-processing-el-" + makeid(3);
        videoTagRef.src = src;
        videoTagRef.style.display = "none";
        videoTagRef.addEventListener('loadedmetadata', (e) => {
            console.log(videoTagRef.videoWidth, videoTagRef.videoHeight)
            this.dimensions.emit({
                width: videoTagRef.videoWidth,
                height: videoTagRef.videoHeight
            })
            this.renderer.removeChild(this.elementRef.nativeElement, videoTagRef);
        })
    }
    ngOnChanges(changes: SimpleChanges){
        if(changes.src.currentValue && changes.src.currentValue !== ''){
            this.processVideoDimensions(this.src);
        }
    }
    ngOnInit(){}
}