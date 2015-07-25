(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorListCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings",
                     FactorListCtrl]);

    function FactorListCtrl($scope, $http, $state, $stateParams, appSettings) {
        //load form list factorlist
        if ($stateParams.modelId != '') {
            $scope.choiceModel = $stateParams.modelId;
        }
        $http.get(appSettings.serverPath + "/modelinfo/getall")
               .success(function (data) {
                   //console.log(data);
                   
                   $scope.modelinfos = data.getModelInfoJSON.body;
                   
                   if ($scope.choiceModel != '') {
                       $scope.modelChangedLoad($scope.choiceModel);
                   }
               })


        $scope.modelChanged = function (id) {
            //console.log($scope.MODULE_CHOICE);

            $scope.modelChangedLoad(id);
        }

        $scope.modelChangedLoad = function (id) {
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
              
            $http.post(appSettings.serverPath + "/modelinfo/view", { _id: $scope.modelinfodetail._id }).
                success(function (data, status, headers, config) {
                      
                    //$scope.modelinfodetail = data["SUCCESS"];
                    //console.log(data);
                    var factortreelist = [];
                    //alert(data["viewModelInfo"]["header"].code);
                    if (data["viewModelInfo"]["header"].code == 0) {
                        for (var i = 0; i < data["viewModelInfo"]["body"].length; i++) {
                            var factortree = {
                                "factorid": data["viewModelInfo"]["body"][i]._id,
                                "parentid": data["viewModelInfo"]["body"][i].Parentid,
                                "name": data["viewModelInfo"]["body"][i].FactorName,
                                "description": data["viewModelInfo"]["body"][i].Description,
                                "weight": data["viewModelInfo"]["body"][i].Weight + "%",
                                "status": data["viewModelInfo"]["body"][i].Status
                            };
                            factortreelist.push(factortree);
                        }
                    }
                    else {
                        alert(data["viewModelInfo"]["header"].message);
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
                                    $http.post(appSettings.serverPath + "/factor/delete", { _id: rowKey }).
                                        success(function (data, status, headers, config) {
                                            if (data["deleteFactor"]["header"].code == 0) {
                                                $("#treeGrid").jqxTreeGrid('deleteRow', rowKey);
                                            }
                                            else {
                                                alert(data["deleteFactor"]["header"].message);
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
                                            return "<a href='#/factoredit/" + $scope.modelinfodetail._id + "/" + row + "'>edit</a>|"
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
            //console.log(url_modelrangerandupdateangular_scala);
            //alert(appSettings.serverPath + "/modelinfo/rangeandupdate");
            $http.post(appSettings.serverPath + "/modelinfo/rangeandupdate", { _id: $scope.modelinfodetail._id }).
                success(function (data, status, headers, config) {
                    if (data["rangeAndUpdate"]["header"].code == 0) {
                        $scope.modelinfodetail = data["rangeAndUpdate"]["body"];
                    }
                    else {
                        alert(data["rangeAndUpdate"]["header"].message);
                    }
                    //console.log($scope.modelinfodetail.name+"-->"+$scope.modelinfodetail.min);
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        }

        $scope.validatemodel = function () {
            //console.log('aaa');
            //alert('abc');
            checkweightrate($scope, $http, appSettings, $scope.choiceModel);
        }

        
        //load form list modellist


        $scope.factoradd = function () {
            $state.go('factoredit', { modelId: $scope.choiceModel,factorId: "" });
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

        //alert($stateParams.modelId);
        /*if ($stateParams.modelId != '') {
            $scope.modelChangedLoad($stateParams.modelId);
        }*/
    }
   
}());