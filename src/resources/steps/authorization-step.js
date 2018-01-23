import {Redirect} from 'aurelia-router';
//import {AuthService} from '../../services/auth-service';

export class AuthorizeStep {
  constructor(authService) {
    this.authService = authService;
  }

  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions()
          .some(i => i.config.settings.auth)) {
      if (!this.authService.isLoggedIn()) {
        return next.cancel(new Redirect('login'));
      }
    }
    return next();
  }
}
