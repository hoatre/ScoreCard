(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorEditCtrl",
                    ["$scope", "$http","$stateParams", "appSettings",
                     FactorEditCtrl]);

    function FactorEditCtrl($scope, $http, $stateParams, appSettings) {
        $scope.factorDetail = {};

        $scope.factorDetail.ModelId = $stateParams.modelId;
        $scope.factorDetail.Parentid = "";
        $scope.factorDetail.ParentName = "";
        $scope.factorDetail.Ordinal = 0;
        $scope.factorDetail.Status = '';
        $scope.factorDetail.Note = '';
        $http.post(appSettings.serverPath + "/modelinfo/view", { _id: $stateParams.modelId }).
		success(function (data, status, headers, config) {
		    if (data["viewModelInfo"]["header"].code == 0) {
		        $scope.factors = data["viewModelInfo"]["body"];
		        if ($stateParams.factorId != null) {
		            for (var i = 0; i < $scope.factors.length; i++) {   
		                if ($scope.factors[i]._id == $stateParams.factorId) {
		                    //alert($scope.factors[i].FactorName);
		                    $scope.factorDetail = $scope.factors[i];
		                }
		            }
		        }
		    }
		    else {
		        alert(data["viewModelInfo"]["header"].message);
		    }
		}).
		error(function (data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});

        //submit
        $scope.save = function () {
            if (!$scope.formFactor.$valid) {
                //alert("Form valid!");
                return;
            }
            //alert(url);
            var factors = {};
            var url = '';
            var strMsg = '';
            //alert($scope.factorDetail._id);
            if (typeof $scope.factorDetail._id == 'undefined' || $scope.factorDetail._id == '') {
                factors = {
                    ModelId: $scope.factorDetail.ModelId,
                    Parentid: $scope.factorDetail.Parentid,
                    ParentName: $scope.factorDetail.ParentName,
                    Description: $scope.factorDetail.Description,
                    Name: $scope.factorDetail.FactorName,
                    Weight: $scope.factorDetail.Weight,
                    Ordinal: $scope.factorDetail.Ordinal,
                    Status: $scope.factorDetail.Status,
                    Note: $scope.factorDetail.Note
                };
                url = appSettings.serverPath + "/factor/insert";
                strMsg = "insertFactor";
            }
            else {
                //alert($scope.factorDetail.FactorName);
                factors = {
                    _id: $scope.factorDetail._id,
                    Parentid: $scope.factorDetail.Parentid,
                    ParentName: $scope.factorDetail.ParentName,
                    Description: $scope.factorDetail.Description,
                    Name: $scope.factorDetail.FactorName,
                    Weight: $scope.factorDetail.Weight,
                    Ordinal: $scope.factorDetail.Ordinal,
                    Status: $scope.factorDetail.Status,
                    Note: $scope.factorDetail.Note
                };
                url = appSettings.serverPath + "/factor/update";
                strMsg = "updateFactor";
            }

            $http.post(url, angular.toJson(factors)).
              success(function (data, status, headers, config) {
                  if (data[strMsg]["header"].code == 0) {
                      window.location.assign("#/factor/" + $scope.factorDetail.ModelId)
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