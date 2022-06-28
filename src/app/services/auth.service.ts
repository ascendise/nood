import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinksService } from './links.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private linksService: LinksService,
    private httpClient: HttpClient) { }

  async getProviders() : Promise<Map<string, string>>
  {
    const links = await this.linksService.getLinks();
    let loginLink = links.get('login');
    if(loginLink === undefined)
    {
      loginLink = '';
    }
    return lastValueFrom(this.httpClient.get<Map<string, string>>(loginLink));
  }

  async isLoggedIn() : Promise<boolean> {
    const links = await this.linksService.getLinks();
    return links.get('logout') !== undefined;
  }
}
