import {bindable} from 'aurelia-framework';

export class BookList {
  @bindable books;

  removeBook(index) {
    this.books.splice(index, 1);
  }

  bookLocation(isFirst, isLast) {
    if (isFirst) return ' - first book';
    if (isLast) return ' - last book';
    return '';
  } 

}
