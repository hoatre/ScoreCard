(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("GroupFunctionListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "GroupFunctionServices",
                     GroupFunctionListCtrl])

    function GroupFunctionListCtrl($scope, $http, $state, appSettings, shareServices, popupService, GroupFunctionServices) {
    }
}());