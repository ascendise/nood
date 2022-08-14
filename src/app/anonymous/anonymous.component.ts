import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html',
  styleUrls: ['./anonymous.component.scss']
})
export class AnonymousComponent implements OnInit {

  constructor(private authService: OAuthService) { }

  ngOnInit(): void {
  }

  public login() {
    this.authService.initLoginFlow();
  }

}
