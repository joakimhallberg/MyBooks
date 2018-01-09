import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class Layout {
  @bindable router;
  contructor(router){
    this.router = router;
  }
}
