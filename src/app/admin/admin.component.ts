import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';
import { SettingService } from '../setting/setting.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '@app/_models';
import { UserService } from '@app/user/user.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  loading = false;
  users: User[] = [];
  style;
  images;
  section;
  isLogoSubmit = false;
  isColorSubmit = false;
  isFieldSubmit = false;

  closeResult: string;

  // openSm(content) {
  //   this.modalService.open(content, { size: 'sm' });
  // }

  popLogo(content1, content2) {
    if (this.isLogoSubmit) {
      this.modalService.open(content1, { size: 'sm' });
    } else {
      this.modalService.open(content2, { size: 'sm' });
    }
  }

  popColor(content1, content2) {
    if (this.isColorSubmit) {
      this.modalService.open(content1, { size: 'sm' });
    } else {
      this.modalService.open(content2, { size: 'sm' });
    }
  }

  popField(content) {
    console.log("popField is called");
    
    if (this.isFieldSubmit) {
      console.log("isFieldSubmit is true");
      
      this.modalService.open(content, { size: 'sm' });
    } else {
      console.log("isFieldSubmit is false");
      
    }
  }

  constructor(
    private userService: UserService, 
    private setting: SettingService, 
    private formBuilder: FormBuilder,
    private modalService: NgbModal) { };

  ngOnInit() {
    this.setting.currentStyle.subscribe(style => this.style = style);
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
    });
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
      this.isLogoSubmit = true;
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

    const newStyle = {
        background: bgColor,
        color: linkColor
    }
    console.log(newStyle);
    this.setting.changeStyle(newStyle);

    this.setting.setColor({
      'background': bgColor,
      'color': linkColor
    }).subscribe((res) => {
      
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

  // Below is for setting fields
  dynamicForm: FormGroup;
  submitted = false;

  // convenience getters for easy access to form fields
  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.fields as FormArray; }

  onChangeFields(e) {
    // if(e.target.value && e.target.value === 0) {
    //   this.isFieldSubmit = true;
    // }
    const numberOfFields = e.target.value || 0;
    if (this.t.length < numberOfFields) {
        for (let i = this.t.length; i < numberOfFields; i++) {
            this.t.push(this.formBuilder.group({
                name: ['', Validators.required]
                //email: ['', [Validators.required, Validators.email]]
            }));
        }
    } else {
        for (let i = this.t.length; i >= numberOfFields; i--) {
            this.t.removeAt(i);
        }
    }
  }

  onSubmitFields() {
    this.submitted = true;
    console.log(this.isFieldSubmit);
    // console.log("onSubmitFields is called");
    // if (this.t.length === 0) {
    //   this.isFieldSubmit = true;
    //   console.log(this.isFieldSubmit);
    // } else {
    //   this.isFieldSubmit = false;
    // }
    
    //this.isFieldSubmit = false;

    // stop here if form is invalid
    if (this.dynamicForm.invalid) {
      return;
    } 

    // display form values on success
    alert("Fields have been changed");
    
    // save values on server
    this.setting.setFields(this.dynamicForm.value).subscribe((res) => console.log(res));
  }

  onReset() {
    // reset whole form back to initial state
    this.submitted = false;
    this.dynamicForm.reset();
    this.t.clear();
  }

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
  }
}
