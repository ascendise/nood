import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinksService } from './links.service';
import { lastValueFrom } from 'rxjs';
import { Link } from './links';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private linksService: LinksService,
    private httpClient: HttpClient) { }

  async getProviders() : Promise<LoginLinks>
  {
    const links = await this.linksService.getLinks();
    const loginLink = links.login.href;
    return (await lastValueFrom(this.httpClient.get<LoginResponse>(loginLink)))._links;
  }

  async isLoggedIn() : Promise<boolean> {
    const links = await this.linksService.getLinks();
    return links.logout !== undefined;
  }
}

export interface LoginLinks {
  google: Link
  self: Link
}

export interface LoginResponse {
  _links: LoginLinks
}
