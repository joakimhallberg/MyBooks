import {bindable, inject, computedFrom, NewInstance} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BootstrapFormRenderer} from '../../renderers/bootstrap-form-renderer';
import {BookApi} from '../../services/bookapi';
import {ValidationRules, ValidationController} from 'aurelia-validation';
import _ from 'lodash';

@inject(EventAggregator, BookApi, NewInstance.of(ValidationController))
export class EditBook{
  @bindable editMode;
  @bindable book;
  @bindable selectedGenre;
  @bindable shelves;
  @bindable genres;
  temporaryBook = new Book();

  constructor(eventAggregator, bookApi, validationController){
    //this.resetTempBook();
    this.eventAggregator = eventAggregator;
    this.validationController = validationController;
    this.validationController.addRenderer(new BootstrapFormRenderer());

    this.ratingChangedListener = e =>
        this.temporaryBook.rating = e.rating; 
    this.saved = false;
    this.bookApi = bookApi;
    this.editingShelves = false;


    ValidationRules.customRule('zeroOrPositiveInteger', 
    (value, obj) => value === null || value === undefined || (Number.isInteger(value) || value >= 0),
    `Books can only be read 0 or more times.`
    );

    //this.validationController.addObject(this, ValidationRules);
    this.rules = ValidationRules
      .ensure('title').required()
      .ensure('timesRead').required().satisfiesRule('zeroOrPositiveInteger').rules;

    this.validationController.addObject(this.temporaryBook, this.rules);
  }

  bind() {
    this.resetTempBook();
    this.ratingElement.addEventListener("change", this.ratingChangedListener);
    // this.selectedShelves = this.shelves.filter(shelf => this.temporaryBook.shelves.indexOf(shelf) !== -1);
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
    this.temporaryBook.genre = newValue.id;
  }

  editModeChanged(editModeNew, editModeOld) {
    if(editModeNew) this.resetTempBook();
  }

  @computedFrom('temporaryBook.title', 'temporaryBook.description', 'temporaryBook.genre', 
  'temporaryBook.ownACopy', 'saved', 'temporaryBook.timesRead')
  get canSave(){
    if(!this.temporaryBook.id) return false;
    return this.isDirty();
    // let clean = this.temporaryBook.title == this.book.title &&
    //             this.temporaryBook.genre == this.book.genre &&
    //             this.temporaryBook.ownACopy == this.book.ownACopy &&
    //             this.temporaryBook.description == this.book.description &&
    //             this.temporaryBook.shelves == this.book.shelves;
    // return !clean; // this.temporaryBook && ! _.isEqual(this.temporaryBook, this.book);
  }
  
  isDirty(){    
      let differences = [];
      _.forOwn(this.temporaryBook, (value, key) => {
          return differences.push({different : this.book[key] != value, key : key} ); 
      });

      return differences.filter(d => d.different).length > 0;
  }

  resetTempBook(){
    this.temporaryBook = Object.assign({}, this.book);
  }

  cancel(){
    let book = Object.assign(new Book(), this.book);
    this.temporaryBook = book;
    this.starRatingViewModel.applyRating(this.temporaryBook.rating);
    this.toggleEditMode();
  }

  save(){
    this.validationController.validate()
        .then(result => {
          if (result.valid) {
            this.loading = true;
            this.publishBookSavedEvent();
          }
        });
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
      .subscribe(`book-save-complete-${this.book.Id}`, () => this.bookSaveComplete());
  }

  toggleEditMode(){
    this.eventAggregator.publish('edit-mode-changed', !this.editMode);
  }

  detached(){
    this.bookSaveCompleteSubscription.dispose();
    this.ratingElement.removeEventListener('change', this.ratingChangedListener);
  }
}

export class Book {
  title = '';
  description = '';
  timesRead = 0;
  shelves = [];
}




// ValidationRules.customRule(
//   'zeroOrPositiveInteger',
//   (value, obj) => value === null || value === undefined 
//     || (Number.isInteger(value) || value >= 0),
//   `Books can only be read 0 or more times.` 
// );

// ValidationRules
//   .ensure(a => a.title).required()
//   .ensure('timesRead')
//   .required()
//   .satisfiesRule('zeroOrPositiveInteger')
//   .on(Book);
