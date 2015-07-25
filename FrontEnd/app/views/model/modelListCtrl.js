(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices",
                     ModelListCtrl]);

    function ModelListCtrl($scope, $http, $state, appSettings, shareServices) {

        //Broadcast message
        $scope.goEdit = function (index) {

            if ($scope.models.length && (index != null || index != undefined)) {

                shareServices.setCurrentObject($scope.models[index]);
                $state.go('modelEdit', { modelId: $scope.models[index]._id });
            }
        };

        //load form list modellist
        $scope.getAllModel = function () {
            //console.log(appSettings.serverPath);
            $http.get(appSettings.serverPath + "/modelinfo/getall")
                .success(function (data) {
                    //console.log(data);
                    $scope.models = data.getModelInfoJSON.body;
                });
        }

        $scope.modelDelete = function (index) {

            $http.post(appSettings.serverPath + "/modelinfo/delete", { _id: $scope.models[index]._id }).
                success(function (data, status, headers, config) {
                    //console.log(data);
                    window.location.assign("/model.html")
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        
        $scope.getAllModel();
    }
}());
