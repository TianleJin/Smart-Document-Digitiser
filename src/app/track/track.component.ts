import { DatabaseService } from '../database/database.service';
import { Component, OnInit } from '@angular/core';
//import fieldsJSON from "../../assets/field/field.json"
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../setting/setting.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {

  constructor(private dbService: DatabaseService, private http:HttpClient, private setting: SettingService) { }

  recordsDB: any[] = [];
  outputDB: any[] = [];
  extraFields: any[] = [];
  allFields: any[] = [];
  numberOfField;
  fieldJSON;

  
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
        //var copy = Object.assign({}, obj["extra"]);
        //console.log("copy");
        //console.log(copy);
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
    this.setting.getFields().subscribe((res) => {
      this.allFields = ["invoiceID", "recordDate"];
      this.fieldJSON = res;
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
    this.dbService.deleteRecord(invoiceID).subscribe(result => {this.onGetRecords();});
    
  }

}
