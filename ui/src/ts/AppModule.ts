import { NgModule, APP_INITIALIZER }   from "@angular/core";
import { BrowserModule }                      from "@angular/platform-browser";
import { FormsModule }                        from "@angular/forms";
import { CommonModule }                       from "@angular/common";
import { HttpClientModule }                   from "@angular/common/http";
import { HttpModule,  JsonpModule }           from "@angular/http";

import { CoreController }                     from "./modules/core/CoreController";
import { HeaderComponent }                     from "./modules/layout/HeaderComponent";
import {ClickOutsideDirective} from "./modules/ClickOutside";
import {DynamicDirective} from "./modules/ModalHolder";
import {ImageDimensionDirective} from "./modules/ImageDimensions";
import {DeleteModalComponent} from "./modules/util/DeleteModalComponent";

import { UserManager }                         from "./services/UserManager";
import { NotificationsManager }                from "./services/NotificationsManager";
import {Helper} from "./services/Helper";
import {MediaManager} from "./services/MediaManager/MediaManager";
import {MockMediaManager} from "./services/MediaManager/MockMediaManager";
import {UMediaManager} from "./services/MediaManager/UMediaManager";
import {SessionService} from "./services/SessionService";
import {ConfigService} from "./services/ConfigService";
import {MediaValidationService} from "./services/MediaValidation";
import { AppRoutesModule }     	              from "./AppRoutesModule";

const appInitializerFn = (appConfig: ConfigService) => {
        return () => {
                return appConfig.loadAppConfig();
        };
};

@NgModule({
  imports: 
          [
              BrowserModule,
              FormsModule,
              CommonModule,
              HttpModule,
              HttpClientModule,
              JsonpModule,
              AppRoutesModule
          ],
  declarations: 
          [
                CoreController ,
                HeaderComponent,
                ClickOutsideDirective,
                DynamicDirective, 
                DeleteModalComponent,
                ImageDimensionDirective     ,
          ],
  providers: 
          [ 	
                ConfigService,  
                {
                        provide: APP_INITIALIZER,
                        useFactory: appInitializerFn,
                        multi: true,
                        deps: [ConfigService]
                },
                UserManager,
                NotificationsManager,
                Helper,
                SessionService,
                MediaValidationService,
                {provide: MediaManager, useClass: UMediaManager}
          ],
  entryComponents: [ DeleteModalComponent],
  bootstrap: 
          [ 
                CoreController 
          ]
})
export class AppModule { }

