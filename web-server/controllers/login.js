// crypto = require('crypto');
//
// var hash = function(password) {
//   return crypto.createHash('sha1').update(password).digest('base64')
// }
// module.exports = function(app) {
//   // =====================================
//   // LOGIN ===============================
//   // =====================================
//   // show the login form
//   app.get('/login', function(req, res) {
//     // render the page and pass in any flash data if it exists
//     res.render('login', {
//       message: req.flash('loginMessage')
//     });
//   });
//
//   app.post('/login', function(req, res) {
//     var request = require('request');
//     user = {
//       "nickname": req.body.nickname,
//       "password": hash(req.body.password)
//     }
//     request.post(
//       'http://localhost:3000/users/authenticate', {
//         json: user
//       },
//       function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//           console.log(body, body.isOk)
//           req.session.user = user;
//           res.redirect('/dashboard');
//         }
//       }
//     );
//   });
// }
