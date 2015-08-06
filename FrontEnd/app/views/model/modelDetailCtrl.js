(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelDetailCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "shareServices", "popupService",
                     ModelDetailCtrl]);

    function ModelDetailCtrl($scope, $http, $state, $stateParams, appSettings, shareServices, popupService) {

        $scope.pie = {
            //labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
            //data: [300, 500, 100]
        };
        $scope.pie.labels = [];
        $scope.pie.data = [];

        $scope.model = {};
        $scope.factors = {};

        // Load data from cache
        //$scope.model = shareServices.getCurrentObject();


        // Load data form server
        if ($scope.model._id == undefined && $stateParams.modelId != '' && $stateParams.modelId != undefined) {
            $http.get(appSettings.serverPath + '/modelinfo/factor/'+ $stateParams.modelId)
                .success(function (data) {
                    $scope.model = data.modelinfo.body.model;
                    $scope.factors = data.modelinfo.body.factor;

                    for (var i in $scope.factors) {
                        var factor = $scope.factors[i];
                        console.log(factor.FactorName);
                        $scope.pie.labels.push(factor.FactorName);
                        $scope.pie.data.push(factor.Weight);
                    }
                });
        }
        $scope.coppy = function () {
            if (popupService.showPopup('Are you sure coppy this model?')) {
                $http.post(appSettings.serverPath + "/modelinfo/copymodel", { _id: $stateParams.modelId })
                    .success(function (data, status, headers, config) {
                        popupService.showMessage(data.copymodel.header.message);
                        /*if (data.copymodel.header.code == 0) {
                            popupService.showMessage(data.copymodel.header.message);
                        }
                        else {
                            popupService.showMessage(data.copymodel.header.message);
                        }*/
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }
        $scope.publish = function () {
            var modelstatus = "draft";
            if ($scope.model.status == 'draft') {
                modelstatus = 'active';
            }
            else if ($scope.model.status == 'active') {
                modelstatus = 'publish';
            }
            else {
                modelstatus = 'draft';
            }
            var strError = '';
            if (modelstatus != 'draft') {
                $http.post(appSettings.serverPath + "/validate/checkweightrate", { modelid: $scope.model._id }).
                        success(function (data, status, headers, config) {
                            //console.log('data.checkweightrate.header.code');
                            var code = data.checkweightrate.header.code;

                            if (code == 0) {
                                $scope.model.status = modelstatus;
                                $scope.save();
                            }
                            else if (code == 1) {
                                strError = data.checkweightrate.header.message + ":\n";
                                for (var i = 0; i < data.checkweightrate.body.weight.length; i++) {
                                    strError += "- " + data.checkweightrate.body.weight[i].FactorName + " : " + data.checkweightrate.body.weight[i].Weight + "\n";
                                }
                                strError += "------------------------------------------\n";
                                strError += "- " + data.checkweightrate.body.rate;
                                //console.log(strError);
                            }
                            else if (code == 2) {
                                strError = data.checkweightrate.header.message + ":\n";
                                for (var i = 0; i < data.checkweightrate.body.weight.length; i++) {
                                    strError += "- " + data.checkweightrate.body.weight[i].FactorName + " : " + data.checkweightrate.body.weight[i].Weight + "\n";
                                }
                                //console.log(strError);
                                //$scope.statuscheck = false;
                            }
                            else if (code == 3) {
                                strError = data.checkweightrate.header.message + ":\n";
                                strError += "- " + data.checkweightrate.body.rate;
                                //console.log(strError);
                                //$scope.statuscheck = false;
                            }
                            else if (code == 4) {
                                strError = data.checkweightrate.header.message + ":\n";
                                //console.log(strError);
                                //$scope.statuscheck = false;
                            }
                            else {
                                strError = data.checkweightrate.header.message;
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
            else {
                $scope.model.status = modelstatus;
                $scope.save();
            }
        }

        // Sava data
        $scope.save = function () {

            $http.post(appSettings.serverPath + "/modelinfo/update", $scope.model).
                success(function (data, status, headers, config) {
                    popupService.showMessage('Update Success!');
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        // Back to list
        $scope.back = function () {
            $state.go("modelList");
        }
    }
}());