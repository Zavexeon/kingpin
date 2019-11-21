const kp = require('./kingpin.js');
const router = new kp.Router(4040);


router.pageNotFound = (request) => {
  request.redirect('https://kingpin-router.zavexeon.repl.co/404');
}



router.get('/', (request) => {
  request.respond.html(`This is an index page. <strong>UwU</strong>`);
})

router.get('/greet/{name}', (request, params) => {
  request.respond.html(`Hello, ${params.name}, nice to meet you!`);
});

router.get('/i/{image}', (request, params) => {
  if (params.image === 'srop') {
    request.respond.image('./srop.png');
  } else {
    request.respond.html('Looks like that image doesn\'t exist.');
  }
});

router.get('/404', (request) => {
  request.respond.html('404: Page not found')
});




router.onRequest((request) => {
  console.log(request);
});


router.start();


