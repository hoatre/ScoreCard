(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("UserListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "UserServices",
                     UserListCtrl])

    function UserListCtrl($scope, $http, $state, appSettings, shareServices, popupService, UserServices) {
    }
}());