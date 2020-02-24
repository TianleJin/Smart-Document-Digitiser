import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { SettingService } from '../setting/setting.service';

import { User } from '@app/_models';
import { UserService } from '@app/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  loading = false;
  users: User[] = [];
  style;
  images;

  constructor(private userService: UserService, private setting: SettingService) { }

  ngOnInit() {
    this.setting.currentStyle.subscribe(style => this.style = style);
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
    });
  }

  changeBg(bgColor) {
    const linkColor = this.linkColor(bgColor);

    const newStyle = {
        background: bgColor,
        color: linkColor
    }

    this.setting.setColor({
      'background': bgColor,
      'color': linkColor
    }).subscribe((res) => {
      this.setting.changeStyle(newStyle);
    });
  }

  linkColor(color) {
      let rgba = color.slice(5, color.length - 1).split(',');
      if (parseInt(rgba[0]) * 0.299 + parseInt(rgba[1]) * 0.587 + parseInt(rgba[2]) * 0.114 < 150) {
          return 'rgba(255,255,255,1)';
      } else {
          return 'rgba(0,0,0,1)';
      }
   }

}
