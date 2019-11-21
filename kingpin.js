//(C)Zavexeon 2019

//basic error reporting, may add line number later
const error = (errorText) => {
  console.log(`kingpin (error): ${errorText}`);
  process.exit();
}


//Router class is access point for user functions
class Router {

  constructor(port) {
    this.port = port;
    this.routes = {}; //static routes
    this.dynamicRoutes = {}; //dynamic routes 
    this.pageNotFound = undefined;
    this.onRequest = undefined;
  }


  //pushLog calls onLog everytime it is called
  _pushLog(type, route, ip, body = null) {
    const d = new Date();

    var requestData = {
      type: type, //GET, POST, 
      route: route,
      date: `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`,
      time: `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
      ip: ip, //ip from which request was made
      body: body
    }

    this.onRequest(requestData);
    return requestData;
  }


  //adds new route to router after checking it
  _addRoute(route, type, callback) {
    if (route in this.routes) {
      error(`route ${route} already exists`);
    } else {
      if (/{(.*)}/g.test(route)) { //tests if the route is dynamic
        if (route in this.dynamicRoutes) {
          error(`dynamic route ${route} already exists`);
        } else {
          let paramNames = [];

          route.split('/').forEach((item, index) => {
            if (/({.*})/g.test(item)) {
              paramNames.push(item.replace('{', '').replace('}', ''));
            }
          });

          this.routes[`/${route.split('/')[1]}`] = { dynamicRoute: route };
          this.dynamicRoutes[route] = { type: type, callback: callback, paramNames: paramNames };
        }
      } else {
        this.routes[route] = { type: type, callback: callback };
      }
    }
  }


  //methods to create handles for different requests 
  //basic GET request to retrieve info from server 
  get(route, callback) {
    this._addRoute(route, 'GET', callback);
  }
  //basic POST request to add data to the server
  post(route, callback) {
    this._addRoute(route, 'POST', callback);
  }
  //basic PUT request to add data to server (if data already exists, does not duplicate it like a POST request would)
  put(route, callback) {
    this._addRoute(route, 'PUT', callback);
  }
  //basic DELETE request to delete data from server
  delete(route, callback) {
    this._addRoute(route, 'DELETE', callback);
  }


  start() {
    const http = require('http');

    http.createServer((req, res) => {

      const request = {
        //redirects request to another uri
        redirect: (uri) => {
          res.writeHead(302, { Location: uri });
          res.end();
        },
        //client object contains info about the well, client
        client: {
          ip: undefined
        },


        respond: {
          //sets head
          _head: (code, contentType, imageSrc = null) => {
            let finalContentType = ''

            //properly sets content-type
            if (contentType === 'html') {
              finalContentType = 'text/html';
            } else if (contentType === 'text') {
              finalContentType = 'text/plain';
            } else if (contentType === 'image') {
              let imgExt = imageSrc.split('.').pop();
              finalContentType = `image/${imgExt}`;
            } else if (contentType === 'css') {
              finalContentType = 'text/css';
            } else if (contentType === 'js') { 
              finalContentType = 'text/javascript';
            } else {
              error(`${contentType} is not a valid content the head`);
            }

            res.writeHead(code, { 'content-type': finalContentType });
          },


          //writes to the webpage, formatting depends on the head specified
          _write: (string) => {
            res.write(string);
          },

          //public methods for the user 
          html: (htmlString, code = 200) => {
            request.respond._head(code, 'html');
            request.respond._write(htmlString);
            res.end();
          },

          htmlFile: (src, code = 200) => {
             request.respond._head(code, 'html');

             const fs = require('fs');
             let htmlFileContents = fs.readFileSync(src, 'utf8');
             
             request.respond._write(htmlFileContents);
             res.end();
          },

          js: (jsString, code = 200) => {
            request.respond._head(code, 'js');
            request.respond._write(jsString);
            res.end();
          },

          jsFile: (src, code = 200) => {
             request.respond._head(code, 'js');

             const fs = require('fs');
             let jsFileContents = fs.readFileSync(src, 'utf8');
             
             request.respond._write(jsFileContents);
             res.end();
          },

          css: (cssString, code = 200) => {
            request.respond._head(code, 'css');
            request.respond._write(cssString);
            res.end();
          },

          cssFile: (src, code = 200) => {
             request.respond._head(code, 'css');

             const fs = require('fs');
             let cssFileContents = fs.readFileSync(src, 'utf8');
             
             request.respond._write(cssFileContents);
             res.end();
          },

          //serves static image from filepath
          image: (filePath, code = 200) => {
            request.respond._head(code, 'image', filePath);

            const fs = require('fs');
            fs.createReadStream(filePath).pipe(res);
          },


          body: null,
        },
      }


      //gets current route endpoint, ie: /home, /info/contact, etc
      var currentRoute = req.url;
      var splitRoute = req.url.split('/');
      var rootRoute = `/${splitRoute[1]}`;
      var type = '';

      request.client.ip = req.headers['x-forwarded-for']

      if (currentRoute in this.routes) { //if current route is in this.routes
        this.routes[currentRoute].callback(request);

        if (this.onRequest !== undefined) {
          this._pushLog(this.routes[currentRoute].type, req.url, request.client.ip);
        }

      } else { //static route not found, check if dynamic
        if (rootRoute in this.routes) {
          var dynamicRouteName = this.routes[rootRoute].dynamicRoute;

          if (dynamicRouteName in this.dynamicRoutes) {
            var dynamicRouteInfo = this.dynamicRoutes[dynamicRouteName];
            var params = {}; //gets returned to callback


            dynamicRouteInfo.paramNames.forEach((item, index) => {
              params[item] = splitRoute[index + 2];
            });
            

            dynamicRouteInfo.callback(request, params);

            if (this.onRequest !== undefined) {
              this._pushLog(dynamicRouteInfo.type, req.url, request.client.ip);
            }
          }


        } else { //route doesn't exist, 404
          if (this.pageNotFound !== undefined) {
            this.pageNotFound(request);
          } else {
            request.respond.html(`<title>404</title><h1>(404) ${req.url} not found</h1>`, 404);
          }
          res.end();
        }
      }

    }).listen(this.port); //start the server!
  }
}


exports.Router = Router; //export Router so it can be used as a module