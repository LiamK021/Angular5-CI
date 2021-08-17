import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import {DynamicDirective} from "../ModalHolder";
import {Router, Params, ActivatedRoute} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';
import {Helper} from "../../services/Helper";
import {SafeStyle} from "@angular/platform-browser";
import { DeleteModalComponent } from '../util/DeleteModalComponent';
import { Subscription } from 'rxjs';

type DeleteModalTypes = "row" | "section";

@Component({
  	selector: 'donors',
  	providers: [],
    templateUrl: './_templates/donors.html'
})
export class DonorsComponent implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('dynamicDirective', {read: ViewContainerRef}) dynamicDirective: ViewContainerRef;
    scrollBarWidth: number = 0;
    scrollBarWidthStr: SafeStyle;

    onDeleteSub: Subscription = Subscription.EMPTY;

    selectedKey : string = "";
    selectedTitle : string = "";
    selectedList : any[];
    editTitle:boolean;
    newDonor:any;
    ngOnInit()
    {  
        this.newDonor = { name: "", letter:"" };

        this.editTitle = false;
        let id = "";
        this.route.params.forEach((params: Params) => {
            id = params['id']; 
        });
        if (id !== "")
        {
            this.selectedKey = id;
            for (let i = 0; i< this.userManager.getDonorList().length; i++)
            {
                if (this.selectedKey == this.userManager.getDonorList()[i].key)
                {
                    this.selectedTitle = this.userManager.getDonorList()[i].title;
                    this.selectedList = this.userManager.getDonorList()[i].donors;
                }
            }
        }
        let scrollBarProps = this.helper.getWidthWithScrollbar("90%");
        this.scrollBarWidthStr = scrollBarProps.style;
        this.scrollBarWidth = scrollBarProps.width;
    }

    ngAfterViewInit(){

    }

    ngOnDestroy() 
    {
    }

    constructor(
        public userManager:UserManager,
        public router: Router,
        private route: ActivatedRoute,
        private helper: Helper,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver:ComponentFactoryResolver
    ) {}

    selectDonorListKey()
    {
        
    }
    editListTitle()
    {
        this.editTitle = true;
    }
    saveListTitle()
    {
        this.editTitle = false;
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/updateDonorListTitle", { title: this.selectedTitle , key:this.selectedKey } , "POST")
            .then( (result) => {
                this.userManager.parseDonorList(result);
                for (let i = 0; i< this.userManager.getDonorList().length; i++)
                {
                    if (this.selectedKey == this.userManager.getDonorList()[i].key)
                    {
                        this.selectedTitle = this.userManager.getDonorList()[i].title;
                        this.selectedList = this.userManager.getDonorList()[i].donors;
                    }
                }
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    deleteDonorCategory(key)
    {
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/donorCategory/"+this.selectedKey, { } , "DELETE")
            .then( (result) => {
                this.userManager.parseDonorList(result);
                this.router.navigate(["/donors"]);
            })
            .catch( (error) => {
                console.warn(error);
            });
    }

    moveDonorUp(donorID : string)
    {
        let data:any = {};
        data.donor_key = this.selectedKey;
        data.donor_id = donorID;

        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/moveDonorOrderUp" , data , "POST")
            .then((result) => {
                this.userManager.parseDonorList(result);
                for (let i = 0; i< this.userManager.getDonorList().length; i++)
                {
                    if (this.selectedKey == this.userManager.getDonorList()[i].key)
                    {
                        this.selectedTitle = this.userManager.getDonorList()[i].title;
                        this.selectedList = this.userManager.getDonorList()[i].donors;
                    }
                }
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    moveDonorDown(donorID: string)
    {
        let data:any = {};
        data.donor_key = this.selectedKey;
        data.donor_id = donorID;

        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/moveDonorOrderDown" , data , "POST")
            .then((result) => {
                this.userManager.parseDonorList(result);
                for (let i = 0; i< this.userManager.getDonorList().length; i++)
                {
                    if (this.selectedKey == this.userManager.getDonorList()[i].key)
                    {
                        this.selectedTitle = this.userManager.getDonorList()[i].title;
                        this.selectedList = this.userManager.getDonorList()[i].donors;
                    }
                }
            })
            .catch( (error) => {
                console.warn(error);
            });
    }

    editRow(index:number)
    {
        this.selectedList[index].inEditMode = true;
    }
    cancelEdit(index:number)
    {
        this.selectedList[index].inEditMode = false;
    }
    deleteRow(index:number)
    {
        this.selectedList[index].inEditMode = false;
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/donor/"+this.selectedList[index].id , {} , "DELETE")
            .then( (result) => {
                this.userManager.parseDonorList(result);
                for (let i = 0; i< this.userManager.getDonorList().length; i++)
                {
                    if (this.selectedKey == this.userManager.getDonorList()[i].key)
                    {
                        this.selectedTitle = this.userManager.getDonorList()[i].title;
                        this.selectedList = this.userManager.getDonorList()[i].donors;
                    }
                }
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    saveRow(index:number)
    {
        this.selectedList[index].inEditMode = false;
        let donor:any = {} ;
        donor.id = this.selectedList[index].id;
        donor.donorKey = this.selectedKey;
        donor.donorName = this.selectedList[index].name;
        donor.letter = this.selectedList[index].letter;
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/donor/" , donor , "PUT")
            .then( (result) => {
                this.userManager.parseDonorList(result);

                for (let i = 0; i< this.userManager.getDonorList().length; i++)
                {
                    if (this.selectedKey == this.userManager.getDonorList()[i].key)
                    {
                        this.selectedTitle = this.userManager.getDonorList()[i].title;
                        this.selectedList = this.userManager.getDonorList()[i].donors;
                    }
                }
            })
            .catch( (error) => {
                console.warn(error);
            });
    }

    addRow()
    {
        let donor:any = {} ;
        donor.donorKey = this.selectedKey;
        donor.donorName = this.newDonor.name;
        donor.letter = this.newDonor.letter;
        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/donor/" , donor , "POST")
            .then( (result) => {
                this.userManager.parseDonorList(result);

                for (let i = 0; i< this.userManager.getDonorList().length; i++)
                {
                    if (this.selectedKey == this.userManager.getDonorList()[i].key)
                    {
                        this.selectedTitle = this.userManager.getDonorList()[i].title;
                        this.selectedList = this.userManager.getDonorList()[i].donors;
                    }
                }
                this.newDonor = { name: "", letter:"" };
            })
            .catch( (error) => {
                console.warn(error);
                
            });
    }
    resolveTextAndHandlerForDeleteModal(type: DeleteModalTypes, index?: number) : {text: string, onDelete: () => void}{

        const deleteRow = () => {
            this.deleteRow(index);
        }

        const deleteSection = () => {
            this.deleteDonorCategory(this.selectedKey);
        }

        return {
            text: type === "section" ? "Do you want to delete this section?" : "Do you want to delete row?",
            onDelete: type === "section" ? deleteSection : deleteRow
        }
    }
    openDeleteModal(type: DeleteModalTypes, index?: number){
        let viewContainerRef = this.dynamicDirective;
        this.onDeleteSub.unsubscribe();
        viewContainerRef.clear();
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(DeleteModalComponent);
        let componentRef = viewContainerRef.createComponent(componentFactory);

        const {text, onDelete} = this.resolveTextAndHandlerForDeleteModal(type, index);
        componentRef.instance.text = text;
        this.onDeleteSub = componentRef.instance.onDelete.subscribe(onDelete)
    }
}
