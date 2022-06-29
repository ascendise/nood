import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LinksService {

  private readonly baseUrl: string = 'http://localhost:5051/api/';
  private cachedLinks?: RootLinks

  constructor(private httpClient: HttpClient) { }

  async getLinks(): Promise<RootLinks> {
    if(this.cachedLinks)
    {
      return this.cachedLinks;
    }
    const response = await lastValueFrom(this.httpClient.get<RootLinks>(this.baseUrl));
    if(this.includesAllLinks(response))
    {
      this.cachedLinks = response;
    }
    return response;
  }

  private includesAllLinks(links: RootLinks) {
    return links.logout !== undefined;
  }
}

export interface Link {
  href: string;
}

export class RootLinks {
  constructor(
    public login: Link,
    public tasks?: Link,
    public checklists?: Link,
    public relations?: Link,
    public logout?: Link
  ) {}
}
