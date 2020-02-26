import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { fakeBackendProvider } from './_helpers/fake-backend';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication/authentication.service';
import { User, Role } from './_models';
import { SettingService } from './setting/setting.service';
import { faHome, faCog, faTable, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { log } from 'util';
import styleObj from '../assets/color/color.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    // icons
    faHome = faHome;
    faCog = faCog;
    faTable = faTable;
    faSignOutAlt = faSignOutAlt;

    // file path
    private COLOR_PATH = 'assets/color/color.json';

    currentUser: User;
    mainStyle: Object;
    linkStyle: Object;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private setting: SettingService,
        private http: HttpClient
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.getColor().subscribe(data => {
            console.log(data);
            this.mainStyle = {
                background: data["background"]
                };
                this.linkStyle = {
                color: data["color"],
                };
        })
    }

    getColor() {
        return this.http.get(this.COLOR_PATH);
    }

    ngOnInit() {
        //this.onGetColor();
        // this.setting.changeStyle(styleObj);
        // this.setting.currentStyle.subscribe(style => {
        //     this.mainStyle = {
        //     background: style["background"]
        //     };
        //     this.linkStyle = {
        //     color: style["color"],
        //     };
        // });
    }
    
    onGetColor() {
        this.setting.getColor().subscribe((res) => {
            let colorJSON = res;
            this.mainStyle = {
                background: colorJSON["background"]
                };
                this.linkStyle = {
                color: colorJSON["color"],
                };
            //this.setting.changeStyle(colorJSON);
        });
    }

    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
