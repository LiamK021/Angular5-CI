import {MediaFile} from "../../services/MediaManager/MediaManager";
import { makeid } from "./util";

export type Orientation = "hoz" | "vert";

export type Visibility = "visible" | "hidden"

export type GridItem = MediaFile & {
    orientation: Orientation,
    width: string,
    visibility: Visibility,
    height: string,
    rendered: boolean
}

export function createEmptyItem(): GridItem {
    return {
        type: 'empty',
        ref: makeid(6),
        url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        params: {
            aspectRatio: "0x0",
            resolution: "0x0",
            extension: "none"
        },
        orientation: ("hoz" as Orientation),
        width: "auto",
        height: "auto",
        visibility: ("hidden" as Visibility),
        rendered: false
    }
}

export function getEmptyItemsIDs(arr: GridItem[]) : number[] {
    return arr.reduce((acc, cur, i) => {
        if(cur.type === 'empty'){
            acc.push(i);
        }
        return acc;
    }, [])
}

export function createFromMediaFile(m: MediaFile): GridItem {
    return {
        ...m,
        orientation: ("hoz" as Orientation),
        width: "auto",
        height: "auto",
        visibility: ("hidden" as Visibility),
        rendered: false
    }
}