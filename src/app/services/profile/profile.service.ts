import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LinksService } from '../links/links.service';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  constructor(private httpClient: HttpClient, private linksService: LinksService) { }

  public async getUser(): Promise<User> {
    const links = await this.linksService.getLinks();
    const user = await firstValueFrom(this.httpClient.get<User>(links.user.href));
    return user;
  }
}

export interface User {
  subject: string;
  username: string;
}
