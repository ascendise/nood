import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { routeAnimations } from './animations';
import { AppConfig, AppConfigService } from './services/app-config/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent implements OnInit {
  title = 'nood';

  private config: AppConfig | null = null;

  constructor(
    private oauthService: OAuthService,
    private configService: AppConfigService,
    private contexts: ChildrenOutletContexts
  ) {}

  async ngOnInit(): Promise<void> {
    this.config = await this.configService.loadConfig();
    const authConfig: AuthConfig = {
      issuer: this.config.oauth.issuer,
      redirectUri: this.config.oauth.redirectUri,
      clientId: this.config.oauth.clientId,
      scope: 'openid profile email offline_access',
      responseType: 'token id_token',
      logoutUrl: this.config.oauth.logoutUrl,
      loginUrl: this.config.oauth.loginUrl,
      oidc: true,
      customQueryParams: {
        audience: this.config.oauth.audience,
      },
    };
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  public logout() {
    this.oauthService.logOut({
      returnTo: this.config?.appDomain,
    });
  }

  public isLoggedIn(): boolean {
    return this.oauthService.hasValidIdToken();
  }

  public getRouteAnimationData(): string {
    const animation = this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'] as string;
    return animation;
  }
}
