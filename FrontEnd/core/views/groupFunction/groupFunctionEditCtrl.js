(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("GroupFunctionEditCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "GroupFunctionServices",
                     GroupFunctionEditCtrl])

    function GroupFunctionEditCtrl($scope, $http, $state, appSettings, shareServices, popupService, GroupFunctionServices) {
    }
}());