(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("Dashboard2Ctrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     Dashboard2Ctrl]);

    function Dashboard2Ctrl($scope, $http, $state, $stateParams, appSettings, popupService) {
        $http.post(appSettings.serverPath + "/spark/percentoptionoffactor", { modelId: "19028285-5fd1-40d7-be66-5e630f948ee5" })
            .success(function (data) {
                $scope.chartFt = new CanvasJS.Chart("chartFtOtpINFt",
                    {
                        theme: 'theme2',
                        title:{
                            text: data.PercentOptionOfFactor.body.modelName

                        },
                        toolTip:{
                            content: "{name} : #percent%"
                        },
                        animationEnabled: true,
                        axisY:{
                            title: "percent"
                        },
                        data:data.PercentOptionOfFactor.body.data

                    });

                $scope.chartFt.render();
        });

    }

}());