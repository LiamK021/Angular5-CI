import {Directive, ViewContainerRef} from "@angular/core";

@Directive({
    selector: `[modal-holder]`,
})
export class DynamicDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}