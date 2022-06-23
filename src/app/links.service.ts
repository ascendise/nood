import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private readonly baseUrl: string = "https://localhost:5051/api/";
  private readonly httpClient: HttpClient;
  private cachedLinks: Observable<Map<string, string>> | null = null;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
   }

  getLinks(): Observable<Map<string, string>> {
    if(this.cachedLinks)
    {
      return this.cachedLinks;
    }
    const response = this.httpClient.get<Map<string, string>>(this.baseUrl)
    .pipe(
      shareReplay(1)
    )
    response.subscribe((values: Map<string, string>) => {
      if(this.includesAllLinks(values))
      {
        this.cachedLinks = response;
      }
    });
    return response;
  }

  private includesAllLinks(links: Map<string, string>) {
    return links.size > 1;
  }
}
