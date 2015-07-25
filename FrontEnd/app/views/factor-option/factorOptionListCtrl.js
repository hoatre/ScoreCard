(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorOptionListCtrl",
                    ["$scope", "$http", "$stateParams", "appSettings",
                     FactorOptionListCtrl]);

    function FactorOptionListCtrl($scope, $http, $stateParams, appSettings) {
        $scope.choiceModel = $stateParams.modelId;
        $scope.choiceFactor = $stateParams.factorId;
        $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfostatus", { status: 'draft' }).
        success(function (data, status, headers, config) {
            //console.log(data);
            $scope.modelinfos = data.getModelInfoByStatusJSON.body;
            if ($scope.choiceModel != '') {
                backmodelChanged($scope, $http, $scope.choiceModel, $scope.choiceFactor);
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        
        function backmodelChanged($scope, $http, modelid, factorid) {
            //alert(modelid);
            for (var i = 0; i < $scope.modelinfos.length; i++) {
                if ($scope.modelinfos[i]._id == modelid) {

                    $scope.modelinfodetail = $scope.modelinfos[i];
                    //alert($scope.modelinfodetail.min);
                }
            }
            //alert(url_ratinglistbymodelidangular_scala+"/"+id);
            if ($scope.modelinfodetail.status == 'draft') {
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

        

        $scope.factorChanged = function (id) {
            //console.log(id)
            for (var i = 0; i < $scope.factors.length; i++) {
                if ($scope.factors[i]._id == id) {
                    //console.log($scope.factors[i]["FactorOption"][0].FactorOptionName);
                    $scope.factoroptions = $scope.factors[i]["FactorOption"];

                }
            }
        }

        
        $scope.validatemodel = function () {
            //console.log('aaa');
            checkweightrate($scope, $http, appSettings, $scope.choiceModel);
        }


        $scope.factoroptionadd = function () {
            window.location.assign("#/factoroptionedit/" + $scope.choiceModel + "/" + $scope.choiceFactor + "/");
        }

        $scope.factoroptiondelete = function (_id, FactorId) {
            //console.log(factorid+":"+factoroptionid);
            $http.post(appSettings.serverPath + "/factoroption/deleteoption", { _id: _id, FactorId: FactorId }).
              success(function (data, status, headers, config) {
                  //console.log(data);
                  //window.location.assign("/factoroptions.html")
                  if (data["deleteOptionFactor"]["header"].code == 0) {
                      for (var i = 0; i < $scope.factoroptions.length; i++) {
                          if ($scope.factoroptions[i].FactorOptionId == _id) {
                              $scope.factoroptions.splice(i, 1);
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