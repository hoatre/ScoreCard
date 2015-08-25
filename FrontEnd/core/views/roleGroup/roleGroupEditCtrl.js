(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RoleGroupEditCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "RoleGroupServices",
                     RoleGroupEditCtrl])

    function RoleGroupEditCtrl($scope, $http, $state, appSettings, shareServices, popupService, RoleGroupServices) {
    }
}());