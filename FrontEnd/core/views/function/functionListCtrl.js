(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FunctionListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "FunctionServices",
                     FunctionListCtrl])

    function FunctionListCtrl($scope, $http, $state, appSettings, shareServices, popupService) {
    }
}());