import { Component } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'nood';

  private readonly authConfig: AuthConfig = {
    issuer: 'https://dev-ypizy20t.us.auth0.com/',
    redirectUri: 'http://localhost:4200',
    clientId: 'TzjUFvs2J6uDTfbDsJOJa3iKoXvW49wj',
    scope: 'openid profile email offline_access',
    responseType: 'token id_token',
    logoutUrl: 'https://dev-ypizy20t.us.auth0.com/v2/logout',
    loginUrl: 'https://dev-ypizy20t.us.auth0.com/authorize',
    oidc: true,
    customQueryParams: {
      audience: 'https://ascendise.todolistapi.ch'
    }
  };

  constructor(private oauthService: OAuthService)
  {
    this.oauthService.configure(this.authConfig);
    this.oauthService.setStorage(localStorage);
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }
}
