import { HttpClient, HttpResponse } from '@angular/common/http';
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

  async getLinks(): Promise<RootLinks| UnauthorizedError> {
    if(this.cachedLinks)
    {
      return this.cachedLinks;
    }
    const response = await lastValueFrom(this.httpClient.get<HttpResponse<LinksResponse>>(this.baseUrl));
    if(response.status == 401 || response.body == null)
    {
      return new UnauthorizedError();
    }
    const links = response.body._links;
    this.cachedLinks = links;
    return links;
  }
}

export class UnauthorizedError extends Error {
}

export interface RootLinks {
    tasks?: Link
    checklists?: Link
    relations?: Link
}

export interface LinksResponse {
  _links: RootLinks
}
