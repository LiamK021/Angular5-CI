import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';
import { Helper } from '../../services/Helper';


@Component({
  	selector: 'home',
  	providers: [],
    templateUrl: './_templates/home.html'
})
export class HomeComponent implements OnInit, OnDestroy
{
    playlistLinkActive: boolean;
    takeoverPage: boolean;
    ngOnInit()
    {  
      this.playlistLinkActive = this.helper.isPlaylistLinkActive();
      this.takeoverPage = this.helper.isTakeoverPageShown()
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, public router: Router, private helper: Helper) 
  	{
      
    }
    gotoPage(location: string) {
        this.router.navigate(["/"+location]);
    }
}
