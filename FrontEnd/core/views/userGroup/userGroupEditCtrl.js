(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("UserGroupEditCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "UserGroupServices",
                     UserGroupEditCtrl])

    function UserGroupEditCtrl($scope, $http, $state, appSettings, shareServices, popupService, UserGroupServices) {
    }
}());