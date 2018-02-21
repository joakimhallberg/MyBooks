 import {HttpClient, json} from 'aurelia-fetch-client';
 import {inject} from 'aurelia-framework';

 @inject(HttpClient)
 export class UserApi{
   constructor(http) {
     this.http = http;
     const baseUrl = 'http://localhost:8333/api/';

    //  http.configure(config => {
    //   config.withBaseUrl(baseUrl);
    //  });
   }

   loadCountry(countryCode) {
      return this.http.fetch(`countries?code=${countryCode}`)
      .then(response => response.json())
      .then(countries => {
        return countries.length > 0 ? countries[0] : {code: '', name: ''};
      })
    .catch(error => {
        console.log('Error retrieving country.');
    });
   }

   getUser(name){
     return this.http.fetch(`users/${name}`)
          .then(response => response.json())
          .then(user => {
            return user;
          })
          .catch(error => {
            console.log('Error retreiving user.');
          });
   }

   getUsers(){
     return this.http.fetch('users')
        .then(response => response.json())
        .then(users => {
          return users;
        })
        .catch(error => {
          console.log('Error retreiving users.');
        });
   }

   addUser(user){
     return this.http.fetch('users', {
          method: 'post',
          body: json(user)
        })
        .then(response => response.json())
        .then(createdUser => {
          return createdUser;
        })
        .catch(error => {
          console.log('Error adding user');
        });
   }

   deleteUser(user){
     return this.http.fetch(`users/${user.name}`, {
          method: 'delete'
        })
        .then(response => response.json())
        .then(responseMessage => {
          return responseMessage;
        })
        .catch(error => {
          console.log('Error Deleting book');
        });
   }

   saveUser(user){
     return this.http.fetch(`users/${user.name}`, {
          method: 'put',
          body: json(user)
        })
        .then(response => response.json())
        .then(savedUser => {
          return savedUser;
        })
        .catch(error => {
          console.log('Error Deleting book');
        });
   }
 }
