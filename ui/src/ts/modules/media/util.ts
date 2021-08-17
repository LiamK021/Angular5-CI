import { Observable } from "rxjs";


export function arrayObjectIndexOf(arr: any[], search: any, prop: string) : number {
    for(let i = 0; i < arr.length; i++){
        if(arr[i][prop] === search){
            return i;
        }
    }
    return -1;
}

export function isNullable(val: any) : boolean {
    return val === undefined || val === null
}

export function countNumOfItems(arr): number {
    return arr.reduce((acc, cur) => {
        if(Array.isArray(cur)){
            acc += countNumOfItems(cur);
        } else {
            acc += 1;
        }
        return acc;
    }, 0)
}

export function isRowTheSame(r: [number, number], cmp: [number, number]): boolean {
    return r[0] === cmp[0] && r[1] === cmp[1]
}

export function getAspectRatio(width: number, height: number): number{
    return width / height;
}

export function pixelsToNumber(pixels: string) : number {
    return parseInt(pixels.slice(0, -2),10)
}

export function makeid(length: number): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export type WidthHeight = {width: number, height: number}

export function loadImageWidthHeight(file: File) : Observable<WidthHeight> {
    return Observable.create(function(observer){
      var img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = function(){
        observer.next({
            width: img.naturalWidth,
            height: img.naturalHeight
        });
        window.URL.revokeObjectURL( img.src );
        observer.complete();
      }
      img.onerror = function(err){
        observer.error(err);
      }
    });
 }

 export function loadVideo(file: File) : Observable<string> {
     return Observable.create(observer => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            observer.next(reader.result);
            observer.complete();
        });
        reader.addEventListener("error", (err) => {
            observer.error(err);
        })
        reader.readAsDataURL(file)
     })
 }

 const gcd = (a, b) => {
    return b
      ? gcd(b, a % b)
      : a;
  };
  
export const aspectRatio = (width: number, height: number): [number, number] => {
    const divisor = gcd(width, height);
  
    return [width / divisor, height / divisor];
  };