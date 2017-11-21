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
    config.map([
      { route: ['', '/', 'home'], name: 'home', moduleId: 'index'},
      { route: ['books'], name: 'books', moduleId: './resources/elements/books'}
    ]);
  }
}
