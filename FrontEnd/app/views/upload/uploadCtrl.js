﻿(function () {
    "use strict";
    var myApp = angular
        .module("sbAdminApp")
        .controller("UploadCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService", "fileUpload",
                     UploadCtrl]);

    function UploadCtrl($scope, $http, $state, $stateParams, appSettings, popupService, fileUpload) {

        $scope.choiceModel = '';
        $scope.models = {};

        // ModeId
        if ($stateParams.modelId != '') {
            $scope.choiceModel = $stateParams.modelId;
        }

        // Get all model
        $http.get(appSettings.serverPath + "/modelinfo/getall")
               .success(function (data) {
                   //console.log(data);

                   $scope.models = data.getModelInfoJSON.body;
               });

        $scope.uploadFile = function () {
            var file = $scope.myFile;
            console.log('file is ');
            console.dir(file);
            var uploadUrl = "/fileUpload";
            fileUpload.uploadFileToUrl(file, uploadUrl, $scope.choiceModel)
                .then(
                    function (response) { //successCallback
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(response);
                    },
                    function (response) { //errorCallback
 	                    // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log(response);
                    }
            );
        };
    }


    myApp.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    myApp.service('fileUpload', ['$http', 'appSettings', function ($http, appSettings) {
        this.uploadFileToUrl = function (file, uploadUrl, modelId) {
            var fd = new FormData();
            fd.append('file', file);
            $http.post(appSettings.serverPath + '/csv/upload/' + modelId, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function () {
                console.log('Sucess!');
            })
            .error(function () {
                console.log('Error!');
            });
        }
    }]);
}());


