(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("Dashboard2Ctrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     Dashboard2Ctrl]);

    function Dashboard2Ctrl($scope, $http, $state, $stateParams, appSettings, popupService) {
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

        $scope.modelChanged = function (id) {
            //console.log(id);
            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == id) {
                    $scope.model = $scope.models[i];
                    //console.log($scope.model.min);
                }
            }
            if (id != null) {
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
            }else {

            }
        }


    }

}());