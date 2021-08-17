import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

class SessionError extends Error {
    constructor(){
        super('Session is not set')
    }
}

@Injectable()
export class SessionService {

    constructor() { }
    appendSessionInfo(headers: HttpHeaders){
        const session = localStorage.getItem('session');
        if (session && session !== ""){
            return headers.append('Session-Info' , session);
        }
        throw new SessionError();
    }
}