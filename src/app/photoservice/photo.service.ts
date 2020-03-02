import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  // Url of API
  jwtUrl: string = "https://niaieservices.us.evoncloud.com/api/Authenticator/authenticate_users";
  uploadUrl: string = "https://niaieservices.us.evoncloud.com/api/UU/process_document";
  infoUrl: string = "https://niaieservices.us.evoncloud.com/api/Fetch/get_document_data";
  
  // Username and password
  loginInfo: Object = {
    "username": "user",
    "password": "user"
  };
  
  constructor(private http: HttpClient) { }

  getJwt() {
    return this.http.post(this.jwtUrl, this.loginInfo);
  }

  uploadImage(jwt: any, template_name: string, image: any, document_name: string) {
    let data = new FormData();
    data.append("pdf_file", image, document_name);
    return this.http.post(this.uploadUrl, data, {
      params: {
        jwt: jwt,
        template_name: template_name
      }
    })
  }

  retrieveData(jwt: any, template_name: string, document_name: string) {
    return this.http.get(this.infoUrl, {
      params: {
        jwt: jwt,
        template_name: template_name,
        document_name: document_name
      }
    });
  }
}