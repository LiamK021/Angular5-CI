import {Injectable}                   from '@angular/core';
import {Http, 
        Response, 
        Headers, 
        Request, 
        RequestOptions, 
        RequestMethod}                              from '@angular/http';
import {Location}                                   from '@angular/common';
import {Router }                                    from '@angular/router';

import {Observable}                                 from 'rxjs/Observable';
import {NotificationsManager}                       from './NotificationsManager';

import {User}   from '../models/User';

@Injectable()
export class UserManager
{
    myEventListener: any;
    _user : User;
    _users : User[];
    currentLayouts : string[];
    _availableLayouts : any;
    _donorList : any;
    _playLists : any;
    _playListDetails : any;

    _playlistBlankEntry:any;
    _layoutBlankEntry:any[];

    _playlistName = "";
    _playlistKey = "";
    _playlistID = "";
    _playlistPlacement = "";
    _apiPath = "";

    _currentSequenceID = "";

	constructor(private http: Http , 
                private _notificationManager:NotificationsManager, 
                private _router: Router, 
                private location: Location) 
    { 

        this._users = [];
        this._donorList = [];
        this._playLists = [];
        this._playListDetails = [];
       this.createEmptyPlaylistEntryModel();
       this.myEventListener = _notificationManager.getEventEmitter().subscribe( (data:any) => this.onEventsReceived(data) );
    }

    onEventsReceived(eventData:any)
    {
        switch (eventData.type)
        {    
            case "sockets_connected":
                break;

        }
    }

    createEmptyPlaylistEntryModel()
    {
        this._playlistBlankEntry = {};
        this._playlistBlankEntry.id = "";
        this._playlistBlankEntry.play_order = 0;
        this._playlistBlankEntry.layout = "";
        this._playlistBlankEntry.layoutTitle = "";
        this._playlistBlankEntry.bgMovie = "";
        this._playlistBlankEntry.solo = 0;
        this._playlistBlankEntry.duration = 0;
        this._playlistBlankEntry.layouts = [];
        this._playlistBlankEntry.transition = {}
        this._playlistBlankEntry.transition.Type= "none";
        this._playlistBlankEntry.transition.duration = 0;
        this._playlistBlankEntry.transition.Asset = "";
    }


    setAPIPath(obj:any)
    {
        this._apiPath = obj.apiPath;
    }
    getAPIPath()
    {
        return this._apiPath;
    }

	sendRequest(url:string , data: any , type:string, specifyContentType: boolean = true) 
    {
        // let body = JSON.stringify( data );
        let _session = localStorage.getItem('session');
        let headers;
        if (specifyContentType)
            headers = new Headers({ 'Content-Type': 'application/json' });
        else
            headers = new Headers();
        if (_session && _session !== "")
        {
            headers.append('Session-Info' , _session);
        }

       	let options = new RequestOptions({ headers: headers });
		let request: Observable<any>;
		if (type == "POST")
		{
			request = this.http.post(url ,  data , options );
		}
		else if (type == "PUT")
		{
			request = this.http.put(url ,  data , options );
		}
		else if (type == "GET")
		{
			request = this.http.get(url ,  options );
		}
		else if (type == "DELETE")
		{
			request = this.http.delete(url ,  options );
		}
        return request.toPromise().then(this.extractData ).catch(this.handleErrorPromise);
    }
    private extractData(res: Response) 
    {
		let body = res.json();
		return body || {};
    }

    private handleErrorPromise (error: Response) 
    {
        console.log(error);
        let errorBody = error.json();
		return Promise.reject(errorBody || error);
    }

    parseUser(data:any)
    {
        this._user = new User();
        this._user.id = data.id;
        this._user.first_name = data.first_name;
        this._user.last_name = data.last_name;
        this._user.email = data.email;
        this._user.admin = data.admin;
    }
    getUser()
    {
        return this._user;
    }
    deleteUser()
    {
        this._user = undefined;
    }
    parseUserList(data:any)
    {
        this._users = [];
        for (let i =0; i<data.length; i++)
        {
            let u = new User();
                u.id = data[i].id;
                u.first_name = data[i].first_name;
                u.last_name = data[i].last_name;
                u.email = data[i].email;
                u.admin = data[i].admin;
                this._users.push(u);
        }

    }
    getUserList()
    {
        return this._users
    }


    parseDonorList(data:any)
    {
        this._donorList = [];
        data.forEach((donorCategory) => {
            // data[key].inEditMode = false;
            this._donorList.push(donorCategory);
        })
    }
    getDonorList()
    {
        return this._donorList;
    }


