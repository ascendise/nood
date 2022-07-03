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
    return lastValueFrom(this.httpClient.get<LoginLinks>(loginLink));
  }

  async isLoggedIn() : Promise<boolean> {
    const links = await this.linksService.getLinks();
    return links.logout !== undefined;
  }
}

export class LoginLinks {
  constructor(
    public google: Link,
    public self: Link
  ) {}
}
