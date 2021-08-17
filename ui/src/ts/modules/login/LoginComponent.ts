import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';


@Component({
  	selector: 'app-login',
  	providers: [],
    templateUrl: './_templates/login.html'
})
export class LoginComponent implements OnInit, OnDestroy
{
    model:any;
    authenticationError:string = "";
    logo_class: string;
    loginbox_class: string;
    inivisble_class: string;
    errorMessage_class: string;

    showPreloader : boolean;
    loginIsCorrect : number;

    sTimeout: any;

    ngOnInit()
    {  
      this.showPreloader = false;
      this.loginIsCorrect = 0;
    this.model = {email: "" , password : ""};

      this.logo_class = "itemFadeIn";
      this.loginbox_class = "itemSlideUp";
      this.errorMessage_class = "accountErrorCollapsed";
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, private _router: Router) 
  	{
      
  	}

  	doLogin()
  	{
        this.authenticationError = "";
        this.errorMessage_class = "accountErrorCollapsed";

        this.showPreloader = true;

        let result:any;
  		this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/login" , this.model , "POST")
            .then( (result) => {
                this.onLoginComplete(result);
                this.logo_class = "itemFadeOut";
                this.loginbox_class = "itemFadeOut";

                this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/playlists" , {} , "GET")
                                    .then((result) => {
                                        this.userManager.parsePlaylists(result);
                                        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/donors" , {} , "GET")
                                            .then((result2) => {
                                                this.userManager.parseDonorList(result2);
                                                let _reload:boolean = false;
                                                this.showPreloader = false;
                                                this.loginIsCorrect = 1;
                                              
                                                
                                                this._router.navigate( ["/home"] );
                                            })
                                            .catch( (error) => {
                                                console.warn(error);
                                            });
                                    })
                                    .catch( (error) => {
                                        console.warn(error);
                                    });
            })
            .catch( (error) => {
                this.onLoginError(error);
            });
  	}
  	onLoginError(error:any)
    {
        this.showPreloader = false;
        this.loginIsCorrect = -1;
        this.authenticationError = error.error;
        this.errorMessage_class = "accountErrorExpanded";
    }
    onLoginComplete(result:any)
  	{
  	    console.log(result);
        this.userManager.parseUser(result);
        // this.userManager.parseUser(result);
        localStorage.setItem('session' , result.session)
        

    }

}