import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private _identity!: Identity;

  constructor(private profileService: ProfileService, private authService: OAuthService, private router: Router) {}

  async ngOnInit() {
    this._identity = this.authService.getIdentityClaims() as Identity;
  }

  public get identity() {
    return this._identity;
  }

  public async deleteProfile() {
    await this.profileService.deleteUser();
    this.router.navigateByUrl('/');
  }
}

interface Identity {
  given_name: string,
  sub: string,
}
