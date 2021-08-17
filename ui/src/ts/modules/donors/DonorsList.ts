import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';
import { ScrollBarProps, Helper } from '../../services/Helper';


@Component({
  	selector: 'donor-list',
  	providers: [],
    templateUrl: './_templates/donors_list.html'
})
export class DonorsList implements OnInit, OnDestroy
{
    selectedKey : string = "";
    selectedList : any[];
    fileToUpload : any;
    scrollBarProps: ScrollBarProps;
    
    ngOnInit()
    {  
        this.selectedKey = "";
        this.scrollBarProps = this.helper.getWidthWithScrollbar(this.helper.defaultViewWidth);
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, public router: Router, private helper: Helper) 
  	{
      
    }

    seeDonorList(key)
    {
        this.router.navigate(["/donors/"+key]);
    }

    handleFileInput(files: FileList) 
    {
        this.fileToUpload = files.item(0);
        console.log(this.fileToUpload);

        let formData: FormData = new FormData();
        formData.append('csvFile', this.fileToUpload, this.fileToUpload.name);

        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/uploadDonorCSV" , formData , "POST" , false)
            .then((result) => {
                console.log(result);
                this.userManager.parseDonorList(result);
                this.fileToUpload = undefined;
            })
            .catch( (error) => {
                console.warn(error);
            });
    }
    downloadSample(){
        window.open("data/sample_csv.csv")
    }

}
