import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinksService } from './links.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly linksService: LinksService;
  private readonly httpClient: HttpClient;

  constructor(linksService: LinksService, httpClient: HttpClient) {
    this.linksService = linksService;
    this.httpClient = httpClient;
   }

  async getProviders() : Promise<Map<string, string>>
  {
    const links = await this.linksService.getLinks();
    let loginLink = links.get("login");
    if(loginLink === undefined)
    {
      loginLink = "";
    }
    return await lastValueFrom(this.httpClient.get<Map<string, string>>(loginLink));
  }
}
