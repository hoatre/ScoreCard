(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("DashboardCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     DashboardCtrl]);

    function DashboardCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

        $scope.bars = {};

        $http.post(appSettings.serverPath + "/spark/scoringrange", { modelId: "cd602b77-b570-4a56-8590-eb65e55b8210" })
            .success(function (data) {
                $scope.bars = data.ScoringRange.body;
                var sumCount = 0;
                for(var i = 0; i<$scope.bars.length; i++){
                    sumCount = parseInt(sumCount) + parseInt($scope.bars[i].application_count)
                }
                var dataPoints = [];
                for(var i = 0; i<$scope.bars.length; i++){
                    dataPoints.push({
                        label: $scope.bars[i].rating_code,
                        y: (parseInt($scope.bars[i].application_count)/parseInt(sumCount))*100
                    });
                }
                var dataPointsPie = [];
                for(var i = 0; i<$scope.bars.length; i++){
                    dataPointsPie.push({
                        label: $scope.bars[i].rating_code,
                        y: $scope.bars[i].application_count
                    });
                }
                $scope.chart = new CanvasJS.Chart("chartContainer", {
                    theme: 'theme1',
                    title:{
                        text: "Scoring Range Chart"
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
                    theme: 'theme1',
                    title:{
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
            });

        $scope.topbot1T = {}
        $scope.topbot1B = {}
        $http.post(appSettings.serverPath + "/spark/topbot", { factorOptionId: "d848e3f9-9ae6-4c46-ba46-62adb892e94d" })
            .success(function (data) {
                $scope.topbot1T = data.ScoringRange.body[0].Top
                $scope.topbot1B = data.ScoringRange.body[1].Bot
            });

        $scope.topbot2T = {}
        $scope.topbot2B = {}
        $http.post(appSettings.serverPath + "/spark/topbot", { factorOptionId: "878578e5-c9f4-430e-a129-446eaa69b374" })
            .success(function (data) {
                $scope.topbot2T = data.ScoringRange.body[0].Top
                $scope.topbot2B = data.ScoringRange.body[1].Bot
            });

    }

}());