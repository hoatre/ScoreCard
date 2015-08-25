(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("GroupListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "GroupServices",
                     GroupListCtrl])

    function GroupListCtrl($scope, $http, $state, appSettings, shareServices, popupService, GroupServices) {
    }
}());