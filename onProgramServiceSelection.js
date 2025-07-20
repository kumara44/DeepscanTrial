        function onProgramServiceSelection(result, isFromFieldsInit, isDefaultDurationPopulationRequired) {
            $("#spanRecurringApptsProgramsServices").focus();
            if (result == "cancel") {
                return false;
            };

            $scope.existingPatientAppointmentProgramsProgramsServices = "";
            $scope.selectedProgramServicesLinkedInfoID = "";
            $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = "";
            $scope.existingPatientAppointmentProgramsProgramsServicesforService = "";
            if (hasValue(result) && hasValue(result.GrantDetails)) {
                if (hasValue(result.GrantDetails.AutoPopulateBillToIrrespectiveofLinkToPatient) && result.GrantDetails.AutoPopulateBillToIrrespectiveofLinkToPatient == true) {
                    //Selected Health plna names to textbox model
                    if (hasValue(result.GrantDetails.GrantName)) {
                        $scope.existingPatientAppointmentBillToInsuranceNames = result.GrantDetails.GrantName;
                    }

                    $scope.existingPatientAppointmentBillToInsuranceID = 0;
                    $scope.existingPatientAppointmentHealthPlanID = 0;  //CLEAR THE SCOPE VARIABLE // HEALTH PLAN ID 
                    $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;

                    $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
                    $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
                    $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
                    $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default

                    if (hasValue(result.GrantDetails.GrantInfoID) && result.GrantDetails.GrantInfoID > 0) {
                        $scope.existingPatientAppointmentGrantID = result.GrantDetails.GrantInfoID;
                    }
                    else {
                        $scope.existingPatientAppointmentGrantID = 0;
                    }

                } else {
                    $scope.AutoPopulateBillToIrrespectiveofLinkToPatient = true;
                }
            }

            if (hasValue(result) && hasValue(result.selectedProgramsorTherapyList)) {
                result = result.selectedProgramsorTherapyList;
            }


            if (hasValue(result)) {
                //TO GET THE DURATION OF THE FIRST SELECTED PRAGRAM AND SERVICE AND ASSSIGN IT TO APPT DURATION
                var GroupTherapyDuration = "";


                var items = [];
                var ProgramsOrService = "";
                for (var index = 0; index < result.length; index++) {
                    if (hasValue(result[index].GroupTherapyCategoryName) && hasValue(result[index].GroupTherapyName)) {
                        result[index].GroupTherapySessionTypeName = result[index].GroupTherapyCategoryName + " - " + result[index].GroupTherapyName;
                    } else if (result[index].GroupTherapyName) {
                        result[index].GroupTherapySessionTypeName = result[index].GroupTherapyName;
                    }
                }

                $scope.existingPatientAppointmentProgramsProgramsServicesList = result;
                $scope.existingPatientAppointmentPgmandServicesList = [];
                let programIds = [];
                //To Selected Multiple Programs and services 
                angular.forEach(result, function (item) {
                    if (hasValue(item)) {
                        if (hasValue(item.GroupTherapyCategoryName) && hasValue(item.GroupTherapyName)) {
                            //$scope.existingPatientAppointmentProgramsProgramsServices = $scope.existingPatientAppointmentProgramsProgramsServices + item.GroupTherapyCategoryName + " - " + item.GroupTherapyName + ";";
                            if (!programIds.includes(item.ProgramID)) {
                                $scope.existingPatientAppointmentProgramsProgramsServices = `${$scope.existingPatientAppointmentProgramsProgramsServices}${item.GroupTherapyCategoryName} - ${getServiceNamesWithCommaSeperated(result, item.ProgramID)}; `;
                                if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesforProgram))
                                    $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = $scope.existingPatientAppointmentProgramsProgramsServicesforProgram + "; " + item.GroupTherapyCategoryName;
                                else
                                    $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = item.GroupTherapyCategoryName

                                programIds.push(item.ProgramID);
                            }

                            if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesforService))
                                $scope.existingPatientAppointmentProgramsProgramsServicesforService = $scope.existingPatientAppointmentProgramsProgramsServicesforService + "; " + item.GroupTherapyName;
                            else
                                $scope.existingPatientAppointmentProgramsProgramsServicesforService = item.GroupTherapyName;

                        }
                        else {
                            if (hasValue(item.GroupTherapyName)) {
                                $scope.existingPatientAppointmentProgramsProgramsServices = $scope.existingPatientAppointmentProgramsProgramsServices + item.GroupTherapyName + "; ";
                            }

                            if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesforService))
                                $scope.existingPatientAppointmentProgramsProgramsServicesforService = $scope.existingPatientAppointmentProgramsProgramsServicesforService + "; " + item.GroupTherapyName;
                            else
                                $scope.existingPatientAppointmentProgramsProgramsServicesforService = item.GroupTherapyName;

                        }


                        if (hasValue(item.ProgramsServicesLinkedInfoID)) {
                            $scope.selectedProgramServicesLinkedInfoID = $scope.selectedProgramServicesLinkedInfoID + item.ProgramsServicesLinkedInfoID + ",";
                        }

                        if (!hasValue($scope.existingPatientApptSelectedProgramID) || $scope.existingPatientApptSelectedProgramID <= 0)
                            $scope.existingPatientApptSelectedProgramID = item.ProgramID;


                        if (hasValue(item.GroupTherapyCategoryID) && hasValue(item.GroupTherapyID)) {
                            $scope.existingPatientAppointmentPgmandServicesList.push({
                                'ProgramID': item.GroupTherapyCategoryID,
                                'ServiceID': item.GroupTherapyID
                            });
                        }
                        if (!GroupTherapyDuration && item.DefaultSessionTime && item.DefaultSessionTime > 0)
                            GroupTherapyDuration = item.DefaultSessionTime;

                    }
                })
                if (GroupTherapyDuration && !isDefaultDurationPopulationRequired) $scope.SelectedExistingPatApptDuration = GroupTherapyDuration;

                //only when program / services are selected then only getting the latest linked grants are autopopulated 
                if (hasValue($scope.selectedProgramServicesLinkedInfoID) && $scope.AutoPopulateBillToIrrespectiveofLinkToPatient == true) {
                    //GETTING THE LATEST GRANTS RELATD POLICIES INFO 
                    $scope.existingPatientApptsGetLinkedGrantsBasedonSelectedProgramService($scope.selectedProgramServicesLinkedInfoID);
                }
            }

            //if after changing the  the duration field is empty then we are assinging the scehdule generated time
            if (!$scope.SelectedExistingPatApptDuration && _.get($scope.ApptSchedView_GetMinimumIntervalList, "[0].AppointmentDuration") > 0)
                $scope.SelectedExistingPatApptDuration = $scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration;

            $scope.existingPatientAppointmentProgramsProgramsServices = $scope.existingPatientAppointmentProgramsProgramsServices.trimEnd('; ');
            $scope.selectedProgramServicesLinkedInfoID = $scope.selectedProgramServicesLinkedInfoID.trimEnd(',');


            if ((isFromFieldsInit || isProgramAutopopulated_StaffActivitiesNotesSavingWindow) && $scope.isBillTooFieldCustomized && !isCashPatient && !$scope.hideBilltoField) {
                isProgramAutopopulated_StaffActivitiesNotesSavingWindow = undefined; //this function is executing 2 times so to avoid popup opening 2 times i used this variabel
                //CALLING THE METHOD ONLY WHEN THE FILED IS CUSTOMIZED FROM THE GIVE APPT FIELDS 
                $scope.existingPatientApptgetPatientLatestPrimaryInsurancePolicyDetails();
            }
            //function call for the Auto Populate Grant Info Based On Program And Service List
            $scope.AutoPopulateGrantInfoBasedOnProgramAndServiceList();
            if (!(_.includes([2, 3], _.get(programServiceBasedFieldsSelection[EMRPracticeModel.PracticeID],"BillTo"))) && editAppointmentCopayLinkedtoApptPoulationBasedOnPracticeId && ($scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide || hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue)) {
                $scope.existingPatientAppointmentCheckCopayCount($scope.existingPatientAppointmentBillToInsuranceID);
            }

            if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                exisitingPatientApptReferralAuthorizationPopulateUsedField();
            //Assigning false to "doNotCheckHealthPlanCustomizationValidation"
            //assigning false to check the Validation  
            //Validaton to allow or deny the health plan for the selected program - service
            $scope.NewAppointmentSchedulerModel.doNotCheckHealthPlanCustomizationValidation = false;
            if ($scope.selectedProgramServicesLinkedInfoID)
                autoPopulateFieldsBasedonProgramSelectionforSpecificPractices();
            autoSelectVistTypeForProgramService(result);
        }
