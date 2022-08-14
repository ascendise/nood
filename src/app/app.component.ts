import { Component } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { AppConfigService } from './services/app-config/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'nood';

  constructor(private oauthService: OAuthService, private configService: AppConfigService)
  {
    this.configService.loadConfig().then(appConfig => {
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

  public login()
  {
    this.oauthService.initLoginFlow();
  }
}
