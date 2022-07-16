import { Component, OnInit } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private readonly authConfig: AuthConfig = {
    issuer: 'https://dev-ypizy20t.us.auth0.com',
    redirectUri: 'http://localhost:4200',
    clientId: 'TzjUFvs2J6uDTfbDsJOJa3iKoXvW49wj',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    loginUrl: 'https://dev-ypizy20t.us.auth0.com/authorize'
  }

  constructor(private oauthService: OAuthService)
  {
    this.oauthService.configure(this.authConfig)
  }

  ngOnInit(): void {
  }

  onSignIn() {
    this.oauthService.initCodeFlow()
  }

}