    parsePlaylistDetails(data:any)
    {
        data.playlist.forEach((entry) => {
            entry.inEditMode = false;
        })
        this._playlistName = data.name;
        this._playlistKey = data.meta.playlist_key;
        this._playlistID = data.meta.id;
        this._playlistPlacement = data.placement;
        this._playListDetails = data.playlist;
    }
    parseAvailableLayouts(data: any)
    {
        this._availableLayouts = data;
    }
    getAvailableLayouts()
    {
        return this._availableLayouts
    }
    getCurrentPlaylistDetails()
    {
        return this._playListDetails;
    }
    getCurrentPlaylistPlacement()
    {
        return this._playlistPlacement;
    }
    getCurrentPlaylistKey()
    {
        return this._playlistKey;
    }
    getCurrentPlaylistID()
    {
        return this._playlistID;
    }
    addNewPlaylistSequence()
    {
        
        let data:any = {};
        
        data.playlist_id = this._playlistID;
        if (this._playlistBlankEntry.id !== "")
        data.id = this._playlistBlankEntry.id;
        data.layout = this._playlistBlankEntry.layout;
        data.layoutTitle = this._playlistBlankEntry.layoutTitle;
        data.bgMovie = this._playlistBlankEntry.bgMovie;
        data.solo = this._playlistBlankEntry.solo;
        data.duration = this._playlistBlankEntry.duration;
        data.transition_type = this._playlistBlankEntry.transition.Type;
        data.transition_time = this._playlistBlankEntry.transition.duration;
        data.transition_asset = this._playlistBlankEntry.transition.Asset;
        data.playlist_key = this._playlistKey;

        this.sendRequest(this._apiPath+"/api/index.php/cms/"+(this._playlistBlankEntry.id !== "" ? "update" : "add")+"PlaylistEntry" , data , "POST")
            .then((result) => {
                this._playlistBlankEntry = undefined;
                this.parsePlaylistDetails(result);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    deletePlaylistSequenceByID(id)
    {
        let data:any = {};
        data.sequence_id = id;
        data.playlist_id = this._playlistID;
        data.playlist_key = this._playlistKey;

        this.sendRequest(this._apiPath+"/api/index.php/cms/deletePlaylistEntry" , data , "POST")
            .then((result) => {
                this.parsePlaylistDetails(result);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    resetPlaylistDetails()
    {
        this._playListDetails = undefined;
    }

    getPlaylistBlankEntry()
    {
        return this._playlistBlankEntry;
    }
    getcurrentSelectedLayout()
    {
        return this._layoutBlankEntry;
    }
    parsePlaylists(data:any)
    {
        data.forEach((playlist) => {
            playlist.inEditMode = false;
            this._playLists.push(playlist);
        })
    }
    getPlaylists()
    {
        return this._playLists;
    }
    togglePlaylistEditModeByID(id)
    {
        for (let i = 0; i<this._playLists.length; i++)
        {
            if (this._playLists[i].id == id)
            {
                if (this._playLists[i].inEditMode)
                {
                    this.sendRequest("http://envision.morscad.com/api/index.php/cms/playlist/"+id , {playlist:this._playLists[i]} , "PUT")
                        .then((result) => {
                        })
                        .catch( (error) => {
                            console.warn(error);
                        });
                }
                this._playLists[i].inEditMode = !this._playLists[i].inEditMode;
            }
        }
    }
    togglePlaylistSequenceEditModeByID(id)
    {
        for (let i = 0; i<this._playListDetails.length; i++)
        {
            if (this._playListDetails[i].id == id)
            {
                this._playlistBlankEntry.id = this._playListDetails[i].id ;
                this._playlistBlankEntry.layout = this._playListDetails[i].layout ;
                this._playlistBlankEntry.layoutTitle = this._playListDetails[i].layoutTitle ;
                this._playlistBlankEntry.bgMovie = this._playListDetails[i].bgMovie ;
                this._playlistBlankEntry.solo = this._playListDetails[i].solo ;
                this._playlistBlankEntry.duration = this._playListDetails[i].duration ;
                this._playlistBlankEntry.transition.Type = this._playListDetails[i].transition.Type  ;
                this._playlistBlankEntry.transition.duration = this._playListDetails[i].transition.duration ;
                this._playlistBlankEntry.transition.Asset = this._playListDetails[i].transition.Asset ;
            }
        }
    }

    setCurrentSequenceID(id)
    {
        this._currentSequenceID = id;
    }
    getCurrentSequenceID()
    {
        return this._currentSequenceID;
    }
    
    movePlaylistSequenceUp(sequenceID)
    {
        let data:any = {};
        data.playlist_id = this._playlistID;
        data.playlist_key = this._playlistKey;
        data.sequence_id = sequenceID;

        this.sendRequest(this._apiPath+"/api/index.php/cms/movePlaylistSequenceUp" , data , "POST")
            .then((result) => {
                this.parsePlaylistDetails(result);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }

   

    movePlaylistSequenceDown(sequenceID)
    {
        let data:any = {};
        data.playlist_id = this._playlistID;
        data.playlist_key = this._playlistKey;
        data.sequence_id = sequenceID;

        this.sendRequest(this._apiPath+"/api/index.php/cms/movePlaylistSequenceDown" , data , "POST")
            .then((result) => {
                this.parsePlaylistDetails(result);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }

    setCurrentLayoutAttributes()
    {
        this._layoutBlankEntry = [];

        for (let i = 0; i<this._playListDetails.length; i++)
        {
            if (this._playListDetails[i].id == this._currentSequenceID)
            {
                this.currentLayouts = [];
                for (let key in this._availableLayouts[this._playListDetails[i].layout])
                {
                    let obj: any = {};
                    obj.element = key;
                    obj.attributes = this._availableLayouts[this._playListDetails[i].layout][key]
                    this.currentLayouts.push(obj);

                    let _attributes: string[] = this._availableLayouts[this._playListDetails[i].layout][key];
                    let entry: any = {};
                    entry.id = "";
                    entry.layout = key;
                    entry.Caption = "";
                    entry.Cta = "";
                    entry.Title = "";
                    entry.Text = "";
                    entry.Quote = "";
                    entry.Asset = "";
                    entry.Donorlevel = "";
                    
                    this._layoutBlankEntry.push(entry);
                }
                if (this._playListDetails[i].layouts.length > 0)
                {
                    for (let j = 0; j<this._playListDetails[i].layouts.length; j++)
                    {
                        for (let q = 0; q<this._layoutBlankEntry.length; q++)
                        {
                            if (this._layoutBlankEntry[q].layout == this._playListDetails[i].layouts[j].layout)
                            {
                                this._layoutBlankEntry[q].id = this._playListDetails[i].layouts[j].id;
                                this._layoutBlankEntry[q].Caption = this._playListDetails[i].layouts[j].Caption || "";
                                this._layoutBlankEntry[q].Cta = this._playListDetails[i].layouts[j].Cta || "";
                                this._layoutBlankEntry[q].Title = this._playListDetails[i].layouts[j].Title || "";
                                this._layoutBlankEntry[q].Text = this._playListDetails[i].layouts[j].Text || "";
                                this._layoutBlankEntry[q].Quote = this._playListDetails[i].layouts[j].Quote || "";
                                this._layoutBlankEntry[q].Asset = this._playListDetails[i].layouts[j].Asset || "";
                                this._layoutBlankEntry[q].Donorlevel = this._playListDetails[i].layouts[j].Donorlevel || "";
                            }
                        }
                    }
                }
            }
        }
        console.log(this._layoutBlankEntry);
    }
    setCurrentPlaylistSequenceLayout(layout)
    {
        this._layoutBlankEntry = layout;
    }

    savePlaylistLayout()
    {
        console.log(this._layoutBlankEntry);
        let data:any = {};
        data.playlist_id = this._playlistID;
        data.playlist_key = this._playlistKey;
        data.sequence_id = this._currentSequenceID;
        data.layouts = this._layoutBlankEntry;

        this.sendRequest(this._apiPath+"/api/index.php/cms/PlaylistLayout" , data , "POST")
            .then((result) => {
                this.parsePlaylistDetails(result);
                this._layoutBlankEntry = undefined;
                this._currentSequenceID = "";
                this.currentLayouts = [];
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    deletePlaylistLayoutByID(id)
    {
        let data:any = {};
        data.layout_id = id;
        data.playlist_id = this._playlistID;
        data.playlist_key = this._playlistKey;

        this.sendRequest(this._apiPath+"/api/index.php/cms/deletePlaylistLayout" , data , "POST")
            .then((result) => {
                this.parsePlaylistDetails(result);
                this._layoutBlankEntry = undefined;
                this._currentSequenceID = "";
                this.currentLayouts = [];
            })
            .catch( (error) => {
                console.warn(error);
            });
    }





}