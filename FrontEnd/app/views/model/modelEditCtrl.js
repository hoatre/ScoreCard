(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelEditCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "shareServices", "popupService",
                     ModelEditCtrl]);

    function ModelEditCtrl($scope, $http, $state, $stateParams, appSettings, shareServices, popupService) {
        $scope.model = {};

        //$scope.model = shareServices.getCurrentObject();
        $scope.originalModel = angular.copy($scope.model);


        if ($scope.model._id == undefined && $stateParams.modelId != '' && $stateParams.modelId != undefined) {
            $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfoid", { _id: $stateParams.modelId })
                .success(function (data) {
                    //console.log(data);
                    $scope.model = data.getModelInfoByIdJSON.body[0];
                    $scope.originalModel = angular.copy($scope.model);
                });
        }
        
        //Back update data
        console.log($scope.originalModel);

        // Sava data
        $scope.save = function () {

            if (!$scope.modelForm.$valid) {
                //console.log("Form valid!");
                return;
            }
            var models = {};
            var action = true;
            if ($scope.model._id == null || $scope.model._id == 'undefined' || $scope.model._id == '') {
                $scope.model.status = 'draft';

                $http.post(appSettings.serverPath + "/modelinfo/insert", $scope.model).
                    success(function (data, status, headers, config) {
                        popupService.showMessage('Insert Success!');
                        $scope.back();
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                //console.log(models.name);
            }
            else {

                if ($scope.model.status != 'draft') {
                    $http.post(appSettings.serverPath + "/validate/checkweightrate", { modelid: $scope.model._id }).
                        success(function (data, status, headers, config) {
                            //console.log('data.checkweightrate.header.code');
                            var code = 0;
                            code = data.checkweightrate.header.code;
                            var strerr = "";
                            if (code == 0) {
                                //console.log(data["checkweightrate"]["header"].message);
                                //$scope.statuscheck = true;

                                $http.post(url, angular.toJson(models)).
                                    success(function (data, status, headers, config) {
                                        popupService.showMessage('Update Success!');
                                        $scope.back();
                                    }).
                                    error(function (data, status, headers, config) {
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.
                                    });

                            }
                            else if (code == 1) {
                                strerr = data["checkweightrate"]["header"].message + ":\n";
                                for (var i = 0; i < data["checkweightrate"]["body"]["weight"].length; i++) {
                                    strerr += "- " + data["checkweightrate"]["body"]["weight"][i].FactorName + " : " + data["checkweightrate"]["body"]["weight"][i].Weight + "\n";
                                }
                                strerr += "------------------------------------------\n";
                                strerr += "- " + data["checkweightrate"]["body"].rate;
                                console.log(strerr);
                                //$scope.statuscheck = false;
                            }
                            else if (code == 2) {
                                strerr = data["checkweightrate"]["header"].message + ":\n";
                                for (var i = 0; i < data["checkweightrate"]["body"]["weight"].length; i++) {
                                    strerr += "- " + data["checkweightrate"]["body"]["weight"][i].FactorName + " : " + data["checkweightrate"]["body"]["weight"][i].Weight + "\n";
                                }
                                console.log(strerr);
                                //$scope.statuscheck = false;
                            }
                            else if (code == 3) {
                                strerr = data["checkweightrate"]["header"].message + ":\n";
                                strerr += "- " + data["checkweightrate"]["body"].rate;
                                console.log(strerr);
                                //$scope.statuscheck = false;
                            }
                            else if (code == 4) {
                                strerr = data["checkweightrate"]["header"].message + ":\n";
                                console.log(strerr);
                                //$scope.statuscheck = false;
                            }
                            //console.log($scope.statuscheck)
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            //$scope.statuscheck = false
                        });
                    //console.log(checkweightrate($scope,$http,$scope.model._id));
                }
                else {
                    $http.post(appSettings.serverPath + "/modelinfo/update", $scope.model).
                        success(function (data, status, headers, config) {
                            popupService.showMessage('Update Success!');
                            $scope.back();
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });
                }
            }
        }

        // Reset data to original
        $scope.cancel = function (editForm) {
            editForm.$setPristine();
            $scope.model = angular.copy($scope.originalModel);
            $scope.message = "";
        };

        // Back to list
        $scope.back = function () {
            $state.go("modelList");
        }
    }
}());