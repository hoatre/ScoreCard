(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("DashboardCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     DashboardCtrl]);

    function DashboardCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

        //$scope.bars = {};

        $scope.topbot1T = {}
        $scope.topbot1B = {}


        $scope.topbot2T = {}
        $scope.topbot2B = {}

        $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfostatus", { status: 'publish' })
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
        $scope.option1Changed = function (id) {
            //console.log(id);
            for (var i = 0; i < $scope.factorOption1s.length; i++) {
                if ($scope.factorOption1s[i].FactorOptionId == id) {
                    $scope.factorOption1 = $scope.factorOption1s[i];
                    //console.log($scope.model.min);
                }
            }
            if(id != null) {
                $http.post(appSettings.serverPath + "/spark/topbot", {factorOptionId: id})
                    .success(function (data) {
                        if(data.ScoringRange.body!=null) {
                            $scope.topbot1T = data.ScoringRange.body[0].Top
                            $scope.topbot1B = data.ScoringRange.body[1].Bot
                        }
                    });
            }
        }

        $scope.option2Changed = function (id) {
            //console.log(id);
            for (var i = 0; i < $scope.factorOption2s.length; i++) {
                if ($scope.factorOption2s[i].FactorOptionId == id) {
                    $scope.factorOption2 = $scope.factorOption2s[i];
                    //console.log($scope.model.min);
                }
            }
            if(id != null) {
                $http.post(appSettings.serverPath + "/spark/topbot", {factorOptionId: id})
                    .success(function (data) {
                        if(data.ScoringRange.body!=null) {
                            $scope.topbot2T = data.ScoringRange.body[0].Top
                            $scope.topbot2B = data.ScoringRange.body[1].Bot
                        }
                    });
            }
        }

        $scope.modelChanged = function (id) {
            //console.log(id);
            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == id) {
                    $scope.model = $scope.models[i];
                    //console.log($scope.model.min);
                }
            }

            if (id != null) {

                $http.post(appSettings.serverPath + "/factoroption/getoptionbymodelid", { modelid: id })
                    .success(function (data, status, headers, config) {
                        //console.log(data);
                        $scope.factorOption1s = data.SUCCESS;

                        if ($scope.choiceOptl != '') {
                            $scope.option1Changed($scope.choiceOptl);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                $http.post(appSettings.serverPath + "/factoroption/getoptionbymodelid", { modelid: id })
                    .success(function (data, status, headers, config) {
                        //console.log(data);
                        $scope.factorOption2s = data.SUCCESS;

                        if ($scope.choiceOpt2 != '') {
                            $scope.option2Changed($scope.choiceOpt2);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                $http.post(appSettings.serverPath + "/spark/scoringrange", {modelId: id})
                    .success(function (data) {
                        if (data.ScoringRange.body != null) {
                            $scope.bars = data.ScoringRange.body;
                            var sumCount = 0;
                            for (var i = 1; i < $scope.bars.length; i++) {
                                sumCount = parseInt(sumCount) + parseInt($scope.bars[i].application_count)
                            }
                            var dataPoints = [];
                            for (var i = 1; i < $scope.bars.length; i++) {
                                dataPoints.push({
                                    label: $scope.bars[i].rating_code,
                                    y: (parseInt($scope.bars[i].application_count) / parseInt(sumCount)) * 100
                                });
                            }
                            var dataPointsPie = [];
                            for (var i = 1; i < $scope.bars.length; i++) {
                                dataPointsPie.push({
                                    label: $scope.bars[i].rating_code,
                                    y: $scope.bars[i].application_count
                                });
                            }
                            $scope.chart = new CanvasJS.Chart("chartContainer", {
                                animationEnabled: true,
                                theme: 'theme1',
                                title: {
                                    text: "Scoring Range Chart (" + $scope.bars[0].modelName + ")"
                                },
                                axisY: {
                                    title: "percent"
                                },
                                data: [
                                    {
                                        type: "column",
                                        dataPoints: dataPoints
                                    }
                                ]
                            });

                            $scope.chart.render(); //render the chart for the first time

                            $scope.chartPie = new CanvasJS.Chart("chartPie", {
                                animationEnabled: true,
                                theme: 'theme1',
                                title: {
                                    text: ""
                                },
                                data: [
                                    {
                                        type: "pie",
                                        dataPoints: dataPointsPie
                                    }
                                ]
                            });

                            $scope.chartPie.render(); //render the chart for the first time
                        }
                    });
            }else {

            }
        }

    }

}());