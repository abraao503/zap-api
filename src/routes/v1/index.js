const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const instanceRoute = require('./instance.route');
const docsRoute = require('./docs.route');
const contactRoute = require('./contact.route');
const campaignRoute = require('./campaign.route');
const tagRoute = require('./tag.route');
const fileRoute = require('./file.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/instances',
    route: instanceRoute,
  },
  {
    path: '/contacts',
    route: contactRoute,
  },
  {
    path: '/campaigns',
    route: campaignRoute,
  },
  {
    path: '/tags',
    route: tagRoute,
  },
  {
    path: '/files',
    route: fileRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
