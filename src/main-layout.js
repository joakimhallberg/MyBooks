import {Router} from 'aurelia-router';
import {inject, bindable} from 'aurelia-framework';

@inject(Router)
export class MainLayout {
  @bindable router;
  constructor(router) {
    this.router = router;
  }
}
