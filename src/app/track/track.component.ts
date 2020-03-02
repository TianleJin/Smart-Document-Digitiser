import { DatabaseService } from '../database/database.service';
import { Component, OnInit } from '@angular/core';
//import fieldsJSON from "../../assets/field/field.json"
import { HttpClient } from '@angular/common/http';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  constructor(private dbService: DatabaseService, private http:HttpClient, public ngxSmartModalService: NgxSmartModalService) { }

  // icons
  faSearch = faSearch;

  recordsDB: any[] = [];
  outputDB: any[] = [];
  extraFields: any[] = [];
  allFields: any[] = [];
  numberOfField;
  fieldJSON;

  popoverTitle: string = "Record Delete Confirmation";
  popoverMessage: string = "Do you want to delete?";
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  private FIELD_PATH = 'assets/field/field.json';

  searchText: string;

  
  ngOnInit() {
    this.setUpList();
    this.onGetRecords();
  }

  onGetRecords() {
    this.dbService.getRecords().subscribe((data:any[])=>{
      this.recordsDB = data;
      for (let i = 0; i < this.recordsDB.length; i++) {
        var obj = this.recordsDB[i];
        // this.dbService.getFiles(obj.invoiceID).subscribe((data:any[]) => {
        //   obj['pictures'] = data;
        // })
        obj["isCollapsed"] = true;
        obj["array"] = [];
        for (let i = 0; i < this.numberOfField; i ++) {
          if (obj["extra"][this.extraFields[i]]) {
            obj["array"].push(obj["extra"][this.extraFields[i]]);
          } else {
            obj["array"].push("");
          }
        }
      }
    });
  }

  setUpList() {
    this.http.get(this.FIELD_PATH).subscribe((content) => {
      this.allFields = ["invoiceID", "recordDate"];
      this.fieldJSON = content;
      this.numberOfField = this.fieldJSON["numberOfFields"];
      let fieldObj = this.fieldJSON["fields"];
      for (let j = 0; j < this.numberOfField; j++) {
        this.allFields.push(fieldObj[j].name);
        this.extraFields.push(fieldObj[j].name);
      }
      this.allFields.push("status");
      this.allFields.push("comments");      
    });
  }

  deleteRecord(invoiceID) {
    this.dbService.deleteRecord(invoiceID).subscribe(result => {this.onGetRecords();
    });
  }

}
