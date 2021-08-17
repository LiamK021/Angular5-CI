import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';


@Component({
  	selector: 'users',
  	providers: [],
    templateUrl: './_templates/user_list.html'
})
export class UserListComponent implements OnInit, OnDestroy
{

    ngOnInit()
    {  
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/users", {} , "GET")
            .then( (result) => {
                this.userManager.parseUserList(result);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, public router: Router) 
  	{
      
    }

    deleteUser(id:string)
    {
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/user/"+id, {} , "DELETE")
            .then( (result) => {
                this.userManager.parseUserList(result);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    registerUser()
    {
        this.router.navigate(["/users/register"]);
    }


}
