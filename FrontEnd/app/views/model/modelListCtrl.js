(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService",
                     ModelListCtrl]);

    function ModelListCtrl($scope, $http, $state, appSettings, shareServices, popupService) {

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

        // Delete
        $scope.modelDelete = function (index) {
            if (popupService.showPopup('Are you sure delete this model?')) {
                $http.post(appSettings.serverPath + "/modelinfo/delete", { _id: $scope.models[index]._id })
                    .success(function (data, status, headers, config) {
                        $scope.models.splice(index, 1);
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        // Add
        $scope.add = function () {

            if (!$scope.modelForm.$valid) {
                return;
            }
            if ($scope.model._id == null || $scope.model._id == 'undefined' || $scope.model._id == '') {
                $scope.model.status = 'draft';

                $http.post(appSettings.serverPath + "/modelinfo/insert", $scope.model).
                    success(function (data, status, headers, config) {
                        //console.log(data.insertModelInfo.body)
                        $scope.models.push(data.insertModelInfo.body);
                        popupService.showMessage('Insert Success!');
                        $scope.model = {};

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }            
        }
        
        $scope.getAllModel();
    }
}());
