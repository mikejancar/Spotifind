//Includes
var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var fileSystem = require('fs');

//Server variables
var clientId = '';
var clientSecret = '';
var redirectUri = 'http://localhost:8888/callback';
var stateKey = 'spotify_auth_state';
var accessToken = '';
var refreshToken = '';

//Server functions

function initializeClientData() {
  fileSystem.readFile('./server/data/client-info.json', 'utf8', function (error, data) {
    if (error) {
      throw error;
    }

    var clientData = JSON.parse(data);
    clientId = clientData.clientId;
    clientSecret = clientData.clientSecret;
  });
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

function createAuthorizationOptions(code) {
  return {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    json: true
  };
}

function createRequestOptions(url) {
  return {
    url: url,
    headers: { 'Authorization': 'Bearer ' + accessToken },
    json: true
  };
}

function retrieveAccessTokens(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.json({
      loggedIn: false,
      errorData: 'State Mismatch'
    });
  } else {
    res.clearCookie(stateKey);
    var authOptions = createAuthorizationOptions(code);

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        accessToken = body.access_token;
        refreshToken = body.refresh_token;
        console.log('Successfully retrieved access and refresh tokens');
        res.json({
          loggedIn: true
        });
      } else {
        res.json({
          loggedIn: false,
          errorData: error
        });
      }
    });
  }
}

//Server initialization
var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cookieParser());

initializeClientData();

//Server endpoints

app.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    }));
});

app.get('/callback', retrieveAccessTokens);

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/playlist', function (req, res) {
  var options = createRequestOptions('https://api.spotify.com/v1/me/playlists')

  request.get(options, function (error, response, body) {
    console.log(body);
    res.json(body);
  });
});

//Server startup
app.listen(8888);
console.log('Spotifind server now listening at http://localhost:8888');