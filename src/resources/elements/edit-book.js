import {bindable, inject, computedFrom} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BookApi} from '../../services/bookapi';
import _ from 'lodash';

@inject(EventAggregator, BookApi)
export class EditBook{
  @bindable editMode;
  @bindable book;
  @bindable selectedGenre;
  @bindable shelves;
  @bindable genres;
  temporaryBook = {};

  constructor(eventAggregator, bookApi){
    this.eventAggregator = eventAggregator;
    this.ratingChangedListener = e =>
        this.temporaryBook.rating = e.rating; 
    this.saved = false;
    this.bookApi = bookApi;
    this.editingShelves = false;
  }

  bind() {
    this.resetTempBook();
    this.ratingElement.addEventListener("change", this.ratingChangedListener);
    this.selectedGenre = this.genres.find(g => g.id == this.book.genre);
    this.selectedShelves = this.shelves.filter(shelf => 
        this.temporaryBook.shelves.indexOf(shelf.name) != -1);
    
    // this.selectedShelves = this.shelves.filter(shelf =>
    //         this.temporaryBook.shelves.indexOf(shelf) !== -1);

    // this.selectedGenre = this.genres.find(g => g.id == this.book.genre);
  }

  toggleEditShelves(){
    this.editingShelves = !this.editingShelves;
  }

  unToggleEditShelves(){
    this.temporaryBook.shelves = this.selectedShelves;
    this.editingShelves = !this.editingShelves;
  }

  selectedGenreChanged(newValue, oldValue){
    if (!newValue) return;
    this.temporaryBook.genre = newValue._id;
  }

  editModeChanged(editModeNew, editModeOld) {
    if(editModeNew) this.resetTempBook();
  }

  @computedFrom('temporaryBook.title', 'temporaryBook.description', 'temporaryBook.genre', 'temporaryBook.ownACopy', 'saved')
  get canSave(){
    let clean = this.temporaryBook.title == this.book.title &&
                this.temporaryBook.genre == this.book.genre &&
                this.temporaryBook.ownACopy == this.book.ownACopy &&
                this.temporaryBook.description == this.book.description &&
                this.temporaryBook.shelves == this.book.shelves;
    return !clean; // this.temporaryBook && ! _.isEqual(this.temporaryBook, this.book);
  }

  resetTempBook(){
    this.temporaryBook = Object.assign({}, this.book);
  }

  cancel(){
    this.temporaryBook = this.book;
    this.starRatingViewModel.applyRating(this.temporaryBook.rating);
    this.toggleEditMode();
  }

  save(){
    this.loading = true;
    this.publishBookSavedEvent();
  }

  bookSaveComplete(){
    this.loading = false;
    this.saved = true;
    setTimeout(() => {
      this.resetTempBook();
      this.saved = false;
      this.toggleEditMode();
    }, 500);
  }

  publishBookSavedEvent(){
    this.eventAggregator.publish('save-book', this.temporaryBook);
  }

  attached(){
    this.bookSaveCompleteSubscription = this.eventAggregator
      .subscribe(`book-save-complete-${this.book._id}`, () => this.bookSaveComplete());
  }

  toggleEditMode(){
    this.eventAggregator.publish('edit-mode-changed', !this.editMode);
  }

  detached(){
    this.bookSaveCompleteSubscription.dispose();
    this.ratingElement.removeEventListener('change', this.ratingChangedListener);
  }
}
