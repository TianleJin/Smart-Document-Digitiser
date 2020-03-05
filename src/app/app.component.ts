
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './authentication/authentication.service';
import { User, Role } from './_models';
import { faHome, faCog, faTable, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


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
        private http: HttpClient
    ) {
    }

    ngOnInit() {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.getColor();
    }

    // get color and set nav bar background color
    getColor() {
        this.http.get(this.COLOR_PATH).subscribe(data => {
            this.mainStyle = {
                background: data["background"]
                };
                this.linkStyle = {
                color: data["color"],
                };
        })
    }

    // check if administrator
    isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    // logout nav bar
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
