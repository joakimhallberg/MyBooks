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
    this.bookApi.addBook({title: this.bookTitle }).then(createdBook => {
      this.books.push(createdBook);
      this.bookTitle = "";
    });
  }

  removeBook(toRemove) {
    this.bookApi.deleteBook(toRemove).then(() => {
      let bookIndex = _.findIndex(this.books,  
            book => { 
              return book._id === toRemove._id;
            });
      this.books.splice(bookIndex, 1);
    })
  }

  bind() {
    this.loadBooks();
    this.loadGenres();
    this.loadShelves();
  }

  loadBooks(){
    this.bookApi.getBooks()
    .then(books => {
      this.books = books; 
    });
  }

  loadGenres(){
    this.bookApi.getGenres()
      .then( genres =>{
        this.genres = genres;
      });
  }
  
  loadShelves(){
    this.bookApi.getShelves()
      .then( shelves =>{
        this.shelves = shelves;
      });
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
