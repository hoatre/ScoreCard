(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelDetailCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "shareServices", "popupService",
                     ModelDetailCtrl]);

    function ModelDetailCtrl($scope, $http, $state, $stateParams, appSettings, shareServices, popupService) {
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

        $scope.checkPublish = function (modelId) {
            var strError = '';
            $http.post(appSettings.serverPath + "/validate/checkweightrate", { modelid: $scope.model._id }).
                    success(function (data, status, headers, config) {
                        //console.log('data.checkweightrate.header.code');
                        var code = data.checkweightrate.header.code;
                        
                        if (code == 0) {                            
                            strError = '';
                        }
                        else if (code == 1) {
                            strError = data.checkweightrate.header.message + ":\n";
                            for (var i = 0; i < data.checkweightrate.body.weight.length; i++) {
                                strError += "- " + data.checkweightrate.body.weight[i].FactorName + " : " + data.checkweightrate.body.weight[i].Weight + "\n";
                            }
                            strError += "------------------------------------------\n";
                            strError += "- " + data.checkweightrate.body.rate;
                            console.log(strError);                            
                        }
                        else if (code == 2) {
                            strError = data.checkweightrate.header.message + ":\n";
                            for (var i = 0; i < data.checkweightrate.body.weight.length; i++) {
                                strError += "- " + data.checkweightrate.body.weight[i].FactorName + " : " + data.checkweightrate.body.weight[i].Weight + "\n";
                            }
                            console.log(strError);
                            //$scope.statuscheck = false;
                        }
                        else if (code == 3) {
                            strError = data.checkweightrate.header.message + ":\n";
                            strError += "- " + data.checkweightrate.body.rate;
                            console.log(strError);
                            //$scope.statuscheck = false;
                        }
                        else if (code == 4) {
                            strError = data.checkweightrate.header.message + ":\n";
                            console.log(strError);
                            //$scope.statuscheck = false;
                        }
                        
                        return strError;
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        //$scope.statuscheck = false
                        return 'Error';
                    });
        }

        // Sava data
        $scope.publish = function () {

            if ($scope.model.status != 'draft') {
                var strMessage = $scope.checkPublish($scope._id);

                if (strMessage == '') {
                    $http.post(appSettings.serverPath + "/modelinfo/update", $scope.model).
                    success(function (data, status, headers, config) {
                        popupService.showMessage('Publish Success!');
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }
                else {
                    popupService.showMessage(strMessage);
                }
            }
            else {
                $http.post(appSettings.serverPath + "/modelinfo/update", $scope.model).
                    success(function (data, status, headers, config) {
                        popupService.showMessage('Update Success!');
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        // Back to list
        $scope.back = function () {
            $state.go("modelList");
        }
    }
}());