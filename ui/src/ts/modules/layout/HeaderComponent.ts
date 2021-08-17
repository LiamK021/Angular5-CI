import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';
import {Helper} from "../../services/Helper";


@Component({
  	selector: 'header-bar',
  	providers: [],
    templateUrl: './_templates/header.html'
})
export class HeaderComponent implements OnInit, OnDestroy
{
    dropdownShow: boolean = false;
    playlistLinkActive: boolean;
    takeoverPage: boolean;
    ngOnInit()
    {  
        this.playlistLinkActive = this.helper.isPlaylistLinkActive();
        this.takeoverPage = this.helper.isTakeoverPageShown();
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, public router: Router, private helper: Helper) 
  	{
      
    }
    closeDropdown(){
        this.dropdownShow = false;
    }
    toggleDropdown(){
        this.dropdownShow = !this.dropdownShow;
    }
    showDropdown(){
        this.dropdownShow = true;
    }
    gotoPage(location)
    {
        this.router.navigate(["/"+location]);
    }

    logout()
    {
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/logout", {} , "POST")
            .then( (result) => {
                this.userManager.deleteUser();
                this.router.navigate(["/login"]);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
}
