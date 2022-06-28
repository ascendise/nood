import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  private readonly baseUrl: string = 'https://localhost:5051/api/';
  private cachedLinks: Map<string, string> | null = null;

  constructor(private httpClient: HttpClient) { }

  async getLinks(): Promise<Map<string, string>> {
    if(this.cachedLinks)
    {
      return this.cachedLinks;
    }
    const response = await lastValueFrom(this.httpClient.get<Map<string, string>>(this.baseUrl));
    if(this.includesAllLinks(response))
    {
      this.cachedLinks = response;
    }
    return response;
  }

  private includesAllLinks(links: Map<string, string>) {
    return links.size > 1;
  }
}
