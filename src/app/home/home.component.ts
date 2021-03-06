import { first } from 'rxjs/operators';
import { DatabaseService } from '../databaseservice/database.service';
import { PhotoService } from '../photoservice/photo.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  DummyData from '../photoservice/sample.json';
import { faCamera, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import { NgxSmartModalService } from 'ngx-smart-modal';

import { User } from '@app/_models';
import { AuthenticationService } from '@app/authentication/authentication.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //icons
  faCamera = faCamera;
  faTrash = faTrash;
  faSave = faSave;

  // require moment to generate date
  moment = require('moment');

  section: number = 1;
  videoWidth: number= 0;
  videoHeight: number = 0;

  // basic info fields
  invoiceID: string = "";
  recordDate: string = "";
  status: string = "";
  comments: string = "";

  inputAlert: string = "";
  picture: string;
  blob;
  captures: Array<any> = [];
  isShow: boolean = true;

  fieldArray: Array<any> = [];
  valueArray: Array<any> = [];
  pairArray: Array<any> = [];

  // jwt key for OCR API
  jwt: any;
  document_name: string = "sample.png";
  template_name: string = "Sample_Receipt";
  uploadResError: Object; 
  uploadRes: Object; 
  getResError: Object; 
  getRes: Object = DummyData;
  unmappedInfo: Array<any> = [];
  previewInfo: Array<any> = [];
  previewError: string;

  private FIELD_PATH = "assets/field/field.json";

  withAutofocus = `<button type="button" ngbAutofocus class="btn btn-danger"
      (click)="modal.close('Ok click')">Ok</button>`;

  constructor(
      private renderer: Renderer2, 
      private dbService: DatabaseService, 
      private http: HttpClient, 
      private photo: PhotoService,
      public ngxSmartModalService: NgxSmartModalService,
  ) {
  }

  ngOnInit() {
    this.getFields();
    this.photo.getJwt().subscribe((data) => {
      this.jwt = data;
    });
  }

  // access video and canvas elements
  @ViewChild('video', { static: false}) videoElement: ElementRef;
  @ViewChild('canvas', { static: false}) canvas: ElementRef;

  // Get all fields from dist/smart/assets/field/field.json
  fieldJSON;
  numberOfField;
  getFields() {
    this.http.get(this.FIELD_PATH).subscribe((data) => {
      this.fieldJSON = data;
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
    video: {
      facingMode: "environment",
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

  // chagng section, called in html file
  changeSection(sectionId) {
    this.section = sectionId;
    if (this.section == 1) {
      this.pairArray = [];
    }
    if (this.section == 2) {
      this.startCamera();
      this.previewInfo = [];
      this.unmappedInfo = [];
      this.previewError = undefined;
    } 
    this.isShow = true;
  }

  // save input details
  onSaveDetails() {
    if (this.validateForm()) {
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

  // upload to input record to database
  onSaveRecord() {
    if (this.validateForm()) {
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
      this.captures = [];
      this.clearDetails();
    } else {this.changeSection(1)}
  }

  // clear all input 
  clearDetails() {
    this.invoiceID = "";
    for (let i = 0; i < this.valueArray.length; i++) {
      this.valueArray[i] = "";
    }
  }

  // capture an image
  capture() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.renderer.setProperty(this.videoElement.nativeElement, 'display', "none");
    this.picture = this.canvas.nativeElement.toDataURL("image/png");
    this.isShow = false;
    this.blob = this.dataURLtoBlob(this.picture);
    this.uploadImg(this.blob, this.jwt, this.template_name, this.document_name);  
  }

  // upload image to ocr server
  uploadImg(blob, jwt, template_name, document_name) {
    this.uploadResError = undefined; 
    this.uploadRes = undefined; 
    this.getResError = undefined; 
    this.getRes = undefined;
    this.photo.uploadImage(jwt, template_name, blob, document_name).subscribe(
      (data) => {
        this.uploadRes = data;
        console.log(this.uploadRes);
        this.photo.retrieveData(jwt, template_name, document_name).subscribe(
          (data) => {
            this.getRes = data;
            console.log(this.getRes);
            this.preview();
          },
          (err) => {
            if (err) {
              this.getResError = err;
              console.log(this.getResError);
              this.preview();
            }
          }
        )
      },
      (err) => {
        if (err) {
          this.uploadResError = err;
          console.log(this.uploadResError);
          this.preview();
        }
      }
    )
  };

  // convert dataURL to Blob
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  // validate form input 
  validateForm() {
    if (this.invoiceID === "") {
      this.inputAlert = "Invoice ID must be provided!";
      return false;
    }
    for (let i = 0; i < this.valueArray.length; i++) {
      if (this.valueArray[i] === "") {
        this.inputAlert = this.fieldArray[i] + " must be provided!";
        return false;
      }
    }
    return true;
  };

  // save pictures in an arrya in order to show in review page
  storePictures() {
    this.captures.push(this.picture);
    this.isShow = true;
    this.previewInfo = [];
    this.unmappedInfo = [];
    this.previewError = undefined;
  };

  // retake a image
  retake() {
    this.isShow = true;
    this.previewInfo = [];
    this.unmappedInfo = [];
    this.previewError = undefined;
  }

  // preview OCR results
  preview() {
    this.previewInfo = [];
    if (this.uploadResError) {
      this.previewError = "Error: Unable to upload to the server. Please try again later!";
      return;
    } else if (this.getResError) {
      this.previewError = "Error: Unable to connect to the server. Please try again later!";
      return;
    } else {
      if ("data" in this.getRes) {
        console.log(this.getRes["data"]);
        let i = 1;
        while ("page_" + i in this.getRes["data"]) {
          const page = this.getRes["data"]["page_" + i];
          if ("Mapped" in page && page["Mapped"][0] != undefined) {
            const fieldsData = page["Mapped"][0];
            console.log(fieldsData);
            let j = 0;
            while ("field_" + j in fieldsData) {
              let text = fieldsData["field_" + j]["Field_Name"] + ":" + fieldsData["field_" + j]["Value"];
              if ("possible_value_group" in fieldsData["field_" + j]) {
                text += " " + fieldsData["field_" + j]["possible_value_group"][0];
              }
              this.previewInfo.push(text);
              j++;
            }
          } 
          if ("Unmapped" in page && page["Unmapped"] !== undefined) {
            const fieldsData = page["Unmapped"]["Fields"];
            console.log("fieldData");
            let text = "";
            let j = 0;
            while (j in fieldsData) {
              if (text.length > 0) {
                text += ", "
              }
              text += fieldsData[j]["field_" + j]["field_value"];
              j++;
            }
            if (text.length > 0) {
              this.unmappedInfo.push(text);
            }
            console.log(this.unmappedInfo);
          }
          i++;
        }
      }
    }
    console.log(this.previewInfo);
    
    if (this.previewInfo.length == 0) {
      this.previewError = "Error: No labelled texts were identified in the image. Please try again!";
    }
  }
}
