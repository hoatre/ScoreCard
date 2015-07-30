(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("PersonalInformationCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService", "modelResource",
                     PersonalInformationCtrl]);

    //load all model
    function PersonalInformationCtrl($scope, $http, $state, $stateParams, appSettings, popupService, modelResource) {
        //----------------------control-------------------------------
        $scope.tab1 = false;
        $scope.tab2 = false;
        $scope.tab3 = false;
        $scope.tab4 = false;
        $scope.tab5 = false;
        $scope.tab6 = false;
        $scope.tab7 = false;

        $scope.changetab = function (stt) {
            //stt = stt + 1;
            $scope.progressdisplay(stt);
        };


        $scope.progressdisplay = function (stt) {
            
            $scope.type = 'info';
            $scope.value = stt;
            $scope.tab1 = false;
            $scope.tab2 = false;
            $scope.tab3 = false;
            $scope.tab4 = false;
            $scope.tab5 = false;
            $scope.tab6 = false;
            $scope.tab7 = false;
            $scope.formname = '1.Personal Infomation';
            if (stt == 1) {
                $scope.type = 'info';
                $scope.formname = "1.Personal Infomation";
                $scope.tab1 = true;
            }
            else if (stt == 2) {
                $scope.type = 'info';
                $scope.formname = "2.Creadit Infomation";
                $scope.tab2 = true;
            }
            else if (stt == 3) {
                
                $scope.type = 'info';
                $scope.formname = "3.Collateral";
                $scope.tab3 = true;
            }
            else if (stt == 4) {
                $scope.type = 'info';
                $scope.formname = "4.Loan Infomation";
                $scope.tab4 = true;
            }
            else if (stt == 5) {
                $scope.type = 'info';
                $scope.formname = "5.Submission";
                $scope.tab5 = true;
            }
            else if (stt == 6) {
                $scope.type = 'info';
                $scope.formname = "6.Application Approval";
                $scope.tab6 = true;
            }
            else {
                $scope.type = 'success';
                $scope.formname = "7.Finish";
                $scope.tab7 = true;
            }
        }

        $scope.progressdisplay(1);

        //----------------datetime picker---------------------------
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
          [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
          ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };
        //----------------End datetime picker---------------------------

        //---------------------------Upload-----------------------------

        //---------------------------End Upload-------------------------
        
        //----------------------control-------------------------------
        //----------------------PersonalInformation-------------------
        $scope.personalinformation = {};
        $scope.personalinformation.Gender = "Male";
        //----------------------End PersonalInformation---------------

        //----------------------Creadit Information-------------------
        $scope.models = [];
        $scope.factors = [];
        $scope.ratings = [];
        $scope.selectModel = $stateParams.modelId;

        $scope.currentModel = {};

        $scope.message = '';
        $scope.messageClass = 'col-md-6 wel bg-info';


        
        $scope.getModelByStatus = function (status) {

            $http.post(appSettings.serverPath + "/modelinfo/getbymodelinfostatus", { status: status }).
                success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.models = data.getModelInfoByStatusJSON.body;
                })
                .error(function (error, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.message = error;
                    $scope.models = [];
                });
        };
        
        $scope.getFactorByModelId = function (modelId) {
            modelResource.getFactorByModelId.query({ _id: modelId },
                function (data) {
                    //alert(data.viewModelInfo.body);
                    $scope.factors = data.viewModelInfo.body;
                },
            function (response) {
                $scope.factors = [];
                $scope.message = response.statusText + "\r\n";

                if (response.data.exceptionMessage)
                    $scope.message = response.data.exceptionMessage;
            });
        };
        $scope.getFactorByModelId("19028285-5fd1-40d7-be66-5e630f948ee5");
        $scope.getFactorByParentId = function (parentId) {
            var result = [];

            if (!$scope.factors)
                return result;

            $scope.factors.forEach(function (element) {
                if (element.Parentid == parentId) {
                    //console.info(element);
                    result.push(element);
                }
            });
            //console.log("parentId:" + parentId);
            //console.info(result)
            return result;
        };

        $scope.submit = function () {
            var options = $scope.getOptions();

            console.info(options)


            $http.post(appSettings.serverPath + "/scoreresult", options).
                success(function (_data, status, headers, config) {
                    var data = _data.scoreResult.body;

                    console.log(data);
                    console.log(data['Status']);
                    if (data['Status'] == 'Approve') {
                        $scope.messageClass = 'col-md-6 wel bg-success';

                        $scope.message = "<h5 class='text-uppercase heading'><strong>Congratulations!</strong></h5><br/> Your loan is approved subject to confirmation of the details you have provided.<br /> Check your mail for next steps.<br /> (Score: " + data['Score'] + ' ,Rating: ' + data['Rating'] + ' ,Status: ' + data['Status'] + ').';
                        console.log($scope.message);
                    }
                    else if (data['Status'] == 'Underwriting') {
                        $scope.messageClass = 'col-md-6 wel bg-warning';

                        $scope.message = "<h5 class='text-uppercase heading'><strong>Underwriting:</strong></h5><br/>Underwriting! <br /> (Score: " + data['Score'] + ' ,Rating: ' + data['Rating'] + ' ,Status: ' + data['Status'] + ').';

                    }
                    else if (data['Status'] == 'Reject') {
                        $scope.messageClass = 'col-md-6 wel bg-danger';
                        $scope.message = "<h5 class='text-uppercase heading'><strong>Reject:</strong></h5><br/>Reject! <br /> (Score: " + data['Score'] + ' ,Rating: ' + data['Rating'] + ' ,Status: ' + data['Status'] + ').';

                    }
                    else {
                        $scope.messageClass = 'col-md-6 wel bg-info';
                        $scope.message = "<h5 class='text-uppercase heading'><strong>Warning:</strong></h5><br/>Please completed choose! <br /> (Score: " + data['Score'] + ' ,Rating: ' + data['Rating'] + ' ,Status: ' + data['Status'] + ').';
                        //console.log(data);
                    }
                })
                .error(function (error, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.message = error;
                    console.log($scope.message);
                });
        };

        $scope.getRatingByModelId = function (modelId) {
            $http.get(appSettings.serverPath + "/rating/getmodelid" + "/" + modelId)
                .success(function (data) {
                    //console.log(data);
                    if (typeof data["ERROR"] == 'undefined') {
                        $scope.ratings = data.getbymodelid.body[0].codein;
                    }
                    else {
                        $scope.ratings = [];
                    }
                })
                .error(function (error, status, headers, config) {
                    $scope.ratings = [];
                });
        }

        $scope.cboModelChange = function (modelId) {
            $scope.getFactorByModelId(modelId);
            $scope.getRatingByModelId(modelId);

            for (var i = 0; i < $scope.models.length; i++) {
                if ($scope.models[i]._id == modelId) {
                    $scope.currentModel = $scope.models[i];
                    console.log($scope.currentModel);
                    break;
                }
            }
        }

        $scope.optionValidate = function () {
            var check = false;
            if ($('#frmMain input:radio:checked').length == 0) {
                alert('You must choose!');
                return false;
            }
            return true;
        };

        $scope.getOptions = function () {
            var result = '';
            $('#frmMain input:radio:checked').each(function () {
                result += "," + $(this).val();
            });
            //alert('{listresult: [' + result.substring(1) + ']}');

            return '{"modelid": "' + $scope.selectModel + '", "custumer_name": "", "listresult":[' + result.substring(1) + ']}';
        };
        //----------------------End Creadit Information---------------

        //---------------------------Collateral---------------------------
        $scope.collateral = {};
        $scope.collateral.TypeCollateral = "Land";
        $scope.collateral.CollateralBefor = "Yes";
        //---------------------------End Collateral-----------------------

        //---------------------------Loan Information---------------------------
        $scope.loanInformation = {};
        $scope.loanInformation.Borrow = 50;
        $scope.loanInformation.Period = 12;
        $scope.optionborrow = {
            min: 10,
            max: 100,
            step: 1,
        };
        $scope.optionperiod = {
            min: 1,
            max: 60,
            step: 1,
        };


        $scope.executeMe = function () {
            console.log('done');
        }
        //---------------------------End Loan Information-----------------------

        //---------------------------Finish---------------------------
        $scope.finish = function () {
            //alert($scope.personalinformation.FirstName);
        }
        //---------------------------End Finish-----------------------
    }
}());
