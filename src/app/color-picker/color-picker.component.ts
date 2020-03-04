import { Component, OnInit } from '@angular/core'
import { SettingService } from '../settingservice/setting.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent implements OnInit {
  constructor(private setting: SettingService) {}
  public hue: string;
  public color: string;

  ngOnInit() {
    this.setting.currentStyle.subscribe(style => this.color = style["background"]);
    console.log(this.color);
  }
}