import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, User } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private _user!: User;

  constructor(private profileService: ProfileService, private router: Router) {}

  async ngOnInit() {
    this._user = await this.profileService.getUser();
  }

  public get user() {
    return this._user;
  }

  public async deleteProfile() {
    await this.profileService.deleteUser();
    this.router.navigateByUrl('/');
  }
}
