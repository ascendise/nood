import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LinksService, RootLinks } from '../links/links.service';

import { ProfileService, User } from './profile.service';

describe('ProfileService', () => {
  const API_BASE_URI = 'https://todoapi.com';

  let service: ProfileService;
  let linksService: jasmine.SpyObj<LinksService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const linkServiceSpy = jasmine.createSpyObj('LinksService', ['getLinks']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService, { provide: LinksService, useValue: linkServiceSpy }],
    });
    service = TestBed.inject(ProfileService);
    linksService = TestBed.inject(LinksService) as jasmine.SpyObj<LinksService>;
    httpTestingController = TestBed.inject(HttpTestingController);
    const links: RootLinks = {
      tasks: { href: '' },
      checklists: { href: '' },
      relations: { href: '' },
      user: { href: `${API_BASE_URI}/user` }
    }
    linkServiceSpy.getLinks.and.returnValue(Promise.resolve(links));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user information', async () => {
    const user = service.getUser();
    await waitForRequest();
    const expectedUser: User = {
      subject: 'myoauth-subject12345',
      username: 'anon123',
    };
    const request = httpTestingController.expectOne(`${API_BASE_URI}/user`);
    expect(request.request.method).toEqual('GET');
    request.flush(expectedUser);
    expect(await user).toEqual(expectedUser);
    expect(linksService.getLinks).toHaveBeenCalled();
  })

  it('should delete user', async () => {
    const deletionRequest = service.deleteUser();
    await waitForRequest();
    const request = httpTestingController.expectOne(`${API_BASE_URI}/user`);
    expect(request.request.method).toEqual('DELETE');
    request.flush('', { status: 204, statusText: 'No Content' });
    await deletionRequest;
  })

  async function waitForRequest() {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
});
