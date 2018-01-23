import {inject} from 'aurelia-framework';
import {AuthService} from '../../services/auth-service';
import {Router} from 'aurelia-router';
import {BookApi} from '../../services/bookapi';

@inject(Router, AuthService, BookApi)
export class Login {
  constructor(router, authService, bookApi) {
    this.authService = authService;
    this.router = router;
    this.books = bookApi;
  }

  login() {
    // this.books.getBooks().then(books=>{
    //   this.books = books;
    // });
    this.authService.logIn(this.userName, this.password)
        .then(tokenResult => {
          if (tokenResult.success) {
            this.errorMessage = '';
            this.router.navigateToRoute('home');
          } else {
            this.errorMessage = tokenResult.message;
          }
        });
  }
}
