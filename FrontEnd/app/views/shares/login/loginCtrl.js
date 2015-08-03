(function () {
    "use strict";
    var app = angular
        .module("sbAdminApp");

    //var app = angular.module('sbAdminApp', [], function config($httpProvider) {
    //    $httpProvider.interceptors.push('AuthInterceptor');
    //});
    app.constant('API_URL', 'http://localhost:3000');

    app.controller('LoginCtrl', function LoginCtrl($scope, RandomUserFactory, UserFactory) {
        'use strict';
        $scope.message = '';
        $scope.getRandomUser = getRandomUser;
        $scope.login = login;
        $scope.logout = logout;

        // Initialization
        UserFactory.getUser().then(function success(response) {
            $scope.user = response.data;
        });

        function getRandomUser() {
            RandomUserFactory.getUser().then(function success(response) {
                $scope.randomUser = response.data;
            }, handerError);
        }

        function login(username, password) {
            UserFactory.login(username, password).then(function sucess(response) {
                $scope.user = response.data.user;
                //console.log('Ctrl login: ' + response.data.token);
            }, handerError);
        }

        function logout() {
            UserFactory.logout();
            $scope.user = null;
        }

        function handerError(response) {
            console.log('Error' + response.data);
        }
    });

    app.factory('RandomUserFactory', function RandomUserFactory($http, API_URL) {
        'use strict';

        return {
            getUser: getUser
        }

        function getUser() {
            return $http.get(API_URL + '/random-user');
        }

    });

    app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory, $q) {
        'use strict';

        return {
            login: login,
            logout: logout,
            getUser: getUser
        }

        function login(username, password) {
            //return $http.post(API_URL + '/login', {
            //    username: username,
            //    password: password
            //}).then(function success(response) {
            //    //console.log('User Factory login:' + response.data.token);
            //    AuthTokenFactory.setToken(response.data.token);
            //    return response;
            //});
            return $http.post('app/views/shares/login/mock/login.json', loginReq).success(function (data) { return data; });
        }

        function logout() {
            AuthTokenFactory.setToken();
        }

        function getUser() {
            if (AuthTokenFactory.getToken()) {
                return $http.get(API_URL + '/me');
            } else {
                return $q.reject({ data: 'Client has no auth token' });
            }
        }
    });

    app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
        'use strict';

        var store = $window.localStorage;
        var key = 'auth-token';

        return {
            getToken: getToken,
            setToken: setToken
        }

        function getToken() {
            //console.log('AuthTokenFactory getToken Key: ' + key + '; token: ' + store.getItem(key));
            return store.getItem(key);
        }

        function setToken(token) {
            if (token) {
                store.setItem(key, token);
                //console.log('Set token: ' + key + '; token: ' + token);
            } else {
                store.removeItem(key);
            }
        }
    });

    app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
        'use strict';

        return {
            request: addToken
        }

        function addToken(config) {
            var token = AuthTokenFactory.getToken();
            //console.log('addToken: ' + token);
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }

            return config;
        }
    });

}());