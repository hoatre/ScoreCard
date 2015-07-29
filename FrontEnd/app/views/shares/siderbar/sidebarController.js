﻿'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .controller('SidebarController', ['$scope', function ($scope) {

      $scope.selectedMenu = 'home';
      $scope.collapseVar = 0;
      $scope.multiCollapseVar = 0;

      $scope.check = function (x) {

          if (x == $scope.collapseVar)
              $scope.collapseVar = 0;
          else
              $scope.collapseVar = x;
      };

      $scope.multiCheck = function (y) {

          if (y == $scope.multiCollapseVar)
              $scope.multiCollapseVar = 0;
          else
              $scope.multiCollapseVar = y;
      };
  }]);