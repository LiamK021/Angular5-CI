import {Injectable, EventEmitter } 	from '@angular/core';



@Injectable()
export class NotificationsManager
{

	emitter: EventEmitter<any>;

	constructor( ) 
	{
		this.emitter = new EventEmitter();
	}
	getEventEmitter()
	{
		return this.emitter;
	}
	sendEvent(data:any)
    {
        this.emitter.next(data);
    }
}