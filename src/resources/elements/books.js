import {bindable,  inject, observable} from 'aurelia-framework';
import {BindingSignaler} from 'aurelia-templating-resources';
import {BookApi} from '../../services/bookapi';

@inject(BookApi, BindingSignaler)
export class Books {
  constructor(bookApi, bindingSignaler)
  {
    //this.bookTitle = ""; 
    this.books = [];
    this.bookApi = bookApi;
    this.bindingSignaler = bindingSignaler;
  }

  addBook () {
    this.books.push({title : this.bookTitle});
    this.bookTitle = "";
  }

  refreshSignal() {
    this.bindingSignaler.signal('can-add-signal');
  }

  bind() {
    this.bookApi.getBooks().then(savedBooks =>
      this.books = savedBooks);
  }

  //@computedFrom('bookTitle.length')
  canAdd() {
    return this.bookTitle.length === 0;
  }

  @observable bookTitle = "";
  bookTitleChanged(newValue, oldValue) {
    console.log('Book title changed, Old Value, ${0}, New Value, ${1}', oldValue, newValue )
  }
}
