import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private readonly baseUrl: string = "https://localhost:5051/api/";
  private readonly httpClient: HttpClient;
  private cachedLinks: Map<string, string>;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.cachedLinks = new Map<string, string>();
   }

  getLinks(): Observable<Map<string, string>> {
    if(this.cachedLinks.size > 0)
    {
      return of(this.cachedLinks);
    }
    const response = this.httpClient.get<Map<string, string>>(this.baseUrl);
    response.subscribe((links: Map<string, string>) =>{
      this.cachedLinks = new Map([...this.cachedLinks, ...links]);
    });
    return response;
  }
}
