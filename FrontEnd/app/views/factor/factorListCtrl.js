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
        $scope.factors = {};

        // ModeId
        if ($stateParams.modelId != '') {
            $scope.choiceModel = $stateParams.modelId;
        }

        // Get all model
        $http.get(appSettings.serverPath + "/modelinfo/getall")
               .success(function (data) {
                   //console.log(data);

                   $scope.models = data.getModelInfoJSON.body;

                   if ($scope.choiceModel != '') {
                       $scope.modelChanged($scope.choiceModel);
                   }
               });


        // Model select change
        $scope.modelChanged = function (id) {
            //console.log(id);
            if (id == null || id == '') {
                $scope.model = {};
                $scope.factors = {};
                $scope.bindTreeData($scope.factors);
                return;
            }

            // Selected model
            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == id) {
                    $scope.model = $scope.models[i];
                }
            }

            $http.post(appSettings.serverPath + "/modelinfo/view", { _id: $scope.model._id }).
                success(function (data, status, headers, config) {

                    if (data["viewModelInfo"]["header"].code == 0) {
                        $scope.factors = data.viewModelInfo.body;

                        $scope.bindTreeData($scope.factors);
                    }
                    else {
                        //alert(data["viewModelInfo"]["header"].message);
                    }


                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        }

        // Bind tree data
        $scope.bindTreeData = function (factors) {

            var factorTreeList = [];

            for (var i = 0; i < factors.length; i++) {
                var factor = factors[i];
                var factortree = {
                    "factorid": factor._id,
                    "parentid": factor.Parentid,
                    "name": factor.FactorName,
                    "description": factor.Description,
                    "weight": factor.Weight + "%",
                    "status": factor.Status
                };
                factorTreeList.push(factortree);
            }

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
                        localData: factorTreeList
                    };

            var dataAdapter = new $.jqx.dataAdapter(source);

            // create Tree Grid
            $("#treeGrid").jqxTreeGrid(
                {
                    width: "100%",
                    source: dataAdapter,
                    sortable: true,
                    ready: function () {
                        $("#treeGrid").jqxTreeGrid('expandRow', '3');
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
                                    return "<a href='#/factors/edit/" + $scope.model._id + "/" + row + "'>Edit</a>|"
                                        + "<a  data-row='" + row + "' class='deleteButtons'>Delete</a>";
                                }
                                else {
                                    return "";
                                }
                            }
                        }
                    ],
                });

            for (var i = 0; i < factorTreeList.length; i++) {
                $("#treeGrid").jqxTreeGrid('expandRow', factorTreeList[i].factorid);
            }
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
                          //$scope.factors.splice(index, 1);
                          if (data.deleteFactor.header.code == 0) {
                              $("#treeGrid").jqxTreeGrid('deleteRow', factorId);
                              return true;
                          }
                          else {
                              popupService.showMessage(data.deleteFactor.header.message);
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

        // add data
        $scope.add = function (editForm) {
            var factors = {};

            if ($scope.choiceModel == null || $scope.choiceModel == '') {
                console.log('Model not null!');
                return;
            }

            $scope.factor.ModelId = $scope.choiceModel;
            $scope.factor.Parentid = $scope.choiceFactor == null ? '' : $scope.choiceFactor;
            $scope.factor.ParentName = '';
            $scope.factor.Name = $scope.factor.FactorName;
            $scope.factor.Ordinal = 0;
            $scope.factor.Status = 'status';
            $scope.factor.Note = '';

            $http.post(appSettings.serverPath + "/factor/insert", $scope.factor)
              .success(function (data, status, headers, config) {
                  if (data.insertFactor.header.code == 0) {
                      $scope.factors.push(data.insertFactor.body);
                      $scope.bindTreeData($scope.factors);
                      //popupService.showMessage('Insert success!');
                      $scope.factor = {};
                      editForm.$setPristine();
                  }
                  else {
                      popupService.showMessage(data.insertFactor.header.message);
                  }
              })
              .error(function (data, status, headers, config) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
              });
        }
    }
}());
