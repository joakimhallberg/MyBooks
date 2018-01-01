import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class BookApi {
  constructor(http) {
    this.http = http;
    const baseUrl = 'http://localhost:8333/api/';

    http.configure(config => {
      config.withBaseUrl(baseUrl)
        .withInterceptor({
          request(request){
            console.log("request", request);
            return request;
          },
          response(response) {
            console.log("response", response);
            return response;
          }
        });
    })
    //this.simulateFetchLatency = 500;
  }

  getBooks() {
    return this.http.fetch('books')
      .then(response => response.json())
      .then(books => {
        return books;
      })
      .catch(error => {
        console.log('Error retreiving books');
        return [];
      });
  }

  getShelves(){
    return this.http.fetch('shelves')
      .then(response => response.json())
      .then(shelves => {
        return shelves;
      })
      .catch(error => {
        console.log('Error retreiving shelves');
        return [];
      });
    // let shelves = ['Classics', 'Want to read', 'Research', 'For the kids']
    // return this.simulateFetch(shelves);
  }

  getGenres(){
    return this.http.fetch('genres')
      .then(response => response.json())
      .then(genres => {
        return genres;
      })
      .catch(error => {
        console.log('Error retreiving genres');
        return [];
      });
  }

  addBook(book) {
    return this.http.fetch('books', {
      method: 'post',
      body: json(book)
    })
    .then(repsonse => response.json())
    .then(createdBook => {
      return createdBook;
    })
    .catch(error => {
      console.log('Error adding book');
      return [];
    });
  }

  deleteBook(book) {
    return this.http.fetch(`book/${book._id}`,{
      method: 'delete'
    })
    .then(response => respose.json())
    .then(response => {
      return responseMessage;
    })
    .catch(error => {
      console.log('Error deleting book.')
    })
  }

  saveBook(book) {
    return this.http.fetch(`book/${book._id}`, {
      method: 'put',
      body: json(book)
    })
    .then(repsonse => response.json())
    .then(savedBook => {
      return savedBook;
    })
    .catch(error => {
      console.log('Error saving book');
      return [];
    });
  }

  simulateFetch(fetchResult){
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(fetchResult);
      }, this.simulateFetchLatency);
    });
  }
}
