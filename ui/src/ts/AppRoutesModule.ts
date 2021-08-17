import { NgModule }             		from '@angular/core';
import { RouterModule, Routes } 		from '@angular/router';
import { BrowserModule }				from '@angular/platform-browser';
import { FormsModule }					from '@angular/forms';
import { CommonModule }					from '@angular/common';

import { LoginComponent }  				from './modules/login/LoginComponent';
import { HomeComponent }  				from './modules/home/HomeComponent';
import { DonorsComponent }  			from './modules/donors/DonorsComponent';
import { DonorsList }  					from './modules/donors/DonorsList';
import { PlaylistComponent }  			from './modules/playlist/PlaylistComponent';
import { PlaylistDetailsComponent }  	from './modules/playlist/PlaylistDetailsComponent';
import { UserListComponent }  			from './modules/users/UserListComponent';
import { RegisterUserComponent }  		from './modules/users/RegisterUserComponent';
import {MediaComponent} from "./modules/media/MediaComponent";
import {MediaUploadModal} from "./modules/media/MediaUploadModal";
import {MediaGridComponent} from "./modules/media/MediaGridComponent";
import {MediaGridItemComponent} from "./modules/media/MediaGridItemComponent";
import {MediaGridItemDescComponent} from "./modules/media/MediaGridItemDescComponent";
import {TakeOverComponent} from "./modules/takeover/TakeOverComponent";
import {VideoProcessingDirective} from "./modules/VideoProcessingDirective";

@NgModule({
	imports: 
		[ 
			BrowserModule,
	        CommonModule,
	        FormsModule,
			RouterModule.forRoot([
					{
						path: 'login',
						component: LoginComponent
					},
					{
						path: 'home',
						component: HomeComponent
					},
					{
						path: 'users',
						component: UserListComponent,
						data: {name: "users"}
					},
					{
						path: 'users/register',
						component: RegisterUserComponent
					},
					{
						path: 'donors',
						component: DonorsList,
						data: {name: "donors-list"}
					},
					{
						path: 'donors/:id',
						component: DonorsComponent,
						data: {name: "donors"}
					},
					{
						path: 'playlist',
						component: PlaylistComponent,
						data: {name: "playlist"}
					},
					{
						path: 'playlist/:id',
						component: PlaylistDetailsComponent,
						data: {name: "playlist-details"}
					},
					{
						path: 'media',
						component: MediaComponent,
						data: {name: "media"}
					},
					{
						path: "takeover",
						component: TakeOverComponent,
						data: {name: "takeover"}
					}
			]) 
		],
	declarations: 
        [
			LoginComponent,
			HomeComponent,
			DonorsComponent,
			DonorsList,
			PlaylistComponent,
			PlaylistDetailsComponent,
			UserListComponent,
			RegisterUserComponent,
			MediaComponent,
			MediaUploadModal,
			MediaGridComponent,
			MediaGridItemComponent,
			MediaGridItemDescComponent,
			TakeOverComponent,
			VideoProcessingDirective
        ],
	exports: 
		[ 
			RouterModule 
		],
	entryComponents: [VideoProcessingDirective]
})
export class AppRoutesModule {}