import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { firstValueFrom } from 'rxjs';
import { LinksService } from '../links/links.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient, private linksService: LinksService, private oauthService: OAuthService) {}

  public async getUser(): Promise<User> {
    const links = await this.linksService.getLinks();
    const user = await firstValueFrom(this.httpClient.get<User>(links.user.href));
    return user;
  }

  public async deleteUser() {
    const links = await this.linksService.getLinks();
    await firstValueFrom(this.httpClient.delete(links.user.href));
    this.oauthService.logOut();
  }
}

export interface User {
  subject: string;
}
