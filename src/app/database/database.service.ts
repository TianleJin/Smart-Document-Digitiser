import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"}),
};


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  // get all invoice records
  getRecords() {
    return this.http.get('/records');
  }

  // get single invoice record using invoice number
  getRecord(invoiceID: string) {
    let url = '/records/' + invoiceID;
    return this.http.get(url);
  }

  // create a new invoice record
  createRecord(data) {
    return this.http.post('/records', data, httpOptions)
  }

  // // update a invoice record
  // updateRecord(invoiceID, data) {
  //   let url = '/records/' + invoiceID;
  //   return this.http.put(url, data, httpOptions);
  // }

  // delete a invoice record
  deleteRecord(invoiceID) {
    let url = '/records/' + invoiceID;
    return this.http.delete(url, httpOptions);
  }

  // create a new photo
  createPhoto(data, invoiceID){
    let url = '/photo/' + invoiceID;
    return this.http.post(url, data);
  }
}
