import {bindable, inject} from 'aurelia-framework';
import {UserApi} from "../../services/userapi";

@inject(UserApi)
export class UserDetails{
  constructor(userApi){
    this.userApi = userApi;
  }

  activate(params, routerConfig){
    this.loadUser(params.name);
  }

  loadUser(name){
    this.userApi.getUser(name).then(fetchedUser =>{
      this.user = fetchedUser;
    });
  }

  saveUser(){
    this.userApi.saveUser(this.user).then(savedUser =>{
      alert("Success saving user");
    })
  }
}
