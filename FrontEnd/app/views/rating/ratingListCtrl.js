(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RatingListCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     RatingListCtrl]);

    function RatingListCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

        $scope.choiceModel = $stateParams.modelId;
        $scope.rating = {};

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
                        $scope.modelRatings = [];
                        $scope.ratings = [];
                    }

                });
        }

        // Generator scoring range
        $scope.gennerateScoringRange = function () {
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

        $scope.validateModel = function () {
            //console.log('aaa');
            checkweightrate($scope, $http, appSettings, $scope.choiceModel);
        }


        // Delete data
        $scope.ratingDelete = function (index) {
            if (popupService.showPopup('Are you sure delete this rating?')) {
                $http.post(appSettings.serverPath + "/rating/delete", { modelid: $scope.choiceModel, code: $scope.ratings[index].code })
                    .success(function (data, status, headers, config) {
                        if (data.deleteRating.header.code == 0) {
                            $scope.ratings.splice(index, 1);
                        }
                        else {
                            popupService.showMessage(data.deleteRating.header.message);
                        }
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

        // Add data
        $scope.add = function (editForm) {

            if ($scope.choiceModel == null || $scope.choiceModel == '') {
                popupService.showMessage('You must choise model!')
                return;
            }
            $scope.rating.statusname = $scope.rating.status;
            $scope.rating.note = '';

            var ratingobj = {
                modelid: $scope.choiceModel,
                codein: $scope.rating
            };

            $http.post(appSettings.serverPath + "/rating/add", angular.toJson(ratingobj))
                .success(function (data, status, headers, config) {
                    if (data.Rating.header.code == 0) {
                        $scope.ratings.push($scope.rating);
                        $scope.rating = {};
                        //popupService.showMessage('Insert Success!');
                        editForm.$setPristine();
                    }
                    else {
                        popupService.showMessage(data.Rating.header.message);
                    }
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }
    }
}());
