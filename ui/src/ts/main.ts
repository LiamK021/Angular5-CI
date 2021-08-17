
import { platformBrowserDynamic } 		from '@angular/platform-browser-dynamic';
import { AppModule }   					from './AppModule';
import { enableProdMode } from '@angular/core';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);