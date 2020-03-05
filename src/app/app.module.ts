
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { JwtInterceptor } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { TrackComponent } from './track/track.component';
import { ColorPickerModule } from './color-picker/color-picker.module';
import { PhotoService } from './photoservice/photo.service';
import { SettingService } from './settingservice/setting.service';
import { DatabaseService } from './databaseservice/database.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    TrackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ColorPickerModule,
    FormsModule,
    FontAwesomeModule,
    Ng2SearchPipeModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType:'danger'
    }),
    NgxSmartModalModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider,
    DatabaseService, 
    SettingService, 
    PhotoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
