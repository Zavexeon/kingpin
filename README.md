# kingpin
Kingpin is a wrapper for nodejs's `http` module specifically designed for routing.

Disclaimer: `GET` requests are currently the only request type supported, `POST` and the others are in the works. 

# Usage

#### Add Kingpin 
Add the file `kingpin.js` to your project.
```js
const kp = require('./kingpin.js');
const router = new kp.Router(3000); //any valid port name can be used here
```

#### Add Routes 
Adding routes with kingpin is incredibly easy. 
```js
router.get('/', (request) => {
  //do something here!
});
```

#### Dynamic Routes
Dynamic routes are easy to setup as well. 
```js
router.get('mydynamicroute/{myparameter}', (request, params) => {
  //Access route parameters in params argument! In this case, params[myparameter]. 
});
```

#### 404 Pages 
Kingpin has a default 404 page, however you can create a custom one easily. 
```js
router.pageNotFound = (request) => {
  //do something here!
}
```

#### Log requests
Kingpin has a hook for getting request information. It returns an object with request info.
```js
router.onRequest((request) => {
  console.log(request);
});
```

# Request object
This is the request object passed to request functions and the `router.pageNotFound` property, not the `router.onRequest()` hook. 

#### `request.redirect(url)`
This redirects the client to a specified url. 

#### `request.client` 
Returns an object with info on the client. Currently only has the property `ip`.

#### `request.respond`
This is a object full of methods of responding to the request.

* `request.respond.html(htmlString, code = 200)`

  * Sends the client a string with text/html headers.
  
* `request.respond.htmlFile('path/to/file', code = 200)

  * Sends the client a file witt text/html headers.
  
* `request.respond.js(jsString, code = 200)`

  * Sends the client a string with text/js headers. 
  
* `request.respond.jsFile('path/to/file', code = 200)`

  * Sends the client a file with text/js headers.

* `request.respond.css(cssString, code = 200)`
  
  * Sends the client a string with text/css headers. 
  
* `request.respond.cssFile('path/to/file', code = 200)` 

  * Sends the client a file with text/css headers. 

* `request.respond.image('path/to/image', code = 200)`

  * Sends the client a static image with image/file_extension_here headers.
  




