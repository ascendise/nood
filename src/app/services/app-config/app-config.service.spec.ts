import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AppConfig, AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppConfigService]
    });
    service = TestBed.inject(AppConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load values from config.json file', async () => {
    const config = service.loadConfig();
    const expectedConfig: AppConfig = {
      apiBaseUri: 'https://nood.com/api/',
      oauth: {
        issuer: 'https://nood.auth0.com/',
        clientId: 'myClientId12345',
        logoutUrl: 'https://nood.auth0.com/v2/logout',
        loginUrl: 'https://nood.auth0.com/authorize',
        audience: 'https://nood.com'
      }
    };
    const request = httpTestingController.expectOne('/assets/config.json');
    request.flush(expectedConfig);
    expect(await config).toEqual(expectedConfig);
  });
});
