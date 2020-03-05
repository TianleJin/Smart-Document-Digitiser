import { DatabaseService } from '../databaseservice/database.service';
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

  recordsDB: Array<any> = [];
  outputDB: Array<any> = [];
  extraFields: Array<any> = [];
  allFields: Array<any> = [];
  numberOfField: number = 0;
  fieldJSON;

  popoverTitle: string = "Record Delete Confirmation";
  popoverMessage: string = "Do you want to delete?";
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  private FIELD_PATH = 'assets/field/field.json';

  searchText: string;

  ngOnInit() {
    this.setUpTable();
  }

  // Get all invoices record from database
  onGetRecords() {
    this.dbService.getRecords().subscribe((data:any[])=>{
      this.recordsDB = data;
      for (let i = 0; i < this.recordsDB.length; i++) {
        var obj = this.recordsDB[i];
        obj["array"] = [];
        obj["extra"] = {};
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

  // set up table
  setUpTable() {
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
      this.onGetRecords();    
    });
  }

  // delete invoice record from database
  deleteRecord(invoiceID) {
    this.dbService.deleteRecord(invoiceID).subscribe(result => {this.onGetRecords();
    });
  }

}
