import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import { Link } from './links';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private cachedLinks?: RootLinks;

  constructor(private httpClient: HttpClient, private config: AppConfigService) {}

  async getLinks(): Promise<RootLinks | UnauthorizedError> {
    const baseUri = (await this.config.loadConfig()).apiBaseUri;
    if (this.cachedLinks) {
      return this.cachedLinks;
    }
    const response = await lastValueFrom(this.httpClient.get<HttpResponse<LinksResponse>>(baseUri));
    if (response.status == 401 || response.body == null) {
      return new UnauthorizedError();
    }
    const links = response.body._links;
    this.cachedLinks = links;
    return links;
  }
}

export class UnauthorizedError extends Error {}

export interface RootLinks {
  tasks: Link;
  checklists: Link;
  relations: Link;
}

export interface LinksResponse {
  _links: RootLinks;
}
