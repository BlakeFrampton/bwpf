const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const path = require("path");

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

const app = express();
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Example API route
app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Serve index.html for all unknown routes (useful for SPAs)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// const PORT = process.env.PORT || 5000;
const PORT = 5000;
console.debug(PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//spotify login and callback
// app.get('/auth/login', (req, res) => {
// });

// app.get('/auth/callback', (req, res) => {
// });

// app.get('/auth/token', (req, res) => {
//     res.json(
//        {
//           access_token: access_token
//        })
//   })


// var generateRandomString = function (length) {
//     var text = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
//     for (var i = 0; i < length; i++) {
//       text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
//   };
  


// app.get('/auth/login', (req, res) => {

//     var scope = "streaming \
//                  user-read-email \
//                  user-read-private"
  
//     var state = generateRandomString(16);
  
//     var auth_query_parameters = new URLSearchParams({
//       response_type: "code",
//       client_id: spotify_client_id,
//       scope: scope,
//       redirect_uri: "http://localhost:3000/auth/callback",
//       state: state
//     })
  
//     res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
//   })


// app.get('/auth/callback', (req, res) => {

//     var code = req.query.code;
  
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: "http://localhost:3000/auth/callback",
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
//         'Content-Type' : 'application/x-www-form-urlencoded'
//       },
//       json: true
//     };
  
//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         var access_token = body.access_token;
//         res.redirect('/')
//       }
//     });
//   })
  