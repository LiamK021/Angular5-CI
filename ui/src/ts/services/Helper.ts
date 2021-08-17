import {Injectable} from "@angular/core";
import {DomSanitizer, SafeStyle} from "@angular/platform-browser";
import { ConfigService } from "./ConfigService";

export type ScrollBarProps = {
    width: number;
    style: SafeStyle;
};

@Injectable()
export class Helper {
    defaultViewWidth: string = "90%";
    constructor(private sanitizer: DomSanitizer, private configService: ConfigService){}
    isPlaylistLinkActive(){
        return true;
    }
    isTakeoverPageShown(){
        return this.configService.getConfig().takeover;
    }
    getWidthWithScrollbar(viewWidth: string) : ScrollBarProps {
        var scrollDiv = document.createElement("div");
        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);

        // Get the scrollbar width
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        // console.warn(scrollbarWidth); // Mac:  15

        // Delete the DIV 
        document.body.removeChild(scrollDiv);
        return {
            width: scrollbarWidth,
            style: this.sanitizer.bypassSecurityTrustStyle(`calc(${viewWidth} + ${scrollbarWidth}px)`)
        }
    }
}