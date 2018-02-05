import {bindable, inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {ShareBook} from './share-book';

@inject(EventAggregator, DialogService)
export class Book {
  @bindable book;
  @bindable shelves;
  @bindable genres;
  @bindable searchTerm;

  constructor (eventAggregator, dialogService) {
    this.eventAggregator = eventAggregator;
    this.editMode = false;
    this.dialogService = dialogService;
  }

  markRead() {
    this.book.readDate = new Date();
    this.book.read = true;
  }

  removeBook() {
    this.eventAggregator.publish('book-removed', this.book);
  }

  toggleEditMode(event) {
    this.editMode = !this.editMode;
  }

  bind() {
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.editModeChangeSubscription = this.eventAggregator.subscribe(
      'edit-mode-changed', mode => {
        this.editMode = mode;
      });
  }

  share() {
    this.dialogService.open(
      { viewModel: ShareBook,
        model: this.book }
    )
    .whenClosed(response => {});
  }

  unbind() {
    this.editModeChangeSubscription.dispose();
  }
}
