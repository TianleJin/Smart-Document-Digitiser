import { first } from 'rxjs/operators';
import { DatabaseService } from '../database/database.service';
import { SettingService } from '../setting/setting.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@app/_models';
import { UserService } from '@app/user/user.service';
import { AuthenticationService } from '@app/authentication/authentication.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  moment = require('moment');

  loading = false;
  currentUser: User;
  userFromApi: User;
  section = 1;
  videoWidth = 0;
  videoHeight = 0;
  // basic info fields
  invoiceID: String = "";
  //invoiceNum: String = "";
  //issuedDate: String = "";
  recordDate: String = "";
  //companyName: String = "";
  //staffNum: String = "";
  status: String;
  comments: String;
  picture: String;
  pictures: Array<String> = [];
  image;
  canvasElement;
  isShow = true;
  fieldJSON;
  numberOfField;
  fieldArray = [];
  valueArray = [];
  pairArray = [];

  constructor(
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private renderer: Renderer2, 
      private dbService: DatabaseService, 
      private http: HttpClient, 
      private setting: SettingService
  ) {
      this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loading = true;
    this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
        this.loading = false;
        this.userFromApi = user;
    });
    this.getFields();
  }

  @ViewChild('video', { static: false}) videoElement: ElementRef;
  @ViewChild('canvas', { static: false}) canvas: ElementRef;

  // Get all fields from dist/smart/assets/field/field.json
  getFields() {
    this.setting.getFields().subscribe((res) => {
      this.fieldJSON = res;
      this.numberOfField = this.fieldJSON["numberOfFields"];
      let fieldObj = this.fieldJSON["fields"];
      for (let j = 0; j < this.numberOfField; j++) {
        this.fieldArray.push(fieldObj[j].name);
      }
      for (let i = 0; i < this.numberOfField; i++) {
        this.valueArray[i] = "";
      }        
    }); 
  }

  constraints = {
    // video: {
    //     facingMode: "environment",
    //     width: { ideal: 240 },
    //     height: { ideal: 320 }
    // }
    video: {
      facingMode: "environment",
      // width: { min: 400, ideal: 1080 },
      // height: { min: 640, ideal: 1920 },
      aspectRatio: { ideal: 0.5625 }
    }
  };

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) { navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
        alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  changeSection(sectionId) {
    this.section = sectionId;
    if (this.section == 2) {
      this.startCamera();
    } 
  }

  onSaveDetails() {
    if (this.validateFrom()) {
      this.recordDate = this.moment().format("YYYY-MM-DD hh:mm a");
      this.status = "Uploaded";
      this.comments = "";
      let temp;
      for (let i = 0; i < this.numberOfField; i++) {
        temp = [];
        temp.push(this.fieldArray[i]);
        temp.push(this.valueArray[i]);
        this.pairArray.push(temp);
      }
      this.changeSection(2);
    };
  }

  onSaveRecord() {
    if (this.validateFrom()) {
      let obj = {
        invoiceID: this.invoiceID,
        recordDate: this.recordDate,
        status: this.status,
        comments: this.comments
      };
      let key;
      let value;
      let tempObj = {};
      for (let i = 0; i < this.numberOfField; i++) {
        key = this.fieldArray[i];
        value = this.valueArray[i];
        tempObj[key]= value;      
      }     
      obj["extra"] = tempObj;
      this.dbService.createRecord(obj).subscribe(result => {});
      this.changeSection(4);
      this.clearDetails();
    } else { this.changeSection(1)}
  }

  clearDetails() {
    this.invoiceID = "";
    for (let i = 0; i < this.valueArray.length; i++) {
      this.valueArray[i] = "";
    }
  }

  capture() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.renderer.setProperty(this.videoElement.nativeElement, 'display', "none");
    this.picture = this.canvas.nativeElement.toDataURL("image/png");
    console.log(this.picture);
    this.isShow = false;
    
    //this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    // console.log(this.canvas.nativeElement.toDataURL("image/png"));
    // console.log(typeof(this.canvas.nativeElement.toDataURL("image/png")));  
    // console.log(this.captures);
  }

  validateFrom() {
    if (this.invoiceID === "") {
      alert("Invoice ID must be provided!");
      return false;
    }
    for (let i = 0; i < this.valueArray.length; i++) {
      if (this.valueArray[i] === "") {
        alert(this.fieldArray[i] + " must be provided!");
        return false;
      }
    }
    return true;
  };

  storePictures(){
    this.pictures.push(this.picture);
    this.isShow = true;
    // for (let i = 0; i < this.captures.length; i++) {
    //   this.pictures.push(this.captures[i]);
    // }
  };

  deletePictures() {
    this.pictures = [];
  }

  retake() {
    this.isShow = true;
  }


}
