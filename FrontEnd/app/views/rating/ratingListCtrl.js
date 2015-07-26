(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RatingListCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     RatingListCtrl]);

    function RatingListCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

        $scope.choiceModel = $stateParams.modelId;

        $http.get(appSettings.serverPath + "/modelinfo/getall")
                .success(function (data) {
                    //console.log(data);
                    $scope.models = data.getModelInfoJSON.body;

                    if ($scope.choiceModel != '') {
                        $scope.modelChanged($scope.choiceModel);
                    }
                })        

        // Mode select change
        $scope.modelChanged = function (modelid) {

            // Return select default
            if (modelid == null || modelid == '') {
                $scope.model = {};
                $scope.ratings = {};

                return;
            }

            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == modelid) {
                    $scope.model = $scope.models[i];
                }
            }
            
            // Get rating by modelId
            $http.get(appSettings.serverPath + "/rating/getmodelid" + "/" + modelid)
                .success(function (data) {

                    if (data.getbymodelid.header.code == 0) {
                        $scope.modelRatings = data.getbymodelid.body;
                        //console.log(data.getbymodelid.body);
                        $scope.ratings = data.getbymodelid.body[0].codein.sort(function (a, b) {
                            return a.scorefrom - b.scorefrom;
                        });
                    }
                    else {
                        //console.log('AA');
                        $scope.modelRatings = [];
                        $scope.ratings = [];
                    }

                })

        }

        // Vadlidate rating
        $scope.ratingCheckRating = function () {
            $scope.ratingCheckRating = function () {
                for (var i = 0; i < ($scope.ratings.length - 1) ; i++) {
                    if ($scope.ratings[i].scoreto != $scope.ratings[i + 1].scorefrom) {
                        console.log("Rating in model false!");
                        return false;
                    }
                }
                console.log("Rating in model true!");
            }
        }

        // Generator scoring range
        $scope.gennerateScoringRange = function () {
            $scope.gennerateScoringRange = function (index) {
                //console.log(url_modelrangerandupdateangular_scala);
                $http.post(url_modelrangerandupdateangular_scala, { id: $scope.model._id })
                    .success(function (data, status, headers, config) {
                        $scope.model = data["SUCCESS"];
                        //console.log($scope.model.name+"-->"+$scope.model.min);
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

            }
        }

        $scope.validateModel = function () {
            //console.log('aaa');
            checkweightrate($scope, $http, appSettings, $scope.choiceModel);
        }


        // Delete data
        $scope.ratingDelete = function (index) {
            if (popupService.showPopup('Are you sure delete this model?')) {
                $http.post(appSettings.serverPath + "/rating/delete", { modelid: $scope.choiceModel, code: $scope.ratings[index].code })
                    .success(function (data, status, headers, config) {
                        $scope.ratings.splice(index, 1);
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        $scope.ratingCheckRating = function () {
            for (var i = 0; i < ($scope.ratings.length - 1) ; i++) {
                if ($scope.ratings[i].scoreto != $scope.ratings[i + 1].scorefrom) {
                    popupService.showMessage("Rating in model false!");
                    return false;
                }
            }
            popupService.showMessage("Rating in model true!");
        }
    }
}());
