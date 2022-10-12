import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import { Link } from './links';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  private cachedLinks?: RootLinks;

  constructor(private httpClient: HttpClient, private config: AppConfigService) {}

  async getLinks(): Promise<RootLinks> {
    const baseUri = (await this.config.loadConfig()).apiBaseUri;
    if (this.cachedLinks) {
      return this.cachedLinks;
    }
    const response = await firstValueFrom(this.httpClient.get<LinksResponse>(baseUri)).catch(
      (err: HttpErrorResponse) => {
        if (err.status === 401) {
          throw new UnauthorizedError();
        }
        throw err;
      }
    );
    const links = response._links;
    this.cachedLinks = links;
    return links;
  }
}

export class UnauthorizedError extends Error {}

export interface RootLinks {
  tasks: Link;
  checklists: Link;
  relations: Link;
  user: Link;
}

export interface LinksResponse {
  _links: RootLinks;
}
