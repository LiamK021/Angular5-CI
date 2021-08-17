import { Component, OnInit, Input } from '@angular/core';
import { MediaParams } from '../../services/MediaManager/MediaManager';

@Component({
    selector: 'media-grid-item-desc',
    templateUrl: './_templates/media-grid-item-desc.html'
})
export class MediaGridItemDescComponent implements OnInit {
    @Input() params: MediaParams;
    constructor() { }

    ngOnInit() { }
}