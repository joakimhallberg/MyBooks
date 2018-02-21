import 'bootstrap';
// import {bindable, inject} from 'aurelia-framework';
// import {BookApi} from 'bookapi';
import {inject} from 'aurelia-framework';
import { AuthService} from './services/auth-service';
import { HttpClient } from 'aurelia-fetch-client';
import { AuthorizeStep } from './resources/steps/authorization-step';

@inject (AuthService, HttpClient)
export class App {
  constructor(authService, http) {
    this.authService = authService;
    const baseUrl = 'http://localhost:8333/api/';
    http.configure(config => {
      config.withBaseUrl(baseUrl)
          .withInterceptor({
            request(request) {
              console.log('request', request);
              return request;
            },
            response(response) {
              console.log('response', response);
              return response;
            }
          })
          .withInterceptor(this.authService.tokenInterceptor);
    });
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'my-books';

    let handleUnknkownRoutes = (instruction) => {
      let path = instruction.fragment.toLowerCase();
      if (path.includes('admin')) {
        return './resources/elements/admin-unknown-route.html';
      }
      return './resources/elements/what-happened.html';
    };

    // let step = {
    //   run: (navigationInstruction, next) => {
    //     console.log('pre-activate for module', navigationInstruction.config.moduleId);
    //     return next();
    //   }
    // };
    let authStep = new AuthorizeStep(this.authService);//this.authService.getAuthStep(); //new AuthorizeStep(this.authService);
    config.addAuthorizeStep(authStep);
    //config.addPreActivateStep(step);
    config.map([
      { route: ['', '/', 'home'], name: 'home', moduleId: 'index', title: 'home', nav: true, settings: {icon: 'home', auth: true}, layoutViewModel: 'main-layout'},
      { route: 'books', name: 'books', title: 'books', moduleId: './resources/elements/books', nav: true, settings: {icon: 'book', auth: true}, layoutViewModel: 'main-layout'},
      { route: 'users', name: 'users', title: 'users', moduleId: './resources/elements/users', nav: true, settings: {icon: 'users', auth: true, admin: true}, layoutViewModel: 'main-layout'},
      { route: 'users/:name/details', name: 'user-detail', title: 'user details', moduleId: './resources/elements/user-details', settings: { auth: true, admin: true}, layoutViewModel: 'main-layout'},
      { route: 'legacy-users', redirect: 'users', layoutViewModel: 'mainlayout'},
      { route: 'login', name: 'login', title: 'title', moduleId: './resources/elements/login', layoutView: 'login-layout.html' }
    ]);
    config.mapUnknownRoutes(handleUnknkownRoutes);
  }

  bind() {
    console.log(this.router.navigation);
  }
}
