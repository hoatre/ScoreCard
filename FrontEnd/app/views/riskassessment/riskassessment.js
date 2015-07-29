(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RiskAssessmentCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     RiskAssessmentCtrl]);

    //load all model
    function RiskAssessmentCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {
        $scope.customerChanged = '';
        $scope.choiceFactorOption = '';
        $scope.showFactorParent = false;
        $scope.showFactorOption = false;
        $scope.customer = {};
        $scope.model = {};
        $scope.modelList = [];
        $scope.factors = {};
        $scope.factorsLv2 = [];
        $scope.resultin = {};

        //get customer 
        $http.get(appSettings.serverPath + "/scoreresult/result")
        .success(function (data) {
            if (data["getresult"].header.code == 0) {
                $scope.customers = data["getresult"].body;
            }
            else {
            }

        });

        $scope.customerChanged = function (id) {
            $http.get(appSettings.serverPath + "/scoreresult/result/" + id)
            .success(function (data) {
                $scope.showFactorOption = false;
                $scope.showFactorParent = true;
                if (id == null || id == '') {
                    $scope.showFactorParent = false;
                    return;
                }
                if (data["getresult"].header.code == 0) {
                    
                    $scope.factors = data["getresult"].body.factor;
                    $scope.resultin = data["getresult"].body.resultin;
                }
                else {
                }
            });
        }


        /*$http.get(appSettings.serverPath + "/modelinfo/getall")
        .success(function (data) {
            //console.log(data);
            $scope.models = data.getModelInfoJSON.body;
        });

        //load factor and factoroption by model change
        $scope.modelChanged = function (id) {
            //console.log(id);
            $scope.model = {};
            $scope.factors = {};
            if (id == null || id == '') {
                $scope.showFactorParent = false;
                return;
            }
            $scope.showFactorOption = false;
            $scope.showFactorParent = true;
            // Selected model
            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == id) {
                    $scope.model = $scope.models[i];
                }
            }

            $http.post(appSettings.serverPath + "/modelinfo/view", { _id: $scope.model._id }).
            success(function (data, status, headers, config) {

                if (data["viewModelInfo"]["header"].code == 0) {
                    $scope.factors = data.viewModelInfo.body;
                }
                else {
                    //alert(data["viewModelInfo"]["header"].message);
                }


            })
            .error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }*/

        $scope.factorOptionChanged = function (id) {

        }

        $scope.back = function () {
            $scope.showFactorParent = true;
            $scope.showFactorOption = false;
        }

        $scope.save = function () {
            var str = "----EDIT----\n";
            for (var i = 0; i < $scope.factorsLv2.length; i++) {
                str += $scope.factorsLv2[i].FactorName + ": " + $scope.factorsLv2[i].Comment + "\n";
            }
            alert(str);
        }

        //get factor-option by factorid
        $scope.showFactorOptionComment = function (id) {
            $scope.showFactorParent = false;
            $scope.showFactorOption = true;
            $scope.factorsLv2 = [];
            for (var i = 0; i < $scope.factors.length; i++) {
                //alert($scope.factors[i].Parentid + ":" + id);
                if ($scope.factors[i].Parentid == id) {
                    for (var j = 0; j < $scope.resultin.length; j++) {
                        if ($scope.resultin[j].factor_id == $scope.factors[i]._id) {
                            $scope.factors[i].factor_score = $scope.resultin[j].factor_score;
                            $scope.factors[i].factor_option_id = $scope.resultin[j].factor_option_id;
                        }
                    }
                    if (typeof $scope.factors[i].factor_option_id == 'undefined') {
                        $scope.factors[i].factor_option_id = '';
                    }
                    if (typeof $scope.factors[i].factor_score == 'undefined') {
                        $scope.factors[i].factor_score = 0;
                    }
                    $scope.factorsLv2.push($scope.factors[i]);
                }
            }
        }


        //-----------------Loan----------------------

        //----------------EndLoan--------------------

        //-----------------Pricing----------------------

        //----------------EndPricing--------------------
    }

}());
