class Router {

  constructor(port) {
    this.port = port;
    this.routes = {};
  }

  set404(html) { //sets a custom 404 page

  }


  get(route, callback) {
    if (route in this.routes) {
      
    }
  }

  post(route, callback) { 

  }


  start() {
    const http = require('http');

    http.createServer((request, response) => {

    });
  }

}

