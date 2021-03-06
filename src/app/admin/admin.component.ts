
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingService } from '../settingservice/setting.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  style:any;
  images:any;
  section:number;
  isLogoSubmit:boolean = false;
  isColorSubmit:boolean = false;
  isFieldSubmit:boolean = false;

  closeResult: string;

  // file path
  private COLOR_PATH = 'assets/color/color.json';

  constructor(
    private setting: SettingService, 
    private formBuilder: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService) { };
    
  ngOnInit() {
    this.setting.currentStyle.subscribe(style => this.style = style);
    this.dynamicForm = this.formBuilder.group({
      numberOfFields: ['', Validators.required],
      fields: new FormArray([])
    });
    this.section = 1;
  }

  // allow user to selcet an image 
  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      if (this.images.type.includes('png') || this.images.type.includes('jpeg') || this.images.type.includes('jpg')) {
        this.isLogoSubmit = true;
      } 
    }
  }

  // upload selected image
  onSubmit(){
    const formData = new FormData();
    formData.append('file', this.images);
    this.setting.uploadImage(formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  changeBg(bgColor) {
    if (bgColor) {
      this.isColorSubmit = true;
    }
    const linkColor = this.linkColor(bgColor);
    this.setting.setColor({
      'background': bgColor,
      'color': linkColor
    }).subscribe((res) => {});
  }

  linkColor(color) {
    let rgba = color.slice(5, color.length - 1).split(',');
    if (parseInt(rgba[0]) * 0.299 + parseInt(rgba[1]) * 0.587 + parseInt(rgba[2]) * 0.114 < 150) {
        return 'rgba(255,255,255,1)';
    } else {
        return 'rgba(0,0,0,1)';
    }
  }

  // Below is for setting fields
  dynamicForm: FormGroup;
  submitted = false;

  // convenience getters for easy access to form fields
  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.fields as FormArray; }

  onChangeFields(e) {
    const numberOfFields = e.target.value || 0;
    if (this.t.length < numberOfFields) {
        for (let i = this.t.length; i < numberOfFields; i++) {
            this.t.push(this.formBuilder.group({
                name: ['', Validators.required]
            }));
        }
    } else {
        for (let i = this.t.length; i >= numberOfFields; i--) {
            this.t.removeAt(i);
        }
    }
      
    if (this.t.valid) {
      this.isFieldSubmit = true;
    } 
    else {
      this.isFieldSubmit = false;
    }
    
  }

  onSubmitFields() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      return;
    } 
    // display form values on success
    this.isFieldSubmit = true;
    // save values on server
    this.setting.setFields(this.dynamicForm.value).subscribe((res) => console.log(res));
  }

  // reset fields
  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.dynamicForm.reset();
    this.t.clear();
  }

  // clear fields input
  onClear() {
    // clear errors and reset fields
    this.submitted = false;
    this.t.reset();
  }

  changeSection(section){
    this.section = section;
    this.isLogoSubmit = false;
    this.isColorSubmit = false;
    this.isFieldSubmit = false;
    this.onReset();
  }

  reloadPage(){
    var location = window.location;
    console.log(location.origin);
    location.assign(location.origin);
  }
}
