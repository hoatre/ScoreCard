(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorOptionListCtrl",
                    ["$scope", "$http", "appSettings",
                     FactorOptionListCtrl]);

    function FactorOptionListCtrl($scope, $http, appSettings) {

        function modellistangular(l) {
            //console.log(url);
            $http.get(url)
                .success(function (data) {
                    //console.log(data);
                    $scope.modelinfos = data.getModelInfoJSON.body;
                    //console.log($scope.choiceFactor);
                    if ($scope.choiceModel != '' && $scope.choiceFactor != '') {
                        //console.log('AAA');
                        backmodelChanged($scope.choiceModel, $scope.choiceFactor);
                    }
                })
        }

        $scope.modellistbymodelsatusangular = function () {
            //console.log(url);
            $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfostatus", { status: 'draft' }).
                success(function (data, status, headers, config) {
                    //console.log(data);
                    $scope.modelinfos = data.getModelInfoByStatusJSON.body;
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        //load form list factorlist
        $scope.factorlistangular = function (l) {
            //console.log(url);
            $http.get(url)
            .success(function (data) {
                //console.log(data);
                $scope.factors = data["FactorsList"];
            })
        }


        $scope.factorlistbymodelidangular = function (modelid) {
            //console.log(url);
            $http.post(appSettings.serverPath + "/factoroption/getbymodelid", { modelid: modelid }).
                success(function (data, status, headers, config) {
                    //console.log(data["SUCCESS"]);
                    //console.log(data);
                    if (typeof data["ERROR"] == 'undefined') {
                        $scope.factors = data["SUCCESS"];
                    }
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.modelChanged = function () {
            $scope.modelChanged = function (id) {
                //console.log(id);
                for (var i = 0; i < $scope.modelinfos.length; i++) {
                    if ($scope.modelinfos[i]._id == id) {
                        $scope.modelinfodetail = $scope.modelinfos[i];
                        //console.log($scope.modelinfodetail.min);
                    }
                }
                //console.log(url_ratinglistbymodelidangular_scala+"/"+id);
                if ($scope.modelinfodetail.status == 'draft') {
                    $('#btnInsert').show();
                }
                else {
                    $('#btnInsert').hide();
                }
                $http.post(appSettings.serverPath + "/factoroption/getbymodelid", { modelid: id }).
                    success(function (data, status, headers, config) {
                        //console.log(data["SUCCESS"]);
                        //console.log(data);
                        $scope.factors = [];
                        if (typeof data["ERROR"] == 'undefined') {
                            $scope.factors = data["SUCCESS"];
                        }
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        $scope.backmodelChanged = function (modelid, factorid) {
            //console.log(id);
            for (var i = 0; i < $scope.modelinfos.length; i++) {
                if ($scope.modelinfos[i]._id == modelid) {

                    $scope.modelinfodetail = $scope.modelinfos[i];
                    //console.log($scope.modelinfodetail.min);
                }
            }
            //console.log(url_ratinglistbymodelidangular_scala+"/"+id);
            if ($scope.modelinfodetail.status == 'draft') {
                $('#btnInsert').show();
            }
            else {
                $('#btnInsert').hide();
            }

            $http.post(appSettings.serverPath + "/factoroption/getbymodelid", { modelid: modelid }).
                success(function (data, status, headers, config) {
                    //console.log(data["SUCCESS"]);
                    //console.log(data);
                    $scope.factors = [];
                    if (typeof data["ERROR"] == 'undefined') {
                        $scope.factors = data["SUCCESS"];
                        for (var i = 0; i < $scope.factors.length; i++) {
                            if ($scope.factors[i]._id == factorid) {
                                //console.log($scope.factors[i]["FactorOption"][0].FactorOptionName);

                                $scope.factoroptions = $scope.factors[i]["FactorOption"];

                            }
                        }
                    }
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        }

        $scope.factorChanged = function () {
            $scope.factorChanged = function (id) {
                //console.log(id)
                for (var i = 0; i < $scope.factors.length; i++) {
                    if ($scope.factors[i]._id == id) {
                        //console.log($scope.factors[i]["FactorOption"][0].FactorOptionName);

                        $scope.factoroptions = $scope.factors[i]["FactorOption"];

                    }
                }
            }
        }

        $scope.validatemodel = function () {
            $scope.validatemodel = function () {
                //console.log('aaa');
                checkweightrate($scope.choiceModel);
            }
        }

        $scope.getfactoroptiondetailangular = function (l, factorId, factorOptionId) {
            //console.log(factorId)
            $http.post(url, { factorId: factorId, factorOptionId: factorOptionId }).
                success(function (data, status, headers, config) {
                    $scope.factoroptiondetail = data["FactorsOptionItem"];
                    //console.log($scope.factoroptiondetail.FactorOptionName);
                    //console.log($scope.modelinfodetail.name+"-->"+$scope.modelinfodetail.min);
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
        $scope.factoroptionadd = function () {
            $scope.factoroptionadd = function () {
                window.location.assign("/factoroptiondetail.html?modelid=" + $scope.choiceModel + "&factorId=" + $scope.choiceFactor);
            }
        }

        $scope.factoroptiondelete = function (l) {
            $scope.factoroptiondelete = function (factorid, factoroptionid) {
                //console.log(factorid+":"+factoroptionid);
                $http.post(url, { idFactor: factorid, idFactorOption: factoroptionid }).
                  success(function (data, status, headers, config) {
                      //console.log(data);
                      //window.location.assign("/factoroptions.html")
                      for (var i = 0; i < $scope.factoroptions.length; i++) {
                          if ($scope.factoroptions[i].FactorOptionId == factoroptionid) {
                              $scope.factoroptions.splice(i, 1);
                          }
                      }

                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                  });
            }
        }

        $scope.actionfactoroptiondetailangular = function () {
            //console.log($scope.groups._id
            $scope.save = function () {
                if (!$scope.formFartorOption.$valid) {
                    //console.log("Form valid!");
                    return;
                }
                var factoroptions = {};
                var url = '';
                if (typeof $scope.factoroptiondetail.FactorOptionId == 'undefined' || $scope.factoroptiondetail.FactorOptionId == '') {
                    url = url_factoroptioninsert_scala;
                    //console.log(url);
                    factoroptions = {
                        FactorId: $scope.choiceFactor,
                        FactorOptionName: $scope.factoroptiondetail.FactorOptionName,
                        Description: $scope.factoroptiondetail.Description,
                        Fatal: $scope.factoroptiondetail.Fatal,
                        Score: $scope.factoroptiondetail.Score,
                        Status: $scope.factoroptiondetail.Status
                    };

                }
                else {
                    url = url_factoroptionupdate_scala;
                    //console.log(url);
                    factoroptions = {
                        idFactor: $scope.choiceFactor,
                        idFactorOption: $scope.factoroptiondetail.FactorOptionId,
                        FactorOptionName: $scope.factoroptiondetail.FactorOptionName,
                        Description: $scope.factoroptiondetail.Description,
                        Fatal: $scope.factoroptiondetail.Fatal,
                        Score: $scope.factoroptiondetail.Score,
                        Status: $scope.factoroptiondetail.Status
                    };

                }
                $http.post(url, angular.toJson(factoroptions)).
                  success(function (data, status, headers, config) {
                      window.location.assign("/factoroptions.html?modelid=" + $scope.choiceModel + "&factorid=" + $scope.choiceFactor)
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                  });
            }
        }

        $scope.modellistbymodelsatusangular();
    }
}());