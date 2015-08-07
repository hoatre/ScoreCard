(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ModelListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService",
                     ModelListCtrl])
    /*.run(function (paginationConfig) {
        paginationConfig.firstText = '«';
        paginationConfig.previousText = 'Prev';
        paginationConfig.nextText = 'Next';
        paginationConfig.lastText = '»';
    });*/
    function ModelListCtrl($scope, $http, $state, appSettings, shareServices, popupService) {

        //-----------paging--------------
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.maxSize = 20;
        $scope.itemsPerPage = 10;
        $scope.pageChanged = function () {
            $scope.getModelPage($scope.currentPage, $scope.itemsPerPage);
        };
        $scope.getModelPage = function (currentPage, pageSize) {
            //console.log(appSettings.serverPath);
            $http.get(appSettings.serverPath + "/modelinfo/search?pageIndex=" + currentPage + "&pageSize=" + pageSize)
                .success(function (data) {
                    //console.log(data);
                    $scope.models = data.modelinfo.body;
                    //$scope.filteredList = data.modelinfo.body;
                    $scope.totalItems = data.modelinfo.count;
                    //$scope.pagination($scope.models);
                    //get model running
                    $http.get(appSettings.serverPath + "/activetable")
                    .success(function (data) {
                        $scope.activetable = data.activetable.body;
                    });
                });
        }
        $scope.getModelPage($scope.currentPage, $scope.itemsPerPage);
        //-----------end paging--------------


        //Broadcast message
        $scope.goEdit = function (index) {

            if ($scope.models.length && (index != null || index != undefined)) {

                shareServices.setCurrentObject($scope.models[index]);
                $state.go('modelEdit', { modelId: $scope.models[index]._id });
            }
        };

        /*//load form list modellist
        $scope.getAllModel = function () {
            //console.log(appSettings.serverPath);
            $http.get(appSettings.serverPath + "/modelinfo/getall")
                .success(function (data) {
                    //console.log(data);
                    $scope.models = data.getModelInfoJSON.body;
                    $scope.pagination($scope.models);
                });
        }

        $scope.pagination = function (list) {
            $scope.filteredList = [];
            $scope.currentPage = 1;
            $scope.itemsPerPage = 5;
            $scope.maxSize = 20;
            $scope.pagedItems = [];
            $scope.totalItems = list.length;
            $scope.numPages = function () {
                return Math.ceil(list.length / $scope.itemsPerPage);
            };
            //$scope.setPage = function (pageNo) {
            //    $scope.currentPage = pageNo;
            //};        //$scope.pageChanged = function () {
            //    $scope.figureOutTodosToDisplay();
            //};        $scope.$watch('currentPage + itemsPerPage', function () {

            $scope.$watch('currentPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                end = begin + $scope.itemsPerPage;

                $scope.filteredList = list.slice(begin, end);
            });            
        }*/


        // Delete
        $scope.modelDelete = function (index) {
            if (popupService.showPopup('Are you sure delete this model?')) {
                $http.post(appSettings.serverPath + "/modelinfo/delall", { _id: $scope.models[index]._id })
                    .success(function (data, status, headers, config) {
                        if (data.dellallmodel.header.code == 0) {
                            $scope.models.splice(index, 1);
                            $scope.pagination($scope.models);
                        }
                        else {
                            popupService.showMessage(data.dellallmodel.header.message);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        // Add
        $scope.add = function (editForm) {

            if (!$scope.modelForm.$valid) {
                return;
            }
            if ($scope.model._id == null || $scope.model._id == 'undefined' || $scope.model._id == '') {
                $scope.model.status = 'draft';

                $http.post(appSettings.serverPath + "/modelinfo/insert", $scope.model).
                    success(function (data, status, headers, config) {
                        if (data.insertModelInfo.header.code == 0) {
                            $scope.models.push(data.insertModelInfo.body);

                            $scope.pagination($scope.models);
                            //popupService.showMessage('Insert Success!');
                            $scope.model = {};
                            editForm.$setPristine();
                        }
                        else {
                            popupService.showMessage(data.insertModelInfo.header.message);
                        }

                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        }

        //$scope.getAllModel();
    }
}());
