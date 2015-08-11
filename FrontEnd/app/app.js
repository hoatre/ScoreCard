'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
var myapp = angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'common.services',
    'ngSanitize',
    'ui.bootstrap-slider',
    'ui.grid.treeView',
    'mgcrea.ngStrap',
    'satellizer'
  ])
    .run(function ($rootScope, $state, $auth) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            if (toState.authenticate && !$auth.isAuthenticated()) {
                // User isn’t authenticated
                $state.transitionTo("login");
                event.preventDefault();
            }
        });
    })
    .constant("appSettings", {
        serverPath: "http://10.15.171.35:8080",
        authPath: "http://10.15.171.35:9000"
        //serverPath: "http://localhost:8080",
        //authPath: "http://localhost:9000"
    })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$authProvider', 'appSettings', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $authProvider, appSettings) {

      $ocLazyLoadProvider.config({
          debug: false,
          events: true,
      });

      $authProvider.facebook({
          clientId: '804896872898846'
      });

      $authProvider.google({
          clientId: '612423556891-59he3rnnqst0dgo8598ua1jg93tvp8ip.apps.googleusercontent.com'
      });

      $authProvider.loginUrl = appSettings.authPath + '/auth/login';
      $authProvider.signupUrl = appSettings.authPath + '/auth/signup'

      $urlRouterProvider.otherwise('/models');

      $stateProvider
          .state('modelList', {
              templateUrl: 'app/views/model/modelList.html',
              url: '/models',
              controller: "ModelListCtrl",
              authenticate: true
          })
          .state('modelEdit', {
              templateUrl: 'app/views/model/modelEdit.html',
              url: '/models/edit/:modelId',
              controller: "ModelEditCtrl",
              authenticate: true
          })
          .state("modelInfo", {
              url: "/models/:modelId",
              templateUrl: "app/views/model/modelInfo.html",
              authenticate: true
          })
          .state("modelInfo.detail", {
              url: "/detail",
              templateUrl: "app/views/model/modelDetail.html",
              controller: "ModelDetailCtrl",
              authenticate: true,
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
          .state('modelInfo.factors', {
              templateUrl: 'app/views/factor/factorList.html',
              url: '/factors',
              controller: "FactorListCtrl",
              authenticate: true
          })
          .state('modelInfo.ratings', {
              templateUrl: 'app/views/rating/ratingList.html',
              url: '/ratings',
              controller: "RatingListCtrl",
              authenticate: true
          })
          .state('modelInfo.active', {
              templateUrl: 'app/views/active/active.html',
              url: '/active',
              controller: "TestListCtrl",
              authenticate: true
          })
        .state('factorList', {
            templateUrl: 'app/views/factor/factorList.html',
            url: '/factors/:modelId',
            controller: "FactorListCtrl",
            authenticate: true
        })
        .state('factorEdit', {
            templateUrl: 'app/views/factor/factorlEdit.html',
            url: '/factors/edit/:modelId/:factorId',
            controller: "FactorEditCtrl",
            authenticate: true
        })
        .state('factorOptionList', {
            templateUrl: 'app/views/factor-option/factorOptionList.html',
            url: '/factoroptions/:modelId/:factorId',
            controller: "FactorOptionListCtrl",
            authenticate: true
        })
        .state('factorOptionEdit', {
            templateUrl: 'app/views/factor-option/factorOptionEdit.html',
            url: '/factoroptions/edit/:modelId/:factorId/:factorOptionId',
            controller: "FactorOptionEditCtrl",
            authenticate: true
        })
        .state('ratingList', {
            templateUrl: 'app/views/rating/ratingList.html',
            url: '/ratings/:modelId',
            controller: "RatingListCtrl",
            authenticate: true
        })
        .state('ratingEdit', {
            templateUrl: 'app/views/rating/ratingEdit.html',
            url: '/ratings/edit/:modelId/:ratingCode',
            controller: "RatingEditCtrl",
            authenticate: true
        })
        .state('testList', {
            templateUrl: 'app/views/test/test.html',
            url: '/test',
            controller: "TestListCtrl",
            authenticate: true
        })
        .state('riskassessment', {
            templateUrl: 'app/views/riskassessment/riskassessment.html',
            url: '/riskassessment',
            controller: "RiskAssessmentCtrl",
            authenticate: true
        })
        .state('personalinformation', {
            templateUrl: 'app/views/personalinformation/personalinformation.html',
            url: '/personalinformation',
            controller: "PersonalInformationCtrl",
            authenticate: true
        })
        .state('activeList', {
            templateUrl: 'app/views/active/active.html',
            url: '/active',
            controller: "TestListCtrl",
            authenticate: true
        })
        .state('uploadFile', {
            templateUrl: 'app/views/upload/home.html',
            url: '/upload',
            controller: "UploadCtrl",
            authenticate: true
        })
        .state('dashboardHome', {
            templateUrl: 'app/views/dashboard/home.html',
            url: '/dashboard',
            controller: "DashboardCtrl",
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
          .state('dashboard2', {
              templateUrl: 'app/views/dashboard/home2.html',
              url: '/dashboard2',
              controller: "Dashboard2Ctrl"
          })
      .state('dashboard', {
          url: '/dashboard3',
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
          //templateUrl: 'views/pages/login.html',
          templateUrl: 'app/views/shares/login/login.html',
          url: '/login',
          controller: 'LoginCtrl',
          authenticate: false
      })
    .state('logout', {
        url: '/logout',
        template: null,
        controller: 'LogoutCtrl',
        authenticate: false
    })
    .state('signup', {
        //templateUrl: 'views/pages/login.html',
        templateUrl: 'app/views/shares/signup/signup.html',
        url: '/signup',
        controller: 'SignupCtrl',
        authenticate: false
    })
    .state('profile', {
        //templateUrl: 'views/pages/login.html',
        templateUrl: 'app/views/shares/profile/profile.html',
        url: '/profile',
        controller: 'ProfileCtrl',
        authenticate: true
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

      //System management
    .state('applicationList', {
        templateUrl: 'core/views/application/applicationList.html',
        url: '/applications',
        controller: "ApplicationListCtrl",
        authenticate: true
    })
    .state('applicationEdit', {
        templateUrl: 'core/views/application/applicationEdit.html',
        url: '/applications/edit/:applicationId',
        controller: "ApplicationEditCtrl",
        authenticate: true
    })
    .state('functionList', {
        templateUrl: 'core/views/function/functionList.html',
        url: '/functions',
        controller: "FunctionListCtrl",
        authenticate: true
    })
    .state('functionEdit', {
        templateUrl: 'core/views/function/functionEdit.html',
        url: '/functions/edit/:functionId',
        controller: "FunctionEditCtrl",
        authenticate: true
    })
    .state('groupList', {
        templateUrl: 'core/views/group/groupList.html',
        url: '/groups',
        controller: "GroupListCtrl",
        authenticate: true
    })
    .state('groupEdit', {
        templateUrl: 'core/views/group/groupEdit.html',
        url: '/groups/edit/:groupId',
        controller: "GroupEditCtrl",
        authenticate: true
    })
    .state('groupFunctionList', {
        templateUrl: 'core/views/groupfunction/groupFunctionList.html',
        url: '/groupfunctions',
        controller: "GroupFunctionListCtrl",
        authenticate: true
    })
    .state('groupFunctionEdit', {
        templateUrl: 'core/views/groupfunction/groupFunctionEdit.html',
        url: '/groupfunctions/edit/:groupFunctionId',
        controller: "GroupFunctionEditCtrl",
        authenticate: true
    })
    .state('roleList', {
        templateUrl: 'core/views/role/roleList.html',
        url: '/roles',
        controller: "RoleListCtrl",
        authenticate: true
    })
    .state('roleEdit', {
        templateUrl: 'core/views/role/roleEdit.html',
        url: '/roles/edit/:roleId',
        controller: "RoleEditCtrl",
        authenticate: true
    })
    .state('roleGroupList', {
        templateUrl: 'core/views/roleGroup/roleGroupList.html',
        url: '/rolefunctons',
        controller: "RoleGroupListCtrl",
        authenticate: true
    })
    .state('roleGroupEdit', {
        templateUrl: 'core/views/rolegroup/roleGroupEdit.html',
        url: '/rolegroups/edit/:roleGroupId',
        controller: "RoleGroupEditCtrl",
        authenticate: true
    })
    .state('userList', {
        templateUrl: 'core/views/user/userList.html',
        url: '/users',
        controller: "UserListCtrl",
        authenticate: true
    })
    .state('userEdit', {
        templateUrl: 'core/views/user/userEdit.html',
        url: '/users/edit/:userId',
        controller: "UserEditCtrl",
        authenticate: true
    })
      .state('userGroupList', {
          templateUrl: 'core/views/usergroup/userGroupList.html',
          url: '/usergroups',
          controller: "UserGroupListCtrl",
          authenticate: true
      })
    .state('userGroupEdit', {
        templateUrl: 'core/views/usergroup/userGroupEdit.html',
        url: '/usergroups/edit/:usergroupId',
        controller: "UserGroupEditCtrl",
        authenticate: true
    })
      //End
  }])
  .controller('MainCtrl', ['$scope', '$auth', function ($scope, $auth) {

      $scope.isAuthenticated = function () {
          return $auth.isAuthenticated();
      };
  }]);

