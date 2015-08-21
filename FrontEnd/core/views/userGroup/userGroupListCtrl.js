(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("UserGroupListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "UserGroupServices",
                     UserGroupListCtrl])

    function UserGroupListCtrl($scope, $http, $state, appSettings, shareServices, popupService, UserGroupServices) {
    }
}());