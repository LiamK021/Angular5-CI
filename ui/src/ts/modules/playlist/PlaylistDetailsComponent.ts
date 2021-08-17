import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {NgForm, FormControl, NgControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {UserManager}        from '../../services/UserManager';
import { Helper, ScrollBarProps } from '../../services/Helper';


@Component({
  	selector: 'playlist',
  	providers: [],
    templateUrl: './_templates/playlist_details.html'
})
export class PlaylistDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('closeModalButton') closeModalButton : ElementRef 

    selectedEntry : any;
    fileToUpload : any;
    _idToDelete : string = "";
    layouts : string[];

    scrollBarProps: ScrollBarProps;

    ngOnInit()
    {  
        this.userManager.resetPlaylistDetails();

        let id = "";
        this.route.params.forEach((params: Params) => {
            id = params['id']; 
        });
        if (id !== "")
        {
            this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/playlist/key/"+id , {} , "GET")
                .then((result) => {
                    this.userManager.parsePlaylistDetails(result);
                    this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/layouts/placement/"+result.placement , {} , "GET")
                        .then((result2) => {
                            this.userManager.parseAvailableLayouts(result2);
                            this.layouts = [];
                            for (let key in result2)
                            {
                                this.layouts.push(key);
                            }
                        });
                })
                .catch( (error) => {
                    console.warn(error);
                });
        }
        this.scrollBarProps = this.helper.getWidthWithScrollbar("90%");
    }

    ngOnDestroy() 
    {
    }

    constructor(  public userManager:UserManager, public router: Router, private route: ActivatedRoute, private helper: Helper) 
  	{
      
    }


    backToPlaylistSelection()
    {
        this.router.navigate(["/playlist"]);
    }
    createBlankPlaylistSequence()
    {
        this.userManager.createEmptyPlaylistEntryModel();
    }
    editPlaylistSequence(id:string)
    {
        this.userManager.createEmptyPlaylistEntryModel();
        this.userManager.togglePlaylistSequenceEditModeByID(id);
    }
    savePlaylistSequence()
    {
        this.userManager.addNewPlaylistSequence();
        // this.closeModalButton.nativeElement.click();
    }
    setDeleteData(id)
    {
        this._idToDelete = id;
    }
    resetDeleteData()
    {
        this._idToDelete = "";
    }
    deletePlaylistSequence()
    {
        if (this._idToDelete !== "")
        {
            this.userManager.deletePlaylistSequenceByID(this._idToDelete);
            this._idToDelete = "";
        }
    }
    setDeleteLayout(id)
    {
        this._idToDelete = id;
    }
    resetDeleteLayoutData()
    {
        this._idToDelete = "";
    }
    deletePlaylistLayout()
    {
        if (this._idToDelete !== "")
        {
            this.userManager.deletePlaylistLayoutByID(this._idToDelete);
            this._idToDelete = "";
        }
    }
    createPlaylistSequenceLayout(currentSequenceID)
    {
        this.userManager.setCurrentSequenceID(currentSequenceID);
        this.userManager.setCurrentLayoutAttributes();
    }

    selectDonorListKey()
    {
        // for (let i = 0; i< this.userManager.getDonorList().length; i++)
        // {
        //     if (this.userManager.getcurrentSelectedLayout().Donorlevel == this.userManager.getDonorList()[i].key)
        //         this.userManager.getcurrentSelectedLayout().Title = this.userManager.getDonorList()[i].title;
        // }
    }


    handleFileInput(files: FileList) 
    {
        this.fileToUpload = files.item(0);
        console.log(this.fileToUpload);

        let formData: FormData = new FormData();
        formData.append('files', this.fileToUpload, this.fileToUpload.name);

        this.userManager.sendRequest(this.userManager.getAPIPath()+"/api/index.php/cms/uploadImage" , formData , "POST" , false)
            .then((result) => {
                //this.parsePlaylistDetails(result);
                // this.userManager.getcurrentSelectedLayout().image_background = this.userManager.getAPIPath()+"/api/images/"+result.imageFile
                // this.userManager.getcurrentSelectedLayout().image_filename = this.fileToUpload.name;
                this.fileToUpload = undefined;
            })
            .catch( (error) => {
                console.warn(error);
            });
    }

    
}
