(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("FactorListCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService", 'uiGridTreeViewConstants',
                     FactorListCtrl]);

    function FactorListCtrl($scope, $http, $state, $stateParams, appSettings, popupService, uiGridTreeViewConstants) {
        $scope.gridOptions = {
            enableSorting: false,
            enableFiltering: false,
            showTreeExpandNoChildren: false,
            groupsCollapedByDefault: false,
            columnDefs: [
                { name: 'FactorName', displayName: 'Name', width: '30%' },
                { name: 'Description', displayName: 'Description', width: '40%' },
                { name: 'Weight', displayName: 'Weight', width: '10%' },
                { name: 'edit', displayName: 'edit', width: '7%', cellTemplate: '<button ng-click="grid.appScope.goEdit(row.entity)" >Edit</button>' },
                { name: 'delete', displayName: 'delete', width: '7%', cellTemplate: '<button ng-click="grid.appScope.factorDelete(row.entity)" >Delete</button>' }
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        var data = [];
        var writeoutNode = function (childArray, currentLevel, dataArray) {
            childArray.forEach(function (childNode) {
                if (childNode.children.length > 0) {
                    childNode.$$treeLevel = currentLevel;
                    id = childNode.id;
                    if (childNode.id == childNode.parentId) {
                        //childNode.parentCategoryName='';
                    }
                }
                else {
                    if ((id != childNode.parentId) || (childNode.id == childNode.parentId)) {
                        if (childNode.id == childNode.parentId) {
                            //childNode.parentCategoryName='';
                        }
                        childNode.$$treeLevel = currentLevel;
                    }
                }
                dataArray.push(childNode);
                writeoutNode(childNode.children, currentLevel + 1, dataArray);
            });
        };
        $scope.gridOptions.data = [];
        writeoutNode(data, 0, $scope.gridOptions.data);

        $scope.expandAll = function () {
            $scope.gridApi.treeBase.expandAllRows();
        };

        var id = 0;

        function getTree(data, id, parentIdName) {

            if (!data || data.length == 0 || !id || !parentIdName)
                return [];

            var tree = [],
                rootIds = [],
                item = data[0],
                primaryKey = item[id],
                treeObjs = {},
                parentId,
                parent,
                len = data.length,
                i = 0;

            while (i < len) {

                item = data[i++];
                primaryKey = item[id];
                treeObjs[primaryKey] = item;
                parentId = item[parentIdName];

                if (parentId) {
                    parent = treeObjs[parentId];

                    if (parent.children) {
                        item.children = [];
                        parent.children.push(item);
                    } else {
                        item.children = [];
                        parent.children = [item];
                    }
                } else {
                    item.children = [];
                    rootIds.push(primaryKey);
                }
            }

            for (var i = 0; i < rootIds.length; i++) {
                tree.push(treeObjs[rootIds[i]]);
            };

            return tree;
        }


        $scope.animationsEnabled = true;
        //--------------------------------------------
        $scope.choiceModel = '';
        $scope.model = {};
        $scope.factors = {};

        // ModeId
        if ($stateParams.modelId != '') {
            $scope.choiceModel = $stateParams.modelId;
        }

        // Get all model
        //$http.get(appSettings.serverPath + "/modelinfo/getall")
        //       .success(function (data) {
        //           //console.log(data);
        //
        //           $scope.models = data.getModelInfoJSON.body;
        //
        //           if ($scope.choiceModel != '') {
        //               $scope.modelChanged($scope.choiceModel);
        //           }
        //       });

        $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfostatus", { status: "draft" })
               .success(function (data) {
                   //console.log(data);

                   $scope.models = data.getModelInfoByStatusJSON.body;

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
                //$scope.bindTreeData($scope.factors);
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
                    $scope.gridOptions.data = [];
                    if (data["viewModelInfo"]["header"].code == 0) {
                        $scope.factors = data.viewModelInfo.body;
                        $scope.gridOptions.data = [];
                        var data1 = getTree($scope.factors, '_id', 'Parentid');
                        //alert(data1);
                        writeoutNode(data1, 0, $scope.gridOptions.data);
                        setTimeout(function () { $scope.expandAll(); }, 200);
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
        $scope.factorDelete = function (entity) {
            if (popupService.showPopup('Are you sure delete this factor?')) {
                $http.post(appSettings.serverPath + "/factor/delete", { _id: entity._id })
                      .success(function (data, status, headers, config) {
                          //$scope.factors.splice(index, 1);
                          if (data.deleteFactor.header.code == 0) {
                              $scope.gridOptions.data = [];
                              for (var i = 0; i < $scope.factors.length; i++) {
                                  if (entity._id == $scope.factors[i]._id) {
                                      $scope.factors.splice(i, 1);
                                  }
                              }
                              var data1 = getTree($scope.factors, '_id', 'Parentid');
                              writeoutNode(data1, 0, $scope.gridOptions.data);
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

        $scope.goEdit = function (entity) {
            if ($scope.models.length && (entity != null || entity != undefined)) {
                $state.go('factorEdit', { modelId: entity.ModelId, factorId: entity._id });
            }
        };

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
                      $scope.factor = {};
                      editForm.$setPristine();

                      $scope.gridOptions.data = [];
                      $scope.factors.push(data.insertFactor.body);
                      var data1 = getTree($scope.factors, '_id', 'Parentid');
                      //alert(data1);
                      writeoutNode(data1, 0, $scope.gridOptions.data);
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
