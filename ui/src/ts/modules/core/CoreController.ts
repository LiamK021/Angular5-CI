
import {Component, OnInit, OnDestroy}          from '@angular/core';
import {Http, Response}             from '@angular/http';
import {Location}                   from '@angular/common';
import {Router , 
        ActivatedRoute, 
        NavigationEnd,
        ActivationEnd,
        NavigationStart}              from '@angular/router';
import {Observable}                 from 'rxjs/Observable';

import {UserManager}              from '../../services/UserManager'
import {filter, map, tap} from "rxjs/operators";
import {Subscription} from "rxjs";
import { LoginComponent } from '../login/LoginComponent';



@Component({
  	selector: 'core-app',
    templateUrl: './_templates/core.html'
})

export class CoreController  implements OnInit, OnDestroy
{
    pageName: string;
    mainDisplayClass:string = "centered";
    initialDestination: string = "";
    sub: any;
    myEventListener : any;
    tenantInfo:string;
    sTimeout : any;
    timeoutPeriod : number;
    currentState:string;
    isIdleMode : boolean;
    disableTimeout : boolean;

    isHome: boolean = true;
    routerSub: Subscription;
    loginComponent = false;

    ngOnInit() 
    {
      this.userManager.sendRequest("./data/config.json" , {} , "GET")
            .then((result) => {
                this.userManager.setAPIPath(result);
                let _session = localStorage.getItem('session');
                if (_session  && _session !== '')
                {
                    this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/handshake" , {} ,  "POST")
                        .then((result) => {
                            if (result && result.id)
                            {
                                this.userManager.parseUser(result);
                                this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/playlists" , {} , "GET")
                                    .then((result) => {
                                        this.userManager.parsePlaylists(result);
                                        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/donors" , {} , "GET")
                                            .then((result) => {
                                                this.userManager.parseDonorList(result);
                                            })
                                            .catch( (error) => {
                                                console.warn(error);
                                            });
                                    })
                                    .catch( (error) => {
                                        console.warn(error);
                                    });
                                this.router.navigate(["/home"]);
                            }
                            else
                            {
                                localStorage.setItem("session" , "");
                                if (!this.userManager.getUser())
                                {
                                this.router.navigate(["/login"]);
                                }
                            }
                        })
                        .catch( (error) => {
                            console.warn(error);
                        });
                }
                else
                {
                    if (!this.userManager.getUser())
                    {
                      this.router.navigate(["/login"]);
                    }
                }
            })
            .catch( (error) => {
                console.warn(error);
            });

    }
    ngOnDestroy() 
    {
        this.routerSub.unsubscribe();
    }

    constructor(private router: Router, 
                private route: ActivatedRoute, 
                private userManager:UserManager,
                private _location: Location)
  	{

        let sc = this;

        this.routerSub = this.router.events.pipe(
            filter(e => e instanceof NavigationStart),
            map((v: any) => v.url === "/home")
        ).subscribe(v => {
            this.isHome = v;
        })

        this.router.events.pipe(
            filter(e => e instanceof ActivationEnd)
        ).subscribe((v: any) => {
            this.pageName = v.snapshot.data.name;
        })
      }
      
      gotoEmail()
      {
        
      }

      onActivate(event: any){
        this.loginComponent = event instanceof LoginComponent;
      }

}