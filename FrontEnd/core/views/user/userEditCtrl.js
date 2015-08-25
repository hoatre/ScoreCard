(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("UserEditCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "UserServices",
                     UserEditCtrl])

    function UserEditCtrl($scope, $http, $state, appSettings, shareServices, popupService, UserServices) {
    }
}());