import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  readonly baseUrl: string = "https://localhost:5051/api/";
  readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
   }

  getLinks(): Observable<Map<string, string>> {
    const links = this.httpClient.get<Map<string, string>>(this.baseUrl);
    return links;
  }
}
