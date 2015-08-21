(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("GroupEditCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "GroupServices",
                     GroupEditCtrl])

    function GroupEditCtrl($scope, $http, $state, appSettings, shareServices, popupService, GroupServices) {
    }
}());