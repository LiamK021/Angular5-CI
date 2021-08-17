export function mimeToExtension(str: string): string {
    let index = str.indexOf('/');
    if(index === -1){
        throw new Error('Invalid type');
    }
    return str.slice(index + 1);
}

export function mimeToType(str: string) : string {
    let index = str.indexOf('/');
    if(index === -1){
        throw new Error('Invalid type');
    }
    return str.slice(0, index);
}