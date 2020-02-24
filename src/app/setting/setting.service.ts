import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import styleObj from '../../assets/color/color.json';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  private styleSource = new BehaviorSubject({
    background: styleObj['background'],
    color: styleObj['color']
  });

  currentStyle = this.styleSource.asObservable();
  
  changeStyle(style) {
    this.styleSource.next(style);
  }

  // // upload logo image 
  // uploadImage(data) {
  //   return this.http.post('/image', data);
  // }

  // get fields
  getFields() {
    return this.http.get('/field');
  }

  // set fields
  setFields(data) {
    return this.http.post('/field', data);
  }

  // get color
  getColor() {
    return this.http.get('/color');
  }

  // set color
  setColor(data) {
    return this.http.post('/color', data);
  }
}
