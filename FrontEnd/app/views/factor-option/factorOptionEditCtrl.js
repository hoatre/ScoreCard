(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorOptionEditCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     FactorOptionEditCtrl]);

    function FactorOptionEditCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {
        //alert("aaa");
        $scope.factorOption = {};
        $scope.factorOption.FactorId = $stateParams.factorId;
        
        if ($stateParams.factorOptionId != '') {
            //alert($stateParams.factorOptionId);
            $http.post(appSettings.serverPath + "/factoroption/getbyfactoroptionid", {  _id: $stateParams.factorOptionId,FactorId: $stateParams.factorId }).
            success(function (data, status, headers, config) {
                if (data["getFactorOptionByIdJSON"]["header"].code == 0) {
                    $scope.factorOption = data["getFactorOptionByIdJSON"]["body"];
                }
                else {
                    alert(data["getFactorOptionByIdJSON"]["header"].message);
                }
                //console.log($scope.factorOption.FactorOptionName);
                //console.log($scope.modelinfodetail.name+"-->"+$scope.modelinfodetail.min);
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        // Save data
        $scope.save = function () {
           
            if (!$scope.factorOptionForm.$valid) {
                //console.log("Form valid!");
                return;
            }
            
            var factorOptions = {};
            var url = '';
            var strMsg = '';
            if (typeof $scope.factorOption.FactorOptionId == 'undefined' || $scope.factorOption.FactorOptionId == '') {
                url = appSettings.serverPath + "/factoroption/insertoption";
                strMsg = "insertFactorOption";
                //console.log(url);
                factorOptions = {
                    FactorId: $stateParams.factorId,
                    FactorOptionName: $scope.factorOption.FactorOptionName,
                    Description: $scope.factorOption.Description,
                    Fatal: $scope.factorOption.Fatal,
                    Score: $scope.factorOption.Score,
                    Status: ""
                };

            }
            else {
                url = appSettings.serverPath + "/factoroption/updateoption";
                strMsg = "updateFactorOption";
                //alert($stateParams.factorOptionId + " : " + $scope.factorOption.FactorOptionId)
                factorOptions = {
                    FactorId: $stateParams.factorId,
                    _id: $scope.factorOption.FactorOptionId,
                    FactorOptionName: $scope.factorOption.FactorOptionName,
                    Description: $scope.factorOption.Description,
                    Fatal: $scope.factorOption.Fatal,
                    Score: $scope.factorOption.Score,
                    Status: $scope.factorOption.Status
                };

            }
            $http.post(url, angular.toJson(factorOptions))
              .success(function (data, status, headers, config) {
                  if (data[strMsg]["header"].code == 0) {
                      //window.location.assign("#/factoroption/" + $scope.factorDetail.ModelId)
                      //alert($stateParams.modelId + " : " + $stateParams.factorId)
                      popupService.showMessage(strMsg + " Success!")
                      $scope.back();
                  }
                  else {
                      alert(data[strMsg]["header"].message);
                  }
              })
              .error(function (data, status, headers, config) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
              });
        }

        // Reset data to original
        $scope.cancel = function (editForm) {
            editForm.$setPristine();
            //$scope.model = angular.copy($scope.originalModel);
            $scope.message = "";
        };

        // Back to list
        $scope.back = function () {
            $state.go("factorOptionList", { modelId: $stateParams.modelId, factorId: $stateParams.factorId });
        }
    }
}());