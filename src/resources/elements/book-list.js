import {bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class BookList {
  @bindable books;
  @bindable shelves;
  @bindable genres;

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
  }

  removeBook(index) {
    this.eventAggregator.publish('book-removed', index);
    //this.books.splice(index, 1);
  }

  // bookLocation(isFirst, isLast) {
  //   if (isFirst) return ' - first book';
  //   if (isLast) return ' - last book';
  //   return '';
  // } 

}
