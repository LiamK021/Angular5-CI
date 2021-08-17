import { Directive, Input, Output, ElementRef, Renderer, EventEmitter } from '@angular/core';

@Directive({
    selector: "[image-dimensions]",
    host: {
        '(load)': 'getDimensions()'
      }    
})

export class ImageDimensionDirective {
    @Output() dimensions = new EventEmitter<{width: number, height: number}>();

    constructor(private el: ElementRef) {
    }
    getDimensions() {
        console.log('here');
        this.dimensions.emit({ "height": this.el.nativeElement.offsetHeight, "width": this.el.nativeElement.offsetWidth });
    }
}