(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FunctionEditCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "FunctionServices",
                     FunctionEditCtrl])

    function FunctionEditCtrl($scope, $http, $state, appSettings, shareServices, popupService, FunctionServices) {
    }
}());