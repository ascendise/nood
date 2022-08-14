import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinksService, UnauthorizedError, RootLinks } from '../links/links.service';
import { lastValueFrom } from 'rxjs';
import { Link } from '../links/links';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private linksService: LinksService) { }

  async isLoggedIn() : Promise<boolean> {
    const links = await this.linksService.getLinks();
    return !(links instanceof UnauthorizedError)
  }
}
