'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'common.services',
    'ngSanitize'
  ])
    .constant("appSettings", {
        serverPath: "http://10.15.171.35:8080"
    })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

      $ocLazyLoadProvider.config({
          debug: false,
          events: true,
      });

      $urlRouterProvider.otherwise('/home');

      $stateProvider
          .state('model', {
              templateUrl: 'app/views/model/modelList.html',
              url: '/model',
              controller: "ModelListCtrl"
          })
        .state('factor', {
            templateUrl: 'app/views/factor/factorList.html',
            url: '/factor',
            controller: "FactorListCtrl"
        })
        .state('factoroption', {
            templateUrl: 'app/views/factor-option/factorOptionList.html',
            url: '/factoroption',
            controller: "FactorOptionListCtrl"
        })
        .state('factoredit', {
            templateUrl: 'app/views/factor/factorlEdit.html',
            url: '/factoredit',
            controller: "FactorEditCtrl"
        })
        .state('rating', {
            templateUrl: 'app/views/rating/ratingList.html',
            url: '/rating',
            controller: "RatingListCtrl"
        })
        .state('test', {
            templateUrl: 'app/views/test/test.html',
            url: '/test',
            controller: "TestListCtrl"
        })
        .state('active', {
            templateUrl: 'app/views/active/active.html',
            url: '/active',
            controller: "TestListCtrl"
        })
      .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'views/dashboard/main.html',
          resolve: {
              loadMyDirectives: function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                  {
                      name: 'sbAdminApp',
                      files: [
                      'scripts/directives/header/header.js',
                      'scripts/directives/header/header-notification/header-notification.js',
                      'scripts/directives/sidebar/sidebar.js',
                      'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                      ]
                  }),
                  $ocLazyLoad.load(
                  {
                      name: 'toggle-switch',
                      files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                             "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                  }),
                  $ocLazyLoad.load(
                  {
                      name: 'ngAnimate',
                      files: ['bower_components/angular-animate/angular-animate.js']
                  })
                  $ocLazyLoad.load(
                  {
                      name: 'ngCookies',
                      files: ['bower_components/angular-cookies/angular-cookies.js']
                  })
                  $ocLazyLoad.load(
                  {
                      name: 'ngResource',
                      files: ['bower_components/angular-resource/angular-resource.js']
                  })
                  $ocLazyLoad.load(
                  {
                      name: 'ngSanitize',
                      files: ['bower_components/angular-sanitize/angular-sanitize.js']
                  })
                  $ocLazyLoad.load(
                  {
                      name: 'ngTouch',
                      files: ['bower_components/angular-touch/angular-touch.js']
                  })
              }
          }
      })
      .state('home', {
          url: '/home',
          controller: 'MainCtrl',
          templateUrl: 'views/dashboard/home.html',
          resolve: {
              loadMyFiles: function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'sbAdminApp',
                      files: [
                      'scripts/controllers/main.js',
                      'scripts/directives/timeline/timeline.js',
                      'scripts/directives/notifications/notifications.js',
                      'scripts/directives/chat/chat.js',
                      'scripts/directives/dashboard/stats/stats.js'
                      ]
                  })
              }
          }
      })
      .state('form', {
          templateUrl: 'views/form.html',
          url: '/form'
      })
      .state('blank', {
          templateUrl: 'views/pages/blank.html',
          url: '/blank'
      })
      .state('login', {
          templateUrl: 'views/pages/login.html',
          url: '/login'
      })
      .state('chart', {
          templateUrl: 'views/chart.html',
          url: '/chart',
          controller: 'ChartCtrl',
          resolve: {
              loadMyFile: function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'chart.js',
                      files: [
                        'bower_components/angular-chart.js/dist/angular-chart.min.js',
                        'bower_components/angular-chart.js/dist/angular-chart.css'
                      ]
                  }),
                  $ocLazyLoad.load({
                      name: 'sbAdminApp',
                      files: ['scripts/controllers/chartContoller.js']
                  })
              }
          }
      })
      .state('table', {
          templateUrl: 'views/table.html',
          url: '/table'
      })
      .state('panels-wells', {
          templateUrl: 'views/ui-elements/panels-wells.html',
          url: '/panels-wells'
      })
      .state('buttons', {
          templateUrl: 'views/ui-elements/buttons.html',
          url: '/buttons'
      })
      .state('notifications', {
          templateUrl: 'views/ui-elements/notifications.html',
          url: '/notifications'
      })
      .state('typography', {
          templateUrl: 'views/ui-elements/typography.html',
          url: '/typography'
      })
      .state('icons', {
          templateUrl: 'views/ui-elements/icons.html',
          url: '/icons'
      })
      .state('grid', {
          templateUrl: 'views/ui-elements/grid.html',
          url: '/grid'
      })
  }]);


