const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getOwnProfile', mid.requiresLogin, controllers.Profile.getOwnProfile);
  app.get('/getProfiles', mid.requiresLogin, controllers.Profile.getProfiles);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changepass', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePass);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Profile.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Profile.makeProfile);
  app.post('/search', mid.requiresLogin, controllers.Profile.searchProfiles);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', mid.requiresSecure, mid.requiresLogout, controllers.Account.notFoundPage);
};

module.exports = router;
