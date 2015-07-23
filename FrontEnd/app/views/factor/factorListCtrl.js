(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorListCtrl",
                    ["$scope", "$http", "appSettings",
                     FactorListCtrl]);

    function FactorListCtrl($scope, $http, appSettings) {
        //load form list factorlist

        $scope.modellistangular = function () {
            //console.log(url);
            $http.get(appSettings.serverPath + "/modelinfo/getall")
                .success(function (data) {
                    //console.log(data);
                    $scope.modelinfos = data.getModelInfoJSON.body;
                    if ($scope.choiceModel != '') {
                        backmodelChanged($scope, $http, $scope.choiceModel);
                    }
                })
        }

        $scope.modellistbymodelsatusangular = function ($scope, $http, url) {
            //console.log(url);
            $http.post(url, { status: 'draft' }).
                success(function (data, status, headers, config) {
                    //console.log(data);
                    $scope.modelinfos = data["SUCCESS"];
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.factorlistbymodelidangular = function () {
            //console.log(url_factorlisbymodelidtangular_scala+"-->"+$scope.factordetail.ModelId);
            $http.post(url_factorlisbymodelidtangular_scala, { id: modelid }).
                success(function (data, status, headers, config) {
                    $scope.factors = data["SUCCESS"];
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.modeldetailChanged = function () {
            //console.log(url_factorlisbymodelidtangular_scala+"-->"+$scope.factordetail.ModelId);
            $scope.modeldetailChanged = function (id) {
                //console.log(id);
                $http.post(url_factorlisbymodelidtangular_scala, { id: id }).
                    success(function (data, status, headers, config) {
                        $scope.factors = data["SUCCESS"];
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        $scope.modeldetailChanged = function () {
            //console.log(url_factorlisbymodelidtangular_scala+"-->"+$scope.factordetail.ModelId);
            //console.log(id);
            $http.post(url_factorlisbymodelidtangular_scala, { id: modelid }).
                success(function (data, status, headers, config) {
                    $scope.factors = data["SUCCESS"];
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.modelChanged = function () {
            $scope.modelChanged = function (id) {
                //console.log($scope.MODULE_CHOICE);
                for (var i = 0; i < $scope.modelinfos.length; i++) {
                    if ($scope.modelinfos[i]._id == id) {
                        $scope.modelinfodetail = $scope.modelinfos[i];
                        //console.log($scope.modelinfodetail.min);
                    }
                }
                //console.log(url_ratinglistbymodelidangular_scala+"/"+id);
                if ($scope.modelinfodetail.status == 'draft') {
                    $('#btnInsert').show();

                    $('#btnGennerateScoringRange').show();
                    $('#btnValidateModel').show();
                    //$('#btnCheckRating').show();
                }
                else {
                    $('#btnInsert').hide();
                    $('#btnGennerateScoringRange').show();
                    $('#btnValidateModel').show();
                    //$('#btnCheckRating').show();
                    if ($scope.modelinfodetail.status == "publish") {
                        $('#btnGennerateScoringRange').hide();
                        $('#btnValidateModel').hide();
                        //$('#btnCheckRating').hide();
                    }
                }
                $http.post(url_factorlisbymodelidtangular_scala, { id: $scope.modelinfodetail._id }).
                    success(function (data, status, headers, config) {
                        //$scope.modelinfodetail = data["SUCCESS"];
                        //console.log(data);
                        var factortreelist = [];
                        if (typeof data["ERROR"] == 'undefined') {
                            for (var i = 0; i < data["SUCCESS"].length; i++) {
                                var factortree = {
                                    "factorid": data["SUCCESS"][i]._id,
                                    "parentid": data["SUCCESS"][i].Parentid,
                                    "name": data["SUCCESS"][i].FactorName,
                                    "description": data["SUCCESS"][i].Description,
                                    "weight": data["SUCCESS"][i].Weight + "%",
                                    "status": data["SUCCESS"][i].Status
                                };
                                factortreelist.push(factortree);
                            }
                        }
                        //console.log(1);
                        // prepare the data
                        var source =
                        {
                            dataType: "json",
                            dataFields: [
                                { name: 'factorid', type: 'string' },
                                { name: 'parentid', type: 'string' },
                                { name: 'name', type: 'string' },
                                { name: 'description', type: 'string' },
                                { name: 'weight', type: 'string' },
                                { name: 'status', type: 'string' }
                            ],
                            hierarchy:
                            {
                                keyDataField: { name: 'factorid' },
                                parentDataField: { name: 'parentid' }
                            },
                            id: 'factorid',
                            localData: factortreelist
                        };
                        //console.log(2);
                        var dataAdapter = new $.jqx.dataAdapter(source);
                        // create Tree Grid
                        $("#treeGrid").jqxTreeGrid(
                            {
                                width: "100%",
                                source: dataAdapter,
                                sortable: true,
                                ready: function () {
                                    $("#treeGrid").jqxTreeGrid('expandRow', '2');
                                },
                                rendered: function () {
                                    $(".deleteButtons").click(function (event) {
                                        // end edit and cancel changes.
                                        var rowKey = event.target.getAttribute('data-row');
                                        $http.post(url_factordeletetangular_scala, { id: rowKey }).
                                            success(function (data, status, headers, config) {
                                                if (typeof data["ERROR"] == 'undefined') {
                                                    $("#treeGrid").jqxTreeGrid('deleteRow', rowKey);
                                                }
                                                else {
                                                    console.log(data["ERROR"]);
                                                }
                                                //console.log(data);
                                                //window.location.assign("/factors.html")
                                                //$scope.factors.splice(index, 1);
                                            }).
                                            error(function (data, status, headers, config) {
                                                // called asynchronously if an error occurs
                                                // or server returns response with an error status.
                                            });
                                    });

                                },
                                columns: [
                                    { text: 'Name', columnGroup: 'name', dataField: 'name', width: 500 },
                                    { text: 'Description', dataField: 'description' },
                                    { text: 'Weight', columnGroup: 'weight', dataField: 'weight', width: 80 },
                                    {
                                        text: 'Action', cellsAlign: 'center', align: "center", width: 130, columnType: 'none', editable: false, sortable: false, dataField: null, cellsRenderer: function (row, column, value) {
                                            // render custom column.
                                            //console.log($scope.modelinfodetail.Status);
                                            if ($scope.modelinfodetail.status == 'draft') {
                                                return "<a href='/factordetail.html?modelid=" + $scope.modelinfodetail._id + "&id=" + row + "'>edit</a>|"
                                                    + "<a  data-row='" + row + "' class='deleteButtons'>delete</a>";
                                            }
                                            else {
                                                return "";
                                            }
                                        }
                                    }
                                ],
                                /*columnGroups: [
                                    { text: 'Name', name: 'Name' }
                                ]*/
                            });
                        //console.log(3);
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        $scope.backmodelChanged = function () {
            //console.log($scope.MODULE_CHOICE);
            for (var i = 0; i < $scope.modelinfos.length; i++) {
                if ($scope.modelinfos[i]._id == modelid) {
                    $scope.modelinfodetail = $scope.modelinfos[i];
                    //console.log($scope.modelinfodetail.min);
                }
            }
            //console.log(url_ratinglistbymodelidangular_scala+"/"+id);
            if ($scope.modelinfodetail.status == 'draft') {
                $('#btnInsert').show();

                $('#btnGennerateScoringRange').show();
                $('#btnValidateModel').show();
                //$('#btnCheckRating').show();
            }
            else {
                $('#btnInsert').hide();
                $('#btnGennerateScoringRange').show();
                $('#btnValidateModel').show();
                //$('#btnCheckRating').show();
                if ($scope.modelinfodetail.status == "publish") {
                    $('#btnGennerateScoringRange').hide();
                    $('#btnValidateModel').hide();
                    //$('#btnCheckRating').hide();
                }
            }
            $http.post(url_factorlisbymodelidtangular_scala, { id: $scope.modelinfodetail._id }).
                success(function (data, status, headers, config) {
                    //$scope.modelinfodetail = data["SUCCESS"];
                    //console.log(data);
                    var factortreelist = [];
                    if (typeof data["ERROR"] == 'undefined') {
                        for (var i = 0; i < data["SUCCESS"].length; i++) {
                            var factortree = {
                                "factorid": data["SUCCESS"][i]._id,
                                "parentid": data["SUCCESS"][i].Parentid,
                                "name": data["SUCCESS"][i].FactorName,
                                "description": data["SUCCESS"][i].Description,
                                "weight": data["SUCCESS"][i].Weight + "%",
                                "status": data["SUCCESS"][i].Status
                            };
                            factortreelist.push(factortree);
                        }
                    }
                    //console.log(1);
                    // prepare the data
                    var source =
                    {
                        dataType: "json",
                        dataFields: [
                            { name: 'factorid', type: 'string' },
                            { name: 'parentid', type: 'string' },
                            { name: 'name', type: 'string' },
                            { name: 'description', type: 'string' },
                            { name: 'weight', type: 'string' },
                            { name: 'status', type: 'string' }
                        ],
                        hierarchy:
                        {
                            keyDataField: { name: 'factorid' },
                            parentDataField: { name: 'parentid' }
                        },
                        id: 'factorid',
                        localData: factortreelist
                    };
                    //console.log(2);
                    var dataAdapter = new $.jqx.dataAdapter(source);
                    // create Tree Grid
                    $("#treeGrid").jqxTreeGrid(
                        {
                            width: "100%",
                            source: dataAdapter,
                            sortable: true,
                            ready: function () {
                                $("#treeGrid").jqxTreeGrid('expandRow', '2');
                            },
                            rendered: function () {
                                $(".deleteButtons").click(function (event) {
                                    // end edit and cancel changes.
                                    var rowKey = event.target.getAttribute('data-row');
                                    $http.post(url_factordeletetangular_scala, { id: rowKey }).
                                        success(function (data, status, headers, config) {
                                            if (typeof data["ERROR"] == 'undefined') {
                                                $("#treeGrid").jqxTreeGrid('deleteRow', rowKey);
                                            }
                                            else {
                                                console.log(data["ERROR"]);
                                            }
                                            //window.location.assign("/factors.html")
                                            //$scope.factors.splice(index, 1);
                                        }).
                                        error(function (data, status, headers, config) {
                                            // called asynchronously if an error occurs
                                            // or server returns response with an error status.
                                        });
                                });

                            },
                            columns: [
                                { text: 'Name', columnGroup: 'name', dataField: 'name', width: 500 },
                                { text: 'Description', dataField: 'description' },
                                { text: 'Weight', columnGroup: 'weight', dataField: 'weight', width: 80 },
                                {
                                    text: 'Action', cellsAlign: 'center', align: "center", width: 130, columnType: 'none', editable: false, sortable: false, dataField: null, cellsRenderer: function (row, column, value) {
                                        // render custom column.
                                        //console.log($scope.modelinfodetail.Status);
                                        if ($scope.modelinfodetail.status == 'draft') {
                                            return "<a href='/factordetail.html?modelid=" + $scope.modelinfodetail._id + "&id=" + row + "'>edit</a>|"
                                                + "<a  data-row='" + row + "' class='deleteButtons'>delete</a>";
                                        }
                                        else {
                                            return "";
                                        }

                                    }
                                }
                            ],
                            /*columnGroups: [
                             { text: 'Name', name: 'Name' }
                             ]*/
                        });
                    //console.log(3);
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.gennerateScoringRange = function () {
            $scope.gennerateScoringRange = function () {
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
            $scope.validatemodel = function () {
                //console.log('aaa');
                checkweightrate($scope, $http, $scope.choiceModel);
            }
        }

        $scope.factordeletree = function () {
            $scope.factordeletree = function (id) {
                console.log(id);
            }
        }

        //load form list modellist


        $scope.getfactordetailangular = function () {
            //console.log(url);
            //console.log(id);
            $http.post(url_factordetailbyfactoridtangular_scala, { id: id }).
                success(function (data, status, headers, config) {
                    //console.log(data["FactorsList"][0].FactorName);
                    $scope.factordetail = data["FactorsList"][0];
                    //console.log($scope.factordetail.name+"-->"+$scope.factordetail.min);
                    //factorlistbymodelidangular($scope,$http);
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        $scope.factoradd = function () {
            $scope.factoradd = function () {
                window.location.assign("/factordetail.html?modelid=" + $scope.choiceModel);
            }
        }

        $scope.factordelete = function () {
            $scope.factordelete = function (index) {
                //console.log(index);
                $http.post(url, { id: $scope.factors[index]._id }).
                  success(function (data, status, headers, config) {
                      //console.log(data);
                      //window.location.assign("/factors.html")
                      $scope.factors.splice(index, 1);
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                  });
            }
        }

        $scope.actionfactordetailangular = function () {
            $scope.save = function () {
                if (!$scope.formFactor.$valid) {
                    //console.log("Form valid!");
                    return;
                }
                //console.log(url);
                var factors = {};
                var url = '';
                if (typeof $scope.factordetail._id == 'undefined' || $scope.factordetail._id == '') {
                    factors = {
                        ModelId: $scope.factordetail.ModelId,
                        Parentid: $scope.factordetail.Parentid,
                        ParentName: $scope.factordetail.ParentName,
                        Description: $scope.factordetail.Description,
                        Name: $scope.factordetail.FactorName,
                        Weight: $scope.factordetail.Weight,
                        Ordinal: $scope.factordetail.Ordinal,
                        Status: $scope.factordetail.Status,
                        Note: $scope.factordetail.Note
                    };
                    url = url_factorinsertangular_scala;
                }
                else {
                    factors = {
                        id: $scope.factordetail._id,
                        Parentid: $scope.factordetail.Parentid,
                        ParentName: $scope.factordetail.ParentName,
                        Description: $scope.factordetail.Description,
                        Name: $scope.factordetail.FactorName,
                        Weight: $scope.factordetail.Weight,
                        Ordinal: $scope.factordetail.Ordinal,
                        Status: $scope.factordetail.Status,
                        Note: $scope.factordetail.Note
                    };
                    url = url_factorupdateangular_scala;
                }

                //console.log(angular.toJson(factors));
                $http.post(url, angular.toJson(factors)).
                  success(function (data, status, headers, config) {
                      window.location.assign("/factors.html?modelid=" + $scope.factordetail.ModelId)
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                  });
            }
        }

        $scope.modellistangular();
    }
}());