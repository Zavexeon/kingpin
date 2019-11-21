# kingpin
Kingpin is a wrapper for nodejs's `http` module specifically designed for routing.

Disclaimer: `GET` requests are currently the only request type supported, POST and the others are in the works. 

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


