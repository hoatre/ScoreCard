/**
 * Created by Deb on 8/21/2014.
 */
(function () {
    "use strict";

    angular
        .module("common.services")
        .factory("shareServices",
                ["$rootScope",
                 shareServices]);

    function shareServices($rootScope) {

        var _dataObj = {};

        var shareService = {};
        shareService.message = "";

        shareService.broadcastMessage = function (message) {
            shareService.message = message;
            $rootScope.$broadcast("notifyMessageChange");
        }

        shareService.setCurrentObject = function (data) {
            _dataObj = data;
        }

        shareService.getCurrentObject = function () {
            return _dataObj;
        }
        return shareService;
    }

}());
