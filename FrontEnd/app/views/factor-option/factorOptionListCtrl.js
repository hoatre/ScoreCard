(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorOptionListCtrl",
                    ["$scope", "$http", "$stateParams", "appSettings", "popupService",
                     FactorOptionListCtrl]);

    function FactorOptionListCtrl($scope, $http, $stateParams, appSettings, popupService) {

        $scope.model = {};
        $scope.factors = {};
        $scope.factorOptions = {};

        $scope.choiceModel = $stateParams.modelId;
        $scope.choiceFactor = $stateParams.factorId;

        $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfostatus", { status: 'draft' })
        .success(function (data, status, headers, config) {
            //console.log(data);
            $scope.models = data.getModelInfoByStatusJSON.body;

            if ($scope.choiceModel != '') {
                $scope.modelChanged($scope.choiceModel);

                if ($scope.choiceFactor != '') {
                    $scope.factorChanged($scope.choiceFactor);
                }
            }
        })
        .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });


        function backmodelChanged($scope, $http, modelid, factorid) {
            console.log('Vai dan');
            //alert(modelid);
            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == modelid) {

                    $scope.model = $scope.models[i];
                    //alert($scope.model.min);
                }
            }
            //alert(url_ratinglistbymodelidangular_scala+"/"+id);
            if ($scope.model.status == 'draft') {
                $('#btnInsert').show();
            }
            else {
                $('#btnInsert').hide();
            }

            $http.post(appSettings.serverPath + "/factoroption/getbymodelid", { modelid: modelid }).
                success(function (data, status, headers, config) {
                    //console.log(data["SUCCESS"]);
                    //alert(data);
                    $scope.factors = [];
                    if (typeof data["ERROR"] == 'undefined') {
                        $scope.factors = data["SUCCESS"];
                        for (var i = 0; i < $scope.factors.length; i++) {
                            if ($scope.factors[i]._id == factorid) {
                                //alert($scope.factors[i]["FactorOption"][0].FactorOptionName);

                                $scope.factorOptions = $scope.factors[i]["FactorOption"];

                            }
                        }
                    }
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        }

        // Model select change
        $scope.modelChanged = function (id) {
            //console.log(id);
            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == id) {
                    $scope.model = $scope.models[i];
                    //console.log($scope.model.min);
                }
            }
            //console.log(url_ratinglistbymodelidangular_scala+"/"+id);
            if ($scope.model.status == 'draft') {
                $('#btnInsert').show();
            }
            else {
                $('#btnInsert').hide();
            }
            $http.post(appSettings.serverPath + "/factoroption/getbymodelid", { modelid: id }).
                success(function (data, status, headers, config) {
                    if (typeof data["ERROR"] == 'undefined') {
                        $scope.factors = data["SUCCESS"];
                    }
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }


        // Factor select change
        $scope.factorChanged = function (id) {
            //console.log(id)
            for (var i = 0; i < $scope.factors.length; i++) {
                if ($scope.factors[i]._id == id) {
                    //console.log($scope.factors[i]["FactorOption"][0].FactorOptionName);
                    $scope.factorOptions = $scope.factors[i]["FactorOption"];

                }
            }
        }

        // Validate model
        $scope.validateModel = function () {
            //console.log('aaa');
            checkweightrate($scope, $http, appSettings, $scope.choiceModel);
        }

        // Delete data
        $scope.factorOptionDelete = function (_id, FactorId) {
            //console.log(factorid+":"+factoroptionid);
            $http.post(appSettings.serverPath + "/factoroption/deleteoption", { _id: _id, FactorId: FactorId }).
              success(function (data, status, headers, config) {
                  //console.log(data);
                  //window.location.assign("/factorOptions.html")
                  if (data["deleteOptionFactor"]["header"].code == 0) {
                      for (var i = 0; i < $scope.factorOptions.length; i++) {
                          if ($scope.factorOptions[i].FactorOptionId == _id) {
                              $scope.factorOptions.splice(i, 1);
                          }
                      }
                  }
                  else {
                      alert(data["deleteOptionFactor"]["header"].message);
                  }


              }).
              error(function (data, status, headers, config) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
              });
        }

        //$scope.modellistbymodelsatusangular();
    }
}());