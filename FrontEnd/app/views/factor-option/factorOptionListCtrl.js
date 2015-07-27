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
            }
        })
        .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        // Model select change
        $scope.modelChanged = function (id) {
            //console.log(id);
            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == id) {
                    $scope.model = $scope.models[i];
                    //console.log($scope.model.min);
                }
            }
   
            // Get all factor leaf
            $http.post(appSettings.serverPath + "/factoroption/getbymodelid", { modelid: id })
                .success(function (data, status, headers, config) {
                    if (typeof data["ERROR"] == 'undefined') {
                        $scope.factors = data["SUCCESS"];

                        if ($scope.choiceFactor != '') {
                            $scope.factorChanged($scope.choiceFactor);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }


        // Factor select change
        $scope.factorChanged = function (id) {            
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
        $scope.factorOptionDelete = function (_id, factorId) {
            if (popupService.showPopup('Are you sure delete this factor option?')) {
                //console.log(factorid+":"+factoroptionid);
                $http.post(appSettings.serverPath + "/factoroption/deleteoption", { _id: _id, FactorId: factorId }).
                  success(function (data, status, headers, config) {
                      //console.log(data);
                      //window.location.assign("/factorOptions.html")
                      if (data.deleteOptionFactor.header.code == 0) {
                          for (var i = 0; i < $scope.factorOptions.length; i++) {
                              if ($scope.factorOptions[i].FactorOptionId == _id) {
                                  $scope.factorOptions.splice(i, 1);
                              }
                          }
                      }
                      else {
                          popupService.showMessage(data.deleteOptionFactor.header.message);
                      }


                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                  });
            }
        }

        // Add data
        $scope.add = function (editForm) {

            if (!$scope.factorOptionForm.$valid) {
                return;
            }

            if (typeof $scope.factorOption.FactorOptionId == 'undefined' || $scope.factorOption.FactorOptionId == '') {
                
                $scope.factorOption.FactorId = $scope.choiceFactor;
                $scope.factorOption.Status = "";
            }

            $http.post(appSettings.serverPath + "/factoroption/insertoption", $scope.factorOption)
              .success(function (data, status, headers, config) {
                  if (data.insertFactorOption.header.code == 0) {

                      $scope.factorOptions.push(data.insertFactorOption.body);
                      //popupService.showMessage("Insert Success!");
                      $scope.factorOption = {};
                      editForm.$setPristine();
                  }
                  else {
                      popupService.showMessage(data.insertFactorOption.header.message);
                  }
              })
              .error(function (data, status, headers, config) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
              });
        }
    }
}());