(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorListCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     FactorListCtrl]);

    function FactorListCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

        $scope.choiceModel = '';
        $scope.model = {};

        //load form list factorlist
        if ($stateParams.modelId != '') {
            $scope.choiceModel = $stateParams.modelId;
        }
        $http.get(appSettings.serverPath + "/modelinfo/getall")
               .success(function (data) {
                   //console.log(data);

                   $scope.models = data.getModelInfoJSON.body;

                   if ($scope.choiceModel != '') {
                       $scope.modelChanged($scope.choiceModel);
                   }
               })


        $scope.modelChanged = function (id) {
            //console.log(id);

            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == id) {
                    $scope.model = $scope.models[i];
                    //console.log($scope.model.min);
                }
            }

            $http.post(appSettings.serverPath + "/modelinfo/view", { _id: $scope.model._id }).
                success(function (data, status, headers, config) {

                    //$scope.model = data["SUCCESS"];
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
                        //alert(data["viewModelInfo"]["header"].message);
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
                                    var factorId = event.target.getAttribute('data-row');
                                    $scope.factorDelete(factorId);                                     
                                });

                            },
                            columns: [
                                { text: 'Name', columnGroup: 'name', dataField: 'name', width: 500 },
                                { text: 'Description', dataField: 'description' },
                                { text: 'Weight', columnGroup: 'weight', dataField: 'weight', width: 80 },
                                {
                                    text: 'Action', cellsAlign: 'center', align: "center", width: 130, columnType: 'none', editable: false, sortable: false, dataField: null, cellsRenderer: function (row, column, value) {
                                        // render custom column.
                                        //console.log($scope.model.Status);
                                        if ($scope.model.status == 'draft') {
                                            return "<a href='#/factors/edit/" + $scope.model._id + "/" + row + "'>edit</a>|"
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
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        // Generator scoring range
        $scope.gennerateScoringRange = function () {
            //console.log(url_modelrangerandupdateangular_scala);
            //alert(appSettings.serverPath + "/modelinfo/rangeandupdate");
            $http.post(appSettings.serverPath + "/modelinfo/rangeandupdate", { _id: $scope.model._id })
                .success(function (data, status, headers, config) {
                    if (data["rangeAndUpdate"]["header"].code == 0) {
                        $scope.model = data["rangeAndUpdate"]["body"];
                    }
                    else {
                        alert(data["rangeAndUpdate"]["header"].message);
                    }
                    //console.log($scope.model.name+"-->"+$scope.model.min);
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        }

        // Validate model
        $scope.validateModel = function () {
            //console.log('aaa');
            //alert('abc');
            checkweightrate($scope, $http, appSettings, $scope.choiceModel);
        }

        // Delete data
        $scope.factorDelete = function (factorId) {
            if (popupService.showPopup('Are you sure delete this factor?')) {
                $http.post(appSettings.serverPath + "/factor/delete", { _id: factorId })
                      .success(function (data, status, headers, config) {
                          //console.log(data);
                          //$scope.factors.splice(index, 1);
                          if (data["deleteFactor"]["header"].code == 0) {
                              $("#treeGrid").jqxTreeGrid('deleteRow', factorId);
                              return true;
                          }
                          else {

                              return false;
                          }
                      })
                      .error(function (data, status, headers, config) {
                          // called asynchronously if an error occurs
                          // or server returns response with an error status.
                          return false;
                      });
            }
        }
    }

}());