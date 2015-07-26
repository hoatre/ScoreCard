(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelDetailCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "shareServices",
                     ModelDetailCtrl]);

    function ModelDetailCtrl($scope, $http, $state, $stateParams, appSettings, shareServices) {
        $scope.model = {};

        // Load data from cache
        //$scope.model = shareServices.getCurrentObject();


        // Load data form server
        if ($scope.model._id == undefined && $stateParams.modelId != '' && $stateParams.modelId != undefined) {
            $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfoid", { _id: $stateParams.modelId })
                .success(function (data) {
                    console.log(data);
                    $scope.model = data.getModelInfoByIdJSON.body[0];
                    console.log($scope.model);
                });
        }

        // Back to list
        $scope.back = function () {
            $state.go("modelList");
        }
    }
}());