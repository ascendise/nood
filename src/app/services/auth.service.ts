import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinksService, UnauthorizedError } from './links.service';
import { lastValueFrom } from 'rxjs';
import { Link } from './links';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private linksService: LinksService,
    private httpClient: HttpClient) { }

  async isLoggedIn() : Promise<boolean> {
    const links = await this.linksService.getLinks();
    return links !== UnauthorizedError
  }
}

export interface LoginLinks {
  google: Link
  self: Link
}

export interface LoginResponse {
  _links: LoginLinks
}
