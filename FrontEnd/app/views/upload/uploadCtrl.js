(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("UploadCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     UploadCtrl]);

    function UploadCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

    }

}());