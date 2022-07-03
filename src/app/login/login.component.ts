import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private google: string = "";
  public get googleLink() {
    return this.google;
  }

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    const providers = await this.authService.getProviders();
    this.google = providers.google.href;
  }

}
