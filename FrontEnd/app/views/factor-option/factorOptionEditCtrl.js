(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorOptionEditCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings",
                     FactorOptionEditCtrl]);

    function FactorOptionEditCtrl($scope, $http, $state, $stateParams, appSettings) {
        //alert("aaa");
        $scope.factoroptiondetail = {};
        $scope.factoroptiondetail.FactorId = $stateParams.factorId;
        
        if ($stateParams.factorOptionId != '') {
            //alert($stateParams.factorOptionId);
            $http.post(appSettings.serverPath + "/factoroption/getbyfactoroptionid", {  _id: $stateParams.factorOptionId,FactorId: $stateParams.factorId }).
            success(function (data, status, headers, config) {
                if (data["getFactorOptionByIdJSON"]["header"].code == 0) {
                    $scope.factoroptiondetail = data["getFactorOptionByIdJSON"]["body"];
                }
                else {
                    alert(data["getFactorOptionByIdJSON"]["header"].message);
                }
                //console.log($scope.factoroptiondetail.FactorOptionName);
                //console.log($scope.modelinfodetail.name+"-->"+$scope.modelinfodetail.min);
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        $scope.save = function () {
           
            if (!$scope.formFartorOption.$valid) {
                //console.log("Form valid!");
                
                return;
            }
            
            var factoroptions = {};
            var url = '';
            var strMsg = '';
            if (typeof $scope.factoroptiondetail.FactorOptionId == 'undefined' || $scope.factoroptiondetail.FactorOptionId == '') {
                url = appSettings.serverPath + "/factoroption/insertoption";
                strMsg = "insertFactorOption";
                //console.log(url);
                factoroptions = {
                    FactorId: $stateParams.factorId,
                    FactorOptionName: $scope.factoroptiondetail.FactorOptionName,
                    Description: $scope.factoroptiondetail.Description,
                    Fatal: $scope.factoroptiondetail.Fatal,
                    Score: $scope.factoroptiondetail.Score,
                    Status: ""
                };

            }
            else {
                url = appSettings.serverPath + "/factoroption/updateoption";
                strMsg = "updateFactorOption";
                //alert($stateParams.factorOptionId + " : " + $scope.factoroptiondetail.FactorOptionId)
                factoroptions = {
                    FactorId: $stateParams.factorId,
                    _id: $scope.factoroptiondetail.FactorOptionId,
                    FactorOptionName: $scope.factoroptiondetail.FactorOptionName,
                    Description: $scope.factoroptiondetail.Description,
                    Fatal: $scope.factoroptiondetail.Fatal,
                    Score: $scope.factoroptiondetail.Score,
                    Status: $scope.factoroptiondetail.Status
                };

            }
            $http.post(url, angular.toJson(factoroptions)).
              success(function (data, status, headers, config) {
                  if (data[strMsg]["header"].code == 0) {
                      //window.location.assign("#/factoroption/" + $scope.factorDetail.ModelId)
                      //alert($stateParams.modelId + " : " + $stateParams.factorId)
                      $state.go('factoroption', { modelId: $stateParams.modelId, factorId: $stateParams.factorId });
                  }
                  else {
                      alert(data[strMsg]["header"].message);
                  }
              }).
              error(function (data, status, headers, config) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
              });
        }

    }
}());