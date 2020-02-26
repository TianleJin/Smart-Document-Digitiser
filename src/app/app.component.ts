import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication/authentication.service';
import { User, Role } from './_models';
import { SettingService } from './setting/setting.service';
import { log } from 'util';
import styleObj from '../assets/color/color.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    currentUser: User;
    mainStyle: Object;
    linkStyle: Object;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private setting: SettingService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    ngOnInit() {
        this.onGetColor();
        //this.setting.changeStyle(styleObj);
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
