(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RoleGroupListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "RoleGroupServices",
                     RoleGroupListCtrl])

    function RoleGroupListCtrl($scope, $http, $state, appSettings, shareServices, popupService, RoleGroupServices) {
    }
}());