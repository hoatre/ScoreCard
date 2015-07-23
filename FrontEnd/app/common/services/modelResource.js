(function () {
    "user strict";

    angular
        .module("common.services")
        .factory("modelResource",
            ["$resource",
                "appSettings",
                modelResource])

    function modelResource($resource, appSettings) {
        return {
            modelinfo: $resource(appSettings.serverPath + "/modelinfo/getall", null,
                    {
                        'getAll': { method: 'GET' }
                    }),
            modelview: $resource(appSettings.serverPath + "/registerUser", null,
                    {
                        'getByModelId': {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function (data, headersGetter) {
                                var str = [];
                                for (var d in data)
                                    str.push(encodeURIComponent(d) + "=" +
                                                        encodeURIComponent(data[d]));
                                return str.join("&");
                            }

                        }
                    })
        }
    }
})();