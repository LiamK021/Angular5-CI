import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';
import { User } from '../../models/User';


@Component({
  	selector: 'register-user',
  	providers: [],
    templateUrl: './_templates/register_user.html'
})
export class RegisterUserComponent implements OnInit, OnDestroy
{
    userModel : any;
    errorMessage : string;
    ngOnInit()
    {  
        this.userModel = {
            first_name : "",
            last_name: "",
            email : "",
            password : "",
            confirmPasswrod: "",
            admin : 0
        };
        this.errorMessage = "";
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, public router: Router) 
  	{
      
    }

    gotoPage(location)
    {
        this.router.navigate(["/"+location]);
    }

    registerUser()
    {
        this.errorMessage = "";

        if (this.userModel.first_name == "" || 
            this.userModel.last_name == "" || 
            this.userModel.email == "" || 
            this.userModel.password == "" || 
            this.userModel.confirmPassword == ""
        )
        {
            this.errorMessage = "Please fill all the form fields";
        }
        else
        {
            if (this.userModel.password  !== this.userModel.confirmPassword)
            {
                this.errorMessage = "Your password and confirmation don't match";
            }
            else
            {
                this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/register", this.userModel , "POST")
                    .then( (result) => {
                        this.router.navigate(["/users"]);
                    })
                    .catch( (error) => {
                        if ( error.error)
                        {
                            this.errorMessage = error.error;
                        }
                        else
                        {
                            this.errorMessage = "There was an error in our system, please contact the system admin";
                        }
                        
                    });
            }
        }
        


    }
}
