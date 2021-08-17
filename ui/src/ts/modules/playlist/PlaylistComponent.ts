import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';


@Component({
  	selector: 'playlist',
  	providers: [],
    templateUrl: './_templates/playlist.html'
})
export class PlaylistComponent implements OnInit, OnDestroy
{
    selectedEntry : any;

    ngOnInit()
    {  
        console.log("from playlist component");
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, public router: Router) 
  	{
      
    }

    seePlaylistDetails(id:string)
    {
        this.router.navigate(["/playlist/"+id]);
    }
    deletePlaylist(id:string)
    {
        
    }
    editPlaylist(id:string)
    {
        this.userManager.togglePlaylistEditModeByID(id);
    }

}
