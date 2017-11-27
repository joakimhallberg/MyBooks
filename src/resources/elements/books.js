import {bindable, computedFrom, inject, observable} from 'aurelia-framework';
import {BookApi} from '../../services/bookapi';

@inject(BookApi)
export class Books {
  constructor(bookApi)
  {
    //this.bookTitle = ""; 
    this.books = [];
    this.bookApi = bookApi;
  }

  addBook () {
    this.books.push({title : this.bookTitle});
    this.bookTitle = "";
  }

  bind() {
    this.bookApi.getBooks().then(savedBooks =>
      this.books = savedBooks);
  }

  @computedFrom('bookTitle.length')
  get canAdd() {
    return this.bookTitle.length === 0;
  }

  @observable bookTitle = "";
  bookTitleChanged(newValue, oldValue) {
    console.log('Book title changed, Old Value, ${0}, New Value, ${1}', oldValue, newValue )
  }
}
