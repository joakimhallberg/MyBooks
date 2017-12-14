import {bindable, computedFrom,  inject} from 'aurelia-framework';
//import {BindingSignaler} from 'aurelia-templating-resources';
import {BookApi} from '../../services/bookapi';
import {EventAggregator} from 'aurelia-event-aggregator';
import _ from 'lodash';

@inject(BookApi, EventAggregator)
export class Books {
  constructor(bookApi, eventAggregator)
  {
    this.bookTitle = ""; 
    this.books = [];
    this.bookApi = bookApi;
    this.eventAggregator = eventAggregator;
  }

  addBook () {
    this.books.push({title : this.bookTitle});
    this.bookTitle = "";
  }

  removeBook(toRemove) {
    let bookIndex = _.findIndex(this.books,  
          book => { 
            return book.Id === remove.Id;
          });
    this.books.splice(bookIndex, 1);
  }

  bind() {
    this.bookApi.getBooks()
    .then(savedBooks =>
      this.books = savedBooks);
  }

  attached() {
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.bookRemoveSubscription = this.eventAggregator
      .subscribe('book-removed', bookIndex => this.removeBook(bookIndex));
    this.bookSaveSubscription = this.eventAggregator
      .subscribe("save-book", book =>
      this.bookSaved(book));
  }

  bookSaved(updateBook) {
    this.bookApi
      .saveBook(updateBook)
      .then((savedBook) =>
        this.eventAggregator.publish(`book-save-complete-${savedBook.Id}`));
  }

  @computedFrom('bookTitle.length')
  get canAdd() {
    return this.bookTitle.length === 0;
  }

  detached() {
    this.bookRemoveSubscription.dispose();
    this.bookSaveSubscription.dispose();
  }

  // @observable bookTitle = "";
  // bookTitleChanged(newValue, oldValue) {
  //   console.log('Book title changed, Old Value, ${0}, New Value, ${1}', oldValue, newValue )
  // }
}
