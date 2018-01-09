import 'bootstrap';
// import {bindable, inject} from 'aurelia-framework';
// import {BookApi} from 'bookapi';

//@inject (BookApi)
export class App {
  // constructor(bookApi) {
  //   //this.message = 'Hello World!';
  //   this.books = [];
  //   this.bookTitle = "";
  //   this.bookApi = bookApi;
  // }

  // constructor() {

  // }

  // addBook () {
  //   this.books.push({title : this.bookTitle});
  //   this.bookTitle = "";
  //   console.log("Book List", this.books);
  // }

  // bind() {
  //   this.bookApi.getBooks().then(savedBooks =>
  //     this.books = savedBooks);
  // }

  configureRouter(config, router) {
    this.router = router;
    config.title = 'my-books';
    var handleUnknkownRoutes = (instruction) => {
      let path = instruction.fragment.toLoweerCase();
      if (path.includes('admin'))
        return './resources/elements/admin-unknown-route.html';
      return './resources/elements/what-happened.html';
    }
    var step = {
      run : (navigationInstruction, next) => {
        console.log("pre-acivate for module", navigationInstruction.config.moduleId);
        return next();
      }
    }
    config.addPreActivateStep(step);
    config.map([
      { route: ['', '/', 'home'], name: 'home', moduleId: 'index', title:'home', nav: true, settings: {icon:'home'}, layoutViewModel: 'main-layout'},
      { route: 'books', name: 'books', title:'books', moduleId: './resources/elements/books', nav:true, settings: {icon:'book'}, layoutViewModel: 'main-layout'},
      { route: 'users', name: 'users', title:'users', moduleId: './resources/elements/users', nav:true, settings: {icon:'users'}, layoutViewModel: 'main-layout'},
      { route: 'users/:name/details', name: 'user-detail', title:'user details', moduleId: './resources/elements/user-details', layoutViewModel: 'main-layout'},
      { route: 'legacy-users', redirect: 'users', layoutViewModel: 'main-layout'},
      { route: 'login', name: 'login', moduleId: './resources/elements/login', layoutViewModel: 'login-layout.html' }
    ]);
    config.mapUnknownRoutes(handleUnknkownRoutes);
  }

  bind(){
    console.log(this.router.navigation);
  }
}
