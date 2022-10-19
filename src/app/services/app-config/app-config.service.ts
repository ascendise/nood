import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private static readonly configFile = '/assets/config.json';

  constructor(private client: HttpClient) {}

  async loadConfig(): Promise<AppConfig> {
    return firstValueFrom(this.client.get<AppConfig>(AppConfigService.configFile));
  }
}

export interface AppConfig {
  apiBaseUri: string;
  oauth: OAuthConfig;
}

export interface OAuthConfig {
  issuer: string;
  redirectUri: string;
  clientId: string;
  logoutUrl: string;
  loginUrl: string;
  audience: string;
}
