(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorEditCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     FactorEditCtrl]);

    function FactorEditCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {
        $scope.factor = {};

        $scope.factor.ModelId = $stateParams.modelId;
        $scope.factor.Parentid = "";
        $scope.factor.ParentName = "";
        $scope.factor.Ordinal = 0;
        $scope.factor.Status = '';
        $scope.factor.Note = '';

        $http.post(appSettings.serverPath + "/modelinfo/view", { _id: $stateParams.modelId })
		.success(function (data, status, headers, config) {
		    if (data["viewModelInfo"]["header"].code == 0) {
		        $scope.factors = data["viewModelInfo"]["body"];

		        if ($stateParams.factorId != null) {
		            for (var i = 0; i < $scope.factors.length; i++) {
		                if ($scope.factors[i]._id == $stateParams.factorId) {
		                    //alert($scope.factors[i].FactorName);
		                    $scope.factor = $scope.factors[i];
		                }
		            }
		        }
		    }
		    else {
		        //alert(data["viewModelInfo"]["header"].message);
		    }
		})
		.error(function (data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
        
        //submit
        $scope.save = function () {
            var factors = {};
            var url = '';
            var strMsg = '';
            //alert($scope.factor._id);
            if (typeof $scope.factor._id == 'undefined' || $scope.factor._id == '') {
                factors = {
                    ModelId: $scope.factor.ModelId,
                    Parentid: $scope.factor.Parentid,
                    ParentName: $scope.factor.ParentName,
                    Description: $scope.factor.Description,
                    Name: $scope.factor.FactorName,
                    Weight: $scope.factor.Weight,
                    Ordinal: $scope.factor.Ordinal,
                    Status: $scope.factor.Status,
                    Note: $scope.factor.Note
                };
                url = appSettings.serverPath + "/factor/insert";
                strMsg = "insertFactor";
            }
            else {
                //alert($scope.factor.FactorName);
                factors = {
                    _id: $scope.factor._id,
                    Parentid: $scope.factor.Parentid,
                    ParentName: $scope.factor.ParentName,
                    Description: $scope.factor.Description,
                    Name: $scope.factor.FactorName,
                    Weight: $scope.factor.Weight,
                    Ordinal: $scope.factor.Ordinal,
                    Status: $scope.factor.Status,
                    Note: $scope.factor.Note
                };
                url = appSettings.serverPath + "/factor/update";
                strMsg = "updateFactor";
            }

            $http.post(url, angular.toJson(factors)).
              success(function (data, status, headers, config) {
                  if (data[strMsg]["header"].code == 0) {
                      popupService.showMessage(strMsg + ' success!');
                      $scope.back();
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

        // Reset data to original
        $scope.cancel = function (editForm) {
            editForm.$setPristine();
            //$scope.model = angular.copy($scope.originalModel);
            $scope.message = "";
        };

        // Back to list
        $scope.back = function () {
            $state.go("factorList", {modelId: $stateParams.modelId});
        }
    }

}());