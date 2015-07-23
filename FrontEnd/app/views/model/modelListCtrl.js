(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelListCtrl",
                    ["$scope", "$http", "appSettings",
                     ModelListCtrl]);

    function ModelListCtrl($scope, $http, appSettings) {

        //load form list modellist
        $scope.modellistangular = function () {
            //console.log(appSettings.serverPath);
            $http.get(appSettings.serverPath + "/modelinfo/getall")
                .success(function (data) {
                    //console.log(data);
                    $scope.modelinfos = data.getModelInfoJSON.body;
                });
        }

        $scope.modeldelete = function () {

            $http.post(appSettings.serverPath + "/modelinfo/delete", { id: $scope.modelinfos[index]._id }).
                success(function (data, status, headers, config) {
                    //console.log(data);
                    window.location.assign("/model.html")
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.getmodeldetailangular = function () {
            //console.log(url);
            $http.get(appSettings.serverPath + "/modelinfo/getbymodelinfoid")
                .success(function (data) {
                    //console.log(data);
                    $scope.modeldetail = data["ModelInfosList"][0];
                    $('#modeldetailstatus').show();
                });
        }

        $scope.actionmodeldetailangular = function () {
            $scope.save = function () {
                //console.log(url);
                var url = "";
                if (!$scope.formModel.$valid) {
                    //console.log("Form valid!");
                    return;
                }
                var models = {};
                var action = true;
                if (typeof $scope.modeldetail == 'undefined' || $scope.modeldetail._id == '') {
                    //console.log(url_modelinsertangular_scala);
                    models = {
                        name: $scope.modeldetail.name,
                        description: $scope.modeldetail.description,
                        status: $scope.modeldetail.status
                    };
                    url = url_modelinsertangular_scala;
                    $http.post(url, angular.toJson(models)).
                        success(function (data, status, headers, config) {
                            window.location.assign("/model.html")
                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        });
                    //console.log(models.name);
                }
                else {
                    models = {
                        id: $scope.modeldetail._id,
                        name: $scope.modeldetail.name,
                        description: $scope.modeldetail.description,
                        status: $scope.modeldetail.status
                    };
                    url = url_modelupdateangular_scala;
                    if ($scope.modeldetail.status != 'draft') {
                        $http.post(url_checkweightrate_scala, { modelid: $scope.modeldetail._id }).
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
                                            window.location.assign("/model.html")
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
                        //console.log(checkweightrate($scope,$http,$scope.modeldetail._id));
                    }
                    else {
                        $http.post(url, angular.toJson(models)).
                            success(function (data, status, headers, config) {
                                window.location.assign("/model.html")
                            }).
                            error(function (data, status, headers, config) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            });
                    }
                }                
            }
        }

        $scope.modellistangular();
    }
}());
