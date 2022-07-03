import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, of, shareReplay } from 'rxjs';
import { Link } from './links';

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
    const response = await lastValueFrom(this.httpClient.get<LinksResponse>(this.baseUrl));
    const links = response._links
    if(this.includesAllLinks(links))
    {
      this.cachedLinks = links;
    }
    return links;
  }

  private includesAllLinks(links: RootLinks) {
    return links.logout !== undefined;
  }
}

export interface RootLinks {
    login: Link
    tasks?: Link
    checklists?: Link
    relations?: Link
    logout?: Link
}

export interface LinksResponse {
  _links: RootLinks
}
