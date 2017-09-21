const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//
// Middleware: Request logging
//
app.use((request, response, next) => {
  var now = new Date().toString();
  var logMessage = `${now}: ${request.method} ${request.url}`;

  console.log(logMessage);
  fs.appendFile('server.log', logMessage + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server log.');
    }
  })
  next();
});

//
// Middleware: Maintenance mode
//
// app.use((request, response, next) => {
//   response.render('maintenance.hbs');
// });

//
// Middleware: Serve static content from the 'public' dir
//
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (screamText) => {
  return screamText.toUpperCase();
});


// RESP: root
app.get('/', (request, response) => {
  response.render('home.hbs', {
    pageTitle: 'Welcome!',
    welcomeMessage: `I'm glad you've found us... now fuck off!`
  });
});

// RESP: /about
app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

// RESP: /bad
app.get('/bad', (request, response) => {
  response.send({
    errorMessage: `That didn't go well.`
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
