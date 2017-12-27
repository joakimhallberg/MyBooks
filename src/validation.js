import {inject, NewInstance} from 'aurelia-framework';
import {ValidationRules, ValidationController} from "aurelia-validation";
 
@inject(NewInstance.of(ValidationController))
export class App {
 
  message = '';
  firstname = '';
  lastname = '';
 
  constructor(controller) {
    this.controller = controller;
    ValidationRules
      .ensure(m => m.lastname).displayName("Surname").required()
      .ensure(m => m.firstname).displayName("First name").required()
      .on(this);
  }
 
  validateMe() {
    this.controller
      .validate()
      .then(v => {
        if (v.length === 0)
          this.message = "All is good!";
        else
          this.message = "You have errors!";
      })
  }
}
