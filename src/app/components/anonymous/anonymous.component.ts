import { AfterViewChecked, Component } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html',
  styleUrls: ['./anonymous.component.scss'],
})
export class AnonymousComponent implements AfterViewChecked {
  constructor(private authService: OAuthService, private router: Router) {}

  ngAfterViewChecked(): void {
    if (this.authService.hasValidIdToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  public login() {
    this.authService.initLoginFlow();
  }
}
