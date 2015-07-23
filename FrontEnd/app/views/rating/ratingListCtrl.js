(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("RatingListCtrl",
                    ["$scope", "$http", "appSettings",
                     RatingListCtrl]);

    function RatingListCtrl($scope, $http, appSettings) {

        //load form list ratinglist
        $scope.ratinglistangular = function () {

        }

        $scope.modellistangular = function () {
            //console.log(url);
            $http.get(appSettings.serverPath + "/modelinfo/getall")
                .success(function (data) {
                    //console.log(data);
                    $scope.modelinfos = data.getModelInfoJSON.body;
                    if ($scope.choiceModel != '') {
                        $scope.backmodelChanged($scope.choiceModel);
                    }
                })
        }

        $scope.modelChanged = function () {
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
        }

        $scope.backmodelChanged = function ( modelid) {
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

        $scope.validatemodel = function validatemodel() {
            $scope.validatemodel = function () {
                //console.log('aaa');
                checkweightrate( $scope.choiceModel);
            }
        }

        $scope.ratingAdd = function () {
            $scope.ratingAdd = function () {
                window.location.assign("/ratingdetail.html?modelid=" + $scope.modelinfodetail._id);
            }
        }

        $scope.ratingdelete = function () {
            $scope.ratingdelete = function (index) {
                //console.log($scope.ratings[index].code);
                $http.post(url, { modelid: $scope.modelforrating.modelid, code: $scope.ratings[index].code }).
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
        }

        $scope.getratingdetailangular = function () {
            //console.log(url);
            $http.get(url)
                .success(function (data) {
                    $scope.ratings = data["SUCCESS"]["codein"][0];
                    $scope.ratingfull = data["SUCCESS"];
                    //getmodeldetailangular($scope,$http,url_modeldetailangular_scala+"/"+data.rating.modelid);
                })
        }

        $scope.getmodeldetailangular = function () {
            //console.log(url);
            $http.get(url)
                .success(function (data) {
                    //console.log(data["SUCCESS"]);
                    $scope.modeldetail = data["ModelInfosList"][0];
                })
        }

        $scope.actionratingdetailangular = function ( modelid) {
            $scope.save = function () {
                var url = "";
                var ratingobj = {};
                //console.log("aaa");
                var codein = {
                    code: $scope.ratings.code,
                    scorefrom: $scope.ratings.scorefrom,
                    scoreto: $scope.ratings.scoreto,
                    status: $scope.ratings.status,
                    statusname: $scope.ratings.statusname,
                    note: $scope.ratings.note
                };
                ratingobj = {
                    modelid: $scope.modeldetail._id,
                    codein: codein
                };
                url = url_ratinginsertangular_scala;
                //console.log(url);
                //console.log(angular.toJson(ratingobj));
                if (checkrating( $scope.ratings)) {
                    $http.post(url, angular.toJson(ratingobj)).
                    success(function (data, status, headers, config) {
                        // window.location.assign("/ratings.html")
                        window.location.assign("/ratings.html?modelid=" + $scope.modeldetail._id);

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                }
            }
        }


        $scope.checkrating = function ( ratings) {
            if (ratings.scorefrom < ratings.scoreto) {
                if ($scope.modeldetail.minscore > ratings.scorefrom) {
                    console.log("Score form more than minscore of model!");
                    return false;
                }
                else {
                    if ($scope.modeldetail.maxscore < ratings.scoreto) {
                        console.log("Model maximum more than Score to!");
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                console.log("Score to more than score form!");
                return false;
            }
        }

        $scope.modellistangular();
    }
}());
