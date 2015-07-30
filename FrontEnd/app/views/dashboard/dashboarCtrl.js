(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("DashboardCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     DashboardCtrl]);

    function DashboardCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

        $scope.bars = {};

        $http.post(appSettings.serverPath + "/spark/scoringrange", { _id: "c69f764e-d651-42ab-8046-b09e9e2c412e" })
            .success(function (data) {
                $scope.bars = data.ScoringRange.body;
                $scope.chart = new CanvasJS.Chart("chartContainer", {
                    theme: 'theme1',
                    title:{
                        text: "Scoring Range Chart"
                    },
                    axisY: {
                        title: "million units",
                        labelFontSize: 16,
                    },
                    axisX: {
                        labelFontSize: 16,
                    },
                    data: [
                        {
                            type: "column",
                            dataPoints: [
                                { label: $scope.bars[0].rating_code, y: $scope.bars[0].application_count }
                            ]
                        }
                    ]
                });

                $scope.chart.render(); //render the chart for the first time

                $scope.changeChartType = function(chartType) {
                    $scope.chart.options.data[0].type = chartType;
                    $scope.chart.render(); //re-render the chart to display the new layout
                }
            });

    }

}());