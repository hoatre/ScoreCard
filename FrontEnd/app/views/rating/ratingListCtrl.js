(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RatingListCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings",
                     RatingListCtrl]);

    function RatingListCtrl($scope, $http, $state, $stateParams, appSettings) {
        $scope.choiceModel = $stateParams.modelId;
        $http.get(appSettings.serverPath + "/modelinfo/getall")
                .success(function (data) {
                    //console.log(data);
                    $scope.modelinfos = data.getModelInfoJSON.body;
                    if ($scope.choiceModel != '') {
                        $scope.backmodelChanged($scope.choiceModel);
                    }
                })

        $scope.modelChanged = function (id) {
            //console.log($scope.MODULE_CHOICE);
            for (var i = 0; i < $scope.modelinfos.length; i++) {
                if ($scope.modelinfos[i]._id == id) {
                    $scope.modelinfodetail = $scope.modelinfos[i];
                    //console.log($scope.modelinfodetail.min);
                    if ($scope.modelinfodetail.status == 'draft') {
                        $('#btnInsert').show();

                        $('#btnGennerateScoringRange').show();
                        $('#btnValidateModel').show();
                        $('#btnCheckRating').show();
                    }
                    else {
                        $('#btnInsert').hide();
                        $('#btnGennerateScoringRange').show();
                        $('#btnValidateModel').show();
                        $('#btnCheckRating').show();
                        if ($scope.modelinfodetail.status == "publish") {
                            $('#btnGennerateScoringRange').hide();
                            $('#btnValidateModel').hide();
                            $('#btnCheckRating').hide();
                        }
                    }
                }
            }
            //console.log(url_ratinglistbymodelidangular_scala+"/"+id);
            $http.get(url_ratinglistbymodelidangular_scala + "/" + id)
            .success(function (data) {

                if (typeof data["ERROR"] == 'undefined') {
                    $scope.modelforrating = data["SUCCESS"][0];
                    $scope.ratings = data["SUCCESS"][0]["codein"].sort(function (a, b) {
                        return a.scorefrom - b.scorefrom;
                    });
                }
                else {
                    //console.log('AA');
                    $scope.modelforrating = [];
                    $scope.ratings = [];
                }

            })
        }

        $scope.backmodelChanged = function (modelid) {
            //console.log($scope.modelinfos);
            for (var i = 0; i < $scope.modelinfos.length; i++) {
                if ($scope.modelinfos[i]._id == modelid) {
                    $scope.modelinfodetail = $scope.modelinfos[i];
                    //console.log($scope.modelinfodetail.min);
                    if ($scope.modelinfodetail.status == 'draft') {
                        $('#btnInsert').show();

                        $('#btnGennerateScoringRange').show();
                        $('#btnValidateModel').show();
                        $('#btnCheckRating').show();
                    }
                    else {
                        $('#btnInsert').hide();
                        $('#btnGennerateScoringRange').show();
                        $('#btnValidateModel').show();
                        $('#btnCheckRating').show();
                        if ($scope.modelinfodetail.status == "publish") {
                            $('#btnGennerateScoringRange').hide();
                            $('#btnValidateModel').hide();
                            $('#btnCheckRating').hide();
                        }
                    }
                }
            }
            //console.log(url_ratinglistbymodelidangular_scala+"/"+id);
            $http.get(appSettings.serverPath + "/rating/getmodelid" + "/" + modelid)
                .success(function (data) {

                    if (typeof data["ERROR"] == 'undefined') {
                        $scope.modelforrating = data.getbymodelid.body;
                        //console.log(data.getbymodelid.body);
                        $scope.ratings = data.getbymodelid.body[0].codein.sort(function (a, b) {
                            return a.scorefrom - b.scorefrom;
                        });


                    }
                    else {
                        //console.log('AA');
                        $scope.modelforrating = [];
                        $scope.ratings = [];
                    }

                })

        }

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

        $scope.gennerateScoringRange = function () {
            $scope.gennerateScoringRange = function (index) {
                //console.log(url_modelrangerandupdateangular_scala);
                $http.post(url_modelrangerandupdateangular_scala, { id: $scope.modelinfodetail._id }).
                    success(function (data, status, headers, config) {
                        $scope.modelinfodetail = data["SUCCESS"];
                        //console.log($scope.modelinfodetail.name+"-->"+$scope.modelinfodetail.min);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

            }
        }

        $scope.validatemodel = function () {
            //console.log('aaa');
            checkweightrate($scope, $http, appSettings, $scope.choiceModel);
        }

        $scope.ratingAdd = function () {
            //window.location.assign("#/ratingedit/" + $scope.choiceModel + "/");

            $state.go('ratingedit', { modelId: $scope.choiceModel, ratingId: "" });
        }

        $scope.ratingdelete = function (index) {
            //console.log($scope.ratings[index].code);
            $http.post(appSettings.serverPath + "/rating/delete", { modelid: $scope.modelforrating.modelid, code: $scope.ratings[index].code }).
                success(function (data, status, headers, config) {
                    //console.log(data);
                    //console.log($scope.ratings.length);
                    $scope.ratings.splice(index, 1);
                    //console.log($scope.ratings.length);
                    //window.location.assign("/ratings.html")
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.ratingCheckRating = function () {
            for (var i = 0; i < ($scope.ratings.length - 1) ; i++) {
                if ($scope.ratings[i].scoreto != $scope.ratings[i + 1].scorefrom) {
                    alert("Rating in model false!");
                    return false;
                }
            }
            alert("Rating in model true!");
        }

        //$scope.modellistangular();
    }
}());
