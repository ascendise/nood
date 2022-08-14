import { Component } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { AppConfig, AppConfigService } from './services/app-config/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'nood';

  private config: AppConfig | null = null;

  constructor(private oauthService: OAuthService, private configService: AppConfigService)
  {
    this.configService.loadConfig().then(appConfig => {
      this.config = appConfig;
      const authConfig: AuthConfig = {
        issuer: appConfig.oauth.issuer,
        redirectUri: appConfig.oauth.redirectUri,
        clientId: appConfig.oauth.clientId,
        scope: 'openid profile email offline_access',
        responseType: 'token id_token',
        logoutUrl: appConfig.oauth.logoutUrl,
        loginUrl: appConfig.oauth.loginUrl,
        oidc: true,
        customQueryParams: {
          audience: appConfig.oauth.audience
        }
      }
      this.oauthService.configure(authConfig);
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
    });
  }

  public logout()
  {
    this.oauthService.logOut(
      {
        returnTo: this.config?.appDomain
      }
    );
  }

  public isLoggedIn(): boolean {
    return this.oauthService.hasValidIdToken();
  }
}
