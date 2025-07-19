'use strict';//INDICATING BROWSER SHOULD RUN ONLY IN JAVA SCRIPT MODE

//*******PURPOSE: THE PURPOSE OF THIS CONTROLLER IS GIVE THE APPOINTMENT FOR THE PATIENT IN THE PRACTICE/CLINIC.
//*******EFFECTIVE FILES: 
//*******CREATED BY: MALINI
//*******CREATED DATE: 07/05/2014
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//INJECTING THE JS FILES RELATED NAMES TO ACCESS THE SERVICE CALLS AND SOME OTHER PREDEFINED FILE NAMES. USED TO CALL SERVICES OR VALIDATE THE CURRENT CONTROLLER INFROAMTION.
angular.module('EMR.Admin').controller('ExistingPatientAppointmentController', ["$scope", '$q', '$timeout', 'ModalPopupService', 'billingSettingsFieldValueListSharedService', 'GiveNewAppointmentService', 'EMRCommonFactory', '$sce', '$compile', '$filter', 'CalendarIntegrationService', 'AppointmentWindowsSettingsService', '$rootScope', 'WebWorkerService', 'GiveAppointmentConstantsService', 'GiveAppointmentPracticeCustomizationService', 'GiveAppointmentFieldGenerationService',
    function ($scope, $q, $timeout, ModalPopupService, billingSettingsFieldValueListSharedService, GiveNewAppointmentService, EMRCommonFactory, $sce, $compile, $filter, CalendarIntegrationService, AppointmentWindowsSettingsService, $rootScope, WebWorkerService, GiveAppointmentConstantsService, GiveAppointmentPracticeCustomizationService, GiveAppointmentFieldGenerationService) {


        this.$onInit = existingPatientApptPageInit;
        let kendoEventsTimeout,kendoSelectors,existingApptGeneralCommentTimeOut
        const DisablingUseColumnBasedOnPracID = GiveAppointmentPracticeCustomizationService.DisablingUseColumnBasedOnPracID(EMRPracticeModel);
        const removeSelectinRoomAvailabilityLabelname = GiveAppointmentPracticeCustomizationService.removeSelectinRoomAvailabilityLabelname(EMRPracticeModel);
        const ignoreMultiplesofFiveValidationforDuration = GiveAppointmentPracticeCustomizationService.ignoreMultiplesofFiveValidationforDuration(EMRPracticeModel);
        const showVideoModalitybyDefault = GiveAppointmentPracticeCustomizationService.showVideoModalitybyDefault(EMRPracticeModel);
        const showConfirmationMessageWhileSamePatientHavingMultipleApptsonSameDay = GiveAppointmentPracticeCustomizationService.showConfirmationMessageWhileSamePatientHavingMultipleApptsonSameDay(EMRPracticeModel);
        const showConfirmationifApptDurationExceedsClinicApptDuration = GiveAppointmentPracticeCustomizationService.showConfirmationifApptDurationExceedsClinicApptDuration(EMRPracticeModel);
        const bindPatientEmailandPhoneNumbertoPatientNameWhileGoogleCalendarSync = GiveAppointmentPracticeCustomizationService.bindPatientEmailandPhoneNumbertoPatientNameWhileGoogleCalendarSync(EMRPracticeModel);
        const editAppointmentCopayLinkedtoApptPoulationBasedOnPracticeId = GiveAppointmentPracticeCustomizationService.editAppointmentCopayLinkedtoApptPoulationBasedOnPracticeId(EMRPracticeModel);
        const showinsuranceorGrantLableNamsasInsurance = GiveAppointmentPracticeCustomizationService.showinsuranceorGrantLableNamsasInsurance(EMRPracticeModel);
        const showPatientNamsasInsurance = GiveAppointmentPracticeCustomizationService.showPatientNamsasInsurance(EMRPracticeModel);
        const showSelectOptioninModalityDropdown = GiveAppointmentPracticeCustomizationService.showSelectOptioninModalityDropdown(EMRPracticeModel);
        const showResourceandRoomNamesinGoogleCalendar = GiveAppointmentPracticeCustomizationService.showResourceandRoomNamesinGoogleCalendar(EMRPracticeModel);
        const dontChangeDurationWhenVisitTypeChange = GiveAppointmentPracticeCustomizationService.dontChangeDurationWhenVisitTypeChange(EMRPracticeModel);
        const dontChangeDurationWhenDateChange = GiveAppointmentPracticeCustomizationService.dontChangeDurationWhenDateChange(EMRPracticeModel);
        const assignFacilityRespectivetoProgramService = GiveAppointmentPracticeCustomizationService.assignFacilityRespectivetoProgramService(EMRPracticeModel);
        $scope.hideBilltoField = false;
        const showApptDurationsUpToPracticeRequestedMinutes = GiveAppointmentPracticeCustomizationService.showApptDurationsUpToPracticeRequestedMinutes
        let previousDuration;
        let patientEmail;
        let patientPhoneNumber;
        const defaultProgamServiceBasedonPractice = GiveAppointmentPracticeCustomizationService.defaultProgamServiceBasedonPractice;

        $scope.existingPatientPhoneNumberDisplayName = "";
        $scope.existingPatientZoomLinkDisplayName = "";
        $scope.isDemographicsCommentsFieldMandatory = false;
        var isProgramServiceFieldCustomizedAndMandatory = false;
        $scope.showMdTimeandPTApptTime = "";
        var patientAssignedProviderID = 0;
        var apptDefaultsInfo = {};
        var isDefaultProviderCustomizationFromDemographicsExists = false;
        var isDefaultDurationFromVisitTypeDataBoundPopulated = false;
        var isDefaultDurationFromMinimulIntervalDataPopulated = false;
        $scope.isReferredByFieldCustomized = false;
        var donotAutoPopulateFacilityOnInit = [467, 2, 458].includes(EMRPracticeModel.PracticeID);
        var donotAutoPopulateProviderWhenStaffLoginOnInit = [467, 671, 458].includes(EMRPracticeModel.PracticeID);
        let donotAutoPopulateProviderOnInit = {
            458: [30],
            999: [6]
        };
        let isFromProviderResourcePopupClick = false, loadDurationWhenOpenedFronPortalAppts = true;
        $scope.isVisitTypeFieldCustomized = false;
        var ReferralAuth = GiveNewAppointmentService.ReferralAuth,
            // Inject **processProgramServiceListAndCheckForTriggerCustomization** function from processProgramServiceListAndCheckForTriggerCustomization
            // This method is used to process the appointments program services and check if trigger is customized for it
            processProgramServiceListAndCheckForTriggerCustomization = GiveNewAppointmentService.processProgramServiceListAndCheckForTriggerCustomization,
            //Declaring variables in scope level
            //these variables can accessed by any function on method in this file
            //"exitingPatientApptOpenCopayPopup" is used in open copay open popup
            exitingPatientApptOpenCopayPopup = GiveNewAppointmentService.openCopayPopup,
            //"getBillingSettingValueToDisplayCopayPopup" is used to get billing seting value
            //based on setting value we asign functionality to respective field
            getBillingSettingValueToDisplayCopayPopup = GiveNewAppointmentService.getBillingSettingValueToDisplayCopayPopup
            ;
        var RefAuthrizationCustomized = false;
        var isScheduleZoomMeetingButtonCustomizedInSetting = false;
        var isScheduleTeamMeetingButtonCustomizedInSetting = false;
        let isRefferralAuthorizationFieldCustomizedOrNot = false;
        //2- TELEPHONE, 7 - VIDEO, 10 - TELEHEALTHPROVIDEDINPATIENTHOME, 11 - TELEHEALTHPROVIDEDOTHERTHANPATIENTHOM
        var modalityIdsToShowZoomAndTeamButtons = [2, 7, 10, 11];

        //#region "     PRACTICE BASED CONDITIONS       "
        var isNeedToCheckVisitTypeChangeForShowingIsFirstMedicalVideoReviewed = new Set([999, 380, 467]).has(EMRPracticeModel.PracticeID);
        var needToUserootscopeCacheForSelectivePractices = (new Set([1]).has(EMRPracticeModel.PracticeID) || EMRPracticeModel.PracticeID == 999 && EMRPracticeModel.LoggedUserID == 4);
        var griffithCenterForChildrenPractice = new Set([999, 618]).has(EMRPracticeModel.PracticeID);
        var hisStoryCoachingAndCounsilingForresourceAvaialability = new Set([36, 640]).has(EMRPracticeModel.PracticeID);
        var additionalParticipantsRemindersSendingBasedOnPractice = new Set([36, 467, 640]).has(EMRPracticeModel.PracticeID);
        var showPrimarySecondaryandTeritiaryPoliciesInfoBasedonPractice = new Set([613]).has(EMRPracticeModel.PracticeID);
        var checkSelectedProviderisPatientAssignedProviderorNot = new Set([999, 573, 467, 641]).has(EMRPracticeModel.PracticeID);
        const enableVistsUnitsTypeOnlyForInsOrGrantsBasedOnPractices = ([36, 467, 644].includes(EMRPracticeModel.PracticeID) || EMRPracticeModel.PracticeID == 999 && EMRPracticeModel.LoggedUserID == 6);
        const showZoomandTeamButtonsforOtherModailty = [999, 652].includes(EMRPracticeModel.PracticeID);
        var showMoreOptionsPracticeIds = {
            671: [11],
            675: [11],
            667: [11],
            689: [11],
            692: [10],
            694: [11],
            699: [11],
            703: [11],
            691: [11],
            678: [11],
            688: [11],
            698: [11, 12],
            674: [11],
            658: [11, 12],
            706: [],
            705: [],
            704: [11],
            708: [],
            722: [],
            713: [12],
            728: [11],
            727: [12],
            729: [24],
            720: [11],
            735: [12],
        };
        var WcHealthPracticeCondition = (EMRPracticeModel.PracticeID == 319 || EMRPracticeModel.PracticeID == 999);
        var emergCousilingParcitceConditionForCashAndInsurace = {
            641: [],
            999: [11585, 6],
            705: [],
            722: [],
            738: [],
        }
        var viewButtonsForAllModalities = new Set([612, 999]).has(EMRPracticeModel.PracticeID);
        var mostRecentProgramServiceHyperlinkHidingPractices = {
            417: [],
            689: [],
            692: [],
            694: [],
            699: [11],
            // 999: [6],
            703: [11],
            706: [],
            705: [],
            678: [],
            688: [],
            698: [],
            674: [],
            722: [],
            458: [],
            713: [],
            728: [],
            727: [],
            729: [],
            724: [],
            735: [12],
        };
        var hideLocationFieldHyperlinksPractices = {
            640: [],
            689: [],
            692: [],
            694: [],
            699: [11],
            703: [11],
            706: [],
            705: [],
            722: [],
            724: [],
        };
        var hideApptDurationHyperlinksPractices = new Set([624, 692, 694]).has(EMRPracticeModel.PracticeID);
        var autoPopulateVisitTypeOnProgramPractices = new Set([671, 999]).has(EMRPracticeModel.PracticeID);
        var populatePorgramServiceByDefault = new Set([689]).has(EMRPracticeModel.PracticeID);
        $scope.isBillTooFieldCustomized = false;
        var isCashPatient = false;
        var doNotShowGoogleAddWindowPracticeIds = new Set([705, 722, 730, 999]).has(EMRPracticeModel.PracticeID);
        const practiceBasedConditions = {
            hideSaveButtonOnVideoModalityForPracticeIds: [738].includes(EMRPracticeModel.PracticeID) || ([999].includes(EMRPracticeModel.PracticeID) && [6].includes(EMRPracticeModel.LoggedUserID)),
        }
        //#endregion

        $scope.ExitingPatientApptCustomizedFields = GiveAppointmentConstantsService.ExitingPatientApptCustomizedFields;

        //ADDED BY PAVAN KUMAR KANDULA ON NOVEMBER 11 2K17 FOR ENUM FOR BILL TO OPTIONS END HERE
        const hideCopayLinkedtoAppt = [567, 640].includes(EMRPracticeModel.PracticeID);
        const hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue = [634].includes(EMRPracticeModel.PracticeID) && EMRPracticeModel.UserType == 1;
        let showCopayLinkedtoAppt = false;
        var isSaveAndScheduleGoogleMeetButtonCustomized = false;
        var isFromSaveAndScheduleGoogleMeet = false;
        let programServiceBasedFieldsSelection = {
            999: {
                modality: 2,
                BillTo: 2, //1-Insurance, 2- Patient, 3- Do Not Bill
                programsServicesLinkedInfoIds: [21291, 21103]
            },
            542: {
                facilityId: 28,
                resourceId: 11,
                modality: 7,
                programsServicesLinkedInfoIds: [82, 83]
            },
            543:{
                modality: 2,
                BillTo: 2, //1-Insurance, 2- Patient, 3- Do Not Bill
                programsServicesLinkedInfoIds: [281, 283, 285]
            }
        };
        var GoogleOrOutlookSummaryName = "";

        const ShowConfirmationPopupIfDurationExceedsEightHours = [726, 999].includes(EMRPracticeModel.PracticeID)

        var hideAddWindowDoNotBillHyperLink = {
            738: [11, 31, 15, 30, 21],
            999: [16523],
        }



















        //PAGE INIT METHOD
        function existingPatientApptPageInit() {

            //ASSIGNING GUID TO IDENTIY THE CONTROLLER CONTROLS UNIQUELY BY USING THIS CONTROLLER GUID IN THE MEMORY TO OVER COME THE IDENTIFICATION SIMILAR NAMEING CONTROLS IDS IN MEMORY.
            $scope.existingPatientApptDynamicFieldsPopupGUID = adminGetGUID();
            $scope.NewAppointmentSchedulerModel = {
            };
            if (hideCopayLinkedtoAppt || hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue) {
                showCopayLinkedtoAppt = false;
            }
            else {
                showCopayLinkedtoAppt = true;
            }
            if (EMRPracticeModel.PracticeID && showMoreOptionsPracticeIds[EMRPracticeModel.PracticeID]) {
                $scope.GiveAppointmentShowMoreOptionsMenu = !showMoreOptionsPracticeIds[EMRPracticeModel.PracticeID].includes(EMRPracticeModel.LoggedUserID);
            }


            if (emergCousilingParcitceConditionForCashAndInsurace[EMRPracticeModel.PracticeID]
                && (emergCousilingParcitceConditionForCashAndInsurace[EMRPracticeModel.PracticeID].length == 0
                    || emergCousilingParcitceConditionForCashAndInsurace[EMRPracticeModel.PracticeID].includes(EMRPracticeModel.LoggedUserID))) {
                $scope.showIsCashPatientAndPrimaryInsurance = true;
                $scope.existingPatientAppointmentPrimaryInsurance = "None";
            }

            let datafromGiveAppointment = $scope.EMRDataFromPopup;
            if (datafromGiveAppointment && [1, 999, 267].includes(EMRPracticeModel.PracticeID)) {
                let practiceApptTime = new Date($scope.EMRDataFromPopup.SelectedDate).getFormat("hh:mm a");
                let practiceApptDateTime = new Date($scope.EMRDataFromPopup.SelectedDate).getFormat("MM/dd/yyyy hh:mm a");
                let practiceTimeZone = _.get(EMRPracticeModel, "practicesettingsmodel.PracticeTimeZone");
                if (practiceTimeZone) {
                    practiceTimeZone = GiveAppointmentConstantsService.TimeZoneEnums[practiceTimeZone.split(" - ")[0]];
                }
                let MDApptTime = datafromGiveAppointment.MdApptTime ? datafromGiveAppointment.MdApptTime : practiceApptTime;
                $scope.NewAppointmentSchedulerModel.MdApptDateTime = datafromGiveAppointment.MdApptDateTime ? datafromGiveAppointment.MdApptDateTime : practiceApptDateTime;
                let PTApptTime = datafromGiveAppointment.PtApptTime ? datafromGiveAppointment.PtApptTime : practiceApptTime;
                $scope.NewAppointmentSchedulerModel.PtApptDateTime = datafromGiveAppointment.PtApptDateTime ? datafromGiveAppointment.PtApptDateTime : practiceApptDateTime;
                $scope.NewAppointmentSchedulerModel.MdTimeZone = datafromGiveAppointment.MdTimeZone ? GiveAppointmentConstantsService.TimeZoneEnums[datafromGiveAppointment.MdTimeZone] : practiceTimeZone;
                $scope.NewAppointmentSchedulerModel.PTTimeZone = datafromGiveAppointment.PTTimeZone ? GiveAppointmentConstantsService.TimeZoneEnums[datafromGiveAppointment.PTTimeZone] : practiceTimeZone;
                if (datafromGiveAppointment.MdApptTime || datafromGiveAppointment.PtApptTime) {
                    $scope.showMdTimeandPTApptTime = `( MD Time: ${MDApptTime}; PT Time: ${PTApptTime} )`;

                }
            }
            if (isNeedToCheckVisitTypeChangeForShowingIsFirstMedicalVideoReviewed) {
                $scope.isFirstMedicalVideoReviewedModel = 0;
            }
            //APPLYING THE PROPERTY TO OPEN POPUP FROM TOP OF THE WINDOW
            // $("#frmExistingAppts").parents(".modal-dialog").css("top", "-77px");
            $scope.hideApptDurationHyperlinks = hideApptDurationHyperlinksPractices;
            $scope.hideLocationFieldHyperlinks = !getLoggedUserHideOrShowValue(hideLocationFieldHyperlinksPractices);
            $scope.assignUserstoViewOtherProviderPopupShow = [1, 999].includes(EMRPracticeModel.PracticeID);

            $scope.showResourceAvaialabilityBasedOnPractice = !hisStoryCoachingAndCounsilingForresourceAvaialability;
            //BY DEFAULT WE WILL HIDE THE SAVE OR UPDATE AND ADD BILLING INFO BUTTON. BASED ON CUSTOMIZATION WE WILL SHOW THIS BUTTON.
            $scope.apptSchedViewSaveAppointmentsforExistingPatientAndDocumentBillingInfobtnHideShow = false;

            //BY DEFAULT WE WILL HIDE THE SAVE OR UPDATE AND PRINT PORTAL LOGINS INFO BUTTON. BASED ON CUSTOMIZATION WE WILL SHOW THIS BUTTON.
            $scope.apptSchedViewSaveAppointmentsforExistingPatientAndPrintPortalLoginsbtnHideShow = false;

            //THIS IS USED TO HIDE THE SAVE & SEND VIDEO REMINDER BUTTOON BY DEFAULT 
            $scope.existingPatientAppointmentsSaveAndSendVideoReminderShow = false;

            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = false;
            $scope.hideMostRecentProgramServiceHyperlinks = !getLoggedUserHideOrShowValue(mostRecentProgramServiceHyperlinkHidingPractices);

            //==================APPLYING THE COLUMN PROPERTIES TO THE DIFFERENT FILEDS IN APPROPRIATE PLACE IN THE CONTROLLER(PAGE / FORM / WINDOW) BLOCK START =====================.
            $scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
            $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";
            $scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
            $scope.existingpatientappointmentButtonsWidthClass = "colReq-sm-12 col-md-6 col-xs-12";
            $scope.existingPatientSideEffectCommentShow = false;
            $scope.existingPatientMedicationSideEffectsWidthClass = "colReq-sm-12 col-xs-12";
            $scope.IsReferralAuthorizationCustomized = false;
            $scope.checkBillingTriggerCustomizedList(); // this method is used to check trggier custmization
            //upgrade to angular 1.7.2
            $scope.existingPatientMedicationSideEffects = 0;
            $scope.IsClientInsuranceVerifiedinpast30to60Days = 0;
            //==================APPLYING THE COLUMN PROPERTIES TO THE DIFFERENT FILEDS IN APPROPRIATE PLACE IN THE CONTROLLER(PAGE / FORM / WINDOW) BLOCK END =====================.

            //==================CALLING THE METHOD TO GET THE USER AUTHENTICATED MAILS INFORMATION BLOCK START ==============================
            //moved this point to get details after default provider customization
            //$scope.existingPatientApptWindowGetUserAuthenticatedMailInfo();
            //==================CALLING THE METHOD TO GET THE USER AUTHENTICATED MAILS INFORMATION BLOCK END ==============================

            //ASSIGNING THE CURRENT DATE AS APPT. DATE WHILE LOADING(PAGE INIT) THE PAGE / FORM / WINDOW.
            $scope.AppointmentDateInAddMode = $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "MM/dd/yyyy");
            //ASSIGNING THE CURRENT DATE AS APPT. TIME WHILE LOADING(PAGE INIT) THE PAGE / FORM / WINDOW.
            $scope.AppointmentTimeInAddMode = $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "hh:mm a");

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.isFromEncounterPopUp) && $scope.EMRDataFromPopup.isFromEncounterPopUp == true) {
                $scope.existingPatientApptGetsTheNearestSlotTimeForSelectedProvider();
            }

            //ADDED ON DECEMBER 30 TH 2016
            //WHILE GIVING THE NEW APPOINTMENT FROM THE WAITING LIST WE WILL CHNAGE THE TITLE OF THE PAGE / FORM / WINDOW.
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.WaitingListID)) {
                $scope.existingPatientAppointmentsHeader = "Confirm Appt. for ";
            }
            else if(_.get($scope.EMRDataFromPopup,"isFromGiveNextVisit")){
                $scope.existingPatientAppointmentsHeader = "Give Next Visit Appt. - ";
            }
            else {
                $scope.existingPatientAppointmentsHeader = "Add Appt. for ";
            }

            //=================INITIALIZING THE OBJECTS TO MAINTAIN THE MODELS AND CONTROLLER CONTROLS RELATED WIDGETS BLOCK START ==========================


            $scope.existingPatientMainGridWidgets = {
            };
            $scope.ExistingPatientApptConfirmation = null;
            $scope.existingPatientAppointmentWidgets = {
            };
            //=================INITIALIZING THE OBJECTS TO MAINTAIN THE MODELS AND CONTROLLER CONTROLS RELATED WIDGETS BLOCK END ==========================


            //================CALLING THE METHOD TO GET THE FACILITIES LIST AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK START =============================
            // if (hasValue(ExistingPatientSelectedData) && hasValue(ExistingPatientSelectedData.SelectedPhysicianID) && hasValue(ExistingPatientSelectedData.SelectedResourceType) && ExistingPatientSelectedData.SelectedResourceType == 2) {
            //removed if else on 01/28/2023
            //$scope.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList(ExistingPatientSelectedData.SelectedPhysicianID, ExistingPatientSelectedData.SelectedResourceType, undefined, true);
            // } else {
            //     $scope.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList(undefined,undefined,undefined,true);
            // }

            //================CALLING THE METHOD TO GET THE FACILITIES LIST AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK END =============================

            //================CALLING THE METHOD TO LOAD THE ENCOUNTER MODALITY INFORMATION AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK START =======================
            $scope.existingPatientApptEncounterModalityInfo();
            //================CALLING THE METHOD TO LOAD THE ENCOUNTER MODALITY INFORMATION AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK END =======================

            //SETTING THE TIME OPTION TO IMPACT ON THE TIME PICKER BASED ON ID BY USING THE FOLLOWING SYNTAX.
            if (hasValue($('#addAppointmentSelectAppointmentTimeId').data("timepicker"))) {
                $('#addAppointmentSelectAppointmentTimeId').data("timepicker").setTime($scope.AppointmentTimeInAddMode);
            }

            //COMMENTED ON SRINIVAS BY SRINIVAS BECAUSE OF THE ISSUE AS ASSIGNING THE LOGGED FACILITY OR DEFAULT FACILITY IN SETTING WINDOW (FACILITITES LINKED TO USERS) NOT 
            //STATEMAINTAING AT THE TIME OF LOADING THE CONTROLLER.(PAGE / FORM / WINDOW).
            //BY OVERCOMING THE ABOVE ISSUE IN THE COMMENTS WE WILL PLACE THE BELOW METHOD CALL IN THE ABOVE METHOD AS $scope.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList();
            //$scope.ApptSchedView_GetMinimumInterval();

            //===============CALLING THE METHOD TO GET THE LIST OF LINKED USERS LIST FOR HOUSE CALL AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK START =======================
            //USED TO LOAD THE HOUSE CALL RELATED PROVIDERS AS ADDITIONAL PARTICIPANTS.
            //$scope.existingPatientAppointmentsGetLinkedUserslistforHouseCall();
            //===============CALLING THE METHOD TO GET THE LIST OF LINKED USERS LIST FOR HOUSE CALL AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK END =======================

            //===============CALLING THE METHOD TO SAVE APPT SLOT DETAILS WHILE GIVING THE NEW APPT BLOCK START ==========================
            //IF TWO USERS WORKING ON APPT SCHEDULER THEY ARE GIVING THE APPT FOR THE SAME SLOT AT A TIME. IN THAT TIME WE ARE INSERTING THOSE SLOT DETAILS
            //IN A TABLE BASED ON THE SLOT WE WILL SHOW THE VALIDATION FOR OTHER USER. SOME OTHER USER IS ALREADY GIVING THE APPT IN THE SAME SLOT. SO
            //SO YOU ARE NOT ALLOWED TO GIVE THE APPT AT THE SAME TIME IN THE SAME SLOT.
            //THIS METHOD IS ONLY APPLICABLE FOR FORMAT1 APPT SCHEDULER ONLY.
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.RequestingFromFormat) && $scope.EMRDataFromPopup.RequestingFromFormat == 1) {
                $scope.existingPatientAppointmentSaveUserInformationWhileGivingConcurrentAppts();
            }
            //===============CALLING THE METHOD TO SAVE APPT SLOT DETAILS WHILE GIVING THE NEW APPT BLOCK END ==========================

            //===============CALLING THE METHOD TO DELETE APPT SLOT DETAILS AFTER 3 MINUTES WHILE OPENING THE ADD APPT PAGE / FORM / WINDOW BLOCK START ==========================
            //BY USING THIS METHOD CALL WE ARE INACTIVE THE SELECTED SLOT DETAILS EXISTS IN THE DATABASE WILL BE INACTIVATED AFTER 3 MINUTES WHILE OPENING THE WINDOW.
            //TO OVERCOME THE CONCURRENT USERS ACCESS THE APPT SCHEDULER SLOT AT A TIME TO GIVE THE APPT.
            //THIS METHOD IS ONLY APPLICABLE FOR FORMAT1 APPT SCHEDULER ONLY.
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.RequestingFromFormat) && $scope.EMRDataFromPopup.RequestingFromFormat == 1) {
                $scope.existingPatientAppointmentSaveUserInformationWhileGivingConcurrentApptsTimerId = $timeout(function () {
                    $scope.existingPatientAppointmentDeleteUserInformationWhileGivingConcurrentAppts();
                }, 3 * 60 * 1000);
            }
            //===============CALLING THE METHOD TO DELETE APPT SLOT DETAILS AFTER 3 MINUTES WHILE OPENING THE ADD APPT PAGE / FORM / WINDOW BLOCK END ==========================

            //==============CALLING THE METHOD TO GET THE LIST OF EPISODE NUMBER DETAILS LIST INFOMATION USED TO SHOW IN THE EPISODE SELECTION POPUP BLOCK START ===================
            //EPISODE DETAILS ARE USED TO LINK THE EPISODE TO THE APPOINTMENT.
            //BY USING THIS METHOS CALL WE ARE LINKED THE EPISODE DETIALS TO THE APPOINTMENT IF SINGLE EPISODE EXISTS.

            //COMMENTED BY HEMANTH ON DEC 06 2K18 
            //TO LOAD THE EPISODE DETAILS ONLY IF THE FIELD IS CUSTOMIZED 
            //$scope.existingPatientAppointmentsGetPatientEpisodeDetailsList(); //NO NEED TO PLACE THIS CODE HERE I THINK


            //==============CALLING THE METHOD TO GET THE LIST OF EPISODE NUMBER DETAILS LIST INFOMATION USED TO SHOW IN THE EPISODE SELECTION POPUP BLOCK END ===================

            //==============BY DEFAULT WE ARE NOT SHOWING THE LAST APPT. DATE AND APPT. STATUS AND VISIT TYPE AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK START ==========================
            $scope.existingPatientAppointmentopenApptHxShowHideLastApptDate = false;
            $scope.existingPatientAppointmentopenApptHxShowHideStatus = false;
            //==============BY DEFAULT WE ARE NOT SHOWING THE LAST APPT. DATE AND APPT. STATUS AND VISIT TYPE AT THE TIME OF LOAD THE PAGE / FORM / WINDOW BLOCK END ==========================

            //==============CALLING THE METHOD TO GET THE LIST OF PAST APPOINTMENTS DETAILS FOR THE PATIENT BLOCK START ===================
            //IN THIS METHOD WE WILL SHOW THE DATA INTO THE LAST APPT. DATE, APPT. STATUS AND VISIT TYPE LABELS AND ALSO SHOW THE APPT. HX LINK LABEL.
            getPatientPastApptDataAndShowLabels();
            //==============CALLING THE METHOD TO GET THE LIST OF PAST APPOINTMENTS DETAILS FOR THE PATIENT BLOCK END =====================

            //APPLYING THE COLUMNS APPLICABLE TO SHOW THE BUTTONS IN BUTTONS DIV IN THE CONTROLLER (PAGE / FORM / WINDOW).
            $scope.divApptsButtonsClass = "col-md-12 col-sm-12 colReq-sm-12";
            //BY DEFAULT 
            $scope.existingPatientAppointmentBriefViewAndDetailViewClickEvent = true;
            $scope.existingpatientBriefViewAndDetailViewTitle = "Detail View";
            $scope.existingPatientAppointmentsHeightClass = "ExistingPatientAppointmentsHeight";
            billtoFieldHyperlinksLabelNameChangesBasedonPractice();
            //commented by hemanth
            // $scope.existingPatientAppointmentsPatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;
            $scope.NewAppointmentSchedulerModel.IsEmergency = ExistingPatientSelectedData.apptSchedulerExistingPatientIsEmergencyAppointment;
            $scope.IsPreAuthMandatoryBeforeGivingAppt = false;

            $scope.ReferralAuthorizationEditHide = true;
            $scope.ReferralAuthorizationDeleteHide = true;

            //CALLING FUNCTION WHCIH IS USED TO GET THE AUTHORIZATION DETAILS OF THE SELECTED PATIENT.
            //$scope.existingPatientAppointmentGetAuthorizationDetails();

            //$scope.existingPatientAppointmentCheckPatientHaveReferralAuthDetails();
            $scope.ExistingPatientAppointmentShowHideClass = "colReq-sm-7";

            $timeout(function () {
                if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo))
                    $scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo.focus();

            }, 200);


            $scope.existingPatientAppointmentVisitTypeMandatoryText = "*";
            $scope.SelectedExistingPatApptVisitTypeMandatoryCheckClass = "mandatoryCheck";
            // alert('s')
            //added by mahesh p on 07/14/2015
            //$scope.NewAppointmentSchedulerModel.BillingNotRequired = true;//on load setting as yes
            $scope.NewAppointmentSchedulerModel.BillingNotRequired = false;//only if the user click on do not bill then only this falg is true
            //added by shabbar taj on 05/05/2021  for disable of use count of referral auth in edit appoinment window
            //if ([36, 999, 285, 267, 565].includes(EMRPracticeModel.PracticeID)) {
            //	$scope.NumberofUnitsforTheVisitDisable = true;
            //}
            //else
            $scope.NumberofUnitsforTheVisitDisable = false;




            //calling method to get appt alerts
            $scope.existingPatientAppointmentLoadPatientAlerts();


            // check the selected  resource type 
            $scope.existingApptSelectedResourceType = ExistingPatientSelectedData.SelectedResourceType;
            if (ExistingPatientSelectedData.SelectedResourceType == 2 && !ExistingPatientSelectedData.isFromNewFormat3Scheduler) {
                $scope.ExistingPatientAppt_GetResourceType();


                //based on the REsourceOrRoomType Resource and Room are shown/hidden.
                //if the appt is opened from Resource then ResourceOrRoomTYpe will be 1 and Resource field will be hidden.
                //if wppt is opened from Room then ResourceOrRoomtype will be 2 then hiding Room field
                $scope.existingappointmentshowSelectResourceOrRoom = _.get(ExistingPatientSelectedData, "ResourceOrRoomType") == 1 ? false : true;
                $scope.existingappointmentshowSelectRoom = _.get(ExistingPatientSelectedData, "ResourceOrRoomType") == 2 ? false : true;

                $scope.existingpatientappointmentButtonsWidthClass = "colReq-sm-12 col-md-12 col-xs-12";
                $scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
                $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";

            }
            else {


                //if the REsourcetYpe is 1 then it means appt is opened form Provider so Show both fields
                $scope.existingappointmentshowSelectRoom = true;
                $scope.existingappointmentshowSelectResourceOrRoom = true;
                $timeout(function () {
                    $scope.existingappointmentshowSelectResourceOrRoomWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                    //$scope.apply();

                }, 100);
                $scope.existingpatientappointmentButtonsWidthClass = "colReq-sm-12 col-md-6 col-xs-12";
            }

            //#######CALL CENTER BLOCK START##################

            if (hasValue(ExistingPatientSelectedData)) {
                if (ExistingPatientSelectedData.isFromCallCenterEHR == true) {
                    $scope.ExistingPatientAppointmentIsFromCallCenterEHR = ExistingPatientSelectedData.isFromCallCenterEHR;
                    $scope.ExistingPatientAppointmentShowHideClass = "colReq-sm-12";
                }
            }

            //#######CALL CENTER BLOCK END##################

            //variable to hide use column
            $scope.RefAuthDoNotShowUseColumn = false;
            //checking permission to deduct auth count
            if (EMRCommonFactory.EMRCheckPermissions("DEMOGRAPHICS-ALLOWUSERTODEDUCTAUTHORIZATIONUSEDCOUNT") == EMRPermissionType.DENIED) {
                $scope.RefAuthDoNotShowUseColumn = true;
            }


            ////CALLING THE METHOD TO LOAD THE PRIMARY INSURANCE POLICY DETAILS.
            //CALLING THE METHOD ONLY WHEN THE FILED IS CUSTOMIZED FROM THE GIVE APPT FIELDS 
            //$scope.existingPatientApptgetPatientLatestPrimaryInsurancePolicyDetails();

            if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "NewClientNewApptRequestFromPortal") {
                $scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit = $scope.EMRDataFromPopup.ReasonForVisit;
                $scope.AppointmentTimeInAddMode = new Date($scope.EMRDataFromPopup.SelectedDate).getFormat("hh:mm a");
                $scope.SelectedExistingPatApptFacilities = $scope.EMRDataFromPopup.SelectedFacilityID;
                $scope.SelectedExistingPatApptDuration = $scope.EMRDataFromPopup.SelectedAppointmentDuration;
                $scope.existingPatientAppointmentSelectRoom = $scope.EMRDataFromPopup.ResourceOrRoomName;
                $scope.existingPatientAppointmentSelectRoomID = $scope.EMRDataFromPopup.ResourceOrRoomID;
            }

            if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "StaffActivitiesNotesSavingWindow") {
                EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.AppointmentScheduler, "Appointment Scheduler", "Give New Appointment Window Open Success" + (_.get($scope.EMRDataFromPopup, "NavigationForApptAuditLog") || ""), EHRAuditLogStatus.Success, EHRAuditLogActions.WINDOWOPEN, $scope.NewAppointmentSchedulerModel.PatientID, EMRPracticeModel.LoggedUserID);
            }


            //COMENTED BY LAKSHMI ON 03/07/2017 FOR GETTING THE CUSTOMIZED FILEDS LIST
            //$scope.ExistingPatientAppointmentColumnsCustomization();

            //CALLING THE APPOINTMENT SCHEDULER SETTINGS INFORMATION WHICH IS PLACED IN COMMON FACTORY

            // ************** *****THIS SETTINGS RELATED TO ALL SCHEDULER CUSTOMIZATIONS  ***** NOT ONLY FOR THE ADD/ EDIT APPT WINDOW FIELDS 
            //FROM THIS VARIABLE WE ARE USING THE COMMON SETTIG ONLY 
            $scope.ExistingPatientAppointmentColumnsCustomizationInfoList = EMRCommonFactory.GetAppointmentSchedulerSettings();

            $scope.PerformNetworkCertificationValidation = false;
            $scope.apptGetPHPVisitTypeValidation = false;
            $scope.apptAdd_Additional_Provider = false;
            $scope.IsApptGivenOutsideScheduleHours = false;
            $scope.existingPatientAppointmentNeedToSendApptRemaiders = false;
            var assignproviderfiledcustomized = false;

            //THIS FUNCTION IS CALLED TO GET COUNTRY AND STATE WISE TIME ZONE NAMES AS STRING TYPE VALUE
            //AND WE ARE PASSING THIS STRING TYPE VALUE INTO GOOGLE CALENDAR TO SHOW APPOINTMENTS SLOTS PROPERLY
            $scope.ExistingPatientApptSchedulerGetCountryAndStateTimeZoneNames();
            if (hasValue($scope.ExistingPatientAppointmentColumnsCustomizationInfoList) && $scope.ExistingPatientAppointmentColumnsCustomizationInfoList.length > 0) {
                //hiding portal block if no child fields are exists

                $scope.ExistingPatientAppointmentColumnsCustomizationInfoList.forEach(function (eachItem) {
                    //GET THE SETTINGS //added by teja n under guidence of srinivas sir //restrict the service calls based on settings
                    //RESTRICT THE SERVICE CALL EHRValidationsPerformValidationsExecution BASED ON SETTING
                    if (eachItem.AppointmentSettingFieldID == 209) {
                        $scope.PerformNetworkCertificationValidation = true;
                    }
                    //RESTRICT THE SERVICE CALL Validate DependentVisit Type and PHPtimeValidations BASED ON SETTING
                    else if (eachItem.AppointmentSettingFieldID == 210) {
                        $scope.apptGetPHPVisitTypeValidation = true;
                    }
                    else if (eachItem.AppointmentSettingFieldID == 169) {
                        $scope.apptAdd_Additional_Provider = true;
                    }
                    else if (eachItem.AppointmentSettingFieldID == 160) {
                        $scope.IsApptGivenOutsideScheduleHours = true;
                    }
                    //Need Get Send Remaider Setting from Appointment Scheduler Settings.
                    //We Need to Get Send Remaider Setting based on Appointment Scheduler Settings List Info.
                    //State maintain the Bool Flag For Send Appt Remaiders.
                    else if (eachItem.AppointmentSettingFieldID == 249) {
                        $scope.existingPatientAppointmentNeedToSendApptRemaiders = true;
                    }
                    else if (eachItem.AppointmentSettingFieldID == GiveAppointmentConstantsService.APPOINTMENTSETTINGSENUMS.SHOWASSIGNEDPROVIDERINPROVIDERFIELDWHILEGIVINGAPPT && $scope.SelectedAssignedProviderID > 0) {
                        //THIS IS USED FOR POPULATING THE PHYSICIAN AND THE RESOURCE LIST IN THE EDIT APPOINTEMNT WINDOW, SO THAT THE USER WILL SELECT  FOR WHOM THE APPOINTMENT IS GOING TO GIVE
                        //REASON TO CALLING THIS METHOD IS : IF PATIENT SELECTS ASSIGNED PROVIDER AND CLICKS ON GIVE APPT IN THE GIVE APPT WINDOW ASSIGNED PROVIDER COLUMN IS FILLED WITH LOGIN PHYSIAN NAME SO BASED ON THE USER SELECTION WE FILL THAT COLUMN WITH SELECTED ASSIGNED PROVIDER  
                        //AND ALSO CHECKS THAT USER SELECTED ASSIGNED PROVIED IS IN APPT SHEDULER PHYSIAN RESOURCE AND NON PHYSIAN LIST OR NOT IF EXIST THE WE ASSIGN IT OTHER WISE WE DON'T DISTURB THE OLD FUNCTIONALITY
                        $scope.ApptShed_PhyResourceandNonPhyList1();
                        assignproviderfiledcustomized = true;
                    }
                })
            }
            // ************** *****THIS SETTINGS RELATED TO ALL SCHEDULER CUSTOMIZATIONS  ***** NOT ONLY FOR THE ADD/ EDIT APPT WINDOW FIELDS 

            if ((!assignproviderfiledcustomized && populatePorgramServiceByDefault && !defaultProgamServiceBasedonPractice[EMRPracticeModel.PracticeID]) || _.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "StaffActivitiesNotesSavingWindow") {
                autoPopulateProgramService();
            }

            if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "NewClientNewApptRequestFromPortal") {
                $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = false;
                $scope.apptSchedViewSaveAppointmentsforExistingPatientAndPrintPortalLoginsbtnHideShow = true;
            }


            ///SHOW HIDE BUTTONS REALTED CODE IS PLACED IN THE BELWO METHOD AFTER GETTING THE CUSTOMIZED LIST 
            //CHANGED BY HEMANTH ON JULY 26 2017 
            $scope.existingPatientApptDynamicFieldsPopupGetCustomizedFieldsList();

            //CALLING FUNCTION WHCIH IS USED TO GET THE AUTHORIZATION DETAILS OF THE SELECTED PATIENT.
            // !dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()
            $scope.existingPatientAppointmentGetAuthorizationDetails();

            //$scope.existingPatientApptGetLatestSlidingFeeForLowIncome();

            $timeout(function () {
                $scope.existingPatientAppointmentSelectProviderWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.existingappointmentshowSelectResourceOrRoomWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.addNewApptSelectResourceProviderWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.existingPatientAppointmentEncounterTypeWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.existingPatientAppointmentReferredByWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.existingpatientappointmentButtonsWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.existingPatientEpisodeWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.existingPatientAppointmentMedicationSideEffectsWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
            }, 500);





            //Labels for the Customized Existing Patients Appointments

            $scope.existingPatientAppointmentSelectBillTo = "Bill To";
            $scope.existingPatientAppointmentSelectBillToInfo = "Bill To";
            $scope.existingPatientAppointmentSelectAdditionalProvider = "Add. Pro. Participants";
            $scope.existingPatientAppointmentSelectAdditionalProviderInfo = "Additional Provider Participants";
            $scope.existingPatientAppointmentSelectResourceRoom = "Resource";
            $scope.existingPatientAppointmentSelectRoomFieldName = "Room";
            $scope.existingPatientAppointmentSelectResourceRoomInfo = "Resource / Room";
            $scope.existingPatientAppointmentSelectReferredBy = "Referred By";
            $scope.existingPatientAppointmentSelectReferredByInfo = "Referred By";
            $scope.existingPatientAppointmentSelectEncounterType = "Encounter Type";
            $scope.existingPatientAppointmentSelectEncounterTypeInfo = "Encounter Type";
            $scope.existingPatientAppointmentSelectProgramServiceTherapy = "Prog./ Service - Therapy / Act.";
            $scope.existingPatientAppointmentSelectProgramServiceTherapyInfo = "Prog./ Service - Therapy / Activity";
            $scope.existingPatientAppointmentSelectMedicationSideEffects = "Medication Side Effects";
            $scope.existingPatientAppointmentSelectMedicationSideEffectsInfo = "Medication Side Effects";
            //$scope.existingPatientAppointmentSelectApptCmntFrmDemographics = "Appt. Comments from Demographics";
            //$scope.existingPatientAppointmentSelectApptCmntFrmDemographicsInfo = "Appt. Comments from Demographics";
            $scope.existingPatientAppointmentSelectEpisode = "Episode #";
            $scope.existingPatientAppointmentSelectEpisodeInfo = "Episode #";
            $scope.existingPatientAppointmentSelectGeneralComments = "General Comments";
            $scope.existingPatientAppointmentSelectGeneralCommentsInfo = "General Comments";
            $scope.existingPatientAppointmentSelectReasonForAppt = "Reason for Appt.";
            $scope.existingPatientAppointmentSelectReasonForApptInfo = "Reason for Appt.";
            $scope.existingPatientAppointmentSelectBillingComments = "Billing Comments";
            $scope.existingPatientAppointmentSelectReasonForVisit = "Reason for Visit";
            $scope.existingPatientAppointmentSelectDeductiableAmount = "Deductiable Amount";
            //as per omkar garu - show do not bill hyperlink all the time
            //if want to hide do not bill hyerplink for any practice add practice id in below($scope.existingPatientAppointmentBillToDoNotBillShowHide) flag
            //The Request to Avoid API Call
            //function call to Get billing settings
            //$scope.existingPatientAppointmentBillingSettingFieldsInfo();
            //Do Not Bill link show by defualt //added by Pavan.burri on March 2019
            //EHR-11699 : hiding do not bill button for 726 practice
            $scope.existingPatientAppointmentBillToDoNotBillShowHide = ![640, 267, 285, 591, 332, 37, 417, 433, 488, 258, 372, 671, 543, 705, 722, 400, 726].includes(EMRPracticeModel.PracticeID);
            //ADDED BY HEMANTH ON JULY 26 2017 
            //THIS TO CHECK THE VISIT TYPE FIELD IS CUSTOMIZED OR NOT 
            $scope.existingpatientAppointmentsVisitTypeFieldCustomized = false;
            //TO hide DIv while not having data
            $scope.ExistingPatientAppointmentPrevApptDetailsShow = false;
            //HOLD THE REASON FOR VISIT ICD CODES LIST DATA
            $scope.NewAppointmentICDCodeDataList = [];
            // $scope.NewAppointmentSchedulerModel.appointmenticdcodesmodel = {};
            $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = [];


            //ASSIGN THE SELECTED TIME ZONE ID TO SAVE APPT DETAILS 
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.selectedTimeZoneInfo) && hasValue($scope.EMRDataFromPopup.selectedTimeZoneInfo.TimeZoneID)) {
                $scope.NewAppointmentSchedulerModel.ApptTimeZoneID = $scope.EMRDataFromPopup.selectedTimeZoneInfo.TimeZoneID;
            }

            //chekcing the selected patient array has value and assigning the mobile or work or home phone valeue to the  phone n umber text field
            if (_.isArray($scope.EMRDataFromPopup.SelectedPatient) && $scope.EMRDataFromPopup.SelectedPatient.length > 0) {
                const [selectedPatientDetails] = $scope.EMRDataFromPopup.SelectedPatient;    //assiging the aray 0 index to the variable
                $scope.existingPatientAppointmentPhoneNumber = selectedPatientDetails.MobilePhone || selectedPatientDetails.HomePhone || selectedPatientDetails.workPhone || selectedPatientDetails.patientPhoneNumberToDisplay;
            }


            //ADDED BY PRATHIMA S ON 16/07/2018 
            //IF SELECTED PROGRAM/SERVICE EXISTS FROM PARENT POPUP THEN TO AUTO POPULATE SELECTED SERVICE INFO IN PAGEINIT
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedServiceInfo)) {
                var programServiceInfo = {};//declaring a obj to push in list variable
                if (hasValue($scope.EMRDataFromPopup.SelectedServiceInfo.ServiceID) && $scope.EMRDataFromPopup.SelectedServiceInfo.ServiceID > 0) {
                    $scope.selectedProgramServicesLinkedInfoID = $scope.EMRDataFromPopup.SelectedServiceInfo.ServiceID;//assigning progaram linked service info id

                    if (hasValue($scope.EMRDataFromPopup.SelectedServiceInfo.GroupTherapyCategoryName) && hasValue($scope.EMRDataFromPopup.SelectedServiceInfo.GroupTherapyName)) {
                        $scope.existingPatientAppointmentProgramsProgramsServices = $scope.existingPatientAppointmentProgramsProgramsServices + $scope.EMRDataFromPopup.SelectedServiceInfo.GroupTherapyCategoryName + " - " + $scope.EMRDataFromPopup.SelectedServiceInfo.GroupTherapyName + "; ";
                    }
                    else {
                        if (hasValue($scope.EMRDataFromPopup.SelectedServiceInfo.GroupTherapyName)) {
                            $scope.existingPatientAppointmentProgramsProgramsServices = $scope.existingPatientAppointmentProgramsProgramsServices + $scope.EMRDataFromPopup.SelectedServiceInfo.GroupTherapyName + "; ";
                        }
                    }
                    programServiceInfo = $scope.EMRDataFromPopup.SelectedServiceInfo;
                    if (hasValue(programServiceInfo)) {
                        $scope.existingPatientAppointmentProgramsProgramsServicesList.push(programServiceInfo);//pushing the items to list to populate
                        if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                            exisitingPatientApptReferralAuthorizationPopulateUsedField();
                    }
                }
            }


            hideReferalAuthorizationAddPopUpForPractice()
            if ([9999, 603, 467, 93, 624].includes(EMRPracticeModel.PracticeID)) {
                $scope.referralAuthorizationAddPopupHide = true;
            }
            else {
                $scope.referralAuthorizationAddPopupHide = false;
            }
            if (checkSelectedProviderisPatientAssignedProviderorNot) {
                getPatientAssignedProviderID();
            }
            if (DisablingUseColumnBasedOnPracID) {
                $scope.NumberofUnitsforTheVisitDisable = true;
            } 

            if (EMRPracticeModel.PracticeID && hideAddWindowDoNotBillHyperLink[EMRPracticeModel.PracticeID]) {
                $scope.hideAddWindowDoNotBillHyperLink =
                    hideAddWindowDoNotBillHyperLink[EMRPracticeModel.PracticeID].length == 0 ||
                    !hideAddWindowDoNotBillHyperLink[EMRPracticeModel.PracticeID].includes(EMRPracticeModel.LoggedUserID);
            }
        };



























        //################### GET FIELDS INFO BLOCK START #############################

        ///#############################  METHOD TO GET THE PATIENT INFO AND NEAREST TIME SLOT - BLOCK START #############################
        ///*******PURPOSE: THIS METHOD IS USED TO GET THE PATIENT INFO AND NEAREST TIME SLOT
        ///*******CREATED BY: SRINIVAS M
        ///*******CREATED DATE: 6TH OCT 2017
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ******************
        $scope.existingPatientApptGetsTheNearestSlotTimeForSelectedProvider = function () {
            var PostData = {};

            PostData.PatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;

            GiveNewAppointmentService.ApptSchedGetGetPatientInfoBasedOnPatientID(PostData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;

                $scope.EMRDataFromPopup.SelectedPatient = [];
                $scope.EMRDataFromPopup.SelectedPatient.push({ PatientID: serviceResponse.PatientID, PersonLastNameFirstName: serviceResponse.PatientFullName, DateOFBirth: serviceResponse.DOB, Gender: serviceResponse.Gender });

            });

            var postData = {};
            postData = {
                ProviderID: ExistingPatientSelectedData.SelectedPhysicianID,
                ResourceType: ExistingPatientSelectedData.SelectedResourceType,
                ShowNearestRoundedTimefromEncounterPopUp: true,
            }

            postData.ApptTime = $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "hh:mm a");
            postData.ApptDate = $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "MM/dd/yyyy hh:mm a");

            GiveNewAppointmentService.apptSchedulerGetsTheNearestSlotTimeForSelectedProvider(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                if (!hasValue(serviceResponse[0]) || !hasValue(serviceResponse[0].SlotTime)) {
                    return false
                };
                $scope.AppointmentTimeInAddMode = serviceResponse[0].SlotTime;
            });
        }
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
        ///#############################  METHOD TO GET THE PATIENT INFO AND NEAREST TIME SLOT - BLOCK END #############################

        ///#############################  METHOD TO GET THE USER AUTHENTICATED MAIL INFORMATION - BLOCK START #############################
        ///*******PURPOSE: THIS METHOD IS USED TO GET THE USER AUTHENTICATED MAIL INFORMATION TO SHOW THE APPT CREATED IN EMR TO CORRESPONDING MAIL CALENDER.
        /// AUTHENTICATECALENDERTYPES = 1 - GMAIL, 2 - IOS, 3 - YAHOO AND ETC...
        ///*******CREATED BY: Lakshmi B
        ///*******CREATED DATE: 01/05/2017
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ******************
        $scope.existingPatientApptWindowGetUserAuthenticatedMailInfo = function () {

            if (needToUserootscopeCacheForSelectivePractices && SelectedPhysicianID && SelectedResourceType) {
                var practiceIDWithProvideridandResourceType = `${EMRPracticeModel.PracticeID}~${SelectedPhysicianID}~${SelectedResourceType}`;
                if ($rootScope.OneToOneApptWindowAuthenticatedMailCalenderTypesCacheData != undefined
                    && practiceIDWithProvideridandResourceType
                    && $rootScope.OneToOneApptWindowAuthenticatedMailCalenderTypesCacheData[practiceIDWithProvideridandResourceType] != undefined) {
                    SelectedUserAuthenticatedMailCalenderTypes = angular.copy($rootScope.OneToOneApptWindowAuthenticatedMailCalenderTypesCacheData[practiceIDWithProvideridandResourceType]);
                    return;
                }
            }

            var PostData = {
                PhysicianId: SelectedPhysicianID,
                ProviderResourceType: SelectedResourceType,
            }

            //CALLING THE SERVICE TO GET THE LIST OF DRIVER DETAILS TO SHOW IN THE GRID
            GiveNewAppointmentService.ApptSched_GetUserAuthenticatedMailInfo(PostData).then(function (serviceResponse) {

                //CHECKING THE SERVICE RESPONSE
                if (isError(serviceResponse)) return false;

                if (hasValue(serviceResponse) && serviceResponse.length > 0) {
                    SelectedUserAuthenticatedMailCalenderTypes = serviceResponse[0].AuthenticateCalenderTypes;
                }
                if (needToUserootscopeCacheForSelectivePractices && SelectedPhysicianID && SelectedResourceType && practiceIDWithProvideridandResourceType) {
                    if (!$rootScope.OneToOneApptWindowAuthenticatedMailCalenderTypesCacheData) {
                        $rootScope.OneToOneApptWindowAuthenticatedMailCalenderTypesCacheData = {};
                    }
                    $rootScope.OneToOneApptWindowAuthenticatedMailCalenderTypesCacheData[practiceIDWithProvideridandResourceType] = angular.copy(SelectedUserAuthenticatedMailCalenderTypes) || "";
                }

                showOrHideGoogleMeetButtonBasedOnMailAuthDetails(serviceResponse[0].CreateGoogleMeet);
            });

        }
        ///#############################  METHOD TO GET THE USER AUTHENTICATED MAIL INFORMATION - BLOCK END #############################

        ///#############################  APPLY MANDATORY CLASSES TO CUSTOMIZED FILEDS - BLOCK START #############################
        ///*******PURPOSE: USED TO APPLY MANDATORY CLASSES TO CUSTOMIZED FILEDS
        ///*******CREATED BY: Lakshmi B
        ///*******CREATED DATE: 01/05/2017
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ******************
        $scope.existingPatientApptApplyMandatoryClassToFields = function (existingApptCustFieldType) {
            switch (existingApptCustFieldType) {
                case 11:

                    $("#txtExistingPatientAppointmentProgramsProgramsServices").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtExistingPatientAppointmentProgramsProgramsServices").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");

                    break;
                case 6:

                    $("#txtExistingPatientAppointmentBillTo").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtExistingPatientAppointmentBillTo").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");

                    break;
                case 7:

                    $("#txtExistingPatientAppointmentAdditionalParticipants").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtExistingPatientAppointmentAdditionalParticipants").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");

                    break;
                case 8:

                    $("#txtExistingPatientAppointmentSelectResource").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtExistingPatientAppointmentSelectResource").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");

                    break;
                case 9:

                    $("#txtExistingPatientReferralMD").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtExistingPatientReferralMD").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");

                    break;
                case 10:

                    $("#ddlEncounterType").removeClass("").addClass("mandatoryCheck");
                    $("#ddlEncounterType").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");

                    break;

                case 13:

                    $("#ddlExistingPatientMedicationSideEffects").removeClass("").addClass("mandatoryCheck");
                    $("#ddlExistingPatientMedicationSideEffects").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");

                    break;

                //Mandatory   validate field customization for Appointment comments From Demographics  
                //case 36:

                //    $("#txtApptComments").removeClass("form-control").addClass("form-control mandatoryCheck");
                //    $("#txtApptComments").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                //    break;

                //Mandatory   validate field customization for Episode  
                case 37:

                    $("#txtExistingPatientEpisodeNumber").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtExistingPatientEpisodeNumber").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    break;
                //Mandatory   validate field customization for GeneralComments 
                case 38:

                    $("#txtGeneralComments").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtGeneralComments").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    break;
                //Mandatory   validate field customization for Reason For Appointment
                case 39:

                    $("#txtReasonforVisit").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtReasonforVisit").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    break;

                case 53: //Mandatory  validate field customization for Billing Comments

                    $("#txtBillingComments").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#txtBillingComments").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    break;

                case 46: //Mandatory  validate field customization for Billing Comments

                    $("#ddlSelectVisitType").removeClass("form-control").addClass("form-control mandatoryCheck");
                    $("#ddlSelectVisitType").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    break;


                default:
                    break;
            }

            return true;
        }
        ///#############################  CHECK EXISTING APPT MANDATORY VALIDATIONS - BLOCK END #############################



        $scope.existingPatientAppointmentsDurationDataSource = new kendo.data.DataSource({
            data: []
        });

        $scope.selectedExistingPatApptDurationComboBoxOptions = {
            filtering: function (e) {
                e.stopPropagation();
            },
            dataBound: function (e) {

                if (hasValue(e.sender.input)) {
                    e.sender.input.attr("maxlength", 4);


                    // e.sender.input.unbind("change.apptDuration");
                    e.sender.input.unbind("keypress.apptDuration");
                    e.sender.input.unbind("keyup.apptDuration");
                    e.sender.input.unbind("keydown.apptDuration");
                    e.sender.input.unbind("input.apptDuration");

                    e.sender.input.bind("keydown.apptDuration", function (evt) {
                        if (hasValue(this.value)) {
                            var key = (evt.keyCode) ? evt.keyCode : evt.which;
                            key = parseInt(key, 10);
                            if (key == 8) {
                                this.value = "";
                                return false;
                            }
                            if ((key < 48 || key > 57) && (key < 96 || key > 105)) {
                                if (!jsIsUserFriendlyChar(key, "Numbers")) {
                                    return false;
                                }
                            }
                            else {
                                if (hasValue(this.value) && /[a-zA-z]/.test(this.value)) {
                                    this.value = String.fromCharCode(evt.keyCode);
                                }

                                this.value = this.value.replace(/[^0-9]/g, '');
                            }
                        }
                    });

                    e.sender.input.bind("keyup.apptDuration", function (evt) {
                        if (hasValue(this.value)) {
                            var key = (evt.keyCode) ? evt.keyCode : evt.which;
                            key = parseInt(key, 10);
                            if (key == 8) {
                                this.value = "";
                                return false;
                            }
                            if ((key < 48 || key > 57) && (key < 96 || key > 105)) {
                                if (!jsIsUserFriendlyChar(key, "Numbers")) {
                                    return false;
                                }
                            }
                            else {
                                if (hasValue(this.value) && /[a-zA-z]/.test(this.value)) {
                                    this.value = String.fromCharCode(evt.keyCode);
                                }

                                this.value = this.value.replace(/[^0-9]/g, '');
                            }
                        }
                    });


                    e.sender.input.bind("keypress.apptDuration", function (evt) {
                        if (hasValue(this.value)) {
                            var key = (evt.keyCode) ? evt.keyCode : evt.which;
                            key = parseInt(key, 10);
                            if (key == 8) {
                                this.value = "";
                                return false;
                            }
                            if ((key < 48 || key > 57) && (key < 96 || key > 105)) {
                                if (!jsIsUserFriendlyChar(key, "Numbers")) {
                                    return false;
                                }
                            }
                            else {
                                if (hasValue(this.value) && /[a-zA-z]/.test(this.value)) {
                                    this.value = String.fromCharCode(evt.keyCode);
                                }

                                this.value = this.value.replace(/[^0-9]/g, '');
                            }
                        }
                    });
                    e.sender.input.bind("input.apptDuration", function (evt) {
                        if (hasValue(this.value)) {
                            var key = (evt.keyCode) ? evt.keyCode : evt.which;
                            key = parseInt(key, 10);
                            if (key == 8) {
                                this.value = "";
                                return false;
                            }
                            if ((key < 48 || key > 57) && (key < 96 || key > 105)) {
                                if (!jsIsUserFriendlyChar(key, "Numbers")) {
                                    return false;
                                }
                            }
                            else {
                                if (hasValue(this.value) && /[a-zA-z]/.test(this.value)) {
                                    this.value = String.fromCharCode(evt.keyCode);
                                }

                                this.value = this.value.replace(/[^0-9]/g, '');
                            }
                        }
                    });
                }
            }
        };



        // Function to check for user friendly keys  
        //------------------------------------------
        function jsIsUserFriendlyChar(val, step) {
            // Backspace, Tab, Enter, Insert, and Delete  
            if (val == 8 || val == 9 || val == 13 || val == 45 || val == 46) {
                return true;
            }
            // Ctrl, Alt, CapsLock, Home, End, and Arrows  
            if ((val > 16 && val < 21) || (val > 34 && val < 41)) {
                return true;
            }
            if (step == "Decimals") {
                if (val == 190 || val == 110) {  //Check dot key code should be allowed
                    return true;
                }
            }
            // The rest  
            return false;
        }

  





        //################### THIS METHOD USED TO GET PRIMARY INSURANCE POLICY DETAILS FOR THE PATIENT BLOCK START ######################### 
        //*******PURPOSE: THIS METHOD USED TO GET THE LATEST PRIMARY INSURANCE POLICY DETAILS FOR THE PATIENT.
        //*******CREATED BY: SRINIVAS M 
        //*******CREATED DATE: 04/15/2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 
        //*******MODIFIED DEVELOPER: 06/28/2017 - RUPA.CH - Populating the Primary Insurance based on Billing Setting; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 
        $scope.existingPatientApptgetPatientLatestPrimaryInsurancePolicyDetails = function () {

            //CHECKING WHETHER THE PATIENT ID IS EXISTS OR NOT
            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) return false;

            ///////////////////// GETTING BILL TO SETTINGS - STARTS ///////////////////
            // Calling Billing Settings and if AutoPopulateHealthPolicyInBillTo is true, then Populate the Primary Health Plan
            billingSettingsFieldValueListSharedService.billingCustomizationServiceGetBillingSettingFieldValuesList({ MultipleSettingInfoIDs: '57' }).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                var isPrimaryInsuranceCalled = false;
                if (hasValue(serviceResponse) && hasValue(serviceResponse.BillingSettingValuesList) && serviceResponse.BillingSettingValuesList.length > 0 && hasValue(serviceResponse.BillingSettingValuesList[0])
                    && hasValue(serviceResponse.BillingSettingValuesList[0].BillingSettingValue)) {

                    //if (serviceResponse.BillingSettingValuesList[0].BillingSettingValue == 1) {
                    //    $scope.autoPopulateInsDetails();
                    //}
                    var BilltoOptions = [];
                    //commented by shabbar taj on 08182020 after verification done in 999
                    //Added by shabbar taj on 08122020 for knowing whether to call bill to patient function based on practice id
                    //var IsBillToPatientCallNeed;
                    //if (HidePatientHyperLinkForPracticeID == 511 || HidePatientHyperLinkForPracticeID == 999) {
                    //	IsBillToPatientCallNeed = false;
                    //}
                    //else {
                    //	IsBillToPatientCallNeed = true;
                    //}
                    BilltoOptions = serviceResponse.BillingSettingValuesList[0].BillingSettingValue.split(",");
                    if (hasValue(BilltoOptions) && hasValue(BilltoOptions.length) && BilltoOptions.length > 0) {
                        for (var item = 0; item < BilltoOptions.length; item++) {
                            if (BilltoOptions[item] == GiveAppointmentConstantsService.ExitingPatientAppointmentBillToValue.INSURANCEGRANT) {
                                $scope.autoPopulateInsDetails(serviceResponse.BillingSettingValuesList[0].BillingSettingValue);
                                isPrimaryInsuranceCalled = true;
                                break;
                                //} else if (BilltoOptions[item] == ExitingPatientAppointmentBillToValue.SLIDINGFEE) {
                                //    $scope.existingPatientAppointmentBillToSlidingFeeClick(); //ACCORDING TO KUMARA SIR REQUEST THERE IS WRONG FLOW / DIRECTION TO PLACE SLIDING FEE OPTION IN ADD APPT WINDOW. COMMENTED ON 24TH APRIL 2018.
                                //    break;
                                //condition modifed by shabbar taj on 08122020 for not using cash patient functionality in 511 practice
                                //condition modifed by Dhanush.B on 07/27/2021 for not using cash patient functionality in 416 practice
                            } else if (BilltoOptions[item] == GiveAppointmentConstantsService.ExitingPatientAppointmentBillToValue.CASHPATIENT && !([511, 9999, 467, 416, 258].includes(EMRPracticeModel.PracticeID))) {
                                $scope.existingPatientAppointmentBillToPatientClick()
                                break;
                            } else if (BilltoOptions[item] == GiveAppointmentConstantsService.ExitingPatientAppointmentBillToValue.DONOTBILLTO) {
                                if ($scope.existingPatientAppointmentBillToDoNotBillShowHide == true) { //BASED ON SETTINGS TO SHOW THE BELOW METHOD TO OVER COME THE AUTO LOAD ISSUE BASE ON SETTINGS
                                    $scope.existingPatientAppointmentDoNotBillClick();
                                    break;
                                }
                            }
                        }
                    }// else {
                    //    $scope.autoPopulateInsDetails();
                    //}
                }
                //else {
                //    $scope.autoPopulateInsDetails();
                //}

                if (!isPrimaryInsuranceCalled && $scope.showIsCashPatientAndPrimaryInsurance) {
                    getPatientLinkedPrimaryInusranceDetailsForPopulation();
                }

            });
            /////////////////////GETTING BILL TO SETTINGS - ENDS///////////////////



        }
        //################### THIS METHOD USED TO GET PRIMARY INSURANCE POLICY DETAILS FOR THE PATIENT BLOCK END ######################### 


        $scope.autoPopulateInsDetails = function (BillingsettingValues) {
            //var DatatoPopup = {};
            var postData = {
                PatientId: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                DOS: $scope.AppointmentDateInAddMode
            }

            var methodName = (showPrimarySecondaryandTeritiaryPoliciesInfoBasedonPractice || $scope.hideBilltoField) ? "Insurance_GetPatientPoliciesInfo" : "PatientPoliciesInfoServiceGetPatientPrimaryPoliciesInfoList";
            //CALLING THE SERVICE TO GET THE INSURANCE POLICY DETAILS FOR THE PATIENT
            //CreateCharges.billingGetPatientBillToInfo(postData).then(function (serviceResponse) {
            GiveNewAppointmentService[methodName](postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                // modeifed by chaitanya seemala on may3rd, 2019  

                // if there are more than 1 primary health plan then we will show all those in auto populate window
                if (hasValue(serviceResponse) && serviceResponse.length > 1) {
                    if (showPrimarySecondaryandTeritiaryPoliciesInfoBasedonPractice || $scope.hideBilltoField) {
                        var primaryInsuranceList = _.filter(serviceResponse, ['InsuranceResponsibility', 'Primary']);
                        if ($scope.showIsCashPatientAndPrimaryInsurance && primaryInsuranceList.length > 0) {
                            $scope.existingPatientAppointmentPrimaryInsurance = _.join(_.map(primaryInsuranceList, "InsuranceName"), ", ");
                        }
                        if (primaryInsuranceList && primaryInsuranceList.length == 1) {
                            bindInsuranceDetailsinBilltoField(primaryInsuranceList[0]);
                        }
                        else {
                            if ($scope.hideBilltoField) {
                                return bindInsuranceDetailsinBilltoField(serviceResponse[0]);
                            }
                            $scope.existingPatientAppointmentBillToClickEvent(serviceResponse);
                        }
                        return;
                    } else {
                        if ($scope.showIsCashPatientAndPrimaryInsurance && serviceResponse.length > 0) {
                            $scope.existingPatientAppointmentPrimaryInsurance = _.join(_.map(serviceResponse, "HealthPlanName"), ", ");
                        }
                    }
                    postData.ListtoBind = serviceResponse;
                    ModalPopupService.OpenPopup(GetEMRPageURLByIndex(3818), postData, 'lg').then(function (result) {
                        $("#spanExistingPatientAppointmentBillTo").focus();
                        if (result == "cancel") return false;
                        if (hasValue(result)) {
                            // binding health plan
                            $scope.existingPatientAppointmentBillToInsuranceNames = result.HealthPlanName;
                            if (hasValue(result) && hasValue(result.PolicyEndDate)) { // appending policy expiry date to insurance name  -- added by AHMED BASHA SHAIK 
                                $scope.existingPatientAppointmentBillToInsuranceNames = $scope.existingPatientAppointmentBillToInsuranceNames + " (Exp Date: " + result.PolicyEndDate + ")";
                            }
                            // copay flag for hide show
                            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = showCopayLinkedtoAppt;
                            // pateint insurence id  for scope level
                            $scope.existingPatientAppointmentBillToInsuranceID = result.PatientInsuranceID;


                            //MAINTAIN THE INSU RANCE ID AS SCOPE LEVEL VARIABLE TO PASS THE UPDATING SP
                            if (hasValue(result) && hasValue(result.InsuranceID)) {
                                $scope.existingPatientAppointmentHealthPlanID = result.InsuranceID;
                            }
                            else {
                                $scope.existingPatientAppointmentHealthPlanID = 0;
                            }

                            // grant id for scope level
                            $scope.existingPatientAppointmentGrantID = result.GrantID;
                            if ($scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide || hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue)
                                // chekcing and auto poluplate copy if existed
                                $scope.existingPatientAppointmentCheckCopayCount($scope.existingPatientAppointmentBillToInsuranceID);

                            //Button Active When Data Auto Populated
                            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
                            ///WHEN LOADING THE PRIMARY INSURANCE THEN APPT  BILL TO TYPE IS 1 FOR THE INSURANCE IS SAVED
                            $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;
                            $scope.NewAppointmentSchedulerModel.InsuranceComments = result.Comments;//To get the insurance comments form the policy comments
                            //if patient has primary insurance then this flag is false
                            $scope.NewAppointmentSchedulerModel.BillingNotRequired = false;

                            if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                                exisitingPatientApptReferralAuthorizationPopulateUsedField();

                        }

                    })
                }
                // checking if there is only one records or not, if there is only one primary policy, we will directly bind to the feild
                else if (hasValue(serviceResponse[0]) && hasValue(serviceResponse[0].PatientInsuranceID) && serviceResponse[0].PatientInsuranceID > 0) {
                    if ($scope.showIsCashPatientAndPrimaryInsurance) $scope.existingPatientAppointmentPrimaryInsurance = serviceResponse[0].HealthPlanName;
                    bindInsuranceDetailsinBilltoField(serviceResponse[0]);
                } else if ($scope.hideBilltoField) {
                    $scope.existingPatientAppointmentBillToPatientClick();
                }
                // checking withh billing setting values
                else if (hasValue(BillingsettingValues)) {
                    var BilltoOptions = [];
                    BilltoOptions = BillingsettingValues.split(",");
                    if (hasValue(BilltoOptions) && hasValue(BilltoOptions.length) && BilltoOptions.length > 0) {
                        for (var item = 0; item < BilltoOptions.length; item++) {
                            //if (BilltoOptions[item] == ExitingPatientAppointmentBillToValue.SLIDINGFEE) {// uncommented by pavan as per requirement given by naveena garu qa on 07/10/2018 and checked by her
                            //    $scope.existingPatientAppointmentBillToSlidingFeeClick(); //ACCORDING TO KUMARA SIR REQUEST THERE IS WRONG FLOW / DIRECTION TO PLACE SLIDING FEE OPTION IN ADD APPT WINDOW. COMMENTED ON 24TH APRIL 2018.
                            //    break;
                            //} else 
                            if (BilltoOptions[item] == GiveAppointmentConstantsService.ExitingPatientAppointmentBillToValue.CASHPATIENT) {
                                $scope.existingPatientAppointmentBillToPatientClick()
                                break;
                            } else if (BilltoOptions[item] == GiveAppointmentConstantsService.ExitingPatientAppointmentBillToValue.DONOTBILLTO) {
                                if ($scope.existingPatientAppointmentBillToDoNotBillShowHide == true) { //BASED ON SETTINGS TO SHOW THE BELOW METHOD TO OVER COME THE AUTO LOAD ISSUE BASE ON SETTINGS
                                    $scope.existingPatientAppointmentDoNotBillClick();
                                    break;
                                }
                            }

                        }
                    }
                }
            });
        }



        //################### THIS METHOD USED TO GET RESOURCE TYPE IS DEPENDENT OR INDEPENDENT START######################### 
        //*******PURPOSE: THIS METHOD USED TO GET RESOURCE TYPE IS DEPENDENT OR INDEPENDENT 
        //*******CREATED BY: Hemanth 
        //*******CREATED DATE: 09/04/2015 
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 
        $scope.ExistingPatientAppt_GetResourceType = function () {
            $scope.ClearSelectResourceProviderDetails();
            var postdata = {
                PhysicianID: SelectedPhysicianID,
            }
            //Service call
            GiveNewAppointmentService.appointmentSchedulerGet_Resourcetype_Dependent(postdata, callCenterSelectedPracticeModel).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                //Show the Select Resource Provider field based on the service Response 
                if (hasValue(serviceResponse)) {
                    $scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";

                    if (hasValue(serviceResponse.isDoctorDependent) && serviceResponse.isDoctorDependent == true) {
                        $scope.addNewApptSelectResourceProvider = true;
                        $scope.existingPatientApptResourceRoomProviderLabelName = `Select ${serviceResponse.ResourceOrRoomType == 1 ? 'Resource' : 'Room'} Provider`;
                        $timeout(function () {
                            $scope.addNewApptSelectResourceProviderWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                            //$scope.apply();

                        }, 100);
                        $scope.existingpatientappointmentButtonsWidthClass = "col-md-6 colReq-sm-12";

                        //$scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
                        //$scope.existingApptsSelectTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";

                        $scope.selectResourceProviderMandatoryCheck = "form-control mandatoryCheck";
                    }
                    else {
                        $scope.addNewApptSelectResourceProvider = false;
                        $scope.existingpatientappointmentButtonsWidthClass = "col-md-6 colReq-sm-12";

                        $scope.selectResourceProviderMandatoryCheck = "form-control";

                    }
                }

            });
        }
        //################### THIS METHOD USED TO GET RESOURCE TYPE IS DEPENDENT OR INDEPENDENT END ######################### 



        //################### THIS METHOD USED TO GET RESOURCE TYPE IS DEPENDENT OR INDEPENDENT END######################### 

        //################### METHOD TO GET PATIENT ALERTS BASED ON SHOW WHEN TYPE - BLOCK START #########################
        //*******PURPOSE: This method used to get patient appt alerts
        //*******CREATED BY:  Afroz
        //*******CREATED DATE: 07/16/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentLoadPatientAlerts = function () {

            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || ExistingPatientSelectedData.SelectedPatient.length <= 0 || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) {
                return false;
            }

            $scope.existingPatApptPostData = {};
            $scope.existingPatApptPostData.PatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;
            $scope.existingPatApptPostData.AlertShowWhenType = alertShowWhenType.APPOINTMENTGIVEN;

            //getting alerts based on show hwen type
            GiveNewAppointmentService.AddEditAlertGetAllDueAlertsBasedOnShowWhenType($scope.existingPatApptPostData, callCenterSelectedPracticeModel).then(function (serviceResponse) {

                if (isError(serviceResponse)) return false;

                if (hasValue(serviceResponse)) {
                    if (hasValue(serviceResponse.Alert_Message)) {
                        $scope.existingPatientAppointmentAlertMessage = "Alerts Info : " + serviceResponse.Alert_Message;
                        $scope.existingpatientappointmentShowalertmessage = true;
                    }
                }

            });
        }
        //################### METHOD TO GET PATIENT ALERTS BASED ON SHOW WHEN TYPE - BLOCK ENDS #########################

        //#################### METHOD TO GET ALRTS TO SHOW THEM IN POPUP BLOCK START ######################
        //*******PURPOSE: THIS METHOD TO GET ALRTS TO SHOW THEM IN POPUP 
        //*******CREATED BY: ABDUL RAHIMAN M
        //*******CREATED DATE: 8/3/2018
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ######################
        $scope.exisitingPateintApptLoadPatientAlertsInPopup = function () {

            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || ExistingPatientSelectedData.SelectedPatient.length <= 0 || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) {
                return false;
            }

            var postData = {
                PatientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                AlertShowWhenType: alertShowWhenType.APPTGIVENASPOPUP
            };

            GiveNewAppointmentService.AddEditAlertGetAllDueAlerts(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;

                if (hasValue(serviceResponse) && serviceResponse.length > 0) {
                    var homeInputsForReminder = {
                        AlertShowWhenType: alertShowWhenType.APPTGIVENASPOPUP
                    };
                    homeInputsForReminder.RemindersTobeAutoPopulate = serviceResponse;
                    homeInputsForReminder.PatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;
                    homeInputsForReminder.PatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;

                    ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/49'*/GetEMRPageURLByIndex(549), homeInputsForReminder, 'modal-800px').then(function (result) {

                        if (result == 'cancel') return false;

                    });
                }
            });
        };
        //#################### METHOD TO GET ALRTS TO SHOW THEM IN POPUP BLOCK ENDS ######################

        //###################OPEN LINK TO INSURANCE POPUP BLOCK START #########################
        //*******PURPOSE: This method used to open Link to insurance pop up
        //*******CREATED BY:  Priyanka G
        //*******CREATED DATE: 03/30/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.openLinktoInsurance = function () {
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/39'*/GetEMRPageURLByIndex(39), 'null', 'lg').then(function (result) {
            });
        }
        //###################OPEN LINK TO INSURANCE POPUP BLOCK END #########################



        //######### APPTSCHEDVIEWGETPATIENTDETAILSTOBEAUTOPOPULATED BLOCK START ##############
        //*******PURPOSE: This method to ApptSchedViewGetPatientDetailsToBeAutopopulated
        //*******CREATED BY:Afroz
        //*******CREATED DATE: 03/23/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedViewGetPatientDetailsToBeAutopopulated = function () {
            $scope.ApptSchedViewPostData = {};
            $scope.ApptSchedViewPostData.PatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;

            GiveNewAppointmentService.apptSchedulerGetPatientDetailsToBeAutopopulatedInAppointmentCreationWindow($scope.ApptSchedViewPostData, callCenterSelectedPracticeModel).then(function (result) {

                if (hasValue(result)) {
                    $scope.NewAppointmentSchedulerModel.AppointmentComments = result.AppointmentComments;
                    $scope.DemographicsAppointmentComments = result.AppointmentComments;
                    if ($scope.existingPatientAppointmentSelectApptCmntFrmDemographics) {
                        showorHideDemogrphicsCommentsField();
                    }
                    //THIS LINE COMMENTED BY SRINIVAS ON 15TH APRIL 2016, SAID BY MOSES NO NEED TO SHOW THE APPT COMMENTS GIVEN FROM THE DEMOGRAPHICS IN GENERAL COMMENTS
                    //$scope.NewAppointmentSchedulerModel.GenearalComments = result.AppointmentComments; //TO ASSIGN THE APPT COMMENTS IN GENERAL COMMENTS TEXTBOX.
                    $scope.NewAppointmentSchedulerModel.ReferingProviderID = result.RefMDID;
                    $scope.SelectedExistingPatApptReferralMD = result.RefMDName;
                    $scope.IsPreAuthMandatoryBeforeGivingAppt = result.IsPreAuthMandatoryBeforeGivingAppt;

                    //ADDED BY HEMANTH ON NOVEMBER 2ND 
                    $scope.NewAppointmentSchedulerModel.IsInterpreterRequired = result.InterpreterRequired;
                    $scope.NewAppointmentSchedulerModel.interpreterLanguage = result.Language
                    $scope.NewAppointmentSchedulerModel.interpreter = result.Interpreter
                    $scope.existingPatientsInterpreter = result.InterpreterDescription;
                    $scope.NewAppointmentSchedulerModel.InterpreterDescription = $scope.existingPatientsInterpreter;
                    $scope.NewAppointmentSchedulerModel.PatientCategoryName = result.PatientCategoryName;
                    patientEmail = result.EMail;
                    patientPhoneNumber = result.PhoneNumber;
                    if (hasValue($scope.NewAppointmentSchedulerModel.AppointmentComments) && $scope.NewAppointmentSchedulerModel.AppointmentComments.toString().trim().length > 0) {
                        $scope.divApptsButtonsClass = "col-md-10 colReq-sm-12 col-xs-12";
                        $scope.apptCommentsLabelTitle = $sce.trustAsHtml("<b>Appt. Comments from Demographics</b> <br/><label class='divApptCommentsLabelWidthClass'>" + $scope.NewAppointmentSchedulerModel.AppointmentComments + "</label>");

                        $scope.apptCommentsLabelTitleToolTip = $sce.trustAsHtml("<b>Appt. Comments from Demographics</b> <br/>" + $scope.NewAppointmentSchedulerModel.AppointmentComments);
                    }
                    //$scope.apptCommentsLabelWidthClass = "Appt. Comments from Demographics <br/> " + $scope.NewAppointmentSchedulerModel.AppointmentComments;
                    else
                        $scope.apptCommentsLabelWidthClass = "";


                    //IF THE PATIENT HAVING THE DEFAULT FACILITIES THEN SHOW THE LABEL AND SHOW THE FACILITIES NAMES
                    if (hasValue(result) && hasValue(result.PatientDefaultFacilities)) {
                        if (result.PatientDefaultFacilities.length > 50) {
                            $scope.existingPatientAppointmentPreferedFacility = result.PatientDefaultFacilities.substring(0, 50) + "..";
                            $scope.existingPatientAppointmentPreferedFacilityInDetail = result.PatientDefaultFacilities;
                        }
                        else {
                            $scope.existingPatientAppointmentPreferedFacility = result.PatientDefaultFacilities;
                        }
                        $scope.existingPatientAppointmentPatientFacilitiesShowHide = true;
                    }
                    else {
                        $scope.existingPatientAppointmentPatientFacilitiesShowHide = false;
                    }

                    //ASSIGN THE PATIENT NAME 
                    if (hasValue(result) && hasValue(result.PatientName)) {
                        $scope.existingPatientAppointmentsPatientName = result.PatientName;
                    }
                    else {
                        $scope.existingPatientAppointmentsPatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;
                    }
                    apptDefaultsInfo = result;
                    handleApptDefaultsPopulationCustomizedFromDemographics();

                    if ($scope.showIsCashPatientAndPrimaryInsurance) {
                        isCashPatient = result && result.CashStartDate ? true : false;
                        $scope.existingPatientAppointmentIsCashPatient = isCashPatient ? "Yes" : "No";
                        autoSelectBilltoasPatientIfIsCashPatientisYes();
                    }

                }
                else {
                    $scope.apptCommentsLabelWidthClass = "";
                    $scope.existingPatientAppointmentsPatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;
                }

                kendoEventsTimeout = $timeout(function () {
                    existingApptKendoEvents();
                }, 2000)

            });

        }
        //######### APPTSCHEDVIEWGETPATIENTDETAILSTOBEAUTOPOPULATED BLOCK END ##############



        var ExistingPatientSelectedData = $scope.EMRDataFromPopup;

        // console.log($scope.EMRDataFromPopup);

        //var SelectedDate = ExistingPatientSelectedData.SelectedDate;
        var SelectedPatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;
        if (ExistingPatientSelectedData && ExistingPatientSelectedData.isFromNewFormat3Scheduler && ExistingPatientSelectedData.isRoomCustomized) {
            var SelectedPhysicianID = ExistingPatientSelectedData.SelectedPhysicianID;
            var SelectedResourceType = 2;
        }
        else {
            var SelectedPhysicianID = ExistingPatientSelectedData.SelectedPhysicianID;
            var SelectedResourceType = ExistingPatientSelectedData.SelectedResourceType;
        }

        //HERE CHECKING EXISTING PATIENT SELECT VARIABLE HAS A VALUE OR NOT & CHECKING IT CONTAINS SELECT PATIENT LIST OR NOT
        //AND CHECKING give Appointment From Patient Demographics FLAG VALUE IS EQUAL TO ONE OR NOT
        if (hasValue(ExistingPatientSelectedData) && hasValue(ExistingPatientSelectedData.SelectedPatient) && ExistingPatientSelectedData.SelectedPatient[0].giveAppointmentFromPatientDemographics == 1) {
            //HERE ASSIGNING ASSIGNED PROVIDER ID VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER ID
            //ASSIGNED PROVIDER ID IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
            //BY PASSING THIS ASSIGNED PROVIDER ID WE SAVE THE APPOINT 
            $scope.SelectedAssignedProviderID = ExistingPatientSelectedData.SelectedPatient[0].AssignedProviderID;
            //HERE ASSIGNING ASSIGNED PROVIDER NAME VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER NAME
            //ASSIGNED PROVIDER NAME IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
            //BY PASSING THIS ASSIGNED PROVIDER NAME WE SAVE THE APPOINT
            $scope.SelectedAssignedProviderName = ExistingPatientSelectedData.SelectedPatient[0].AssignedProviderName;
        }
        //HERE CHECKING EXISTING PATIENT SELECT VARIABLE HAS A VALUE OR NOT & CHECKING IT CONTAINS SELECT PATIENT LIST OR NOT
        //AND CHECKING give Appointment From Patient Demographics FLAG VALUE IS EQUAL TO TWO OR NOT
        else if (hasValue(ExistingPatientSelectedData) && hasValue(ExistingPatientSelectedData.SelectedPatient) && ExistingPatientSelectedData.SelectedPatient[0].giveAppointmentFromPatientDemographics == 2) {
            //HERE ASSIGNING ASSIGNED PROVIDER ID VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER ID
            //ASSIGNED PROVIDER ID IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
            //BY PASSING THIS ASSIGNED PROVIDER ID WE SAVE THE APPOINT
            $scope.SelectedAssignedProviderID = ExistingPatientSelectedData.SelectedPatient[0].AssignedProviderID;
            //HERE ASSIGNING ASSIGNED PROVIDER NAME VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER NAME
            //ASSIGNED PROVIDER NAME IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
            //BY PASSING THIS ASSIGNED PROVIDER NAME WE SAVE THE APPOINT
            $scope.SelectedAssignedProviderName = ExistingPatientSelectedData.SelectedPatient[0].AssignedProviderName;
        }
        else {
            //HERE ASSIGNING ASSIGNED PROVIDER ID VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER ID
            //ASSIGNED PROVIDER ID IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
            //BY PASSING THIS ASSIGNED PROVIDER ID WE SAVE THE APPOINT
            $scope.SelectedAssignedProviderID = ExistingPatientSelectedData.AssinedProviderID;
            //HERE ASSIGNING ASSIGNED PROVIDER NAME VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER NAME
            //ASSIGNED PROVIDER NAME IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
            //BY PASSING THIS ASSIGNED PROVIDER NAME WE SAVE THE APPOINT
            $scope.SelectedAssignedProviderName = ExistingPatientSelectedData.AssinedProviderName;
        }

        var SelectedUserAuthenticatedMailCalenderTypes;
        var SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysician;
        var SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysicianEmailID;
        var SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoom;
        var SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoomEmailID;

        if (ExistingPatientSelectedData && ExistingPatientSelectedData.isFromNewFormat3Scheduler && ExistingPatientSelectedData.isRoomCustomized) {
            $scope.existingPatientAppointmentSelectRoom = ExistingPatientSelectedData.SelectedPhysicianorResourceName;
            $scope.existingPatientAppointmentSelectRoomID = ExistingPatientSelectedData.SelectedPhysicianID
        } else {
            //assigning the provider name to the model
            if (getLoggedUserHideOrShowValue(donotAutoPopulateProviderOnInit) && !(EMRPracticeModel.UserType == 0 && donotAutoPopulateProviderWhenStaffLoginOnInit)) {
                $scope.existingPatientAppointmentSelectedProviderorResource = ExistingPatientSelectedData.SelectedPhysicianorResourceName;
            }
        }

        //USED TO MAINTAIN THE CALL CENTER SELECTED PRACTICE MODEL INFORMATION
        //IF THIS VALUE IS NULL THEN GO WITH EXISTING EMRPRACTICEMODEL OTHERWISE USE CALLCENTERSELETEDPRACTICEMODEL
        var callCenterSelectedPracticeModel = ExistingPatientSelectedData.callCenterSelectedPracticeModel;

        //var IsExistingPatientEmergencyAppointment = ExistingPatientSelectedData.apptSchedulerExistingPatientIsEmergencyAppointment;   //TO HOLD IF IT IS EMERGENCY APPOINTMENT
        var SelectedResourceID = ExistingPatientSelectedData.SelectedResourceID;
        //################### ADD APPOINTMENT TO EXISTING PATIENT MODEL STRUCTURE BLOCK START #########################
        //*******PURPOSE: This method is USED TO RETURN THE NewAppointmentSchedulerModel 
        //*******CREATED BY:  LAKSHMI B
        //*******CREATED DATE: 07/16/2014
        //////$scope.LoadNewAppointmentSchedulerModel = function () {
        //////    $scope.NewAppointmentSchedulerModel = {};
        //////}
        //################### ADD APPOINTMENT TO EXISTING PATIENT MODEL STRUCTURE BLOCK START #########################




        //################### GETS FACILITIES LIST SET TO SHOW IN APPOINTMENT SCHEDULER BLOCK START #########################
        //*******PURPOSE: This method is used to Get the facilities list that are marked as, to be shown in appointment scheduler.
        //*******CREATED BY:  LAKSHMI B
        //*******CREATED DATE: 07/11/2014
        $scope.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList = function (ResourcePhysicainID, ResourceType, isFromProviderChange, isFromPageLoad) {

            if (needToUserootscopeCacheForSelectivePractices && SelectedPhysicianID && SelectedResourceType) {
                var practiceIDWithProvideridandResourceType = `${EMRPracticeModel.PracticeID}~${SelectedPhysicianID}~${SelectedResourceType}`;
                if ($rootScope.OneToOneApptWindowFacilitesList != undefined
                    && practiceIDWithProvideridandResourceType
                    && $rootScope.OneToOneApptWindowFacilitesList[practiceIDWithProvideridandResourceType] != undefined) {
                    $scope.ApptSchedView_FacilitiesList = angular.copy($rootScope.OneToOneApptWindowFacilitesList[practiceIDWithProvideridandResourceType]);
                    assignFacilitiesList(isFromProviderChange, isFromPageLoad);
                    return;
                }
            }

            var postData = {};
            //ADDED BY PAVAN KUMAR KANDULA ON 19-12-2K17 FOR GETTING THE RESOURCE LINKED FACILITY  START ////////
            //here while changing the provider for the appointment then we will get the facilities linked to that provider
            //but here if the resource type is 2 then only sending the provider id 
            //if that provider details is not sent then we will not get the facility linked to that provider
            //so due to this here resource type is sending as input
            if (hasValue(ResourcePhysicainID) && hasValue(ResourceType)) {
                var ProviderDetails = [];
                ProviderDetails.push({
                    ProviderID: ResourcePhysicainID,
                    ResourceType: ResourceType,
                })
                postData.ApptSchedulerProviderResourceModelList = ProviderDetails;

            }
            //ADDED BY PAVAN KUMAR KANDULA ON 19-12-2K17 FOR GETTING THE RESOURCE LINKED FACILITY  END ////////
            GiveNewAppointmentService.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList(null, callCenterSelectedPracticeModel, postData).then(function (result) {
                if (needToUserootscopeCacheForSelectivePractices && SelectedPhysicianID && SelectedResourceType && practiceIDWithProvideridandResourceType) {
                    if (!$rootScope.OneToOneApptWindowFacilitesList) {
                        $rootScope.OneToOneApptWindowFacilitesList = {};
                    }
                    $rootScope.OneToOneApptWindowFacilitesList[practiceIDWithProvideridandResourceType] = angular.copy(result) || [];
                }
                $scope.ApptSchedView_FacilitiesList = result;
                assignFacilitiesList(isFromProviderChange, isFromPageLoad);
            });
        };
        //################### GETS FACILITIES LIST SET TO SHOW IN APPOINTMENT SCHEDULER BLOCK END #########################

        function assignFacilitiesList(isFromProviderChange, isFromPageLoad) {
            $scope.autoPopulateFacilityinGiveApptWindow = "";
            $scope.ApptSchedView_FacilitiesList.unshift({ FacilityDisplayName: ' - Select Facility - ', FacilityID: 0 });

            for (var index = 0; index < $scope.ApptSchedView_FacilitiesList.length; index++) {
                if ($scope.ApptSchedView_FacilitiesList[index].AutoPopulateDefaultFacilityIDInAppt == true) {
                    $scope.autoPopulateFacilityinGiveApptWindow = $scope.ApptSchedView_FacilitiesList[index].FacilityID;
                }
            }     
            
            if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "StaffActivitiesNotesSavingWindow") {
                $scope.autoPopulateFacilityinGiveApptWindow = $scope.EMRDataFromPopup.SelectedFacilityID
            } 

            $scope.ApptSchedView_GetMinimumInterval(null, isFromProviderChange, isFromPageLoad);

        };
        //################### GETS FACILITIES LIST SET TO SHOW IN APPOINTMENT SCHEDULER BLOCK END #########################


        //######### GETS APPOINTMENTS VISIT TYPE BLOCK START ##############
        //*******PURPOSE: This method gets the appointments visit type
        //*******CREATED BY:LAKSHMI B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_GetApptsVisitType = function () {
            if (needToUserootscopeCacheForSelectivePractices && SelectedPhysicianID && SelectedResourceType) {
                var practiceIDWithProvideridandResourceType = `${EMRPracticeModel.PracticeID}~${SelectedPhysicianID}~${SelectedResourceType}`;
                if ($rootScope.OneToOneApptWindowVistTypeList != undefined
                    && practiceIDWithProvideridandResourceType
                    && $rootScope.OneToOneApptWindowVistTypeList[practiceIDWithProvideridandResourceType] != undefined) {
                    assignVisitTypeListToDropdown(angular.copy($rootScope.OneToOneApptWindowVistTypeList[practiceIDWithProvideridandResourceType]));
                    return;
                }
            }

            var ApptSchedViewPostData = {};
            ApptSchedViewPostData.VisitType = '';
            ApptSchedViewPostData.SelectedPhysicianID = SelectedPhysicianID;
            ApptSchedViewPostData.ResourceType = SelectedResourceType;

            GiveNewAppointmentService.ApptSchedView_GetApptsVisitType(ApptSchedViewPostData, callCenterSelectedPracticeModel).then(function (result) {
                if (isError(result)) return false;

                if (needToUserootscopeCacheForSelectivePractices && SelectedPhysicianID && SelectedResourceType && practiceIDWithProvideridandResourceType) {
                    if (!$rootScope.OneToOneApptWindowVistTypeList) {
                        $rootScope.OneToOneApptWindowVistTypeList = {};
                    }
                    $rootScope.OneToOneApptWindowVistTypeList[practiceIDWithProvideridandResourceType] = angular.copy(result) || [];
                }

                assignVisitTypeListToDropdown(result);
            });

        }
        //######### GETS APPOINTMENTS VISIT TYPE BLOCK END ##############

        function assignVisitTypeListToDropdown(result) {

            result.unshift({ VisitType: ' - Select Visit Type - ', VisitTypeID: "0" });

            if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "NewClientNewApptRequestFromPortal"
                && $scope.ApptSchedView_GetApptsVisitTypeListDataSoource.data().length <= 0) {
                loadDurationWhenOpenedFronPortalAppts = false;
            } else {
                loadDurationWhenOpenedFronPortalAppts = true;
            }

            $scope.ApptSchedView_GetApptsVisitTypeList = result;

            $scope.ApptSchedView_GetApptsVisitTypeListDataSoource.data($scope.ApptSchedView_GetApptsVisitTypeList);
            $scope.PatientApptVisitTypeDurationExists = false;

            //CONDTION ADDED BY HEMANTH ON SEPT 17 2K18 
            if (!hasValue($scope.SelectedExistingPatApptVisitType) || $scope.SelectedExistingPatApptVisitType == 0)
                $scope.SelectedExistingPatApptVisitType = 0; ////upgrade to angular 1.7.2
        
        }
        //######### GETS APPOINTMENTS VISIT TYPE BLOCK END ##############


        $scope.ApptSchedView_GetApptsVisitTypeListDataSoource = new kendo.data.DataSource({
            data: []
        });

        //$scope.ddlSelectVisitTypeOptions = {};
        $scope.ddlSelectVisitTypeOptions = {
            //dataSource: $scope.ApptSchedView_GetApptsVisitTypeListDataSoource,////upgrade to angular 1.7.2
            //upgrade to angular 1.7.2
            template: '<span style="background-color:{{dataItem.ApptVisitTypeBackColor}};color: {{dataItem.ApptVisitTypeForeColor}}" >{{dataItem.VisitType}}</span>',// kendo.template($("#ApptVisitTypeDropDownListvalueTemplate").html()),
            //valueTemplate: '<div style="background-color:{{dataItem.ApptVisitTypeBackColor}};color: {{dataItem.ApptVisitTypeForeColor}}" >{{dataItem.VisitType}}</div>',// kendo.template($("#ApptVisitTypeDropDownListvalueTemplate").html()),
            dataBound: function (e) {

                if (!$("#ddlSelectVisitType-list").hasClass("VisitTypeDisplayWidth"))
                    $("#ddlSelectVisitType-list").addClass("VisitTypeDisplayWidth");

                $scope.existingPatientAppointmentWidgets.ddlSelectVisitType = e.sender;
                $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow = false;
                $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapy = "";
                $scope.NewAppointmentSchedulerModel.PatientContactIDs = undefined;
                $scope.ExistingPatientFamilyMembersAttendingTherapy = "";

                var selectedVisitType;
                let isSchedulerGenerationDurationAssignedinVisitTypeDataBound = false;

                if (hasValue(e.sender) && hasValue(e.sender.dataSource) && hasValue(e.sender.dataSource.data()) && e.sender.dataSource.data().length > 0) {
                    var VisitTypeList = e.sender.dataSource.data();



                    //WHEN ADD APPOINTMENT WINDOW OPEN FROM WAITLIST 
                    if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.WaitingListID)) {
                        $scope.SelectedExistingPatApptVisitType = $scope.EMRDataFromPopup.VisitTypeID;
                        $scope.SelectedExistingPatApptDuration = $scope.EMRDataFromPopup.Duration;
                        $scope.SelectedExistingPatApptFacilities = $scope.EMRDataFromPopup.FacilityID;
                    }
                    else {

                        for (var index = 0; index < VisitTypeList.length; index++) {
                            if (VisitTypeList[index].IsDefaultVisitType == true) {
                                e.sender.select(index);
                                $scope.SelectedExistingPatApptVisitType = VisitTypeList[index].VisitTypeID;
                                $scope.ddlselectedVisitTypeItemVisitTypeName = VisitTypeList[index].VisitType;

                                if (isNeedToCheckVisitTypeChangeForShowingIsFirstMedicalVideoReviewed && $scope.SelectedExistingPatApptVisitType == 395) { //395 - New client psychiatric assessment-OP
                                    $scope.showIFirstMedicalVideoReviewedDropDown = true;
                                } else {
                                    $scope.showIFirstMedicalVideoReviewedDropDown = false;
                                }
                                selectedVisitType = VisitTypeList[index];

                                //IF THE SELECTED VISIT TYPE IS HAVING THE FAMILY IN NAME THEN SHOW THE ATTENDING FAMILY MEMBERS IN THERAPY OPTION IS ENABLED
                                // if (hasValue($scope.ddlselectedVisitTypeItemVisitTypeName) && $scope.ddlselectedVisitTypeItemVisitTypeName.toLowerCase().indexOf("family") >= 0) {
                                //ABOVE LINE IS COMMNETED BY HEMANTH ON 7TH NOVEMBER 206
                                //SHOW THE FAMILY THERAPY BASED ON THE USED FOR TYPE FORM THE VISIT TYPE ADDING    //1- FOR FAMILY THERAPY 2-- HOUSE CALL
                                if (hasValue(VisitTypeList[index]) && hasValue(VisitTypeList[index].ApptVisitTypeUsedFor) && VisitTypeList[index].ApptVisitTypeUsedFor == "1") {
                                    $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow = true;
                                    $timeout(function () {
                                        $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                                        //$scope.apply();

                                    }, 100);
                                }
                                else {
                                    $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow = false;
                                    $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapy = "";
                                    $scope.NewAppointmentSchedulerModel.PatientContactIDs = undefined;
                                    $scope.ExistingPatientFamilyMembersAttendingTherapy = "";
                                }
                                if (loadDurationWhenOpenedFronPortalAppts) {
                                    if (VisitTypeList[index].Duration > 0) {
                                        $scope.PatientApptVisitTypeDurationExists = true;
                                        //MAINTAIN THE SELECTED VISIT TYPE DURATION FOR THE VARIABLE TO STATE MAINTAIN THE DURATION IF THE PROVIDER CHANGE
                                        $scope.PatientApptVisitTypeDurationInfo = VisitTypeList[index].Duration;
                                        assignAppointmentDuration(VisitTypeList[index].Duration);
                                        //break;//upgrade to angular 1.7.2
                                    }
                                    else {
                                        if (hasValue($scope.ApptSchedView_GetMinimumIntervalList) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0]) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration)) {
                                            assignAppointmentDuration($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration);
                                        }
                                    }
                                }
                                break;//upgrade to angular 1.7.2
                            }
                            else {

                                //upgrade to angular 1.7.2
                                if (!hasValue($scope.SelectedExistingPatApptVisitType))
                                    $scope.SelectedExistingPatApptVisitType = 0;


                                //$timeout(function () {
                                if (hasValue($scope.PatientApptVisitTypeDurationExists) && $scope.PatientApptVisitTypeDurationExists == true) {
                                    return;
                                }
                                if (hasValue($scope.ApptSchedView_GetMinimumIntervalList) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0]) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration)
                                    && loadDurationWhenOpenedFronPortalAppts && !isSchedulerGenerationDurationAssignedinVisitTypeDataBound) {
                                    isSchedulerGenerationDurationAssignedinVisitTypeDataBound = true;
                                    assignAppointmentDuration($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration);
                                }
                                //}, 100);
                            }
                            if (index == VisitTypeList.length - 1) {
                                $scope.PatientApptVisitTypeDurationExists = false;
                            }
                        }
                        if (hasValue($scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration))
                            $scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration.value($scope.SelectedExistingPatApptDuration);

                    }



                    var patientHomeFacilityExists = false;
                    // if (hasValue($scope.ddlselectedVisitTypeItemVisitTypeName) && $scope.ddlselectedVisitTypeItemVisitTypeName.toLowerCase().indexOf("house call") >= 0) {
                    //ABOVE LINE IS COMMNETED BY HEMANTH ON 7TH NOVEMBER 206
                    //SHOW THE PATIENT HOME FACILITY AS SELECTED   //1- FOR FAMILY THERAPY 2-- HOUSE CALL
                    if (hasValue(selectedVisitType) && hasValue(selectedVisitType.ApptVisitTypeUsedFor) && selectedVisitType.ApptVisitTypeUsedFor == "2") {
                        if (hasValue($scope.ApptSchedView_FacilitiesList) && $scope.ApptSchedView_FacilitiesList.length > 0) {
                            for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                                if (hasValue($scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode) && $scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode == "12" &&
                                    hasValue($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityDisplayName) && $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityDisplayName.toLowerCase().indexOf("patient home") >= 0) {
                                    if (!loadDurationWhenOpenedFronPortalAppts) {
                                        $scope.SelectedExistingPatApptFacilities = $scope.EMRDataFromPopup.SelectedFacilityID;
                                        $scope.SelectedExistingPatApptDuration = $scope.EMRDataFromPopup.SelectedAppointmentDuration;
                                    } else {
                                        $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                                        patientHomeFacilityExists = true;
                                    }
                                    break;
                                }
                            }
                            if (patientHomeFacilityExists == false) {
                                for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                                    if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode == "12") {
                                        if (!loadDurationWhenOpenedFronPortalAppts) {
                                            $scope.SelectedExistingPatApptFacilities = $scope.EMRDataFromPopup.SelectedFacilityID;
                                            $scope.SelectedExistingPatApptDuration = $scope.EMRDataFromPopup.SelectedAppointmentDuration;
                                        } else {
                                            $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (!isDefaultDurationFromVisitTypeDataBoundPopulated)
                        populateDefaultDurationFromDemographicsApptInfo();
                    isDefaultDurationFromVisitTypeDataBoundPopulated = true;



                }
            },
        };

        //############### GET THE NEAREST DROPDOWN BLOCK START ############################### 
        //PURPOSE: THIS METHOD IS USED TO GET THE NEREST DURATION IN DURATION DROPDOWN.
        //CREATED BY: GANESH V
        //CREATED ON: 29/02/2016 
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ************************* 
        //getnearest duration
        $scope.SelectedExistingPatApptgetNearestDefaultDuration = function (VisitTyprRlatedDuration) {
            var durationDifflist = [];
            var durationModel = {};
            if (hasValue(VisitTyprRlatedDuration) && VisitTyprRlatedDuration > 0) {
                if (hasValue($scope.ApptSchedView_GetMinimumIntervalList) && $scope.ApptSchedView_GetMinimumIntervalList.length > 0) {
                    for (var index = 0; index < $scope.ApptSchedView_GetMinimumIntervalList.length; index++) {
                        durationModel = {
                            DurationDiff: Math.abs(VisitTyprRlatedDuration - $scope.ApptSchedView_GetMinimumIntervalList[index].AppointmentDuration),
                            ActualAppointmentDuration: $scope.ApptSchedView_GetMinimumIntervalList[index].AppointmentDuration,

                        };
                        durationDifflist.push(durationModel);
                    }
                }

                if (hasValue(durationDifflist) && durationDifflist.length > 0 && hasValue(durationDifflist[0].DurationDiff)) {
                    var minDuration = durationDifflist[0].DurationDiff;
                    var nearestDuration;
                    var Count = 0;
                    if (hasValue(durationDifflist) && durationDifflist.length > 0) {
                        for (var durationDiffIndex = 1; durationDiffIndex < durationDifflist.length; durationDiffIndex++) {
                            if (durationDifflist[durationDiffIndex].DurationDiff < minDuration) {
                                minDuration = durationDifflist[durationDiffIndex].DurationDiff;
                                nearestDuration = durationDifflist[durationDiffIndex].ActualAppointmentDuration;
                                Count += 1;
                            }
                        }
                    }
                }

                if (Count == 0) {
                    if (hasValue(durationDifflist) && durationDifflist.length > 0 && hasValue(durationDifflist[0].ActualAppointmentDuration)) {
                        $scope.SelectedExistingPatApptDuration = durationDifflist[0].ActualAppointmentDuration;
                    }
                }
                else {
                    $scope.SelectedExistingPatApptDuration = nearestDuration;
                }
            }
            //else {
            //    if (hasValue($scope.ApptSchedView_GetMinimumIntervalList) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0]) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration)) {
            //        $scope.SelectedExistingPatApptDuration = $scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration;
            //    }
            //}
        };
        //############### GET THE NEAREST DROPDOWN BLOCK END ############################### 


        //################### GETS ENCOUNTER TYPE C32 LIST BLOCK START #########################
        //*******PURPOSE: This method gets the appointments encounter type c32 list
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_GetEncounterTypeC32List = function () {

            GiveNewAppointmentService.ApptSchedView_GetEncounterTypeC32List().then(function (serviceResponse, callCenterSelectedPracticeModel) {

                if (isError(serviceResponse)) return false;

                $scope.ApptSchedView_GetEncounterTypeC32ListData = serviceResponse;
                $scope.ApptSchedView_GetEncounterTypeC32ListData.unshift({ EncounterTypeName: ' - Select Encounter Type - ', EncounterTypeId: 0 });

                //upgrade to angular 1.7.2
                $scope.SelectedExistingPatApptEncounterType = 0;
            })

        }
        //######### GETS ENCOUNTER TYPE C32 LIST BLOCK END ##############





        //################### GET LIST OF DEFAULT FACILITIES  BLOCK START #########################
        //*******PURPOSE: This method gets the list of default FACILITIES
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_GetDefaultFacilities = function () {

            GiveNewAppointmentService.ApptSchedView_GetDefaultFacilities(callCenterSelectedPracticeModel).then(function (serviceResponse) {

                if (isError(serviceResponse)) return false;

                $scope.ApptSchedView_GetDefaultFacilitiesList = serviceResponse;
            })

        }
        //######### GET LIST OF DEFAULT FACILITIES BLOCK END ##############


        //################### GET PATIENT DISEASE VALIDATION  BLOCK START #########################
        //*******PURPOSE: This method used to validate whether the patient is diceased or not
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_GetPatientDiceaseValidation = function () {

            GiveNewAppointmentService.ApptSchedView_GetPatientDiceaseValidation(callCenterSelectedPracticeModel).then(function (serviceResponse) {

                if (isError(serviceResponse)) return false;

                $scope.ApptSchedView_GetPatientDiceaseValidationList = serviceResponse;
            })

        }
        //######### GET PATIENT DISEASE VALIDATION BLOCK END ##############


        //################### GET LIST OF FUTURE APPOINTMENTS BLOCK START #########################
        //*******PURPOSE: This method used to Get the List of future appointments
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_GetFutureAppointmentsList = function () {

            GiveNewAppointmentService.ApptSchedView_GetFutureAppointmentsList(callCenterSelectedPracticeModel).then(function (serviceResponse) {

                if (isError(serviceResponse)) return false;

                $scope.ApptSchedView_GetFutureAppointmentsListData = serviceResponse;
            })

        }
        //######### GET LIST OF FUTURE APPOINTMENTS BLOCK END ##############


        //################### GET LIST OF PHYSICIAN RELATED APPOINTMENTS LIST BLOCK START #########################
        //*******PURPOSE: This method used to Get the List of 
        //related appointment list
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_GetAppointmentsRelatedtoPhysician = function () {

            GiveNewAppointmentService.ApptSchedView_GetAppointmentsRelatedtoPhysician(callCenterSelectedPracticeModel).then(function (serviceResponse) {

                if (isError(serviceResponse)) return false;

                $scope.ApptSchedView_GetAppointmentsRelatedtoPhysicianList = serviceResponse;
            })

        }
        //######### GET LIST OF PHYSICIAN RELATED APPOINTMENTS LIST BLOCK END ##############

        //################### GETTING THE MIN INTERVAL INFOMATION SECTION BLOCK START #########################
        //*******PURPOSE: This method used to Get the interval information of the selected user from the data base
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/14/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_GetMinimumInterval = function (isFromFacilityDataBound, isFromProviderChange, isFromPageLoad) {
            isFromProviderResourcePopupClick = isFromProviderChange;

            //validation added by Ganesh V.
            if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) {
                ShowErrorMessage("Please Enter Valid Date Format MM/DD/YYYY.");
                $scope.addAppointmentSelectAppointmentDate = true;
                return;
            }

            if (!hasValue($scope.AppointmentTimeInAddMode)) {
                ShowErrorMessage("Please Select Appointment time.")
                $scope.addAppointmentSelectAppointmentTime = true;
                return;
            }

            var SelectedDate = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;

            GiveNewAppointmentService.ApptSchedView_GetMinimumInterval(SelectedPhysicianID, SelectedResourceType, adminDateInStringFormat(SelectedDate), 0, callCenterSelectedPracticeModel).then(function (serviceResponse) {

                if (hasValue($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList) && $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.length > 0) {
                    $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = false;

                    $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.forEach(function (eachItem) {
                        if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSENDAPPOINTMENTREMINDER || eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSSAVEANDSENDAPPOINTMENTREMINDER) {
                            if (!$scope.AppointmentDateInAddMode || (DateDiff.inDays($scope.AppointmentDateInAddMode, adminGetCurrentDate()) <= 0)) {
                                //HIDING SAVE & SEND APPT REMINDER BUTTON
                                $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = true;
                            }
                        }

                        if (!$scope.isVisitTypeFieldCustomized && eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SELECTVISITTYPE || eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSSELECTVISITTYPE) {
                            $scope.isVisitTypeFieldCustomized = true;
                            //VISIT TYPE IS LOADING ONLY FROM PAGE LOAD 
                            // IN FACILITY DATA BOUND AND IN DATE CHANGE EVENTS NO NEED TO CALL VISIT TYPE METHOD
                            if (!isFromFacilityDataBound) {
                                $scope.ApptSchedView_GetApptsVisitType();
                            }
                        }

                    })
                }


                if (isError(serviceResponse)) return false;


                $scope.existingPatientTopMostDurationsInfoList = [];
                if (hasValue(serviceResponse)) {
                    serviceResponse = getApptDurationsListBasedonPractice(serviceResponse)
                    $scope.ApptSchedView_GetMinimumIntervalList = serviceResponse;

                    //added by hemanth on feb 15 2k18 
                    //to display duration hyperlinks at duration dropdown 
                    for (var durationCount = 0; durationCount < $scope.ApptSchedView_GetMinimumIntervalList.length; durationCount++) {
                        if (durationCount >= 6) break;
                        $scope.existingPatientTopMostDurationsInfoList.push($scope.ApptSchedView_GetMinimumIntervalList[durationCount]);
                    }




                    $scope.existingPatientAppointmentsDurationDataSource.data(serviceResponse);

                    var MinimumInterval = 5;
                    MinimumInterval = $scope.ApptSchedView_GetMinimumIntervalList[0].MinimumInterval;//Assigning Provider Min Interval


                    if (!hasValue($('#addAppointmentSelectAppointmentTimeId').data("timepicker"))) {
                        //timepicker
                        $('#addAppointmentSelectAppointmentTimeId').timepicker({
                            minuteStep: MinimumInterval,
                            // showMeridian: true,
                        });
                    }


                    if (hasValue($('#addAppointmentSelectAppointmentTimeId').data("timepicker")) && hasValue($('#addAppointmentSelectAppointmentTimeId').data("timepicker").minuteStep)) {
                        $('#addAppointmentSelectAppointmentTimeId').data("timepicker").minuteStep = MinimumInterval;
                    }
                    //VALIDATING WHETHER THE FACILITY ARE FILLED OR NOT
                    //if ($scope.ApptSchedView_FacilitiesList == undefined) return;

                    if (isFromPageLoad && _.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "NewClientNewApptRequestFromPortal") {
                        $scope.SelectedExistingPatApptDuration = $scope.EMRDataFromPopup.SelectedAppointmentDuration;
                    }
                    //ADDED BY HEMATH ON 07/05/216
                    //MAINTAIN THE SELECTED VISIT TYPE DURATION FOR THE VARIABLE TO STATE MAINTAIN THE DURATION IF THE PROVIDER CHANGE
                    else if (!dontChangeDurationWhenDateChange && hasValue($scope.PatientApptVisitTypeDurationInfo) && $scope.PatientApptVisitTypeDurationInfo > 0) {
                        assignAppointmentDuration($scope.PatientApptVisitTypeDurationInfo)
                    }
                    //if the default duration not exist for the selected visitype then load the first value as duration
                    else {
                        if (!$scope.SelectedExistingPatApptDuration && hasValue($scope.ApptSchedView_GetMinimumIntervalList) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0]) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration)) {
                            assignAppointmentDuration($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration);
                        }
                    }
                    $timeout(function () {
                        if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "NewClientNewApptRequestFromPortal") {
                            $scope.SelectedExistingPatApptFacilities = $scope.EMRDataFromPopup.SelectedFacilityID;
                        }                        
                        if (!isDefaultDurationFromMinimulIntervalDataPopulated)
                            populateDefaultDurationFromDemographicsApptInfo();
                        isDefaultDurationFromMinimulIntervalDataPopulated = true;
                    
                        // ADDED BY HEMANTH ON APRIL 12TH 2017
                        if (hasValue($scope.ApptSchedView_FacilitiesList) && $scope.ApptSchedView_FacilitiesList.length > 0 && !$scope.SelectedExistingPatApptFacilities) {
                           
                            if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "StaffActivitiesNotesSavingWindow" && isFromPageLoad) {
                                var facilityExists = false;
                                for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                                    if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID == $scope.EMRDataFromPopup.SelectedFacilityID) {
                                        $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                                        $scope.SelectedFacilityDisplayName = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityDisplayName;
                                        facilityExists = true;
                                        break;
                                    }
                                }
                                if (facilityExists) {
                                    return;
                                }
                            }   
                           
                            //when provider drop down changed and previous provider selected facility is available for current selected provider then we are state maintaining facility 
                            //without showing logged facility
                            if (isFromProviderChange && $scope.SelectedExistingPatApptFacilities > 0 && _.find($scope.ApptSchedView_FacilitiesList, { FacilityID: parseInt($scope.SelectedExistingPatApptFacilities) })) {
                                return;
                            }
                            //if user customized to show linked facility then making function call to load his linked facility
                            if (_.find($scope.ExistingPatientAppointmentColumnsCustomizationInfoList, { AppointmentSettingFieldID: GiveAppointmentConstantsService.APPOINTMENTSETTINGSENUMS.CLIENTLINKEDLOCATIONINFACILITYFIELD }))
                                return $scope.exitingPatientApptPatientLinkedLocationPopupClick(true, serviceResponse);
                            //CHECKING WHETHER THE FACILITY EXISTS FOR  SPECIFIED TIME OR NOT
                            existingPatientAppointmentLoadFacilityForUser(serviceResponse, isFromPageLoad);
                        }                      
                    }, 200);



                }
            })
        }
        //######### GETTING THE MIN INTERVAL INFOMATION SECTION BLOCK END ##############



        //############### REFRESH THE SCHEDULER IF THE INSTANCE OF SCHEDULER ON SIGNALR BLOCK START###################
        //*******PURPOSE: this this event is useful when the appt changes are done for the current provider then refreshing the status by refreshing the scheduler grid
        //*******CREATED BY: mAHESH P
        //*******CREATED DATE: 07/30/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //this  method is useful in calling the signalr refreshing of the practice when appt details are changed
        $scope.existingPatientApptSignalrRefresh = function () {

            var apptSignalrModel = {

                EMRAppServerCentralizerAppointmentSchedulerActions: {
                    ProviderID: $scope.NewAppointmentSchedulerModel.PhysicianID,
                    ResourceType: $scope.NewAppointmentSchedulerModel.ResourceType,
                    AppointmentDate: new Date($scope.NewAppointmentSchedulerModel.StartTime).getFormat("MM/dd/yyyy"),
                }
            };

            if (!ExistingPatientSelectedData.isFromCallCenterEHR) {
                apptSignalrModel.Type = EHRCentralizerMessageTypes.EMRAppointmentSchedulerRefresh;
                if (_.get($scope.EMRDataFromPopup, "isGiveApptFromAppointmentScheduler")) {
                    apptSignalrModel.EHRSessionID = EMRPracticeModel.EHRSessionID;
                }
                //SEND REQUEST THROUGH SCOKET
                EMRCommonFactory.WebSocketSendRequest(apptSignalrModel);


                //TO REFERSH THE GILBERT SCHEDULER 
                // ADDED BY HEMANTH ON NOV 13 2017 
                var gilbertSignalrModel = {
                    EHRGilbertAppointmentSchedulerActions: {
                        isFromExactDate: true,
                        gilbertClinicTherapistsSelectedDate: new Date($scope.NewAppointmentSchedulerModel.StartTime).getFormat("MM/dd/yyyy"),
                        isCallingFromPreviousorNext: undefined,
                    }
                };
                gilbertSignalrModel.Type = EHRCentralizerMessageTypes.EHRGILBERTAPPTSCHEDULERREFRESH;
                //SEND REQUEST THROUGH SCOKET
                EMRCommonFactory.WebSocketSendRequest(gilbertSignalrModel);



                //$rootScope.apptSchedulerRefreshSchedulerOnAddingUsingSignalR(apptSignalrModel);//calling root scope function for signalr to refresh  the scheduler

            }
        };
        //############### REFRESH THE SCHEDULER IF THE INSTANCE OF SCHEDULER ON SIGNALR BLOCK END ###################

        //############### REFRESH THE SCHEDULER IF THE INSTANCE OF SCHEDULER ON SIGNALR BLOCK START###################
        //*******PURPOSE: THIS THIS EVENT IS USEFUL WHEN THE APPT CHANGES ARE DONE FOR THE CURRENT PROVIDER THEN REFRESHING THE STATUS BY REFRESHING THE RESOURCE PROVIDERSCHEDULER GRID
        //*******CREATED BY: SRINIVAS M
        //*******CREATED DATE: 10/19/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //this  method is useful in calling the signalr refreshing of the practice when appt details are changed
        $scope.existingPatientApptResourceProviderSignalrRefresh = function () {

            var apptSignalrModel = {

                EMRAppServerCentralizerAppointmentSchedulerActions: {
                    ProviderID: $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID,
                    ResourceType: $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianResourceype,
                    AppointmentDate: new Date($scope.NewAppointmentSchedulerModel.StartTime).getFormat("MM/dd/yyyy"),
                    isLinkedProvider: true
                }
            };

            if (!ExistingPatientSelectedData.isFromCallCenterEHR) {
                apptSignalrModel.Type = EHRCentralizerMessageTypes.EMRAppointmentSchedulerRefresh;
                if (_.get($scope.EMRDataFromPopup, "isGiveApptFromAppointmentScheduler")) {
                    apptSignalrModel.EHRSessionID = EMRPracticeModel.EHRSessionID;
                }

                //SEND REQUEST THROUGH SCOKET
                EMRCommonFactory.WebSocketSendRequest(apptSignalrModel);

                //$rootScope.apptSchedulerRefreshSchedulerOnAddingUsingSignalR(apptSignalrModel);//calling root scope function for signalr to refresh  the scheduler

            }
        };
        //############### REFRESH THE SCHEDULER IF THE INSTANCE OF SCHEDULER ON SIGNALR BLOCK END ###################

        //############### REFRESH THE SCHEDULER IF THE INSTANCE OF SCHEDULER ON SIGNALR BLOCK START###################
        //*******PURPOSE: THIS THIS EVENT IS USEFUL WHEN THE APPT CHANGES ARE DONE FOR THE CURRENT PROVIDER THEN REFRESHING THE STATUS BY REFRESHING THE RESOURCE PROVIDERSCHEDULER GRID
        //*******CREATED BY: SRINIVAS M
        //*******CREATED DATE: 03/31/2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //this  method is useful in calling the signalr refreshing of the practice when appt details are changed
        //modified to add new input parameter as provider id as resource and room both are split into seperate fields so based 
        //on the input signal refresh will be performed on resource or room
        $scope.existingPatientApptResourceOrRoomSignalrRefresh = function (ProviderID) {

            var apptSignalrModel = {

                EMRAppServerCentralizerAppointmentSchedulerActions: {
                    ProviderID,
                    ResourceType: 2,
                    AppointmentDate: new Date($scope.NewAppointmentSchedulerModel.StartTime).getFormat("MM/dd/yyyy"),
                    isLinkedProvider: true
                }
            };

            apptSignalrModel.Type = EHRCentralizerMessageTypes.EMRAppointmentSchedulerRefresh;
            if (_.get($scope.EMRDataFromPopup, "isGiveApptFromAppointmentScheduler")) {
                apptSignalrModel.EHRSessionID = EMRPracticeModel.EHRSessionID;
            }
            //SEND REQUEST THROUGH SCOKET
            EMRCommonFactory.WebSocketSendRequest(apptSignalrModel);

            //$rootScope.apptSchedulerRefreshSchedulerOnAddingUsingSignalR(apptSignalrModel);//calling root scope function for signalr to refresh  the scheduler

        };
        //############### REFRESH THE SCHEDULER IF THE INSTANCE OF SCHEDULER ON SIGNALR BLOCK END ###################








        //################### SAVE NEW APPOINTMENT FOR EXISTING PATIENT BLOCK START #########################
        //*******PURPOSE: THIS METHOD IS USED FOR SAVING ALL THE INFORMATION THAT IS USED FOR GIVING THE APPOINTMENT FOR A PATIENT WHOSE IS ALLREADY IN THAT PRACTICE
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014 // save sp start 
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_SaveAppointmentsforExistingPatient = function (isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink, isFromGoogleMeet) {

            isFromSaveAndScheduleGoogleMeet = isFromGoogleMeet;

            if ($scope.AppointmentDateInAddMode && validateDateOnDemand($scope.AppointmentDateInAddMode)) {
                //checking the sec admin permission to give appt for current day is allowed or not and date is current date or not
                if (EMRCommonFactory.EMRCheckPermissions("APPOINTMENTSCHEDULER-ALLOWTOSCHEDULEAPPTONTHESAMEDAY") == EMRPermissionType.DENIED
                    && !DateDiffInDays($scope.AppointmentDateInAddMode, adminGetCurrentDate())) {
                    ShowErrorMessage("You are not authorized to schedule appointments on the same day. Please contact your administrator to proceed further");
                    return;
                }
            }

            if (!_.get($scope.SelectedPhysicianData, "PhysicianId") && _.get(ExistingPatientSelectedData, "isFromNewFormat3Scheduler")) {
                ShowErrorMessage("Please Select Provider / Resource. ");
                angular.element("#existingPatientAppointmentSelectProvider").focus();
                return false;
            }
            if (!$scope.existingPatientAppointmentSelectedProviderorResource) {
                ShowErrorMessage("Please Select Provider / Resource. ");
                angular.element("#existingPatientAppointmentSelectProvider").focus();
                return false;
            }
            if ($scope.IsClientInsuranceVerifiedinpast30to60Days == 1) {
                if (!$scope.ClientInsuranceVerifiedDate) {
                    ShowErrorMessage("Please Select / Enter Insurance Verified Date. ");
                    $scope.existingPatientVerifiedDateFocus = true;
                    return;
                }
                if (!validateDateOnDemand($scope.ClientInsuranceVerifiedDate)) {
                    ShowErrorMessage("Please Enter Valid Date Format MM/DD/YYYY.");
                    $scope.existingPatientVerifiedDateFocus = true;
                    return;
                }
            }
            else if($scope.IsClientInsuranceVerifiedinpast30to60Days == 2 && !$scope.ClientInsuranceNotVerifiedComments){
                ShowErrorMessage("Please Enter Client Insurance not Verified Comments.");
                $scope.ClientInsuranceNotVerifiedCommentsFocus = true;
                return;
            }

            checkPatientRestrictionForSchedulingAppts(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);

        }

        function saveApptforPatientAfterCheckingValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) &&
                hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName)) {
                if (verifySaveIsPerformedFromIndianIP($scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName)) return;
            }

            //GET THE SETTINGS //added by teja n under guidence of srinivas sir //restrict the service calls based on settings
            //RESTRICT THE SERVICE CALL  BASED ON SETTING 
            if (hasValue($scope.PerformNetworkCertificationValidation) && $scope.PerformNetworkCertificationValidation == true) {
                EHRPerformMandatoryValidationsInFormWithOutFocusForCustomizationFields("divfrmExistingAppts");
            }

            //Variable Assign the Send Appointment Remaider Falg.
            //We need to use send Appointment Remider base on this flag
            //maintain Send Appt Remainder Status
            $scope.existingPatientAppointmentIsSendApptRemainder = isSendApptRemainder;


            //ADDED BY PAVAN KUMAR KANDULA ON 12/06/2018 AS PER THE REQUEST OF BHARATH ANNA
            if (hasValue($scope.PatientAppointmentTypeID)) {
                $scope.NewAppointmentSchedulerModel.PatientAppointmentTypeID = $scope.PatientAppointmentTypeID;
            }


            $scope.NewAppointmentSchedulerModel.PhysicianID = SelectedPhysicianID;
            $scope.NewAppointmentSchedulerModel.ResourceType = SelectedResourceType;
            $scope.NewAppointmentSchedulerModel.isSendSMStoPatient = isSaveAndAddBillingInfo == -4;//FROM Save and send sms

            $scope.NewAppointmentSchedulerModel.IsFromPillersofWellnessScheduler = _.get($scope, "EMRDataFromPopup.IsFromPillersofWellnessScheduler", false);




            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) &&
                hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName)) {
                $scope.NewAppointmentSchedulerModel.PersonName = $scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName;
            }
            //$scope.NewAppointmentSchedulerModel.VisitTypeName = $scope.SelectedExistingPatApptVisitType;

            if (hasValue($scope.SelectedExistingPatApptVisitType) && $scope.SelectedExistingPatApptVisitType > 0) {
                if (hasValue($("#ddlSelectVisitType").data("kendoDropDownList"))) {
                    $scope.NewAppointmentSchedulerModel.VisitTypeName = $("#ddlSelectVisitType").data("kendoDropDownList").text();
                }
            }

            if (hasValue($scope.SelectedExistingPatApptVisitTypeName))
                $scope.NewAppointmentSchedulerModel.VisitTypeName = $scope.SelectedExistingPatApptVisitTypeName;
            $scope.NewAppointmentSchedulerModel.FacilityName = $scope.SelectedExistingPatApptFacilities;

            //checking the value in the phone number text field and validation the format of phone number as per emr poicy
            //if format is not acceptable then stoping the saving here
            if ($scope.existingPatientAppointmentPhoneNumber && !validatePhoneText($scope.existingPatientAppointmentPhoneNumber)) {
                angular.element("#txtExistingPatientAppointmentPhoneNumber").focus();
                return;
            }
            $scope.NewAppointmentSchedulerModel.ApptLinkedPhoneNumber = $scope.existingPatientAppointmentPhoneNumber;   //assingging the phone number value to save input model
            $scope.NewAppointmentSchedulerModel.ZoomMeetingLink = $scope.existingPatientAppointmentZoomMeetingLink; //assingging the zoom link value to save input model

            $scope.NewAppointmentSchedulerModel.ReferredBy = $scope.ReferredByName;
            $scope.NewAppointmentSchedulerModel.DateofBirth = ExistingPatientSelectedData.SelectedPatient[0].DateOFBirth;
            $scope.NewAppointmentSchedulerModel.InsuranceName = $scope.existingPatientAppointmentBillToInsuranceNames;

            if (hasValue(EMRPracticeModel.Title)) {
                $scope.NewAppointmentSchedulerModel.AppointmentCreatedByName = EMRPracticeModel.FirstName + " " + EMRPracticeModel.LastName + " " + EMRPracticeModel.Title;
                $scope.NewAppointmentSchedulerModel.ActionPerformedBy = EMRPracticeModel.FirstName + " " + EMRPracticeModel.LastName + " " + EMRPracticeModel.Title;
            }
            else {
                $scope.NewAppointmentSchedulerModel.AppointmentCreatedByName = EMRPracticeModel.FirstName + " " + EMRPracticeModel.LastName;
                $scope.NewAppointmentSchedulerModel.ActionPerformedBy = EMRPracticeModel.FirstName + " " + EMRPracticeModel.LastName;
            }

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PatientDemographicsCreatedBy)) {
                $scope.NewAppointmentSchedulerModel.PatientDemographicsCreatedBy = $scope.EMRDataFromPopup.SelectedPatient[0].PatientDemographicsCreatedBy;
            }
            else if (hasValue(EMRPracticeModel)) {
                $scope.NewAppointmentSchedulerModel.PatientDemographicsCreatedBy = EMRPracticeModel.FirstName + " " + EMRPracticeModel.LastName;
            }



            $scope.NewAppointmentSchedulerModel.HomePhone = ExistingPatientSelectedData.SelectedPatient[0].HomePhone;
            $scope.NewAppointmentSchedulerModel.MobilePhone = ExistingPatientSelectedData.SelectedPatient[0].MobilePhone;
            $scope.NewAppointmentSchedulerModel.ReferralAuthNum = $scope.SelectedExistingPatApptReferralAuth;
            $scope.NewAppointmentSchedulerModel.PersonType = 2; //1 -- non patient, 2 -- patient, 3 -- event / organization

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0].Patient_Status_TypeID)) {
                if ($scope.EMRDataFromPopup.SelectedPatient[0].Patient_Status_TypeID == 2) {
                    $scope.NewAppointmentSchedulerModel.IsPatientInActive = true;
                }
                else {
                    $scope.NewAppointmentSchedulerModel.IsPatientInActive = false;
                }
            }

            if (hasValue($("#ddlExistingPatientAppointmentEncounterModality").data("kendoDropDownList"))) {
                $scope.NewAppointmentSchedulerModel.EncounterModality = $("#ddlExistingPatientAppointmentEncounterModality").data("kendoDropDownList").text();
            }
            $scope.NewAppointmentSchedulerModel.ProgramName = $scope.existingPatientAppointmentProgramsProgramsServicesforProgram;
            $scope.NewAppointmentSchedulerModel.ServiceName = $scope.existingPatientAppointmentProgramsProgramsServicesforService;
            $scope.NewAppointmentSchedulerModel.ProgramServiceName = $scope.existingPatientAppointmentProgramsProgramsServices;

            if (hasValue($scope.PatientAppointmentTypeID) && $scope.PatientAppointmentTypeID > 0) {
                if (hasValue($("#ddlExistingPatientAppointmentPatientApptType").data("kendoDropDownList"))) {
                    $scope.NewAppointmentSchedulerModel.Patient_Appointment_TypeDesc = $("#ddlExistingPatientAppointmentPatientApptType").data("kendoDropDownList").text();
                }
            }

            $scope.NewAppointmentSchedulerModel.Appointment_Encounter_Modality_Type = $scope.SelectedExistingPatApptEncounterType;

            var startDate = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;
            //************  END TIME CALCULATED BASED ON APPT START DATE TIME AND DURATION *****************

            var DateTime = new Date(startDate);    // converting dateformat to IST (Tue Jun 11 2019 22:30:00 GMT+0530 (India Standard Time)) --->    "06/11/2019 09:30 PM"
            //DATE TIME WILL BE CONVERTED AS (1560272400000) FORMAT THEN IT WILL BE CONVERTED AS TIME AND DATE FORMAT 
            var EndTimeCaluclated = DateTime.setMinutes(DateTime.getMinutes() + parseInt($scope.SelectedExistingPatApptDuration + ""));
            var EndTimeCaluclatedTime = $.format.date(new Date(EndTimeCaluclated), "hh:mm a");     // CONVERTD AS HOURS AND MINUTES FORMAT 
            var EndTimeCaluclatedDate = $.format.date(new Date(EndTimeCaluclated), "MM/dd/yyyy");  // CONVERTD AS MONTH DATE YEAR FORMAT 
            $scope.NewAppointmentSchedulerModel.AppointmentEndDate = EndTimeCaluclatedDate + " " + EndTimeCaluclatedTime;
            $scope.NewAppointmentSchedulerModel.EndTime = EndTimeCaluclatedTime;   //  CALCULATED END TIME ASSIGNED TO THE VARIABLE 


            if (hasValue($scope.exisitingPatientAppointmentStatusInformation) && $scope.exisitingPatientAppointmentStatusInformation.length > 0) {
                var ApptStatusInfo = $.grep($scope.exisitingPatientAppointmentStatusInformation, function (item) {
                    return item.AppointmentStatusSystemDefinedTypeID == 0 && item.AppointmentStatusType == 1;
                });
                if (hasValue(ApptStatusInfo) && hasValue(ApptStatusInfo[0])) {
                    $scope.NewAppointmentSchedulerModel.StatusID = ApptStatusInfo[0].AppointmentStatusInfoID;
                    $scope.NewAppointmentSchedulerModel.AppointmentStatusBackColor = ApptStatusInfo[0].StatusBackColor;
                    $scope.NewAppointmentSchedulerModel.AppointmentStatusForeColor = ApptStatusInfo[0].StatusForeColor;
                    $scope.NewAppointmentSchedulerModel.AppointmentStatusSystemDefinedTypeID = ApptStatusInfo[0].AppointmentStatusSystemDefinedTypeID;
                    if (hasValue(ApptStatusInfo[0].StatusDisplayName))
                        $scope.NewAppointmentSchedulerModel.AppointmentStatusDesc = ApptStatusInfo[0].StatusDisplayName;
                    else if (hasValue(ApptStatusInfo[0].StatusAliasName))
                        $scope.NewAppointmentSchedulerModel.AppointmentStatusDesc = ApptStatusInfo[0].StatusAliasName;

                }
                else if (hasValue(ApptStatusInfo)) {
                    $scope.NewAppointmentSchedulerModel.StatusID = ApptStatusInfo.AppointmentStatusInfoID;
                    $scope.NewAppointmentSchedulerModel.AppointmentStatusBackColor = ApptStatusInfo.StatusBackColor;
                    $scope.NewAppointmentSchedulerModel.AppointmentStatusForeColor = ApptStatusInfo.StatusForeColor;
                    $scope.NewAppointmentSchedulerModel.AppointmentStatusSystemDefinedTypeID = ApptStatusInfo.AppointmentStatusSystemDefinedTypeID;
                    if (hasValue(ApptStatusInfo.StatusDisplayName))
                        $scope.NewAppointmentSchedulerModel.AppointmentStatusDesc = ApptStatusInfo.StatusDisplayName;
                    else
                        $scope.NewAppointmentSchedulerModel.AppointmentStatusDesc = ApptStatusInfo.StatusAliasName;

                }
            }

            if (hasValue($scope.existingPatientAppointmentBillToInsuranceIDPriorAuthStatus))
                $scope.NewAppointmentSchedulerModel.PriorAuth = $scope.existingPatientAppointmentBillToInsuranceIDPriorAuthStatus;
            else
                $scope.NewAppointmentSchedulerModel.PriorAuth = false;

            if (hasValue($scope.exisitingPatientAppointmentIsAutoCreateSuperBill))
                $scope.NewAppointmentSchedulerModel.IsAutoCreateSuperBill = $scope.exisitingPatientAppointmentIsAutoCreateSuperBill;
            else
                $scope.NewAppointmentSchedulerModel.IsAutoCreateSuperBill = false;

            $scope.NewAppointmentSchedulerModel.AddAdditionalProvider = $scope.apptAdd_Additional_Provider;

            if (hasValue($scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings) &&
                hasValue($scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings.AppointmentGiventopatient))
                $scope.NewAppointmentSchedulerModel.IsAdmissionsEpisodesAutoCreate = $scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings.AppointmentGiventopatient;

            if (hasValue($scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings) &&
                hasValue($scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings.AppointmentGiventopatientProgramID) &&
                $scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings.AppointmentGiventopatientProgramID > 0) {

                if ($scope.NewAppointmentSchedulerModel.IsAdmissionsEpisodesAutoCreate == true) {
                    if (hasValue($scope.existingPatientApptSelectedProgramID) && $scope.existingPatientApptSelectedProgramID > 0)
                        $scope.NewAppointmentSchedulerModel.EpisodeProgramID = $scope.existingPatientApptSelectedProgramID;
                    else
                        $scope.NewAppointmentSchedulerModel.EpisodeProgramID = $scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings.AppointmentGiventopatientProgramID;

                }
            }


            var ApptSchedView_VisitTypeDropdownlist = $("#ddlSelectVisitType").data("kendoDropDownList");
            var ApptSchedView_VisitTypeDataItem;
            if (hasValue(ApptSchedView_VisitTypeDropdownlist) && ApptSchedView_VisitTypeDropdownlist.length > 0) {
                ApptSchedView_VisitTypeDataItem = ApptSchedView_VisitTypeDropdownlist.dataItem();
            }

            if (ApptSchedView_VisitTypeDataItem != null && hasValue(ApptSchedView_VisitTypeDataItem.ProcedureVisitType) && ApptSchedView_VisitTypeDataItem.ProcedureVisitType == "1") {

                if (!hasValue($scope.NewAppointmentSchedulerModel.GenearalComments)) {
                    ShowErrorMessage("Please Enter General Comments.");
                    $("#txtGeneralComments").focus();
                    return;
                }

            }

            //553 - "BH HOSPITAL DISCHARGE"  is wellcare visit type
            if (WcHealthPracticeCondition && $scope.isReferredByFieldCustomized && !$scope.SelectedExistingPatApptReferralMD && [470, 471, 472, 473, 474, 553].includes($scope.SelectedExistingPatApptVisitType)) {
                ShowErrorMessage(`Please Select ${$scope.existingPatientAppointmentSelectReferredBy}.`);
                angular.element("#spanExistingPatientReferralMD").focus();
                return;
            }

            if ($scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit && [467, 999].includes(EMRPracticeModel.PracticeID)) {
                var htmlRegex = /<("[^"]*"|'[^']*'|[^'">])*>/g;
                var functionRegex = /\b(function)\b/g;

                if (htmlRegex.test($scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit) || functionRegex.test($scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit)) {
                    ShowErrorMessage(`Please Enter Valid ${$scope.existingPatientAppointmentSelectReasonForAppt}.`);
                    angular.element("#txtReasonforVisit").focus();
                    return false;
                }
            }

            var ApptWindowType = 2;
            //WHEN GIVE APPT WINDWO IS OPEND FORM THE ALL CLIENT SCHEDULER THEN GETTING THE OBJECTES BASED ON ALL CLIENTS OBJECTS CUSTOMIZATION 
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PopupOpenFrom) && $scope.EMRDataFromPopup.PopupOpenFrom == "AllClientScheduler") {
                ApptWindowType = 7; //ALL CLIENTS SCHDULER GIVE APPT WINDOW 
                $scope.NewAppointmentSchedulerModel.AppointmentModuleType = 8; //for ALL CLEINTS APPT SCHEDUELR 
            }

            var MandatoryFieldsList;
            //WE ARE USING THE LIST FROM THE ADD / EDIT FIELDS TO CHECK MANDATORY VALIDATION 
            //NO NEED TO RE LOGIN TO APPLY THE CHANGES 
            if (hasValue($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList) && $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.length > 0) {
                MandatoryFieldsList = $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.filter(function (ExistingPatientAppointmentCustomizedColumns) {
                    return ((ExistingPatientAppointmentCustomizedColumns.IsMandatory == 1 && !ExistingPatientAppointmentCustomizedColumns.ShowFieldinWindow) && (ExistingPatientAppointmentCustomizedColumns.IsUsedFor == ApptWindowType)); //only give appt window fields 
                })
            }


            //for mandatory validation of customized fields
            var ValidationInfo = {};

            if (hasValue(MandatoryFieldsList) && MandatoryFieldsList.length > 0) {
                for (var i = 0; i < MandatoryFieldsList.length; i++) {

                    ValidationInfo = $scope.existingPatientApptValidateMandatoryFieldsInfo(MandatoryFieldsList[i].AppointmentSettingFieldID, MandatoryFieldsList[i].appointmentCustomizedFiledsDisplayName);
                    //Validation Succeeded
                    if (hasValue(ValidationInfo) && !ValidationInfo) return false;
                }
            }
            if ((EMRPracticeModel.PracticeID === 361 || EMRPracticeModel.PracticeID === 999) && validateEncounterModalityLinkedFacilityForPractice()) return;

            if ($scope.showIFirstMedicalVideoReviewedDropDown) {
                if (!$scope.isFirstMedicalVideoReviewedModel || $scope.isFirstMedicalVideoReviewedModel == "0") {
                    ShowErrorMessage("Please Select First Medical Appt Video Review.");
                    $scope.existingPatientAppointmentWidgets.ddlFirstMedicalVideoReviewed.focus();
                    return;
                }
                $scope.NewAppointmentSchedulerModel.IsFirstMedicalApptVideoReviewed = $scope.isFirstMedicalVideoReviewedModel;
            } else {
                $scope.NewAppointmentSchedulerModel.IsFirstMedicalApptVideoReviewed = 0;
            }

            $scope.NewAppointmentSchedulerModel.PatientID = SelectedPatientID;
            $scope.NewAppointmentSchedulerModel.PhysicianID = SelectedPhysicianID;
            $scope.NewAppointmentSchedulerModel.ResourceType = SelectedResourceType;
            var SelectedDate = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;

            //when the date is not a valid date time
            if (new Date(SelectedDate).toString().toLowerCase() == "Invalid Date".toLowerCase()) return;


            $scope.NewAppointmentSchedulerModel.StartTime = adminDateInStringFormat(SelectedDate);

            //ASSIGN THE SELECTED TIME ZONE ID TO SAVE APPT DETAILS 
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.selectedTimeZoneInfo) && hasValue($scope.EMRDataFromPopup.selectedTimeZoneInfo.TimeDiffInMins)) {
                $scope.NewAppointmentSchedulerModel.PracticeApptTime = new Date($scope.NewAppointmentSchedulerModel.StartTime).addMinutes(-($scope.EMRDataFromPopup.selectedTimeZoneInfo.TimeDiffInMins)).getFormat("MM/dd/yyyy hh:mm a");
            }


            //IF INSURANCE SELECTEd Then LINK those insurances   FOR THE APPT
            if (hasValue($scope.existingPatientAppointmentBillToInsuranceID)) {
                $scope.NewAppointmentSchedulerModel.ApptLinkedPatientInsuranceID = $scope.existingPatientAppointmentBillToInsuranceID;
            }
            else {
                $scope.NewAppointmentSchedulerModel.ApptLinkedPatientInsuranceID = 0;
            }


            //PASSING THE SELECTED INSURANCE ID / HELTH PLAN ID PASSED TO THE APPT SAVING 
            if (hasValue($scope.existingPatientAppointmentHealthPlanID)) {
                $scope.NewAppointmentSchedulerModel.ApptLinkedHealthPlanID = $scope.existingPatientAppointmentHealthPlanID;
            }
            else {
                $scope.NewAppointmentSchedulerModel.ApptLinkedHealthPlanID = 0;
            }




            //IF GRANTS SELECTEd Then LINK those GRANTS   FOR THE APPT
            if (hasValue($scope.existingPatientAppointmentGrantID)) {
                $scope.NewAppointmentSchedulerModel.ApptLinkedPatientGrantID = $scope.existingPatientAppointmentGrantID;
            }
            else {
                $scope.NewAppointmentSchedulerModel.ApptLinkedPatientGrantID = 0;
            }

            if (hasValue($scope.selectedProgramServicesLinkedInfoID)) {
                $scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs = $scope.selectedProgramServicesLinkedInfoID;
            }
            else {
                $scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs = "";
            }


            if ($scope.SelectedExistingPatApptFacilities != undefined) {
                $scope.NewAppointmentSchedulerModel.FacilityID = $scope.SelectedExistingPatApptFacilities;
            }

            if ($scope.SelectedExistingPatApptDuration != undefined) {
                $scope.NewAppointmentSchedulerModel.Duration = $scope.SelectedExistingPatApptDuration;
            }

            if (hasValue($scope.existingPatientAppointmentSelectResourceID) && parseInt($scope.existingPatientAppointmentSelectResourceID) > 0) {
                $scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID = $scope.existingPatientAppointmentSelectResourceID;
            }
            else {
                $scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID = 0;
            }
            //assigning selected RoomID and Name for save model for valiadtion and saving
            $scope.NewAppointmentSchedulerModel.AppointmentLinkedRoomID = $scope.existingPatientAppointmentSelectRoomID ? $scope.existingPatientAppointmentSelectRoomID : 0;
            $scope.NewAppointmentSchedulerModel.AppointmentLinkedRoomName = $scope.existingPatientAppointmentSelectRoom;
            //if (hasValue($scope.existingPatientAppointmentSlidingFeeforLowIncome)) {
            //    $scope.NewAppointmentSchedulerModel.SlidingFeeforLowIncome = $scope.existingPatientAppointmentSlidingFeeforLowIncome;
            //}

            //OTHER THAN FACE TO FACE APPTS REMAINING ALL ARE CONSIDER AS TELEPHONE ENCOUNTER APPTS
            if (hasValue($scope.NewAppointmentSchedulerModel.AppointmentTypeID) && $scope.NewAppointmentSchedulerModel.AppointmentTypeID > 1) {
                $scope.NewAppointmentSchedulerModel.IsTelePhoneEncounterAppt = true;
            }

            //if the participants selected  in existing appt
            if (hasValue($scope.SelectedParticipantList) && $scope.SelectedParticipantList.length > 0) {
                $scope.NewAppointmentSchedulerModel.participantsInfo = $scope.SelectedParticipantList;
            }
            else {
                $scope.NewAppointmentSchedulerModel.participantsInfo = [];
            }

            if (hasValue($scope.existingPatientselectedAdditionalParticipants)) {
                $scope.NewAppointmentSchedulerModel.AdditionalParticipantNames = $scope.existingPatientselectedAdditionalParticipants;
            }
            //ADDED ON DECEMBER 30 TH 2016
            //WHILE GIVING THE NEW APPOINTMENT FROM THE WAITLIST FOR PROVIDER WIDNOW THEN SAVE THE APPT ID FOR THE SELECTED WAITNG LIST 
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.WaitingListID)) {
                $scope.NewAppointmentSchedulerModel.AppointmentWaitingListID = $scope.EMRDataFromPopup.WaitingListID;
            }


            //event or organization name
            if (hasValue(ExistingPatientSelectedData.SelectedPatient[0]) && hasValue(ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName)) {
                $scope.NewAppointmentSchedulerModel.PatientorEventorOrganizationName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;
            }

            //IF THE EPISODE NUMBER IS SELECTED THEN ASSIGNA IDENTY COLUMN
            if (hasValue($scope.InPatCareLevelEventInfoID) && $scope.InPatCareLevelEventInfoID > 0) {
                $scope.NewAppointmentSchedulerModel.InPatCareLevelEventInfoID = $scope.InPatCareLevelEventInfoID;
            }
            else {
                $scope.NewAppointmentSchedulerModel.InPatCareLevelEventInfoID = undefined;
            }

            if (hasValue($scope.InPatCareLevelEventEndDate) && hasValue($scope.InPatCareLevelAdmittedDate)) {
                if (DateDiff.inDays($scope.InPatCareLevelAdmittedDate, $scope.InPatCareLevelEventEndDate) > 0) {
                    ShowErrorMessage("Program Admission End Date must be greater than Appointment Date");

                    return;
                }
            }

            //IF THE APPT GIVEN FROM GILBERT CLINIC
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList) && $scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList.length > 0) {
                $scope.NewAppointmentSchedulerModel.isApptGivenByMe = true;
                $scope.NewAppointmentSchedulerModel.AppointmentModuleType = 7; //for juvenile calender
            }
            else {
                $scope.NewAppointmentSchedulerModel.isApptGivenByMe = false;
            }



            if (hasValue($scope.existingPatientAppointmentSelectedProviderorResource)) {
                $scope.NewAppointmentSchedulerModel.PhysicianName = $scope.existingPatientAppointmentSelectedProviderorResource;
            }

            if (hasValue($("#ddlSelectFacility").data("kendoDropDownList"))) {
                var FacilityName = $("#ddlSelectFacility").data("kendoDropDownList").text();
            }

            if (hasValue(FacilityName)) {
                $scope.NewAppointmentSchedulerModel.FacilityName = FacilityName;
            }

            //Getting the selected value text from the encounter Modality drop down added by PAVAN KUMAR KANDULA
            if (hasValue($("#ddlExistingPatientAppointmentEncounterModality").data("kendoDropDownList"))) {
                var EncounterTypeDesc = $("#ddlExistingPatientAppointmentEncounterModality").data("kendoDropDownList").text();
            }

            if (hasValue(EncounterTypeDesc)) {
                $scope.NewAppointmentSchedulerModel.AppointmentTypeDesc = EncounterTypeDesc;
            }

            //IF accomanied by details are selected 
            if (hasValue($scope.existingPatientsAdditionalParticipantsList)) {

                $scope.NewAppointmentSchedulerModel.AccompaniedByInfoModelInfo = $scope.existingPatientsAdditionalParticipantsList;

            }

            var postData = {}

            if (hasValue($scope.NewAppointmentSchedulerModel.PatientID) && $scope.NewAppointmentSchedulerModel.PatientID > 0) {
                postData.PatientID = $scope.NewAppointmentSchedulerModel.PatientID;
            }

            if ($scope.SelectedExistingPatApptVisitType != undefined) {
                postData.VisitType = $scope.SelectedExistingPatApptVisitType;
            }
            else {
                if (hasValue($scope.ApptSchedView_GetApptsVisitTypeList) && $scope.ApptSchedView_GetApptsVisitTypeList.length > 0) {
                    angular.forEach($scope.ApptSchedView_GetApptsVisitTypeList, function (item) {

                        if (hasValue(item) && hasValue(item.IsDefaultVisitType) && item.IsDefaultVisitType == true) {
                            $scope.SelectedExistingPatApptVisitType = item.VisitTypeID;
                            $scope.SelectedExistingPatApptVisitTypeName = item.VisitType;
                        }

                    });

                    if ($scope.SelectedExistingPatApptVisitType == undefined || !hasValue($scope.SelectedExistingPatApptVisitType) || $scope.SelectedExistingPatApptVisitType <= 0) {
                        angular.forEach($scope.ApptSchedView_GetApptsVisitTypeList, function (item) {

                            if (hasValue(item) && hasValue(item.IsSystemDefined) && item.IsSystemDefined == true) {
                                $scope.SelectedExistingPatApptVisitType = item.VisitTypeID;
                                $scope.SelectedExistingPatApptVisitTypeName = item.VisitType;
                            }

                        });
                    }

                    if ($scope.SelectedExistingPatApptVisitType != undefined) {
                        postData.VisitType = $scope.SelectedExistingPatApptVisitType;
                    }

                }
            }

            //IF THE APPT IS GIVEN FROM TEH DAY PROGRAM WINDOW THEN CHECK THE VALIDATION
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.InPatPHPInfoID) && $scope.EMRDataFromPopup.InPatPHPInfoID > 0) {
                postData.PHPInfoID = $scope.EMRDataFromPopup.InPatPHPInfoID;
            }
            else {
                postData.PHPInfoID = 0;
            }

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedNewClientNewApptFromPortalInfoID) && $scope.EMRDataFromPopup.SelectedNewClientNewApptFromPortalInfoID > 0) {
                $scope.NewAppointmentSchedulerModel.NewClientApptRequestFromPortalInfoID = $scope.EMRDataFromPopup.SelectedNewClientNewApptFromPortalInfoID;
            }

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PatientEmailID)) {
                $scope.NewAppointmentSchedulerModel.NewClientApptRequestFromPortalPatientEmailID = $scope.EMRDataFromPopup.PatientEmailID;
            }

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PatientName)) {
                $scope.NewAppointmentSchedulerModel.NewClientApptRequestFromPortalPatientName = $scope.EMRDataFromPopup.PatientName;
            }

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PatientPhoneNumber)) {
                $scope.NewAppointmentSchedulerModel.NewClientApptRequestFromPortalPatientPhoneNumber = $scope.EMRDataFromPopup.PatientPhoneNumber;
            }

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.ReasonForVisit)) {
                $scope.NewAppointmentSchedulerModel.Reason = $scope.EMRDataFromPopup.ReasonForVisit;
            }



            var existingPatientApptRefAuthInfo = [];

            if (hasValue($scope.existingPatientMainGridOptions.dataSource.data) && $scope.existingPatientMainGridOptions.dataSource.data.length > 0) {
                for (var index = 0; index <= $scope.existingPatientMainGridOptions.dataSource.data().length - 1; index++) {

                    //WE SHOULD CREATE CLAIM ONLY FOR THE CLAIMS FOR THE SELECTED PATIENTS.
                    if (hasValue($scope.existingPatientMainGridOptions.dataSource.data()[index].NumberofUnitsForThisVisit) && $scope.existingPatientMainGridOptions.dataSource.data()[index].NumberofUnitsForThisVisit > 0) {

                        if (hasValue($scope.existingPatientMainGridOptions.dataSource.data()[index].NoOfVisitsLeft)) {
                            if ($scope.existingPatientMainGridOptions.dataSource.data()[index].NumberofUnitsForThisVisit > $scope.existingPatientMainGridOptions.dataSource.data()[index].NoOfVisitsLeft) {
                                //ShowErrorMessage("Used for this visit must not be greater than Available.");
                                ShowErrorMessage("Auth. Used count for this visit must not be greater than Available Count.");
                                return false;

                            }
                        }

                        if (hasValue($scope.existingPatientMainGridOptions.dataSource.data()[index].MaxUnitsPerDay)) {
                            if ($scope.existingPatientMainGridOptions.dataSource.data()[index].NumberofUnitsForThisVisit > $scope.existingPatientMainGridOptions.dataSource.data()[index].MaxUnitsPerDay) {
                                //ShowErrorMessage("Used for this visit must not be greater than Available.");
                                ShowErrorMessage("Auth. Used count for this visit must not be greater than Max Units Per Day (" + $scope.existingPatientMainGridOptions.dataSource.data()[index].MaxUnitsPerDay + ").");
                                return false;
                            }
                        }

                        //GETTING THE GRID DATA INTO THE LIST WHICH IS USED AS INPUT FOR THE SERVICE.
                        // ----------------------    ASSIGNING THE VARIABLE BLOCK - START  ----------------------------
                        existingPatientApptRefAuthInfo.push({
                            Authorization_CurrentUsedUnits: $scope.existingPatientMainGridOptions.dataSource.data()[index].NumberofUnitsForThisVisit,
                            ReferalAuthID: $scope.existingPatientMainGridOptions.dataSource.data()[index].ReferalAuthID,
                            Referal_Authorization_ByProvider_Info_ID: $scope.existingPatientMainGridOptions.dataSource.data()[index].Referal_Authorization_ByProvider_Info_ID,
                            ReferalAuthAllowedCptCodesInfoID: $scope.existingPatientMainGridOptions.dataSource.data()[index].ReferalAuthAllowedCptCodesInfoID
                        });
                        // ----------------------    ASSIGNING THE VARIABLE BLOCK - END  ----------------------------

                        $scope.SelectedExistingPatApptReferralAuth = $scope.existingPatientMainGridOptions.dataSource.data()[index].AuthNo;

                    }
                }
            }

            if (existingPatientApptRefAuthInfo != null) {
                $scope.NewAppointmentSchedulerModel.RefAuthDetailInfo = existingPatientApptRefAuthInfo;
            }




            //when the date is not a valid date time
            //Placing this condition for the Error as The string was not recognized as a valid DateTime. There is an unknown word starting at index 0.
            //StartTime":"NaN/NaN/NaN 00:00 AM
            if (new Date($scope.NewAppointmentSchedulerModel.StartTime).toString().toLowerCase() == "Invalid Date".toLowerCase()) return;

            postData.StartTime = $scope.NewAppointmentSchedulerModel.StartTime;
            /// 1- ADD APPOINTMENT FOR PATEINT WINDOW
            /// 2- EDIT APPT WINDOW
            /// 3- FROM NON PATEINT ADD AND EDIT WINDOWS
            /// 4- RECURRING APPT WINDOW
            /// 5 - FROM ADD APPT FROM ENCOUNTER WINDOW
            postData.ValidateDependentVisitTypeNavigationFrom = 1;

            var billToCustomized = false;
            //checking referal Authorization Customized or not 
            if (hasValue($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList) && $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.length > 0) {
                $.grep($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList, function (item) {
                    //checking fro referela authorizations 
                    if (item.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.REFERRALAUTHORIZATION || item.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSREFERRALAUTHORIZATION) {
                        RefAuthrizationCustomized = true;
                    }
                    //checking for BILLL TO INSURANCE
                    if (item.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.BILLTOINSURANCE || item.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSBILLTOINSURANCE) {
                        billToCustomized = true;
                    }

                    ///ADDED BY HEMANTH ON JULY 26 2017 
                    //THIS TO CHECK THE VISIT TYPE FIELD IS CUSTOMIZED OR NOT 

                    if (item.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SELECTVISITTYPE || item.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSSELECTVISITTYPE) {
                        $scope.existingpatientAppointmentsVisitTypeFieldCustomized = true;
                    }

                });
            }
            //WHILE SAVING THE APPT END TIME EXCEED THE APPT START DATE THEN DISPLAYING THE CONFIRMATION THAT END TIME EXCEEDS THE START DATE. DO YOU WANT TO CONTINUE?
            //IF THE USER WANT TO CONTINUE THEN DURATION IS CHANGING TO GET THE END DATE SAME AS THE START DATE
            if (DateDiff.inDays(startDate, $scope.NewAppointmentSchedulerModel.AppointmentEndDate) > 0) {

                var confirmationMessage = "Appointment for a patient can not cross 12 midnight and can not span into next day. <br />Still do you want to Continue?";
                // Enter 'End time as " + $scope.NewAppointmentSchedulerModel.AppointmentEndDate + "' in comments.
                ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), confirmationMessage, 'md').then(function (result) {

                    if (result == "NO") {
                        return false;
                    }
                    else {
                        //END DATE IS NOT SAME AS START DATE THEN SENDING THE ACTUAL END DATE IN COMMENTS
                        if (hasValue($scope.NewAppointmentSchedulerModel.GenearalComments)) {
                            $scope.NewAppointmentSchedulerModel.GenearalComments += " - End time " + $scope.NewAppointmentSchedulerModel.AppointmentEndDate;
                        } else {
                            $scope.NewAppointmentSchedulerModel.GenearalComments = "End time " + $scope.NewAppointmentSchedulerModel.AppointmentEndDate;
                        }
                        //VARIABLE TO CACULATE THE DURATION WHICH IS LESS THAN THE USER SELECTED DURATION TO GET THE END DATE SAME AS START DATE
                        var tempDate = EndTimeCaluclatedDate + " 12:00 AM";
                        $scope.ChangedDuration = $scope.SelectedExistingPatApptDuration - parseInt(DateDiff.inMins($scope.NewAppointmentSchedulerModel.AppointmentEndDate, tempDate));
                        var endDateTime = new Date(startDate);
                        //DATE TIME WILL BE CONVERTED AS (1560272400000) FORMAT THEN IT WILL BE CONVERTED AS TIME AND DATE FORMAT 
                        EndTimeCaluclated = endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(($scope.ChangedDuration - 1) + ""));
                        EndTimeCaluclatedTime = $.format.date(new Date(EndTimeCaluclated), "hh:mm a");     // CONVERTD AS HOURS AND MINUTES FORMAT 
                        EndTimeCaluclatedDate = $.format.date(new Date(EndTimeCaluclated), "MM/dd/yyyy");  // CONVERTD AS MONTH DATE YEAR FORMAT 
                        $scope.NewAppointmentSchedulerModel.AppointmentEndDate = $scope.AppointmentDateInAddMode + " " + EndTimeCaluclatedTime;
                        $scope.NewAppointmentSchedulerModel.EndTime = EndTimeCaluclatedTime;   //  CALCULATED END TIME ASSIGNED TO THE VARIABLE 
                        //VARIABLE TO CACULATE THE DURATION WHICH IS LESS THAN THE USER SELECTED DURATION TO GET THE END DATE SAME AS START DATE
                        $scope.ChangedDuration = $scope.SelectedExistingPatApptDuration // - parseInt(DateDiff.inMins(tempDate, $scope.NewAppointmentSchedulerModel.AppointmentEndDate));


                        // if (griffithCenterForChildrenPractice && billToCustomized && !$scope.existingPatientAppointmentHealthPlanID && $scope.existingPatientAppointmentBillToInsuranceNames && !hideBilltoField) {
                        //     getInsuranceDetailsAndOpenConfiramtion(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                        // } else {
                        //     checkReferralValidationAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                        // }
                        showDurationConfirmationPopupAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink, billToCustomized);

                    }
                });
            } else {
                // if (griffithCenterForChildrenPractice && billToCustomized && !$scope.existingPatientAppointmentHealthPlanID && $scope.existingPatientAppointmentBillToInsuranceNames && !hideBilltoField) {
                //     getInsuranceDetailsAndOpenConfiramtion(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                // } else {
                //     checkReferralValidationAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                // }
                showDurationConfirmationPopupAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink, billToCustomized);

            }
        }

        //######### SAVE NEW APPOINTMENT FOR EXISTING PATIENT BLOCK END ##############

        function showDurationConfirmationPopupAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink, billToCustomized) {
            if (ShowConfirmationPopupIfDurationExceedsEightHours && parseInt($scope.SelectedExistingPatApptDuration) > 480) {
                const confirmationMessage = "You are about to schedule an appointment lasting over 8 hours. If this is correct, please click OK to proceed, or click Cancel to adjust the duration.";
                ModalPopupService.OpenPopup(
                    GetEMRPageURLByIndex(50), confirmationMessage,
                    'md'
                ).then(function (result) {
                    if (result == "NO") {
                        return false;
                    }

                    if (griffithCenterForChildrenPractice && billToCustomized && !$scope.existingPatientAppointmentHealthPlanID && $scope.existingPatientAppointmentBillToInsuranceNames && !$scope.hideBilltoField) {
                        getInsuranceDetailsAndOpenConfiramtion(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                    } else {
                        checkReferralValidationAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                    }
                });
            }
            else {
                if (griffithCenterForChildrenPractice && billToCustomized && !$scope.existingPatientAppointmentHealthPlanID && $scope.existingPatientAppointmentBillToInsuranceNames && !$scope.hideBilltoField) {
                    getInsuranceDetailsAndOpenConfiramtion(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                } else {
                    checkReferralValidationAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }
            }

        }


        function getInsuranceDetailsAndOpenConfiramtion(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            GiveNewAppointmentService.Insurance_GetPatientPoliciesInfo({ PatientID: _.get($scope.EMRDataFromPopup, "SelectedPatient[0].PatientID") }).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                if (serviceResponse && serviceResponse.length > 0) {
                    var confirmationMessage = `<label style="color:red;line-height: 2em;">Patient is having Active Policy for the selected DOS, <br/>Still do you want to continue with Bill To = ${$scope.existingPatientAppointmentBillToInsuranceNames} for this Visit?</label>`
                    ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), confirmationMessage, 'md').then(function (result) {
                        if (result == "NO") return;
                        checkReferralValidationAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink)
                    })
                } else {
                    checkReferralValidationAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink)
                }
            })
        }

        function checkReferralValidationAndProceed(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {
            //ADDED BY HEMANTH ON JULY 19 2017 
            // TO CHECK THE MANDATORY VALIDATIONS FOR THE REFERAL AUTHORIZATIONS BASED ON THE FIELDS CUSTOMIZATIONS AND INSURANCE SELECTION 
            //based on visibility of authorization adding we are checking validation
            if (RefAuthrizationCustomized && !hasValue($scope.NewAppointmentSchedulerModel.RefAuthDetailInfo)) {

                var dataToService = {
                    InsuranceID: $scope.existingPatientAppointmentBillToInsuranceID,
                    AppointmentDate: $scope.AppointmentDateInAddMode,
                    ReferalAuthMandatoryNavigationFrom: 5,  /// AUTHORIZATIONS MANDATORY SETTINGS LKP  5-- FOR SAVE APPT INFO 

                }

                //ADDED BY  PAVAN KUMAR KANDULA ON 23/05/2018 UNDER THE GUIDANCE OF AFROZ BASHA SHAIK START HERE
                if (hasValue($scope.NewAppointmentSchedulerModel) && hasValue($scope.NewAppointmentSchedulerModel.PhysicianID) && $scope.NewAppointmentSchedulerModel.PhysicianID > 0) {
                    dataToService.ProviderID = $scope.NewAppointmentSchedulerModel.PhysicianID;
                }
                //ADDED BY  PAVAN KUMAR KANDULA ON 23/05/2018 UNDER THE GUIDANCE OF AFROZ BASHA SHAIK END HERE

                var ExistingPatientApptProgAndServiceList = [];
                var ProgramServiceItem = {};

                if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesList) && $scope.existingPatientAppointmentProgramsProgramsServicesList.length > 0) {

                    angular.forEach($scope.existingPatientAppointmentProgramsProgramsServicesList, function (item) {
                        if (hasValue(item)) {
                            ProgramServiceItem = {};
                            ProgramServiceItem.ProgramID = item.GroupTherapyCategoryID;
                            ProgramServiceItem.ServiceID = item.GroupTherapyID;
                            ExistingPatientApptProgAndServiceList.push(ProgramServiceItem);
                        }
                    });
                }

                dataToService.LinkedProgramServiceModelList = ExistingPatientApptProgAndServiceList;

                //service call to check the validations 
                GiveNewAppointmentService.apptSchedulerCheckMandatoryValidationsforReferalAuthorization(dataToService).then(function (serviceResponce) {
                    if (isError(serviceResponce)) return false;
                    if (serviceResponce.RequestExecutionStatus == 1) {
                        $scope.existingPatientAppointmentShowConfirmationMessageForAuthorization(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder);
                    }
                    else if (serviceResponce.RequestExecutionStatus == 2) {
                        ShowErrorMessage("Please Select Referral Authorization.");
                        return;
                    }
                    // Override User Authentication
                    else if (serviceResponce.RequestExecutionStatus == 3 && hasValue(serviceResponce.BillingAuthNoMandatoryFieldLinkedID) && serviceResponce.BillingAuthNoMandatoryFieldLinkedID > 0
                        && hasValue(serviceResponce.IsLoggedUserCanOverride) && serviceResponce.IsLoggedUserCanOverride == false) { // 3 - Block with Override

                        var popupData = {
                            BillingAuthNoMandatoryFieldLinkedID: serviceResponce.BillingAuthNoMandatoryFieldLinkedID
                        };
                        ModalPopupService.OpenPopup(GetEMRPageURLByIndex(2853), popupData, 'modal-360px').then(function (result) {
                            if (hasValue(result) && result == 'cancel') return;

                            $scope.apptSchedulerValidateDependentVisitTypeandPHPtimeValidations(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                        });
                    }
                    else {
                        $scope.apptSchedulerValidateDependentVisitTypeandPHPtimeValidations(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                    }

                });
            }
            else {
                $scope.apptSchedulerValidateDependentVisitTypeandPHPtimeValidations(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }
        }

        //################### METHOD TO OPEN CONFIRMATION POPUP TO SELECT REF AUTH DETAILS BLOCK START #########################
        //*******PURPOSE: This method is used to open Confirmation popup to select ref auth details
        //*******CREATED BY:Afroz
        //*******CREATED DATE:10 24 2017
        $scope.existingPatientAppointmentShowConfirmationMessageForAuthorization = function (postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder) {
            // var confirmationMessage = "Selected Visit Type having Dependent Visit Type" + " '" + serviceResponse[0].DependentVisitTypeName + "' " + " <br />Still do you want to Continue?";
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), "Referral Authorization Details are not selected, <br />Still do you want to Continue?", 'md').then(function (result) {

                if (result == "NO") {
                    return false;
                }
                else {
                    $scope.apptSchedulerValidateDependentVisitTypeandPHPtimeValidations(postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder);
                }

            });
        }
        //################### METHOD TO OPEN CONFIRMATION POPUP TO SELECT REF AUTH DETAILS BLOCK ENDS #########################



        //################### SAVE NEW APPOINTMENT DETAILS  AFTER PHP VALIDATING THE DEPENDENT INFO BLOCK START #########################
        //*******PURPOSE: THIS METHOD IS USED FOR SAVE SAVE NEW APPOINTMENT DETAILS  AFTER PHP VALIDATING THE DEPENDENT INFO
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.apptSchedulerValidateDependentVisitTypeandPHPtimeValidations = function (postData, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            //IF THE VISIT  TYPE FIELD IS CUSTOMIZED THEN ONLY WE ARE SHOW THE CONFRIMATION RELATED TO DEPENDENT VIST TYEP AND PHP TIME VALIDATIONS 
            if ($scope.existingpatientAppointmentsVisitTypeFieldCustomized) {

                //if the setting is true the go for service call //added by teja n under guidence of srinivas sir 
                if (hasValue($scope.apptGetPHPVisitTypeValidation) && $scope.apptGetPHPVisitTypeValidation == true) {


                    //THIS IS USED TO CHECK THE IF THE DEPENDENT VISIT TYPE HAVING THE APPT BEFOR THE CURRENT TIME OTHER WISE SHOW THE CONFIRMATION
                    GiveNewAppointmentService.ApptSchedValidateDependentVisitTypeandPHPtimeValidations(postData).then(function (serviceResponse) {
                        if (isError(serviceResponse)) return false; //CHECKING THE SERVICE RESPONSE AFTER EXECUTING THE SERVICE

                        if (serviceResponse[0] != undefined && serviceResponse.length > 0) {

                            //FALSE -- FOR DEPENDETN VISIT TYPE NOT HAVING THE APPTS BEFORE THEN SHOWING THE CONFIRMATION
                            if (serviceResponse[0].isFromVisitTypeValidation == false) {
                                //show confirmation message

                                if (hasValue($("#ddlSelectVisitType").data("kendoDropDownList")))
                                    var VisitTypeName = $("#ddlSelectVisitType").data("kendoDropDownList").text();
                                if (hasValue(VisitTypeName)) {
                                    $scope.NewAppointmentSchedulerModel.AppointmentVisitTypeDesc = VisitTypeName;
                                }
                                var confirmationMessage = "The patient must have an appt with Visit type " + "'" + serviceResponse[0].DependentVisitTypeName + "'" + " in prior to the appt with Visit type " + "'" + VisitTypeName + "'" + "<br/><br/>" + "Still do you want to Continue?";
                                // var confirmationMessage = "Selected Visit Type having Dependent Visit Type" + " '" + serviceResponse[0].DependentVisitTypeName + "' " + " <br />Still do you want to Continue?";
                                ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), confirmationMessage, 'md').then(function (result) {

                                    if (result == "NO") {
                                        return false;
                                    }
                                    else {

                                        // PHP TIMES RELATED VALIDATIONS
                                        if (serviceResponse[0].isFromPHPTimeValidation == false) {
                                            //show confirmation message
                                            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), "Selected Appt. time is not exist in the Patient Day Program.<br />Still do you want to Continue?", 'md').then(function (result) {

                                                if (result == "NO") {
                                                    return false;
                                                }
                                                else {
                                                    //$scope.apptSchedulerView_SaveAppointmentsInformation(isSaveAndAddBillingInfo);
                                                    $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, false, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                                }

                                            });

                                        }

                                        else {
                                            //SAVE THE APPT DETAILS
                                            $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, false, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                        }
                                    }

                                });
                            }
                            // PHP TIMES RELATED VALIDATIONS
                            else if (serviceResponse[0].isFromPHPTimeValidation == false) {
                                //show confirmation message
                                ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), "Selected Appt. time is not same as in Patient Day Program.<br />Still do you want to Continue?", 'md').then(function (result) {

                                    if (result == "NO") {
                                        return false;
                                    }
                                    else {
                                        //$scope.apptSchedulerView_SaveAppointmentsInformation(isSaveAndAddBillingInfo);
                                        $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, false, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                    }

                                });

                            }

                            else {
                                //$scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, false, false);
                                //FOR CHECKING THE MAX SLOTS VALIDATION WHILE SAVING THE APPT
                                //IF THAT FLAG IS FALSE THEN THE MAX SLOTS VALIDATION IS NOT FIRED AT THE TIME OF SAVING THE APPT.
                                $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, true, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                            }
                        }
                    })

                } else {
                    //$scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, false, false);
                    //FOR CHECKING THE MAX SLOTS VALIDATION WHILE SAVING THE APPT
                    //IF THAT FLAG IS FALSE THEN THE MAX SLOTS VALIDATION IS NOT FIRED AT THE TIME OF SAVING THE APPT.
                    $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, true, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }
            }
            else {
                //$scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, false, false);
                //FOR CHECKING THE MAX SLOTS VALIDATION WHILE SAVING THE APPT
                //IF THAT FLAG IS FALSE THEN THE MAX SLOTS VALIDATION IS NOT FIRED AT THE TIME OF SAVING THE APPT.
                $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, false, true, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }

        };




        //################### SAVE NEW APPOINTMENT DETAILS  AFTER VALIDATING THE DEPENDENT VISIT TYPE AND PHP RELATED VALIDATIONS INFO BLOCK START #########################
        //*******PURPOSE: THIS METHOD IS USED FOR SAVE NEW APPOINTMENT DETAILS  AFTER VALIDATING THE DEPENDENT VISIT TYPE AND PHP RELATED VALIDATIONS INFO 
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

        $scope.apptScheduler_SaveAppointmentDetailsInfo = function (callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {
            //IF MULTIPLE APPTS CONFIRMATION CLICKS ON YES THE THIS FALG IS TRUE
            if (isHouseCallConfirmationRequired) {
                $scope.NewAppointmentSchedulerModel.IsHouseCallConfirmationRequired = isHouseCallConfirmationRequired;
            }

            //IF MULTIPLE APPTS CONFIRMATION CLICKS ON YES THE THIS FALG IS TRUE
            if (MultipleApptConfirmation) {
                $scope.NewAppointmentSchedulerModel.IsMultipleApptsConfirmationRequired = MultipleApptConfirmation;
            }


            if ($scope.SelectedExistingPatApptVisitType != undefined) {
                $scope.NewAppointmentSchedulerModel.VisitType = $scope.SelectedExistingPatApptVisitType;
            }
            else {
                if (hasValue($scope.ApptSchedView_GetApptsVisitTypeList) && $scope.ApptSchedView_GetApptsVisitTypeList.length > 0) {
                    angular.forEach($scope.ApptSchedView_GetApptsVisitTypeList, function (item) {

                        if (hasValue(item) && hasValue(item.IsDefaultVisitType) && item.IsDefaultVisitType == true) {
                            $scope.SelectedExistingPatApptVisitType = item.VisitTypeID;
                            $scope.SelectedExistingPatApptVisitTypeName = item.VisitType;
                        }

                    });

                    if ($scope.SelectedExistingPatApptVisitType == undefined || !hasValue($scope.SelectedExistingPatApptVisitType) || $scope.SelectedExistingPatApptVisitType <= 0) {
                        angular.forEach($scope.ApptSchedView_GetApptsVisitTypeList, function (item) {

                            if (hasValue(item) && hasValue(item.IsSystemDefined) && item.IsSystemDefined == true) {
                                $scope.SelectedExistingPatApptVisitType = item.VisitTypeID;
                                $scope.SelectedExistingPatApptVisitTypeName = item.VisitType;
                            }

                        });
                    }

                    if ($scope.SelectedExistingPatApptVisitType != undefined) {
                        $scope.NewAppointmentSchedulerModel.VisitType = $scope.SelectedExistingPatApptVisitType;
                    }

                }
            }

            if (!hasValue(ApptGivenForSameDaySameTimeWithDifferentProvider) || ApptGivenForSameDaySameTimeWithDifferentProvider == false) {
                $scope.NewAppointmentSchedulerModel.Confir_For_SamSlot_SamPat_DifPro = false;
            }
            else {
                $scope.NewAppointmentSchedulerModel.Confir_For_SamSlot_SamPat_DifPro = true;
            }

            GiveNewAppointmentService.ApptSchedView_ValidateApptInfoWhileSaveingorUpdating($scope.NewAppointmentSchedulerModel, callCenterSelectedPracticeModel, isSaveAndAddBillingInfo).then(function (serviceResponse) {
                //THIS IS COMMENTED BY HEMANTH ON APR 16 2K18 ( TO SHOW THE CONFIRMATION WHILE GIVING APPT IN NON SCHEDULE HOURS)
                //if (isError(serviceResponse)) return false; //CHECKING THE SERVICE RESPONSE AFTER EXECUTING THE SERVICE
                if (serviceResponse && serviceResponse.RequestExecutionStatus == -2 && serviceResponse.ResponseID == 4) {
                    showWarningorBlockMessageWhileSamePatientHavingMultipleApptsonSameDay(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink, serviceResponse.ErrorMessage);
                }
                else if (serviceResponse && serviceResponse.RequestExecutionStatus == -4 && serviceResponse.ErrorID == -4) {
                    openNarcoticConfirmationPopupAndRedoSameValdiationCall(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }
                //SHOW CONFIRMATION WHILE GIVING THE MORE THAN ONE APPOINTEMNT IN THE SAME SLOT FOR THE SAME USER
                //SHOW THE CONFIRMATIN WHILE GIVING THE NORMAL APPOINTEMENT IN HOUSE CALL TIMEINGS
                else if (serviceResponse != undefined && hasValue(serviceResponse) && serviceResponse.RequestExecutionStatus == -3 && (!isHouseCallConfirmationRequired || !MultipleApptConfirmation)) {
                    //$scope.NewAppointmentSchedulerModel.PatientID = "";
                    $scope.NewAppointmentSchedulerModel.FacilityID = "";

                    ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), serviceResponse.ErrorMessage + "<br /><br />Still do you want to Continue?", 'md').then(function (result) {

                        if (result == "NO") {
                            return false;
                        }
                        else {

                            /**
                             * @constant
                             * */
                            var APPOINTMENTSAVEBILLTOANDHEALTHPLANCONFIRMATION = 3;
                            //Check Response ID from the sp is equal to 3
                            //if Response is equal to 3 means Confirmation popup from validation to allow or Deny the Health Plan selected for the Program - Service
                            if (serviceResponse.ResponseID == APPOINTMENTSAVEBILLTOANDHEALTHPLANCONFIRMATION) {
                                //Assigning true to "doNotCheckHealthPlanCustomizationValidation"
                                //assigning true to not check the Validation  
                                //Validaton to allow or deny the health plan for the selected program - service
                                $scope.NewAppointmentSchedulerModel.doNotCheckHealthPlanCustomizationValidation = true;
                            }

                            GiveNewAppointmentService.providersApptsSchedInfoGetApptExistorNotAtSameTimeForPatientValidationList($scope.NewAppointmentSchedulerModel, callCenterSelectedPracticeModel).then(function (serviceResponse) {
                                if (isError(serviceResponse)) return false; //CHECKING THE SERVICE RESPONSE AFTER EXECUTING THE SERVICE

                                if (serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0] != undefined && serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo.length > 0) {

                                    var ApptsInfo;
                                    if (serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo.indexOf(EMRStringSeperator)) {
                                        ApptsInfo = serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo.replace(/¦/ig, "<br />");
                                    }
                                    else {
                                        ApptsInfo = serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo;
                                    }

                                    //show confirmation message
                                    ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), "The below Appointment(s) already given for the same time<br /><br />" + ApptsInfo + "<br /><br />Still do you want to Continue?", 'md').then(function (result) {
                                        //show confirmation message
                                        //ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), serviceResponse.ErrorMessage + "<br /><br />Still do you want to Continue?", 'md').then(function (result) {

                                        if (result == "NO") {
                                            return false;
                                        }
                                        else {

                                            //APPT GIVEN FOR SAME DAY SAME TIME WITH DIFFERENT PROVIDER
                                            if (hasValue(serviceResponse.ErrorMessage) && hasValue(serviceResponse.ResponseID) && serviceResponse.ResponseID == 1) {
                                                $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, true, true, true, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                            }
                                            else {

                                                //IF THE HOSUE CALL IS NOT SCHEDULED FOR THE SELECTED USER AND SLEECTED TIME THEN SHOW THE CONFIRMATION ONLY FOR THE MULTIPLE APPTS FOR THE SAME SLOTS
                                                if (hasValue(serviceResponse.ErrorMessage) && serviceResponse.ErrorMessage.indexOf("House Call") <= 0) {
                                                    $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, true, true, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                                }
                                                else {
                                                    //for first time isSaveAndAddBillingInfo
                                                    if (!isHouseCallConfirmationRequired && !MultipleApptConfirmation) {
                                                        //$scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, true, false, false);
                                                        //$scope.apptSchedulerView_SaveAppointmentsInformation(isSaveAndAddBillingInfo);
                                                        if ((_.get($scope, "NewAppointmentSchedulerModel.AppointmentLinkedResourceID") > 0) || (_.get($scope, "NewAppointmentSchedulerModel.AppointmentLinkedRoomID") > 0)) {
                                                            $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, true, true, false, isSendApptRemainder);
                                                        }//CHECKING FOR THE RESOURCE LINKED PROVIDER ID EXISTS THEN WE WILL CALL THE SAVE METHOD AGAIN TO GET THE APPTS VALIDATION
                                                        else if (hasValue($scope.NewAppointmentSchedulerModel) && hasValue($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID) && $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID > 0) {
                                                            $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, true, true, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                                        }
                                                        else {
                                                            $scope.apptSchedulerView_SaveAppointmentsInformation(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                                        }
                                                    }
                                                    else {
                                                        $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, true, true, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                                    }
                                                }
                                            }
                                        }

                                    });
                                } else {
                                    $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, true, true, false, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                }
                            });
                        }
                    });
                }
                //ADDED BY HEMANTH ON APR 14 2K18 
                //SHOW THE CONFIRMATION WHILE GIVING THE APPT OUTSIDE SCHEDULER GENERATED HOURS 
                else if (serviceResponse != undefined && hasValue(serviceResponse) && serviceResponse.RequestExecutionStatus == -2 && serviceResponse.ResponseID == 2) {
                    ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), serviceResponse.ErrorMessage + "<br /><br />Still do you want to Continue?", 'md').then(function (result) {
                        if (result == "NO") {
                            return false;
                        }
                        else {
                            $scope.NewAppointmentSchedulerModel.IsApptGivenOutsideScheduledHours = true;
                            $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                        }
                    })
                }
                //SHOW CONFIRMATION WHILE GIVING THE MORE THAN ONE APPOINTEMNT IN THE SAME SLOT FOR THE SAME USER
                else if (serviceResponse != undefined && hasValue(serviceResponse) && serviceResponse.RequestExecutionStatus != 0) {
                    ShowErrorMessage(serviceResponse.ErrorMessage);
                    //$("#existingPatientAppointmentSelectResource").focus();
                    if (serviceResponse.ErrorMessage == "Please select Enrolled Program(s).") {
                        $("#spanRecurringApptsProgramsServices").focus();
                    }
                    return;
                }
                else {
                    //CALLING THE SERVICE TO GET THE STATUS RELATED TO APPOINTMENT FOR THE SAME TIME GIVEN FOR THE PHYSICIAN IN THE SAME FACILITY OR OTHER FACILITY
                    $scope.NewAppointmentSchedulerModel.FacilityID = "";
                    GiveNewAppointmentService.providersApptsSchedInfoGetApptExistorNotAtSameTimeForPatientValidationList($scope.NewAppointmentSchedulerModel, callCenterSelectedPracticeModel).then(function (serviceResponse) {
                        if (isError(serviceResponse)) return false; //CHECKING THE SERVICE RESPONSE AFTER EXECUTING THE SERVICE

                        if (serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0] != undefined && serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo.length > 0) {

                            var ApptsInfo;
                            if (serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo.indexOf(EMRStringSeperator)) {
                                ApptsInfo = serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo.replace(/¦/ig, "<br />");
                            }
                            else {
                                ApptsInfo = serviceResponse.apptSchedAuthorizationDetailsOutputModelList[0].AppointmentValidationInfo;
                            }

                            //show confirmation message
                            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), "The below Appointment(s) already given for the same time<br /><br />" + ApptsInfo + "<br /><br />Still do you want to Continue?", 'md').then(function (result) {

                                if (result == "NO") {
                                    return false;
                                }
                                else {
                                    $scope.apptSchedulerView_SaveAppointmentsInformation(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                }

                            });
                        }
                        else {
                            $scope.apptSchedulerView_SaveAppointmentsInformation(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                        }
                    })

                }
            });

        }
        //SAVE NEW APPOINTMENT DETAILS  AFTER VALIDATING THE DEPENDENT VISIT TYPE AND PHP RELATED VALIDATIONS INFO BLOCK END

        function openNarcoticConfirmationPopupAndRedoSameValdiationCall(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(6596), {}, 'md').then(function (result) {
                if (result == "cancel") return;


                if (result.comment) {
                    if ($scope.NewAppointmentSchedulerModel.GenearalComments)
                        $scope.NewAppointmentSchedulerModel.GenearalComments = `${$scope.NewAppointmentSchedulerModel.GenearalComments}; ${result.comment}`;
                    else
                        $scope.NewAppointmentSchedulerModel.GenearalComments = result.comment;
                }
                $scope.NewAppointmentSchedulerModel.IsAppointmentWithin45DaysOfNarcoticValdiated = true;
                $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink)
            })
        }
        
        $scope.apptSchedulerView_SaveAppointmentsInformation = function (isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            if ($scope.addNewApptSelectResourceProvider == true) {
                if (!hasValue($scope.selectResourceProvider)) {
                    ShowErrorMessage(`Please ${$scope.existingPatientApptResourceRoomProviderLabelName}. `);
                    // ShowErrorMessage("Please Select Resource / Room Provider. ");
                    $("#spanSelectResourceProvider").focus();
                    return false;
                }
            }

            var existingPatientApptRefAuthInfo = [];


            if ($scope.IsPreAuthMandatoryBeforeGivingAppt == true && !hasValue($scope.SelectedExistingPatApptReferralAuth)) {
                //show confirmation message
                ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), "Pre Authorization not selected to Give Appointment.<br />Still do you want to Continue?", 'md').then(function (result) {

                    if (result == "NO") {
                        return false;
                    }
                    else if (result == "YES") {
                        $scope.IsPreAuthMandatoryBeforeGivingAppt = false;

                        //call save method again
                        $scope.ApptSchedView_SaveAppointmentsforExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink, isFromSaveAndScheduleGoogleMeet);
                    }
                });

                return false;
            }

            if ($scope.SelectedExistingPatApptDuration != undefined) {
                $scope.NewAppointmentSchedulerModel.Duration = $scope.SelectedExistingPatApptDuration;
            }

            if ($scope.SelectedExistingPatApptFacilities != undefined) {
                $scope.NewAppointmentSchedulerModel.FacilityID = $scope.SelectedExistingPatApptFacilities;
            }
            if ($scope.SelectedExistingPatApptEncounterType != undefined) {
                $scope.NewAppointmentSchedulerModel.C32EncounterTypeId = $scope.SelectedExistingPatApptEncounterType;
            }

            if ($scope.SelectedExistingPatApptVisitType != undefined) {
                $scope.NewAppointmentSchedulerModel.VisitType = $scope.SelectedExistingPatApptVisitType;
            }
            else {
                if (hasValue($scope.ApptSchedView_GetApptsVisitTypeList) && $scope.ApptSchedView_GetApptsVisitTypeList.length > 0) {
                    angular.forEach($scope.ApptSchedView_GetApptsVisitTypeList, function (item) {

                        if (hasValue(item) && hasValue(item.IsDefaultVisitType) && item.IsDefaultVisitType == true) {
                            $scope.SelectedExistingPatApptVisitType = item.VisitTypeID;
                            $scope.SelectedExistingPatApptVisitTypeName = item.VisitType;
                        }

                    });

                    if ($scope.SelectedExistingPatApptVisitType == undefined || !hasValue($scope.SelectedExistingPatApptVisitType) || $scope.SelectedExistingPatApptVisitType <= 0) {
                        angular.forEach($scope.ApptSchedView_GetApptsVisitTypeList, function (item) {

                            if (hasValue(item) && hasValue(item.IsSystemDefined) && item.IsSystemDefined == true) {
                                $scope.SelectedExistingPatApptVisitType = item.VisitTypeID;
                                $scope.SelectedExistingPatApptVisitTypeName = item.VisitType;
                            }

                        });
                    }

                    if ($scope.SelectedExistingPatApptVisitType != undefined) {
                        $scope.NewAppointmentSchedulerModel.VisitType = $scope.SelectedExistingPatApptVisitType;
                    }
                }
            }

            $scope.NewAppointmentSchedulerModel.WorkStationName = EMRClientSystemName;
            if ($scope.IsFinalValidation) {
                $scope.NewAppointmentSchedulerModel.IsConfirmationRequired = false;
            }
            else {
                $scope.NewAppointmentSchedulerModel.IsConfirmationRequired = true;
            }

            //Code inserted by Kranthi Kumar G on FEB 24 2016 to get CPT TO BILL info
            if (hasValue($scope.addAppointmentCPTToBill) && $scope.addAppointmentCPTToBill.length > 0) {
                $scope.NewAppointmentSchedulerModel.CPTToBill = $scope.addAppointmentCPTToBill;
            }


            $scope.NewAppointmentSchedulerModel.MedicationSideEffects = $scope.existingPatientMedicationSideEffects;

            $scope.NewAppointmentSchedulerModel.MedicationSideEffectsComments = $scope.existingPatientAppointmentSideEffectComment;
            $scope.NewAppointmentSchedulerModel.IsClientInsuranceVerifiedinpast30to60Days = $scope.IsClientInsuranceVerifiedinpast30to60Days > 0 ? parseInt($scope.IsClientInsuranceVerifiedinpast30to60Days) : 0;
            $scope.NewAppointmentSchedulerModel.ClientInsuranceVerifiedDate = $scope.ClientInsuranceVerifiedDate;
            $scope.NewAppointmentSchedulerModel.ClientInsuranceNotVerifiedComments = $scope.ClientInsuranceNotVerifiedComments;

            //var BillingNotRequired;
            //if ($scope.NewAppointmentSchedulerModel.BillingNotRequired == true) {
            //    BillingNotRequired = false;
            //}
            //else {
            //    BillingNotRequired = true;
            //}
            //$scope.NewAppointmentSchedulerModel.BillingNotRequired = BillingNotRequired;


            //IF THE SELECTED RESOURCE IS DEPENDENT THEN CHECK THE VALIDATION FOR RESOURCE PROVIDER OTHER WISE SAVE THE REMAINING DATA INTO DATABASE
            if ($scope.addNewApptSelectResourceProvider == true) {
                if (!hasValue($scope.selectResourceProvider)) {
                    ShowErrorMessage(`Please ${$scope.existingPatientApptResourceRoomProviderLabelName}. `);
                    $("#spanSelectResourceProvider").focus();
                    return false;
                }
                else {
                    EMRCommonFactory.SaveClientSideCodeLog("apptSchedulerView_SaveAppointmentsInformation - 3882", "ExistingPatientAppointmentsController", "", JSON.stringify($scope.NewAppointmentSchedulerModel));
                    //VALIDATE THE SELECTED PROVIDER HAS ALREADY APPOINTMENT AT THE SAME TIME THEN SHOW CONFIRMATION MESSAGE
                    GiveNewAppointmentService.appointmentSchedulerValidateAppointmentSchedulerGenerationForReferringProvider($scope.NewAppointmentSchedulerModel, callCenterSelectedPracticeModel).then(function (serviceResponse) {
                        if (isError(serviceResponse)) return false;
                        if (hasValue(serviceResponse)) {
                            if (!hasValue(serviceResponse.ErrorMessage) && serviceResponse.confirmationModelList == null) {
                                $scope.ExistingPatientAppt_SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                            }
                            else if (serviceResponse.confirmationModelList != null && hasValue(serviceResponse.confirmationModelList[0])) {


                                //CALLING THE APPOINTMENT SCHEDULER SETTINGS INFORMATION WHICH IS PLACED IN COMMON FACTORY
                                $scope.exisitingPateintApptSchedulerFieldsCustomizationInfoList = EMRCommonFactory.GetAppointmentSchedulerSettings();



                                ///ADDED BY HEMANTH ON 10/26/2016
                                //hiding portal block if no child fields are exists
                                if ($scope.exisitingPateintApptSchedulerFieldsCustomizationInfoList.filter(function (CheckinApptCustomizedFields) {
                                    //based on the show confirmation setting we are showing the confirmation fro resource prvider
                                    return ((CheckinApptCustomizedFields.AppointmentSettingFieldID == 5));
                                }).length == 0) {
                                    ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), serviceResponse.confirmationModelList[0].ConformationMessage, 'md').then(function (result) {
                                        if (result == "NO") {
                                            return false;
                                        }
                                        else if (result == "YES") {
                                            //$scope.ExistingPatientAppt_SaveApptForExistingPatient(isSaveAndAddBillingInfo);
                                            //ABOVE LINE COMMENTTED BY HEMANTH ON JULY 15 2017//
                                            // ADDED REFERAL AUTHORIZATIONS RELATED VALDIATIONS 
                                            $scope.existingpateintApptSaveAppointmentInformationAfterCheckingReferalAuthorizationValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                        }
                                    });

                                }
                                else {
                                    // $scope.ExistingPatientAppt_SaveApptForExistingPatient(isSaveAndAddBillingInfo);
                                    //ABOVE LINE COMMENTTED BY HEMANTH ON JULY 15 2017//
                                    // ADDED REFERAL AUTHORIZATIONS RELATED VALDIATIONS 
                                    $scope.existingpateintApptSaveAppointmentInformationAfterCheckingReferalAuthorizationValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                                }
                                ///BASED ON APPPT SCHEDUELR SETTINGS SHWO HIDE THE SECOND CONFIRMATION FOR RESOURCE PROVIDER


                            }
                            else {
                                if (hasValue(serviceResponse.ErrorMessage)) {
                                    ShowErrorMessage(serviceResponse.ErrorMessage);
                                    if (serviceResponse.ErrorMessage.toString().trim().length > 0 && serviceResponse.ErrorMessage.toString().trim().toLowerCase() == "linked provider appt. sheet is not generated for selected facility.") {
                                        $('#spanSelectResourceProvider').focus();
                                    }
                                    return false;
                                }
                            }
                        }
                    });
                }
            } else {
                //  $scope.ExistingPatientAppt_SaveApptForExistingPatient(isSaveAndAddBillingInfo);
                //ABOVE LINE COMMENTTED BY HEMANTH ON JULY 15 2017//
                // ADDED REFERAL AUTHORIZATIONS RELATED VALDIATIONS 
                $scope.existingpateintApptSaveAppointmentInformationAfterCheckingReferalAuthorizationValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }
        }







        $scope.existingpateintApptSaveAppointmentInformationAfterCheckingReferalAuthorizationValidations = function (isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            //CHECKING THE REFERAL AUTHORIZATION AND  SELECTED PROGRAM / SERVICES  VALIDATION 
            if (hasValue($scope.NewAppointmentSchedulerModel.RefAuthDetailInfo) && $scope.NewAppointmentSchedulerModel.RefAuthDetailInfo.length > 0 && hasValue($scope.selectedProgramServicesLinkedInfoID)) {
                var RefauthIDs = "";
                angular.forEach($scope.NewAppointmentSchedulerModel.RefAuthDetailInfo, function (authrization) {
                    if (!hasValue(RefauthIDs)) {
                        RefauthIDs = authrization.ReferalAuthID
                    }
                    else {
                        RefauthIDs += "," + authrization.ReferalAuthID;
                    }
                })

                var DataToservice = {};
                DataToservice.ReferalAuthIDs = String(RefauthIDs);
                DataToservice.ProgramsServicesLinkedInfoIDs = $scope.selectedProgramServicesLinkedInfoID;

                GiveNewAppointmentService.apptSchedulerValidateProgramServicesLinkedtoReferalAuthorization(DataToservice).then(function (serviceResponse) {
                    if (hasValue(serviceResponse) && serviceResponse.RequestExecutionStatus == -2) {
                        //show confirmation message
                        ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), "selected " + "'" + $scope.existingPatientAppointmentSelectProgramServiceTherapy + "'" + " is not linked to selected Authorization.<br />Still do you want to Continue?", 'md').then(function (result) {

                            if (result == "NO") {
                                return false;
                            }
                            else if (result == "YES") {
                                //call save method again
                                $scope.ExistingPatientAppt_SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                            }
                        });
                    }
                    else {
                        $scope.ExistingPatientAppt_SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                    }
                })
            }
            else {
                $scope.ExistingPatientAppt_SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }

        }



        //=========== SAVE EXISITNG PATIENT APPOINTMENT SERVICE CALL START =======================================================================================
        $scope.ExistingPatientAppt_SaveApptForExistingPatient = function (isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {
            var IsFromSaveandSendApptReminder = false;
            //BUILDING POST DATA OBJ TO PASS TO COMMON EHR VALIDATION SERVIE...
            var postDataToValidations = {
                EHRValidationInputModel: $scope.NewAppointmentSchedulerModel,
                EHRValidationsRulesApplyTypeENUMValue: EHRValidationsRulesApplyTypeENUM.APPOINTMENTDETAILS,
                EHRValidationRulesInMemoryDataFieldsList: $scope.appointmentDetailsDynamicFieldsAddEditPopupBuildEHRValidationInMemoryData($scope.NewAppointmentSchedulerModel),
                ehrValidationsCommonPopupHeader: 'Validation(s) to Save Appointment Details'
            };
            //the Perform Network CertificationValidation SETTING is true THE ONLY GO FOR SERVICE CALL
            //GET THE SETTINGS //added by teja n under guidence of srinivas sir //restrict the service calls based on settings
            //RESTRICT THE SERVICE CALL  BASED ON SETTING 

            if (hasValue($scope.PerformNetworkCertificationValidation) && $scope.PerformNetworkCertificationValidation == true) {
                //CALLING VALIDATION SERVICE...
                GiveNewAppointmentService.EHRValidationsPerformValidationsExecution(postDataToValidations).then(function (serviceResponseOfValidation) {

                    if (isError(serviceResponseOfValidation) || (hasValue(serviceResponseOfValidation) && serviceResponseOfValidation.RequestExecutionStatus == 1)) {
                        return false;
                    } else {
                        checkProgramServiceNadPatientBasedValidation(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                        //$scope.SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                    }
                });
            }
            else {
                checkProgramServiceNadPatientBasedValidation(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                // $scope.SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }
        };
        //=========== SAVE EXISITNG PATIENT APPOINTMENT SERVICE CALL END =======================================================================================


        function checkProgramServiceNadPatientBasedValidation(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink){
            if (!$scope.selectedProgramServicesLinkedInfoID) return $scope.SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            $scope.selectedProgramServicesLinkedInfoID = $scope.selectedProgramServicesLinkedInfoID.toString();
            var dataToService = {
                PatientID: $scope.NewAppointmentSchedulerModel.PatientID,
                AppointmentDates: [new Date($scope.NewAppointmentSchedulerModel.StartTime).getFormat("MM/dd/yyyy")],
                SelectProgramServicesLinkedInfoIDs: $scope.selectedProgramServicesLinkedInfoID.split(","),
                AppointmentType: 1 //1-one to one,2-recurring
            }

            GiveNewAppointmentService.ValidateAppointmentsRestrictedProgramServicesForOneApptPerOneDay(dataToService).then(function(serviceResponse){
                if(isError(serviceResponse)) return;

                $scope.SaveApptForExistingPatient(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);

            })
        }

        $scope.SaveApptForExistingPatient = async function (isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            var IsFromSaveandSendApptReminder = false;

            // Execute a function to check if the current appointment's program service are trigger customized
            // **IsTiggerCustomized** is set to true if the appointments program services are trigger customized
            // If IsTiggerCustomized is true this appointment record is inserted in CCSI table
            $scope.NewAppointmentSchedulerModel.IsTiggerCustomized = existingPatientApptIsTriggerCustomized();

            $scope.NewAppointmentSchedulerModel.PersonType = 2; //1 -- non patient, 2 -- patient, 3 -- event / organization

            //IF THE END DATE EXCEEDS TO NEXT DATE THEN REDUCING THE DURATION TO CURRENT DATE
            if (hasValue($scope.ChangedDuration)) {
                $scope.NewAppointmentSchedulerModel.Duration = $scope.ChangedDuration;
            }

            if ($scope.EMRDataFromPopup && $scope.EMRDataFromPopup.RequestingFromFormat == 1) {
                $scope.NewAppointmentSchedulerModel.isFromFormat1 = true
            }
            $scope.NewAppointmentSchedulerModel.IsAppointmentImportedFromPortal = (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "NewClientNewApptRequestFromPortal");
            if ([319, 467, 11111].includes(EMRPracticeModel.PracticeID) && $scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs && await ValidateWhileGivingMoreThanOneAppttoSamePatientwithSameProgramonSameDay()) return;
            if ([511].includes(EMRPracticeModel.PracticeID) && [5, 6, 8, 9, 43].includes($scope.NewAppointmentSchedulerModel.VisitType) && await checkVisitTypeValidationWhileGivingAppt()) return;
            GiveNewAppointmentService.ApptSchedView_SaveAppointmentsforExistingPatient($scope.NewAppointmentSchedulerModel, callCenterSelectedPracticeModel).then(function (serviceResponse) {

                if (isError(serviceResponse)) {
                    EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.AppointmentScheduler, "Appointment Scheduler", "Save Appointment Failure" + (_.get($scope.EMRDataFromPopup, "NavigationForApptAuditLog") || ""), EHRAuditLogStatus.Failure, EHRAuditLogActions.ADDITION, $scope.NewAppointmentSchedulerModel.PatientID, EMRPracticeModel.LoggedUserID);
                    return false;
                }

                //Verify Appointment ID and Send Remaider Settings Status. We required to Send Remaider if it's First Appointment for this Patient.
                //"isEWAPIFrmTlLogNotRequired" Variable to Maintain status for Patient have First Appoinment or Not. 
                //We need to Call the Send Remaider Based on Appt ID.
                //Checking Appointment ID and Send Remaider Settings Status.
                if (serviceResponse.isEWAPIFrmTlLogNotRequired == true && hasValue(serviceResponse.ResponseID) && serviceResponse.ResponseID > 0 && $scope.existingPatientAppointmentNeedToSendApptRemaiders == true && isSendApptRemainder == true) {
                    // Date Validation To Check Appointment Date & Time must be greater than Server Date & Time
                    if (DateDiff.inDaysWithTime($scope.NewAppointmentSchedulerModel.StartTime, adminGetCurrentDateAndTime()) < 0) {
                        //Service Call To Get Customers Appointment Preferences Information 
                        GiveNewAppointmentService.GetSchedulerAppointmentsPreferenceInformation($scope.NewAppointmentSchedulerModel).then(function (response) {
                            //If There Is An Error In Response Then Returning Back
                            if (isError(response))
                                return false;
                            //Checking Whether Response Has  Value  And Response List Having Data Or Not And Whether User Declined To Receive Message Or Not
                            if (hasValue(response) && hasValue(response.ApptSchedulerPatientCommunicationPreferenceInformationList) && response.ApptSchedulerPatientCommunicationPreferenceInformationList.length > 0 && hasValue(response.ApptSchedulerPatientCommunicationPreferenceInformationList[0]) && !response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_DeclinedToReceiveMsgs && (response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_DeclinedToReceiveMsgs != undefined)) {
                                //CONDITION TO CHECK WHETHER USER SELECTED ANY ONE OF THE COMMUNICATION PREFERENCES
                                if (response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_Phone || response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_SMS || response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_EMail || response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_CellPhone) {
                                    //Function to Call For send Remaider Only If User Selected One Of The Communication Preferences
                                    $scope.appointmentSchedulerOpenSendRemainderPopup(serviceResponse.ResponseID);
                                }
                            }
                        });


                    }
                }

                if (serviceResponse != undefined && serviceResponse.RequestExecutionStatus != undefined && parseInt(serviceResponse.RequestExecutionStatus) == -3) {

                    $scope.ExistingPatientApptConfirmation = serviceResponse.confirmationModelList
                    $scope.ShowConfirmationMessage(0, isSaveAndAddBillingInfo, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }
                else {
                    // added by Akbar on 20/05/2020
                    PubSub.publish('oneToOneApptsRefresh', $scope.NewAppointmentSchedulerModel);

                    $scope.existingPatientApptSignalrRefresh(SelectedPatientID);//calling root scope function for signalr to refresh  the scheduler 
                    //CHECKING WHETHER THE RESOURCE LINKED PHYSICIANID IS GREATER THAN ZERO OR NOT
                    //IF IT GREATER THAN ZERO THEN SEND THE REQUEST TO THE SIGNALR TO REFRESH THE CORRESPONDING PHYSICIAN GRID REFRESH
                    if (hasValue($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID) && $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID > 0) {
                        $scope.existingPatientApptResourceProviderSignalrRefresh();
                    }
                    if ((hasValue($scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID) && $scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID > 0)) {
                        $scope.existingPatientApptResourceOrRoomSignalrRefresh($scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID);
                    }
                    if (_.get($scope.NewAppointmentSchedulerModel, 'AppointmentLinkedRoomID') > 0) {
                        $scope.existingPatientApptResourceOrRoomSignalrRefresh($scope.NewAppointmentSchedulerModel.AppointmentLinkedRoomID);
                    }

                    $scope.appointmentRemindersAutoRefresh(); //Auto Execute Easy form Reminders 

                    EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.AppointmentScheduler, "Appointment Scheduler", "Save Appointment Success" + (_.get($scope.EMRDataFromPopup, "NavigationForApptAuditLog") || ""), EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.NewAppointmentSchedulerModel.PatientID, EMRPracticeModel.LoggedUserID);

                    //######################################### DOCUMENT BILLING INFO BLOCK - START #########################################
                    //The following code inserted by KRANTHI KUMAR G ON JUNE 10 2016 to specify that open Double Dollar Window from the Parent Window after closing this (Add Appointment Window)
                    if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == true) {
                        //Open $$ Window
                        serviceResponse.DocBillingInfo = true;


                        //ADDED BY S.SUDHEER(06/16/2016).
                        //THIS IS USED TO MAINTIAN APPOINTMENT ID OF THE SELECTED SLOT
                        serviceResponse.AppointmentID = serviceResponse.ResponseID;


                        //PatientId
                        serviceResponse.PatientId = SelectedPatientID;
                        //Appointment DOS
                        serviceResponse.DOS = $scope.AppointmentDateInAddMode;
                    }
                    //######################################### DOCUMENT BILLING INFO BLOCK - START #########################################
                    //for remainder sending
                    else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == false) {
                        //Appointment DOS
                        serviceResponse.IsSendRemainder = true;
                        IsFromSaveandSendApptReminder = true;
                        sendAppointmentRemindertoAdditionalParticipants(serviceResponse.ResponseID);
                    }
                    //############################################ SAVE & PRINT PORTAL LOGINS STARTS ##########################################
                    else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == -1) {
                        GiveNewAppointmentService.patientChartServicePrintPortalLoginsInformation({
                            PatientID: $scope.NewAppointmentSchedulerModel.PatientID
                        });
                    }
                    //############################################ SAVE & PRINT PORTAL LOGINS ENDS ##########################################
                    //############################################## SAVE AND PRINT ALL FUTURE APPOINTMENTS INFORMATION START ####################################################
                    else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == -2) {
                        $scope.exisitingPatientSaveandPrintApptInformation(SelectedPatientID, $scope.NewAppointmentSchedulerModel);
                    }
                    //############################################## SAVE AND PRINT ALL FUTURE APPOINTMENT INFORMATIONS END ####################################################

                    //############################################## SAVE AND SEND VIDEO  REMINDER TO PATIENT AND PROVIDER  BLOCK  START ####################################################
                    else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == -3) {
                        var ProviderIDtoSendVideoMeeting = 0;
                        //IF APPT IS FOR PROVIDER 
                        if (SelectedResourceType == 1) {
                            ProviderIDtoSendVideoMeeting = SelectedPhysicianID;
                        }
                        //IS APPT FOR RESOURCE THEN WE WIL CONSIDER RESOURCE LINKED PHYSICIAN ID AS PROVIDER ID 
                        else {
                            if (hasValue($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID) && $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID > 0) {
                                ProviderIDtoSendVideoMeeting = $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID;
                            }
                        }

                        $scope.exisitingPatientSaveandSendVideoRemindertoPatientandProvider(SelectedPatientID, serviceResponse.ResponseID, ProviderIDtoSendVideoMeeting);
                    }
                    //############################################## SAVE AND SEND VIDEO REMINDER TO PATEINT AND PROVIDER  END ####################################################

                    //ADDED BY PAVAN KUMAR KANDULA ON 07/06/2018 WHEN SAVE AND SEND APPT BUTTON IS CLICKED THEN NO NEED TO CHECK THE SETTING CONFIRMATION FIELD TO SEND APPT REMINDER (BECAUSE USER MANUALY WANT TO SEND APPT REMINDER AFTER SAVING)
                    if (hasValue(IsFromSaveandSendApptReminder) && IsFromSaveandSendApptReminder != true && isSaveAndAddBillingInfo != -3) {
                        //ADDED BY HEMANTH ON NOV 11 2017 
                        //SEND CONFIRMATION AFTER BOOKING APPOINTMENT TO THE CLIENT   BLOCK START 
                        if ($scope.ExistingPatientAppointmentColumnsCustomizationInfoList.filter(function (ExistingPatientAppointmentColumnsCustomizationFields) {
                            return ((ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == 122))
                        }).length > 0) {
                            //calling the service to get the appts details info to send confirmation 
                            $scope.existingPatientAppointmentsGetSelectedAppointmentDetailstoSendConfirmation(serviceResponse.ResponseID);

                            //callling the list to get the list of tempaltes information 
                            // $scope.existingPatientAppointmentsGetConfirmationTempatesList();
                        }
                        //SEND CONFIRMATION AFTER BOOKING APPOINTMENT TO THE CLIENT BLOCK END 
                    }


                    //  ########################################## SAVE EHR APPOINTMENT IN THIRD PARTY CALENDAR BLOCK START #############################################
                    // THIS BLOCK IS USED TO ADD APPOINTMENT IN THIRD PARTY CALENDAR (GOOGLE , IOD, YAHOOO ETC) WHEN EVER A NEW APPOINTMENT IS ADDED IN EHR.
                    // TO AUTO ADD APPOINTMENT IN ANY SPECIFIC THIRD PARTY CALENDAR, USER FIRST NEED TO AUTHENTICATE WITH THAT SPECIFIC THIRD PARTY API
                    // WE ARE GOING TO AUTO ADD APPOINTMENT FOR THE USERS THOSE WHO HAVE "ACTIVE" AUTHENTICATION STATUS FROM "DASHBOARD >> SETTINGS >> PERFORM AUTHENTICATION WITH GOOGLE / IOS CALENDAR" CUSTOMIZATION WINDOW
                    if (hasValue(SelectedUserAuthenticatedMailCalenderTypes)) {
                        existingPatientAppointmentAuthenticateToGoogleCalendar(serviceResponse);

                    }
                    //  ########################################## SAVE EHR APPOINTMENT IN THIRD PARTY CALENDAR BLOCK END   #############################################

                    ////  ########################################## SAVE EHR APPOINTMENT IN THIRD PARTY CALENDAR BLOCK END  #############################################

                    if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.isFromEncounterPopUp) && $scope.EMRDataFromPopup.isFromEncounterPopUp == true) {
                        serviceResponse.StartTime = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;
                        serviceResponse.PhysicianID = $scope.NewAppointmentSchedulerModel.PhysicianID;
                        serviceResponse.ResourceType = $scope.NewAppointmentSchedulerModel.ResourceType;
                        serviceResponse.PhysicianName = $scope.existingPatientAppointmentSelectedProviderorResource;
                        serviceResponse.Programs_Services_LinkedInfo_IDs = $scope.selectedProgramServicesLinkedInfoID;
                    }
                    if (isFromSaveAndZoomLink)
                        serviceResponse.scheduleTeleTherapyMeeting = true;

                    if (isFromSaveAndTeamLink)
                        GiveNewAppointmentService.openScheduleTeleTherapyMeetingTeamsPopup(serviceResponse, true);

                    $scope.OK(serviceResponse);
                    $scope.NewAppointmentSchedulerModel.AppointmentID = serviceResponse.ResponseID;
                    $scope.ExistingPatientAppointmentExecuteAutoUploadReminderRules($scope.NewAppointmentSchedulerModel);
                    //ADDED BY PHANI KUMAR M ON 31 ST MARCH 2018 
                    //WHEN PROGRAM SERVICES SELECTED THEN BASED ON SETTINGS AUTO CREATING SERVICES
                    //ADDED APPOINTID CONDITION ON 18 TH APRIL 2018
                    if (hasValue($scope.NewAppointmentSchedulerModel) && hasValue($scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs) && hasValue($scope.NewAppointmentSchedulerModel.AppointmentID) && $scope.NewAppointmentSchedulerModel.AppointmentID > 0) {
                        var AutoCreationData = {
                            NavigationFrom: 1,//Individual Appointments,
                            PatientIDs: $scope.NewAppointmentSchedulerModel.PatientID.toString(),
                            ServiceStartDateTime: $scope.NewAppointmentSchedulerModel.StartTime,
                            ProgramServiceLinkedInfoIDs: $scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs,
                            IdentityID: $scope.NewAppointmentSchedulerModel.AppointmentID
                        }
                        AutoAddServicestoProgramsGivenInApptWindowBasedonSettings(AutoCreationData);
                    }

                }

            });




        };

        //#################### METHOD TO BUILD IN MEMEORY DATA BLOCK START ######################
        //*******PURPOSE: THIS METHOD TO BUILD IN MEMEORY DATA 
        //*******CREATED BY: PAVAN KUMAR KANDULA
        //*******CREATED DATE: 7/12/2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ######################
        $scope.appointmentDetailsDynamicFieldsAddEditPopupBuildEHRValidationInMemoryData = function (PostData) {

            var inMemoryDataList = [];

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTPATIENTID,
                FieldType: 1,
                FieldValue: PostData.PatientID,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTSTARTDATETIME,
                FieldType: 1,
                FieldValue: PostData.StartTime,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTDURATION,
                FieldType: 1,
                FieldValue: PostData.Duration,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTPHYSICIANID,
                FieldType: 1,
                FieldValue: PostData.PhysicianID,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTPHYSICIANNAME,
                FieldType: 1,
                FieldValue: PostData.PhysicianName,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTFACILITYID,
                FieldType: 1,
                FieldValue: PostData.FacilityID,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTFACILITYNAME,
                FieldType: 1,
                FieldValue: PostData.FacilityName,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTENCOUNTERMODALITYID,
                FieldType: 1,
                FieldValue: PostData.AppointmentTypeID,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTENCOUNTERMODALITYDESC,
                FieldType: 1,
                FieldValue: PostData.AppointmentTypeDesc,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTVISITTYPEID,
                FieldType: 1,
                FieldValue: PostData.VisitType,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTVISITTYPEDESC,
                FieldType: 1,
                FieldValue: PostData.AppointmentVisitTypeDesc,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTPROGRAMSERVICELINKEDID,
                FieldType: 1,
                FieldValue: PostData.ApptProgramsServicesLinkingInfoIDs,
                GroupNumber: 1
            });

            PostData.ApptProgramsServicesLinkingName = $scope.existingPatientAppointmentProgramsProgramsServices;

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTPROGRAMSERVICELINKEDNAMES,
                FieldType: 1,
                FieldValue: PostData.ApptProgramsServicesLinkingName,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTEPISODEID,
                FieldType: 1,
                FieldValue: PostData.InPatCareLevelEventInfoID,
                GroupNumber: 1
            });

            PostData.EpisodeNumberDesc = $scope.OpenExistingPatientEpisodeNumber;

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTEPISODE,
                FieldType: 1,
                FieldValue: PostData.EpisodeNumberDesc,
                GroupNumber: 1
            });

            inMemoryDataList.push({
                FieldID: EHRReportFieldsModulesFieldsLKPENUM.APPTHEALTHPLANID,
                FieldType: 1,
                FieldValue: PostData.ApptLinkedHealthPlanID,
                GroupNumber: 1
            });
            return inMemoryDataList;
        }

        //#################### METHOD TO BUILD IN MEMEORY DATA BLOCK ENDS ######################



        $scope.ShowConfirmationMessage = function (confirmationIndex, isSaveAndAddBillingInfo, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            if ($scope.ExistingPatientApptConfirmation[confirmationIndex] == undefined) {
                //all the confirmations are succeeded
                $scope.NewAppointmentSchedulerModel.IsConfirmationRequired = false;
                //BUILDING POST DATA OBJ TO PASS TO COMMON EHR VALIDATION SERVIE...
                var postDataToValidations = {
                    EHRValidationInputModel: $scope.NewAppointmentSchedulerModel,
                    EHRValidationsRulesApplyTypeENUMValue: EHRValidationsRulesApplyTypeENUM.APPOINTMENTDETAILS,
                    EHRValidationRulesInMemoryDataFieldsList: $scope.appointmentDetailsDynamicFieldsAddEditPopupBuildEHRValidationInMemoryData($scope.NewAppointmentSchedulerModel),
                    ehrValidationsCommonPopupHeader: 'Validation(s) to Save Appointment Details'
                };

                //GET THE SETTINGS //added by teja n under guidence of srinivas sir //restrict the service calls based on settings
                //RESTRICT THE SERVICE CALL EHRValidationsPerformValidationsExecution BASED ON SETTING 
                if (hasValue($scope.PerformNetworkCertificationValidation) && $scope.PerformNetworkCertificationValidation == true) {
                    //CALLING VALIDATION SERVICE...
                    GiveNewAppointmentService.EHRValidationsPerformValidationsExecution(postDataToValidations).then(function (serviceResponseOfValidation) {

                        if (isError(serviceResponseOfValidation) || (hasValue(serviceResponseOfValidation) && serviceResponseOfValidation.RequestExecutionStatus == 1)) {
                            return false;
                        }
                        else {

                            // Execute a function to check if the current appointment's program service are trigger customized
                            // **IsTiggerCustomized** is set to true if the appointments program services are trigger customized
                            // If IsTiggerCustomized is true this appointment record is inserted in CCSI table
                            $scope.NewAppointmentSchedulerModel.IsTiggerCustomized = existingPatientApptIsTriggerCustomized();

                            $scope.NewAppointmentSchedulerModel.PersonType = 2; //1 -- non patient, 2 -- patient, 3 -- event / organization

                            //IF THE END DATE EXCEEDS TO NEXT DATE THEN REDUCING THE DURATION TO CURRENT DATE
                            if (hasValue($scope.ChangedDuration)) {
                                $scope.NewAppointmentSchedulerModel.Duration = $scope.ChangedDuration;
                            }

                            GiveNewAppointmentService.ApptSchedView_SaveAppointmentsforExistingPatient($scope.NewAppointmentSchedulerModel, callCenterSelectedPracticeModel).then(function (serviceResponse) {
                                if (isError(serviceResponse)) {
                                    EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.AppointmentScheduler, "Appointment Scheduler", "Save Appointment Failure" + (_.get($scope.EMRDataFromPopup, "NavigationForApptAuditLog") || ""), EHRAuditLogStatus.Failure, EHRAuditLogActions.ADDITION, $scope.NewAppointmentSchedulerModel.PatientID, EMRPracticeModel.LoggedUserID);
                                    return false
                                }
                                //Verify Appointment ID and Send Remaider Settings Status. We required to Send Remaider if it's First Appointment for this Patient.
                                //"isEWAPIFrmTlLogNotRequired" Variable to Maintain status for Patient have First Appoinment or Not. 
                                //We need to Call the Send Remaider Based on Appt ID.
                                //Checking Appointment ID and Send Remaider Settings Status.
                                if (serviceResponse.isEWAPIFrmTlLogNotRequired && hasValue(serviceResponse.ResponseID) && serviceResponse.ResponseID > 0 && $scope.existingPatientAppointmentNeedToSendApptRemaiders && $scope.existingPatientAppointmentIsSendApptRemainder) {
                                    // Date Validation To Check Appointment Date & Time must be greater than Server Date & Time
                                    if (DateDiff.inDaysWithTime($scope.NewAppointmentSchedulerModel.StartTime, adminGetCurrentDateAndTime()) < 0) {
                                        //Service Call To Get Customers Appointment Preferences Information 
                                        GiveNewAppointmentService.GetSchedulerAppointmentsPreferenceInformation($scope.NewAppointmentSchedulerModel).then(function (response) {
                                            //If There Is An Error In Response Then Returning Back
                                            if (isError(response))
                                                return false;
                                            //Checking Whether Response Has  Value  And Response List Having Data Or Not And Whether User Declined To Receive Message Or Not
                                            if (hasValue(response) && hasValue(response.ApptSchedulerPatientCommunicationPreferenceInformationList) && response.ApptSchedulerPatientCommunicationPreferenceInformationList.length > 0 && hasValue(response.ApptSchedulerPatientCommunicationPreferenceInformationList[0]) && !response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_DeclinedToReceiveMsgs && (response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_DeclinedToReceiveMsgs != undefined)) {
                                                //CONDITION TO CHECK WHETHER USER SELECTED ANY ONE OF THE COMMUNICATION PREFERENCES
                                                if (response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_Phone || response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_SMS || response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_EMail) {
                                                    //Function to Call For send Remaider Only If User Selected One Of The Communication Preferences
                                                    $scope.appointmentSchedulerOpenSendRemainderPopup(serviceResponse.ResponseID);
                                                }
                                            }
                                        });


                                    }
                                }
                                // added by Akbar on 20/05/2020
                                PubSub.publish('oneToOneApptsRefresh', $scope.NewAppointmentSchedulerModel);

                                $scope.existingPatientApptSignalrRefresh();//calling root scope function for signalr to refresh  the scheduler 
                                //CHECKING WHETHER THE RESOURCE LINKED PHYSICIANID IS GREATER THAN ZERO OR NOT
                                //IF IT GREATER THAN ZERO THEN SEND THE REQUEST TO THE SIGNALR TO REFRESH THE CORRESPONDING PHYSICIAN GRID REFRESH
                                if (hasValue($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID) && $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID > 0) {
                                    $scope.existingPatientApptResourceProviderSignalrRefresh();
                                }
                                if ((hasValue($scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID) && $scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID > 0)) {
                                    $scope.existingPatientApptResourceOrRoomSignalrRefresh($scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID);
                                }
                                if (_.get($scope.NewAppointmentSchedulerModel, 'AppointmentLinkedRoomID') > 0) {
                                    $scope.existingPatientApptResourceOrRoomSignalrRefresh($scope.NewAppointmentSchedulerModel.AppointmentLinkedRoomID);
                                }


                                $scope.appointmentRemindersAutoRefresh(); //Auto Execute Easy form Reminders 

                                //######################################### DOCUMENT BILLING INFO BLOCK - START #########################################
                                //The following code inserted by KRANTHI KUMAR G ON JUNE 10 2016 to specify that open Double Dollar Window from the Parent Window after closing this (Add Appointment Window)
                                if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == true) {
                                    //Open $$ Window
                                    serviceResponse.DocBillingInfo = true;
                                    //PatientId
                                    serviceResponse.PatientId = SelectedPatientID;

                                    //ADDED BY S.SUDHEER(06/16/2016).
                                    //THIS IS USED TO MAINTIAN APPOINTMENT ID OF THE SELECTED SLOT
                                    serviceResponse.AppointmentID = serviceResponse.ResponseID;

                                    //Appointment DOS
                                    serviceResponse.DOS = $scope.AppointmentDateInAddMode;
                                }
                                //######################################### DOCUMENT BILLING INFO BLOCK - START #########################################
                                //for remainder sending
                                else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == false) {
                                    //Appointment DOS
                                    serviceResponse.IsSendRemainder = true;
                                    sendAppointmentRemindertoAdditionalParticipants(serviceResponse.ResponseID);
                                }
                                //############################################ SAVE & PRINT PORTAL LOGINS STARTS ##########################################
                                else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == -1) {
                                    GiveNewAppointmentService.patientChartServicePrintPortalLoginsInformation({
                                        PatientID: $scope.NewAppointmentSchedulerModel.PatientID
                                    });
                                }
                                //############################################ SAVE & PRINT PORTAL LOGINS ENDS ##########################################
                                //############################################## SAVE AND PRINT ALL FUTURE APPOINTMENTS INFORMATION START ####################################################
                                else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == -2) {
                                    $scope.exisitingPatientSaveandPrintApptInformation(SelectedPatientID, $scope.NewAppointmentSchedulerModel);
                                }
                                //############################################## SAVE AND PRINT ALL FUTURE APPOINTMENTS INFORMATION END ####################################################

                                //  ########################################## SAVE EHR APPOINTMENT IN THIRD PARTY CALENDAR BLOCK START #############################################
                                // THIS BLOCK IS USED TO ADD APPOINTMENT IN THIRD PARTY CALENDAR (GOOGLE , IOD, YAHOOO ETC) WHEN EVER A NEW APPOINTMENT IS ADDED IN EHR.
                                // TO AUTO ADD APPOINTMENT IN ANY SPECIFIC THIRD PARTY CALENDAR, USER FIRST NEED TO AUTHENTICATE WITH THAT SPECIFIC THIRD PARTY API
                                // WE ARE GOING TO AUTO ADD APPOINTMENT FOR THE USERS THOSE WHO HAVE "ACTIVE" AUTHENTICATION STATUS FROM "DASHBOARD >> SETTINGS >> PERFORM AUTHENTICATION WITH GOOGLE / IOS CALENDAR" CUSTOMIZATION WINDOW
                                if (hasValue(SelectedUserAuthenticatedMailCalenderTypes)) {
                                    existingPatientAppointmentAuthenticateToGoogleCalendar(serviceResponse);
                                }
                                //  ########################################## SAVE EHR APPOINTMENT IN THIRD PARTY CALENDAR BLOCK END   #############################################

                                if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.isFromEncounterPopUp) && $scope.EMRDataFromPopup.isFromEncounterPopUp == true) {
                                    serviceResponse.StartTime = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;
                                    serviceResponse.PhysicianID = $scope.NewAppointmentSchedulerModel.PhysicianID;
                                    serviceResponse.ResourceType = $scope.NewAppointmentSchedulerModel.ResourceType;
                                    serviceResponse.PhysicianName = $scope.existingPatientAppointmentSelectedProviderorResource;
                                    serviceResponse.Programs_Services_LinkedInfo_IDs = $scope.selectedProgramServicesLinkedInfoID;
                                }
                                //isFromSaveAndZoomLink CONDITION 
                                if (isFromSaveAndZoomLink) {
                                    serviceResponse.scheduleTeleTherapyMeeting = true;
                                }

                                if (isFromSaveAndTeamLink)
                                    GiveNewAppointmentService.openScheduleTeleTherapyMeetingTeamsPopup(serviceResponse, true);

                                $scope.OK(serviceResponse);

                                EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.AppointmentScheduler, "Appointment Scheduler", "Save Appointment Success" + (_.get($scope.EMRDataFromPopup, "NavigationForApptAuditLog") || ""), EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.NewAppointmentSchedulerModel.PatientID, EMRPracticeModel.LoggedUserID);

                                $scope.NewAppointmentSchedulerModel.AppointmentID = serviceResponse.ResponseID;
                                $scope.ExistingPatientAppointmentExecuteAutoUploadReminderRules($scope.NewAppointmentSchedulerModel);

                                //ADDED BY PHANI KUMAR M ON 31 ST MARCH 2018 
                                //WHEN PROGRAM SERVICES SELECTED THEN BASED ON SETTINGS AUTO CREATING SERVICES
                                //ADDED APPOINTID CONDITION ON 18 TH APRIL 2018
                                if (hasValue($scope.NewAppointmentSchedulerModel) && hasValue($scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs) && hasValue($scope.NewAppointmentSchedulerModel.AppointmentID) && $scope.NewAppointmentSchedulerModel.AppointmentID > 0) {
                                    var AutoCreationData = {
                                        NavigationFrom: 1,//Individual Appointments,
                                        PatientIDs: $scope.NewAppointmentSchedulerModel.PatientID.toString(),
                                        ServiceStartDateTime: $scope.NewAppointmentSchedulerModel.StartTime,
                                        ProgramServiceLinkedInfoIDs: $scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs,
                                        IdentityID: $scope.NewAppointmentSchedulerModel.AppointmentID
                                    }
                                    AutoAddServicestoProgramsGivenInApptWindowBasedonSettings(AutoCreationData);
                                }
                            });

                        }
                    });
                }
                else {

                    // Execute a function to check if the current appointment's program service are trigger customized
                    // **IsTiggerCustomized** is set to true if the appointments program services are trigger customized
                    // If IsTiggerCustomized is true this appointment record is inserted in CCSI table
                    $scope.NewAppointmentSchedulerModel.IsTiggerCustomized = existingPatientApptIsTriggerCustomized();



                    $scope.NewAppointmentSchedulerModel.PersonType = 2; //1 -- non patient, 2 -- patient, 3 -- event / organization

                    //IF THE END DATE EXCEEDS TO NEXT DATE THEN REDUCING THE DURATION TO CURRENT DATE
                    if (hasValue($scope.ChangedDuration)) {
                        $scope.NewAppointmentSchedulerModel.Duration = $scope.ChangedDuration;
                    }

                    GiveNewAppointmentService.ApptSchedView_SaveAppointmentsforExistingPatient($scope.NewAppointmentSchedulerModel, callCenterSelectedPracticeModel).then(function (serviceResponse) {
                        if (isError(serviceResponse)) {
                            EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.AppointmentScheduler, "Appointment Scheduler", "Save Appointment Failure" + (_.get($scope.EMRDataFromPopup, "NavigationForApptAuditLog") || ""), EHRAuditLogStatus.Failure, EHRAuditLogActions.ADDITION, $scope.NewAppointmentSchedulerModel.PatientID, EMRPracticeModel.LoggedUserID);
                            return false
                        }
                        //Verify Appointment ID and Send Remaider Settings Status. We required to Send Remaider if it's First Appointment for this Patient.
                        //"isEWAPIFrmTlLogNotRequired" Variable to Maintain status for Patient have First Appoinment or Not. 
                        //We need to Call the Send Remaider Based on Appt ID.
                        //Checking Appointment ID and Send Remaider Settings Status.
                        if (serviceResponse.isEWAPIFrmTlLogNotRequired && hasValue(serviceResponse.ResponseID) && serviceResponse.ResponseID > 0 && $scope.existingPatientAppointmentNeedToSendApptRemaiders && $scope.existingPatientAppointmentIsSendApptRemainder) {
                            // Date Validation To Check Appointment Date & Time must be greater than Server Date & Time
                            if (DateDiff.inDaysWithTime($scope.NewAppointmentSchedulerModel.StartTime, adminGetCurrentDateAndTime()) < 0) {
                                //Service Call To Get Customers Appointment Preferences Information 
                                GiveNewAppointmentService.GetSchedulerAppointmentsPreferenceInformation($scope.NewAppointmentSchedulerModel).then(function (response) {
                                    //If There Is An Error In Response Then Returning Back
                                    if (isError(response))
                                        return false;
                                    //Checking Whether Response Has  Value  And Response List Having Data Or Not And Whether User Declined To Receive Message Or Not
                                    if (hasValue(response) && hasValue(response.ApptSchedulerPatientCommunicationPreferenceInformationList) && response.ApptSchedulerPatientCommunicationPreferenceInformationList.length > 0 && hasValue(response.ApptSchedulerPatientCommunicationPreferenceInformationList[0]) && !response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_DeclinedToReceiveMsgs && (response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_DeclinedToReceiveMsgs != undefined)) {
                                        //CONDITION TO CHECK WHETHER USER SELECTED ANY ONE OF THE COMMUNICATION PREFERENCES
                                        if (response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_Phone || response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_SMS || response.ApptSchedulerPatientCommunicationPreferenceInformationList[0].Pat_Comm_Preference_EMail) {
                                            //Function to Call For send Remaider Only If User Selected One Of The Communication Preferences
                                            $scope.appointmentSchedulerOpenSendRemainderPopup(serviceResponse.ResponseID);
                                        }
                                    }
                                });


                            }

                        }

                        // added by Akbar on 20/05/2020
                        PubSub.publish('oneToOneApptsRefresh', $scope.NewAppointmentSchedulerModel);

                        $scope.existingPatientApptSignalrRefresh();//calling root scope function for signalr to refresh  the scheduler 
                        //CHECKING WHETHER THE RESOURCE LINKED PHYSICIANID IS GREATER THAN ZERO OR NOT
                        //IF IT GREATER THAN ZERO THEN SEND THE REQUEST TO THE SIGNALR TO REFRESH THE CORRESPONDING PHYSICIAN GRID REFRESH
                        if (hasValue($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID) && $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID > 0) {
                            $scope.existingPatientApptResourceProviderSignalrRefresh();
                        }
                        if ((hasValue($scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID) && $scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID > 0)) {
                            $scope.existingPatientApptResourceOrRoomSignalrRefresh($scope.NewAppointmentSchedulerModel.AppointmentLinkedResourceID);
                        }
                        if (_.get($scope.NewAppointmentSchedulerModel, 'AppointmentLinkedRoomID') > 0) {
                            $scope.existingPatientApptResourceOrRoomSignalrRefresh($scope.NewAppointmentSchedulerModel.AppointmentLinkedRoomID);
                        }

                        $scope.appointmentRemindersAutoRefresh(); //Auto Execute Easy form Reminders 

                        //######################################### DOCUMENT BILLING INFO BLOCK - START #########################################
                        //The following code inserted by KRANTHI KUMAR G ON JUNE 10 2016 to specify that open Double Dollar Window from the Parent Window after closing this (Add Appointment Window)
                        if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == true) {
                            //Open $$ Window
                            serviceResponse.DocBillingInfo = true;
                            //PatientId
                            serviceResponse.PatientId = SelectedPatientID;

                            //ADDED BY S.SUDHEER(06/16/2016).
                            //THIS IS USED TO MAINTIAN APPOINTMENT ID OF THE SELECTED SLOT
                            serviceResponse.AppointmentID = serviceResponse.ResponseID;

                            //Appointment DOS
                            serviceResponse.DOS = $scope.AppointmentDateInAddMode;
                        }
                        //######################################### DOCUMENT BILLING INFO BLOCK - START #########################################
                        //for remainder sending
                        else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == false) {
                            //Appointment DOS
                            serviceResponse.IsSendRemainder = true;
                            sendAppointmentRemindertoAdditionalParticipants(serviceResponse.ResponseID);
                        }
                        //############################################ SAVE & PRINT PORTAL LOGINS STARTS ##########################################
                        else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == -1) {
                            GiveNewAppointmentService.patientChartServicePrintPortalLoginsInformation({
                                PatientID: $scope.NewAppointmentSchedulerModel.PatientID
                            });
                        }
                        //############################################ SAVE & PRINT PORTAL LOGINS ENDS ##########################################
                        //############################################## SAVE AND PRINT ALL FUTURE APPOINTMENTS INFORMATION START ####################################################
                        else if (hasValue(isSaveAndAddBillingInfo) && isSaveAndAddBillingInfo == -2) {
                            $scope.exisitingPatientSaveandPrintApptInformation(SelectedPatientID, $scope.NewAppointmentSchedulerModel);
                        }
                        //############################################## SAVE AND PRINT ALL FUTURE APPOINTMENTS INFORMATION END ####################################################

                        //  ########################################## SAVE EHR APPOINTMENT IN THIRD PARTY CALENDAR BLOCK START #############################################
                        // THIS BLOCK IS USED TO ADD APPOINTMENT IN THIRD PARTY CALENDAR (GOOGLE , IOD, YAHOOO ETC) WHEN EVER A NEW APPOINTMENT IS ADDED IN EHR.
                        // TO AUTO ADD APPOINTMENT IN ANY SPECIFIC THIRD PARTY CALENDAR, USER FIRST NEED TO AUTHENTICATE WITH THAT SPECIFIC THIRD PARTY API
                        // WE ARE GOING TO AUTO ADD APPOINTMENT FOR THE USERS THOSE WHO HAVE "ACTIVE" AUTHENTICATION STATUS FROM "DASHBOARD >> SETTINGS >> PERFORM AUTHENTICATION WITH GOOGLE / IOS CALENDAR" CUSTOMIZATION WINDOW
                        if (hasValue(SelectedUserAuthenticatedMailCalenderTypes)) {

                            existingPatientAppointmentAuthenticateToGoogleCalendar(serviceResponse);

                        }
                        //  ########################################## SAVE EHR APPOINTMENT IN THIRD PARTY CALENDAR BLOCK END   #############################################

                        if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.isFromEncounterPopUp) && $scope.EMRDataFromPopup.isFromEncounterPopUp == true) {
                            serviceResponse.StartTime = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;
                            serviceResponse.PhysicianID = $scope.NewAppointmentSchedulerModel.PhysicianID;
                            serviceResponse.ResourceType = $scope.NewAppointmentSchedulerModel.ResourceType;
                            serviceResponse.PhysicianName = $scope.existingPatientAppointmentSelectedProviderorResource;
                            serviceResponse.Programs_Services_LinkedInfo_IDs = $scope.selectedProgramServicesLinkedInfoID;
                        }

                        //IF CONDITION TO CHECK BUTTON CLICKED SAVE APPOINTMENT AND SCHEDULE ZOOM THERAPHY MEETING 
                        if (isFromSaveAndZoomLink) {
                            //PASSING AND OBHECT AS FLAG TO RETURN IN RESULT AFTER CLICK ON OK  IN THE APPT SCHEDULE POP UP
                            serviceResponse.scheduleTeleTherapyMeeting = true;
                        }
                        if (isFromSaveAndTeamLink)
                            GiveNewAppointmentService.openScheduleTeleTherapyMeetingTeamsPopup(serviceResponse, true);

                        $scope.OK(serviceResponse);

                        EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.AppointmentScheduler, "Appointment Scheduler", "Save Appointment Success" + (_.get($scope.EMRDataFromPopup, "NavigationForApptAuditLog") || ""), EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.NewAppointmentSchedulerModel.PatientID, EMRPracticeModel.LoggedUserID);

                        $scope.NewAppointmentSchedulerModel.AppointmentID = serviceResponse.ResponseID;
                        $scope.ExistingPatientAppointmentExecuteAutoUploadReminderRules($scope.NewAppointmentSchedulerModel);

                        //ADDED BY PHANI KUMAR M ON 31 ST MARCH 2018 
                        //WHEN PROGRAM SERVICES SELECTED THEN BASED ON SETTINGS AUTO CREATING SERVICES
                        //ADDED APPOINTID CONDITION ON 18 TH APRIL 2018
                        if (hasValue($scope.NewAppointmentSchedulerModel) && hasValue($scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs) && hasValue($scope.NewAppointmentSchedulerModel.AppointmentID) && $scope.NewAppointmentSchedulerModel.AppointmentID > 0) {
                            var AutoCreationData = {
                                NavigationFrom: 1,//Individual Appointments,
                                PatientIDs: $scope.NewAppointmentSchedulerModel.PatientID.toString(),
                                ServiceStartDateTime: $scope.NewAppointmentSchedulerModel.StartTime,
                                ProgramServiceLinkedInfoIDs: $scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs,
                                IdentityID: $scope.NewAppointmentSchedulerModel.AppointmentID
                            }
                            AutoAddServicestoProgramsGivenInApptWindowBasedonSettings(AutoCreationData);
                        }
                    });
                }
                return false;

            }

            var confirmationMessage;
            confirmationMessage = $scope.ExistingPatientApptConfirmation[confirmationIndex].ConformationMessage;
            confirmationIndex = confirmationIndex + 1;

            if (hasValue(confirmationMessage) && confirmationMessage == "^@^_FutureAppointAvailableAndCommPref_^@^") {

                if (!ExistingPatientSelectedData.isFromCallCenterEHR) {

                    //CHECKING THE SHOW FUTURE APPTS WINDOW OPTION IS ENABLED OR NOT IN THE SETTINGS WINDOW
                    if ($scope.ExistingPatientAppointmentColumnsCustomizationInfoList.filter(function (ExistingPatientAppointmentColumnsCustomizationFields) {
                        return ((ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SHOWFUTUREAPPTSWHILEGIVINGTHEAPPT) || (ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SHOWCOMMUNICATIONPREFERENCEWHILEGIVINGTHEAPPT));
                    }).length > 0) {

                        var apptSchedulerExistingPtApptDetails = {
                            SelectedPatientID: SelectedPatientID,
                            SelectedPhysicianID: SelectedPhysicianID,
                        };
                        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/279'*/GetEMRPageURLByIndex(279), apptSchedulerExistingPtApptDetails, 'modal-460px').then(function (result) {
                            if (hasValue(result)) {

                                $scope.NewAppointmentSchedulerModel.IsCommonPrefDetailsExist = result.dataExists;
                                $scope.NewAppointmentSchedulerModel.apptSchedulerSavePatientCommPrefeModel = result;

                                $scope.ShowConfirmationMessage(confirmationIndex, isSaveAndAddBillingInfo, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                            }
                            //$("#").focus();
                        });

                    }
                    else {
                        $scope.ShowConfirmationMessage(confirmationIndex, isSaveAndAddBillingInfo, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                    }
                }
                else {
                    $scope.ShowConfirmationMessage(confirmationIndex, isSaveAndAddBillingInfo, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }

            }
            else {
                var SizeOfConfirmationPopup = "md";

                if (confirmationMessage.toLowerCase().indexOf("scheduled group therapy session") >= 0) {
                    SizeOfConfirmationPopup = "md";
                }
                else if (confirmationMessage.toLowerCase().indexOf("the following policies are expired") >= 0) {
                    SizeOfConfirmationPopup = "modal-400px";
                }

                ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), confirmationMessage, SizeOfConfirmationPopup).then(function (result) {

                    if (result == "NO") {
                        return false;
                    }
                    else if (result == "YES") {
                        $scope.ShowConfirmationMessage(confirmationIndex, isSaveAndAddBillingInfo, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                    }
                });
            }


        }



        ///#############################  CHECK EXISTING APPT MANDATORY VALIDATIONS - BLOCK START #############################
        ///*******PURPOSE: USED TO CHECK CHECK EXISTING APPT MANDATORY VALIDATIONS
        ///*******CREATED BY: Lakshmi B
        ///*******CREATED DATE: 01/05/2017
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ******************
        $scope.existingPatientApptValidateMandatoryFieldsInfo = function (existingApptCustFieldType, displayName) {

            //41
            if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.APPTDURATION_INMIN) {
                if (!hasValue($scope.SelectedExistingPatApptDuration) || $scope.SelectedExistingPatApptDuration <= 0) {
                    ShowErrorMessage("Please Enter / Select " + $scope.SelectedApptDurationInMinAliasNameToShowWhileSaving + " .");
                    if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration))
                        $scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration.focus();
                    return false;
                }

                //if (hasValue($scope.SelectedExistingPatApptDuration) && $scope.SelectedExistingPatApptDuration < 5) {
                //    ShowErrorMessage("Duration must be greater than or equals to 5 Minutes.");
                //    if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration))
                //        $scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration.focus();
                //    return false;
                //}

                if ($scope.SelectedExistingPatApptDuration == " - Select Appointment Duration - ") {
                    ShowErrorMessage("Please Select " + $scope.SelectedApptDurationInMinAliasNameToShowWhileSaving + " .")
                    return false;
                }
                if ($scope.existingPatientAppointmentDurationChange()) return false;
            }
            //45
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.SELECTFACILITY) {

                ///validation for select facility
                if (!hasValue($scope.SelectedExistingPatApptFacilities)) {
                    ShowErrorMessage("Please Select " + $scope.SelectedFacilityAliasNameToShowWhileSaving + " .");
                    if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlAppointmentFacility))
                        $scope.existingPatientAppointmentWidgets.ddlAppointmentFacility.focus();
                    return false;
                }

                if ($scope.SelectedExistingPatApptFacilities == "null" || $scope.SelectedExistingPatApptFacilities == "0") {
                    ShowErrorMessage("Please Select Facility.")
                    return false;
                }
            }
            //40
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.APPTDATE) {

                var AddPatientApptStartdatePicker;
                //Get the selected date value from the date picker after clearing and selected the same date
                if (hasValue($("#txtPatientAppointmentDateInAddMode").data("kendoDatePicker")))
                    AddPatientApptStartdatePicker = $("#txtPatientAppointmentDateInAddMode").data("kendoDatePicker").value();
                if (hasValue(AddPatientApptStartdatePicker) && !hasValue($scope.AppointmentDateInAddMode)) {
                    $scope.AppointmentDateInAddMode = new Date(AddPatientApptStartdatePicker).getFormat("MM/dd/yyyy"); //Assigning the date value to the text box
                }

                var validator = $("#frmExistingAppts").data("kendoValidator");
                if (!validator.validate()) {
                    return false;
                }


                if (!hasValue($scope.AppointmentDateInAddMode)) {
                    ShowErrorMessage("Please Select " + $scope.SelectedApptDateAliasNameToShowWhileSaving + " .")
                    //$scope.editAppointmentSelectProviderFocus = true;
                    $scope.addAppointmentSelectAppointmentDate = true;
                    return false;
                }

                //Check valid date format
                if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) return;

            }
            //42
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.APPTTIME) {
                if (!hasValue($scope.AppointmentTimeInAddMode)) {
                    ShowErrorMessage("Please Select " + $scope.SelectedApptTimeAliasNameToShowWhileSaving + " .")
                    $scope.addAppointmentSelectAppointmentTime = true;
                    return false;
                }
            }
            //42
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.PROVIDER_USER_RESOURCE) {
                //if the provider or resource is not  selected then show the validation
                if (!hasValue($scope.NewAppointmentSchedulerModel.PhysicianID) || $scope.NewAppointmentSchedulerModel.PhysicianID == 0) {
                    ShowErrorMessage("Please Select " + $scope.SelectedProviderOrUserOrResourceAliasNameToShowWhileSaving + " .")
                    setTimeout(function () {
                        $("#existingPatientAppointmentSelectProvider").focus();
                    }, 200);
                    return false;
                }
            }
            //case 46 || 138:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.SELECTVISITTYPE || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSSELECTVISITTYPE) {

                //SHOW THE VISIT TYPE VALIDATION ONLY FOR THE FACE TO FACE AND VIDEO APPTS
                //if ($scope.NewAppointmentSchedulerModel.AppointmentTypeID == 1 || $scope.NewAppointmentSchedulerModel.AppointmentTypeID == visitTypeOptionName.VIDEOVISTITYPE) {
                if (hasValue($scope.SelectedVisitTypeAliasNameToShowWhileSaving) && (!hasValue($scope.SelectedExistingPatApptVisitType) || $scope.SelectedExistingPatApptVisitType <= 0)) {
                    ShowErrorMessage("Please select " + $scope.SelectedVisitTypeAliasNameToShowWhileSaving + " .");
                    if (hasValue($scope.existingPatientAppointmentWidgets.ddlSelectVisitType))
                        $scope.existingPatientAppointmentWidgets.ddlSelectVisitType.focus();
                    return false;
                }
                // }
            }
            //case 46 || 138:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.PROGRAMORSERVICE_THERAPYORACTIVITY || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSPROGRAMORSERVICE_THERAPYORACTIVITY) {

                if (!hasValue($scope.existingPatientAppointmentProgramsProgramsServices) || !hasValue($scope.existingPatientAppointmentProgramsProgramsServicesList) || $scope.existingPatientAppointmentProgramsProgramsServicesList.length <= 0) {
                    //$("#txtExistingPatientAppointmentProgramsProgramsServices").removeClass("form-control").addClass("form-control mandatoryCheck");
                    //$("#txtExistingPatientAppointmentProgramsProgramsServices").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    //ShowErrorMessage("Please Select Program / Service - Therapy / Activity.");
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectProgramServiceTherapy + ".");
                    $("#spanRecurringApptsProgramsServices").focus();
                    return false;

                }
            }
            //case 46 || 138:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.BILLTOINSURANCE || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSBILLTOINSURANCE) {

                if (!hasValue($scope.existingPatientAppointmentBillToInsuranceNames)) {
                    //$("#txtExistingPatientAppointmentBillTo").removeClass("form-control").addClass("form-control mandatoryCheck");
                    //$("#txtExistingPatientAppointmentBillTo").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    //ShowErrorMessage("Please Select Bill To.");
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectBillTo + ".");
                    $("#txtExistingPatientAppointmentBillTo").focus();
                    return false;

                }
            }

            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ADDITIONALPROVIDERPARTICIPANTS || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSADDITIONALPROVIDERPARTICIPANTS) {
                if (!hasValue($scope.existingPatientAppointmentAdditionalParticipants)) {
                    //$("#txtExistingPatientAppointmentAdditionalParticipants").removeClass("form-control").addClass("form-control mandatoryCheck");
                    //$("#txtExistingPatientAppointmentAdditionalParticipants").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    //ShowErrorMessage("Please Select Additional Provider Participants.");
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectAdditionalProvider + ".");
                    $("#existingPatientAppointmentAdditionalParticipants").focus();
                    return false;

                }
            }
            //case 8 ||126:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.RESOURCE || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSRESOURCEORROOM) {
                //if ($scope.NewAppointmentSchedulerModel.ResourceType == 1) {
                if ($scope.existingappointmentshowSelectResourceOrRoom && !hasValue($scope.existingPatientAppointmentSelectResource)) {
                    //$("#txtExistingPatientAppointmentSelectResource").removeClass("form-control").addClass("form-control mandatoryCheck");
                    //$("#txtExistingPatientAppointmentSelectResource").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    //ShowErrorMessage("Please Select Resource or Room.");
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectResourceRoom + ".");
                    $("#existingPatientAppointmentSelectResource").focus();
                    return false;

                }
                //}
            }
            //caase 270
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ROOM) {
                //if ($scope.NewAppointmentSchedulerModel.ResourceType == 1) {
                //If the Room field is Mandatpry then checking if the room field is shown and not have value then show validaiton
                if ($scope.existingappointmentshowSelectRoom && !hasValue($scope.existingPatientAppointmentSelectRoom)) {
                    ShowErrorMessage(`Please Select ${$scope.existingPatientAppointmentSelectRoomFieldName}.`);
                    $("#existingPatientAppointmentSelectRoom").focus();
                    return false;

                }
                //}
            }
            // case  9 || 127 :
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.REFERREDBY || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSREFERREDBY) {
                if (!hasValue($scope.SelectedExistingPatApptReferralMD)) {
                    //$("#txtExistingPatientReferralMD").removeClass("form-control").addClass("form-control mandatoryCheck");
                    //$("#txtExistingPatientReferralMD").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    //ShowErrorMessage("Please Select Referred By.");
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectReferredBy + ".");
                    $("#spanExistingPatientReferralMD").focus();
                    return false;
                }
            }
            // case 10 ||128:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ENCOUNTERTYPE || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSENCOUNTERTYPE) {
                if (parseInt($scope.SelectedExistingPatApptEncounterType) <= 0) {
                    //$("#ddlEncounterType").removeClass("").addClass("mandatoryCheck");
                    //$("#ddlEncounterType").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");.
                    //ShowErrorMessage("Please Select Encounter Type.");
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectEncounterType + ".");
                    $scope.existingPatientAppointmentWidgets.ddlSelectEncounterType.focus();
                    return false;

                }
            }
            //  case 13 || 130:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.MEDICATIONSIDEEFFECTS || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSMEDICATIONSIDEEFFECTS) {
                if (!hasValue($scope.existingPatientMedicationSideEffects) || $scope.existingPatientMedicationSideEffects <= 0) {
                    //$("#ddlExistingPatientMedicationSideEffects").removeClass("").addClass("mandatoryCheck");
                    //$("#ddlExistingPatientMedicationSideEffects").attr("ng-class", "SelectedExistingPatApptVisitTypeMandatoryCheckClass");
                    //ShowErrorMessage("Please Select Medication Side Effects.");
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectMedicationSideEffects + ".");
                    $scope.existingPatientMainGridWidgets.ddlExistingPatientMedicationSideEffectsInfo.focus();
                    return false;

                }
            }
            //case 36:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.APPOINTMENTCOMMENTSFROMDEMOGRAPHICS || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSAPPOINTMENTCOMMENTSFROMDEMOGRAPHICS) {
                //Mandatory Validation for Appointment Comment From Demographics
                if (!hasValue($scope.NewAppointmentSchedulerModel.AppointmentComments)) {
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectApptCmntFrmDemographics + ".");
                    $("#txtApptComments").focus();
                    return false;

                }
            }
            //case 37 || 132:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.EPISODE || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSEPISODE) {
                //Mandatory Validation for Episode

                if (!hasValue($scope.OpenExistingPatientEpisodeNumber)) {
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectEpisode + ".");
                    $("#txtExistingPatientEpisodeNumber").focus();
                    return false;

                }
            }
            //case 38 || 133:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.GENERALCOMMENTS || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSGENERALCOMMENTS) {
                //Mandatory Validation for General Comments
                if (!hasValue($scope.NewAppointmentSchedulerModel.GenearalComments)) {
                    ShowErrorMessage("Please Enter " + $scope.existingPatientAppointmentSelectGeneralComments + ".");
                    $("#txtGeneralComments").focus();
                    return false;
                }
            }
            // case 39 || 134:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.REASONFORAPPOINTMENT || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSREASONFORAPPOINTMENT) {
                //Mandatory Validation for Reason for Appointment

                if (!hasValue($scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit)) {
                    ShowErrorMessage("Please Select / Enter " + $scope.existingPatientAppointmentSelectReasonForAppt + ".");
                    $("#txtReasonforVisit").focus();
                    return false;

                }
            }
            //CASE 158 //ADDED BY PAVAN KUMAR KANDULA ON 21/03/2018 AS PER THE REQUEST OF KUMARA GARU
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.REASONFORVISIT) {
                //Mandatory Validation for Reason for Appointment

                if (!hasValue($scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes) || !hasValue($scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList) || $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList.length <= 0) {
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectReasonForVisit + ".");
                    $("#txtReasonforVisitName").focus();
                    return false;

                }
            }
            //case 49 || 142:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ADDITIONALPARTICIPANTS || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSADDITIONALPARTICIPANTS) {
                //Mandatory Validation for Reason for Appointment
                if (!hasValue($scope.existingPatientselectedAdditionalParticipants)) {
                    ShowErrorMessage("Please Select " + $scope.existingPatientAppointmentSelectAdditionalParticipants + ".");
                    $("#spanSelectAdditionalParticipants").focus();
                    return false;

                }
            }
            //case 53 || 145:
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.BILLINGCOMMENTS || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSBILLINGCOMMENTS) {
                //Mandatory Validation for Billing Comments
                if (!hasValue($scope.NewAppointmentSchedulerModel.BillingComments)) {
                    ShowErrorMessage("Please Enter " + $scope.existingPatientAppointmentSelectBillingComments + ".");
                    $("#txtBillingComments").focus();
                    return false;
                }
            }
            //TRANSPORTATION COMMENTS 
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSTRANSPORTATIONCOMMENTS) {
                //Mandatory Validation for Billing Comments
                if (!hasValue($scope.NewAppointmentSchedulerModel.TransportationComments)) {
                    ShowErrorMessage("Please Enter " + $scope.existingPatientApptTransportaionCommentsShowWhileSaving + ".");
                    $("#txtExistingPatientAppointmentTransportationComments").focus();
                    return false;
                }
            }
            //ATTENDENTS INFO 
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSLINKTOATTENDANTGOINGWITHTHEPATIENT) {
                //Mandatory Validation for Billing Comments
                if (!hasValue($scope.NewAppointmentSchedulerModel.AttendentUserNames)) {
                    ShowErrorMessage("Please select " + $scope.existingPatientApptLinktoAttendentShowWhileSaving + ".");
                    $("#existingPatientAppointmentLinkToAttendantGoingWithThePatient").focus();
                    return false;
                }
            }
            //  DEDUCTIABLEAMOUNT: 214 -- added by chaitanya seemala
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.DEDUCTIABLEAMOUNT) {
                //Mandatory Validation for DEDUCTIABLE AMOUNT
                if (!hasValue($scope.NewAppointmentSchedulerModel.Deductible)) {
                    ShowErrorMessage("Please Enter " + $scope.existingPatientAppointmentSelectDeductiableAmount + ".");
                    $("#txtExistingPatientAppointmentBillToDudictible").focus();
                    return false;
                }
            }
            //case 262 zoom meeting link text field validation for mandatory
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ZOOMMEETINGLINKTEXTFIELD) {
                //Mandatory Validation for zoom lin text field
                if (!$scope.NewAppointmentSchedulerModel.ZoomMeetingLink) {
                    ShowErrorMessage("Please Enter " + $scope.existingPatientZoomLinkDisplayName + ".");
                    $("#taExistingPatientAppointmentZoomMeetingLink").focus();
                    return false;
                }
            }
            //case 263 phine number  text field validation for mandatory
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.PHONENUMBERTEXTFIELD) {
                //Mandatory Validation for phine number
                if (!$scope.NewAppointmentSchedulerModel.ApptLinkedPhoneNumber) {
                    ShowErrorMessage("Please Enter " + $scope.existingPatientPhoneNumberDisplayName + ".");
                    $("#txtExistingPatientAppointmentPhoneNumber").focus();
                    return false;
                }
            }
            //299 - sLIDING fEE
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.SLIDINGFEE) {
                //Mandatory Validation for Sliding Fee
                if (!$scope.NewAppointmentSchedulerModel.SlidingFee) {
                    ShowErrorMessage("Please Enter " + $scope.slidingFeeFieldDisplayName + ".");
                    angular.element("#txtExistingPatientAppointmentSlidingFee").focus();
                    return false;
                }
            }
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.PATIENTCATEGORYNAMEFROMDEMOGRAPHICS) {
                if (!$scope.NewAppointmentSchedulerModel.PatientCategoryName) {
                    ShowErrorMessage("Please Select " + $scope.PatientCategoryDisplayName + " From Demographics.");
                    angular.element("#txtExistingPatientApptPatientCateogryName").focus();
                    return false;

                }
            }
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ENCOUNTERMODALITY || existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSENCOUNTERMODALITY) {
                if (!parseInt($scope.NewAppointmentSchedulerModel.AppointmentTypeID) > 0) {
                    ShowErrorMessage("Please Select " + displayName + ".");
                    if (hasValue($scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo))
                        $scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo.focus();
                    return false;
                }
            }
            else if (existingApptCustFieldType == $scope.ExitingPatientApptCustomizedFields.CLIENTINSURANCEBEENVERIFIEDINPASTTHIRTYTOSIXTYDAYS) {
                if (!parseInt($scope.IsClientInsuranceVerifiedinpast30to60Days) > 0) {
                    ShowErrorMessage("Please Select " + displayName + ".");
                    $scope.existingPatientMainGridWidgets.ddlExistingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysInfo.focus();
                    return false;

                }
            }

            return true;
        }
        ///#############################  CHECK EXISTING APPT MANDATORY VALIDATIONS - BLOCK END #############################



        function sleep(milliseconds) {
            var start = new Date(adminGetCurrentDate()).getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date(adminGetCurrentDate()).getTime() - start) > milliseconds) {
                    break;
                }
            }
        }


        //################### GET REFERRAL SOURCE CATEGORIES LIST BLOCK START #########################
        //*******PURPOSE: This method used to Get the List of physician related appointment list
        //*******CREATED BY:  Lakshmi B
        //*******CREATED DATE: 07/11/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.openExistingPatientApptReferralMD = function () {
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/22'*/GetEMRPageURLByIndex(22), 'CallingDatafromExistingPatAppt', 'modal-1000px').then(function (result) {
                $("#spanExistingPatientReferralMD").focus();

                //if the result is Cancel then Return.
                if (result == "cancel") {
                    return;
                }

                if (hasValue(result)) {
                    if (hasValue(result.SelectedInfo)) {
                        ///if both last name and first name available
                        if (hasValue(result.SelectedInfo.LastName) && hasValue(result.SelectedInfo.FirstName)) {
                            $scope.ReferredByName = result.SelectedInfo.FirstName + ", " + result.SelectedInfo.LastName;
                        }//if only last name available
                        else if (hasValue(result.SelectedInfo.LastName)) {
                            $scope.ReferredByName = result.SelectedInfo.LastName;
                        }
                        // if only first name available
                        else {
                            $scope.ReferredByName = result.SelectedInfo.FirstName;
                        }
                    }
                    $scope.SelectedExistingPatApptReferralMD = "";
                    $scope.NewAppointmentSchedulerModel.ReferingProviderID = "";
                    //if (result.CatetoryID == 5) {

                    //    $scope.SelectedExistingPatApptReferralMD = result.SelectedInfo[0].lastName + ", " + result.SelectedInfo[0].firstName;

                    //}
                    //else {
                    //$scope.SelectedExistingPatApptReferralMD = result.SelectedInfo.FirstName + ", " + result.SelectedInfo.LastName;
                    $scope.SelectedExistingPatApptReferralMD = $scope.ReferredByName;

                    //   }
                    $scope.NewAppointmentSchedulerModel.ReferingProviderID = result.SelectedID;
                    $scope.SelectedExistingPatApptReferralMD = $scope.SelectedExistingPatApptReferralMD.replace(/, +$/, '');

                }
            });
        };
        //################### GET REFERRAL SOURCE CATEGORIES LIST BLOCK END #########################


        ////################### EDIT NEW APPOINTMENT FOR EXISTING PATIENT BLOCK START #########################
        ////*******PURPOSE: THIS METHOD IS USED FOR GET DATA OF THE APPOINTMENT GIVEN TO PATIENT FOR EDITING PURPOSE.
        ////*******CREATED BY: PRIYANKA G
        ////*******CREATED DATE: 07/18/2014
        ////*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //$scope.EditAppointmentSched = function () {
        //	AppointmentSchedulerService.EditAppointmentScheduler($scope.EditAppointmentModel.newappointmentschedulermodel, callCenterSelectedPracticeModel).then(function (serviceResponse) {
        //		if (isError(serviceResponse)) return false;

        //		$scope.Edit_AppointmentScheduler = serviceResponse;
        //	})
        //}
        ////################### EDIT NEW APPOINTMENT FOR EXISTING PATIENT BLOCK END #########################

        //################### CALL PRIOR AUTHORIZATION POPUP BLOCK START ##############################
        //*******PURPOSE: This method is used to get the existing prior authorization information for the patient, appointment and physician
        //*******CREATED BY: Lakshmi B
        //*******CREATED DATE: 10/15/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; **********************************
        $scope.openPriorAuthorization = function () {

            var SelectedDate = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;

            var SelectPriorAuth = {
                SelectedPatientID: SelectedPatientID,
                SelectedDate: SelectedDate,
                SelectedPhysicianID: SelectedPhysicianID,
                ResourceType: SelectedResourceType,
                DataToSendPopUp: "AuthOpenFromExistingPatAppt"
            };

            if (hasValue($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID) && $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID > 0) {
                SelectPriorAuth.SelectedPhysicianID = $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID;
            }

            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/57'*/GetEMRPageURLByIndex(57), SelectPriorAuth, 'vlg').then(function (result) {
                $("#spanExistingPatientReferralAuth").focus();
                if (hasValue(result) && result != "cancel") {
                    $scope.SelectedExistingPatApptReferralAuth = result.AuthNo;
                    $scope.NewAppointmentSchedulerModel.ReferalAuthID = result.ReferalAuthID;
                    $scope.ExistingPatientReferralAuthProviderId = result.PhysicianID;
                    //$scope.EditAppointmentModel.AuthNo = result.AuthNo;
                    //$scope.EditAppointmentModel.ReferalAuthID = result.ReferalAuthID;
                }
            });
        };
        //################### CALL REFERRAL SOURCE POPUP BLOCK END ##############################


        //################### CLEAR REFERRAL MD INFO BLOCK START ##############################
        //*******PURPOSE: This method is used to clear the referral md info
        //*******CREATED BY: Lakshmi B
        //*******CREATED DATE: 10/18/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; **********************************
        $scope.ClearReferralMD = function () {
            $scope.SelectedExistingPatApptReferralMD = "";
            $scope.NewAppointmentSchedulerModel.ReferingProviderID = 0;
        }
        //################### CLEAR REFERRAL MD INFO BLOCK END ##############################



        $scope.existingPatientApptWithOutClientChange = function () {
            if (!hasValue($scope.existingPatientselectedAdditionalParticipants)) {
                $scope.NewAppointmentSchedulerModel.ApptAdditionalParticipantsWithOutClient = false;
                return;
            }
        }



        //################### CLEAR REFERRAL AUTHORIZATION INFO BLOCK START ##############################
        //*******PURPOSE: This method is used to clear the referral Auth info
        //*******CREATED BY: Lakshmi B
        //*******CREATED DATE: 10/18/2014
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; **********************************
        $scope.ClearReferralAuthorizationDetails = function () {
            $scope.SelectedExistingPatApptReferralAuth = "";
            $scope.NewAppointmentSchedulerModel.ReferalAuthID = 0;
        }
        //################### CLEAR REFERRAL AUTHORIZATION INFO BLOCK END ##############################



        //################### OPEN VISIT TYPE POPUP BLOCK START #########################
        //*******PURPOSE: This method used to open visit type popup
        //*******CREATED BY: Lakshmi B
        //*******CREATED DATE: 03/07/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentSelectVisistTypePopup = function () {

            $scope.existingPatientApptVisitTypePopupPostData = {
            };
            $scope.existingPatientApptVisitTypePopupPostData.VisitType = $scope.VisitType;
            $scope.existingPatientApptVisitTypePopupPostData.SelectedPhysicianID = SelectedPhysicianID;
            $scope.existingPatientApptVisitTypePopupPostData.SelectedResourceType = SelectedResourceType;
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/316'*/GetEMRPageURLByIndex(316), $scope.existingPatientApptVisitTypePopupPostData, 'modal-440px').then(function (result) {
                $scope.existingPatientAppointmentWidgets.ddlSelectVisitType.focus();
                if (hasValue(result)) {
                    $scope.SelectedExistingPatApptVisitType = result.VisitTypeID;
                    $scope.ddlselectedVisitTypeItemVisitTypeName = result.VisitType;

                    if (isNeedToCheckVisitTypeChangeForShowingIsFirstMedicalVideoReviewed && result.VisitTypeID == 395) { //395 - New client psychiatric assessment-OP
                        $scope.showIFirstMedicalVideoReviewedDropDown = true;
                    } else {
                        $scope.showIFirstMedicalVideoReviewedDropDown = false;
                    }
                    //IF THE SELECTED VISIT TYPE IS HAVING THE FAMILY IN NAME THEN SHOW THE ATTENDING FAMILY MEMBERS IN THERAPY OPTION IS ENABLED
                    //if (hasValue($scope.ddlselectedVisitTypeItemVisitTypeName) && $scope.ddlselectedVisitTypeItemVisitTypeName.toLowerCase().indexOf("family") >= 0) {
                    //ABOVE LINE IS COMMNETED BY HEMANTH ON 7TH NOVEMBER 206
                    //SHOW THE FAMILY THERAPY BASED ON THE USED FOR TYPE FORM THE VISIT TYPE ADDING   //1- FOR FAMILY THERAPY 2-- HOUSE CALL
                    if (hasValue(result) && hasValue(result.ApptVisitTypeUsedFor) && result.ApptVisitTypeUsedFor == "1") {
                        $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow = true;
                        $timeout(function () {
                            $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                            //$scope.apply();

                        }, 100);
                    }
                    else {
                        $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow = false;
                        $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapy = "";
                        $scope.NewAppointmentSchedulerModel.PatientContactIDs = undefined;
                        $scope.ExistingPatientFamilyMembersAttendingTherapy = "";
                    }
                    if (!dontChangeDurationWhenVisitTypeChange && result.Duration > 0) {
                        $scope.SelectedExistingPatApptDuration = result.Duration;
                        //MAINTAIN THE SELECTED VISIT TYPE DURATION FOR THE VARIABLE TO STATE MAINTAIN THE DURATION IF THE PROVIDER CHANGE
                        $scope.PatientApptVisitTypeDurationInfo = result.Duration;
                    }
                    else {
                        //ADDED BY HEMANTH ON JUNE 22 2017 
                        //TO GET THE DEFAULT DURTAION WHEN THE SELECTED VISIT TYPE IS NOT HAVING THE APPT DURATION
                        if (_.get($scope.ApptSchedView_GetMinimumIntervalList, "[0].AppointmentDuration") > 0) {
                            if (!$scope.SelectedExistingPatApptDuration)
                                $scope.SelectedExistingPatApptDuration = $scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration;
                            //MAINTAIN THE SELECTED VISIT TYPE DURATION FOR THE VARIABLE TO STATE MAINTAIN THE DURATION IF THE PROVIDER CHANGE
                            $scope.PatientApptVisitTypeDurationInfo = 0;
                        }
                    }
                    //Changes done by bharath.gourisetti on 16thAug2021 as per qa(vamsi garu) requirement
                    //Based on practiceids populating referral use durationcount when selected visit type from popup
                    //if (EMRPracticeModel && [285, 267, 565, 999].includes(EMRPracticeModel.PracticeID))
                    //	autoPopulateauthcountFromDuration($scope.SelectedExistingPatApptDuration);


                    if (hasValue(result.CPTCodeDescription)) {
                        $scope.addAppointmentCPTToBill = result.CPTCodeDescription;
                    }
                    else {
                        $scope.addAppointmentCPTToBill = "";
                    }

                    var patientHomeFacilityExists = false;
                    // if (hasValue($scope.ddlselectedVisitTypeItemVisitTypeName) && $scope.ddlselectedVisitTypeItemVisitTypeName.toLowerCase().indexOf("house call") >= 0) {
                    //ABOVE LINE IS COMMNETED BY HEMANTH ON 7TH NOVEMBER 206
                    //SHOW THE PATIENT HOME FACILITY AS SELECTED   //1- FOR FAMILY THERAPY 2-- HOUSE CALL
                    if (hasValue(result) && hasValue(result.ApptVisitTypeUsedFor) && result.ApptVisitTypeUsedFor == "2") {
                        if (hasValue($scope.ApptSchedView_FacilitiesList) && $scope.ApptSchedView_FacilitiesList.length > 0) {
                            for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                                if (hasValue($scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode) && $scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode == "12" &&
                                    hasValue($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityDisplayName) && $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityDisplayName.toLowerCase().indexOf("patient home") >= 0) {
                                    $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                                    patientHomeFacilityExists = true;
                                    break;
                                }
                            }

                            if (patientHomeFacilityExists == false) {
                                for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                                    if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode == "12") {
                                        $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                                        break;
                                    }
                                }
                            }

                        }
                    }



                    //  $scope.SelectedExistingPatApptgetNearestDefaultDuration($scope.selectedVisitTypeDuration);
                }
            });

        }
        //################### OPEN VISIT TYPE POPUP BLOCK END #########################





        //################### EXISTING PATIENT APPOINTMENT BRIEF AND DETAIL VIEW BLOCK START #########################
        //*******PURPOSE: This method used to view deatil view and brief view 
        //*******CREATED BY: Lakshmi B
        //*******CREATED DATE: 04/13/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentBriefViewAndDetailViewClick = function () {
            if ($scope.existingPatientAppointmentBriefViewAndDetailViewClickEvent == true) {
                $("#spanExistingpatientBriefViewAndDetailView").removeClass("DetailIcon").addClass("BriefIcon");
                $scope.existingpatientBriefViewAndDetailViewTitle = "Brief View";

                $scope.existingPatientAppointmentsHeightClass = "ExistingPatientAppointmentsHeight PaddingWhenScrollClass";
                //$("#ddlEncounterType").focus();
                //$scope.existingPatientAppointmentEncounterTypeHideShow = true;
                $scope.existingPatientAppointmentBillThisVisitHideShow = true;
                //$scope.existingPatientAppointmentReferredByHideShow = true;


                if ($scope.addNewApptSelectResourceProvider == false && ExistingPatientSelectedData.SelectedResourceType == 2) {
                    $scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";

                }
                else {

                    $scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";

                }

                if ($scope.addNewApptSelectResourceProvider == false && $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow == true) {
                    //$scope.familyMembersAttendingTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";
                    //$scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";

                    $scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";

                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";
                }
                else {
                    $scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";
                }

                $scope.existingPatientAppointmentBillThisVisitAsNewPatinetHideShow = true;
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.showColumn("NoofVisistAllowed2");
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.showColumn("AuthNo");
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.showColumn("CountFrequencyDuration");
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.showColumn("CPTandDXCodes");


                $scope.existingPatientAppointmentBriefViewAndDetailViewClickEvent = false;

                //$timeout(function () {
                //    if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlSelectEncounterType))
                //        $scope.existingPatientAppointmentWidgets.ddlSelectEncounterType.focus();
                //}, 200)
                if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo))
                    $scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo.focus();
            }

            else {

                if ($scope.addNewApptSelectResourceProvider == false && ExistingPatientSelectedData.SelectedResourceType == 2) {
                    $scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";

                }
                else {
                    $scope.existingApptsSelectProgramClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";

                }

                if ($scope.addNewApptSelectResourceProvider == false && $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow == true) {
                    //$scope.familyMembersAttendingTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";
                    //$scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";

                    $scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";
                }
                else {
                    $scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
                    $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";
                }
                $("#spanExistingpatientBriefViewAndDetailView").addClass("DetailIcon").removeClass("BriefIcon");
                $scope.existingpatientBriefViewAndDetailViewTitle = "Detail View";
                $scope.existingPatientAppointmentsHeightClass = "ExistingPatientAppointmentsHeight";
                $timeout(function () {
                    if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo))
                        $scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo.focus();
                }, 200);

                //$scope.existingPatientAppointmentEncounterTypeHideShow = false;
                //$scope.existingPatientAppointmentReferredByHideShow = false;

                //$("#ddlEncounterType").focus();
                $scope.existingPatientAppointmentBillThisVisitHideShow = false;
                $scope.existingPatientAppointmentBillThisVisitAsNewPatinetHideShow = false;
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.hideColumn("NoofVisistAllowed2");
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.hideColumn("AuthNo");
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.hideColumn("CountFrequencyDuration");
                $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.hideColumn("CPTandDXCodes");


                $scope.existingPatientAppointmentBriefViewAndDetailViewClickEvent = true;
            }

        }
        //################### EXISTING PATIENT APPOINTMENT BRIEF AND DETAIL VIEW BLOCK END #########################


        $scope.existingPatientAppointmentFacilitiesOptions = {
            dataBound: function () {
                //  $scope.ApptSchedView_GetMinimumInterval(true);
            },
            change: function () {
                //$scope.existingPatientAppointmentSelectResourceClear();
            },
        }


        $scope.existingPatientAppointmentChange = function () {
            $scope.ApptSchedView_GetMinimumInterval(true);
            //GET THE LINKED USERS LIST DURING THE HOUSE CALL TIMINGS
            $scope.existingPatientAppointmentsGetLinkedUserslistforHouseCall();
            if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                exisitingPatientApptReferralAuthorizationPopulateUsedField();
            //Added by Santhi for Task 2396
            //if (EMRPracticeModel && [285, 267, 565, 999].includes(EMRPracticeModel.PracticeID))
            //	autoPopulateauthcountFromDuration($scope.SelectedExistingPatApptDuration);

        }


        $scope.SelectedExistingPatApptVisitTypeChange = function () {

            var dropdownData = $scope.existingPatientAppointmentWidgets.ddlSelectVisitType;

            $scope.selectedVisitTypeItem = dropdownData.dataItem(dropdownData.select());

            if (hasValue($scope.selectedVisitTypeItem) && hasValue($scope.selectedVisitTypeItem.VisitType)) {
                $scope.ddlselectedVisitTypeItemVisitTypeName = $scope.selectedVisitTypeItem.VisitType;
            }


            if (!dontChangeDurationWhenVisitTypeChange && hasValue($scope.selectedVisitTypeItem) && hasValue($scope.selectedVisitTypeItem.Duration) && $scope.selectedVisitTypeItem.Duration > 0) {
                //getting Nereast Duration.
                //  $scope.SelectedExistingPatApptgetNearestDefaultDuration($scope.selectedVisitTypeItem.Duration);
                $scope.SelectedExistingPatApptDuration = $scope.selectedVisitTypeItem.Duration;
                //MAINTAIN THE SELECTED VISIT TYPE DURATION FOR THE VARIABLE TO STATE MAINTAIN THE DURATION IF THE PROVIDER CHANGE
                $scope.PatientApptVisitTypeDurationInfo = $scope.selectedVisitTypeItem.Duration;
            }
            else {
                //ADDED BY HEMANTH ON JUNE 22 2017 
                //TO GET THE DEFAULT DURTAION WHEN THE SELECTED VISIT TYPE IS NOT HAVING THE APPT DURATION
                if (_.get($scope.ApptSchedView_GetMinimumIntervalList, "[0].AppointmentDuration") > 0) {
                    if (!$scope.SelectedExistingPatApptDuration)
                        $scope.SelectedExistingPatApptDuration = $scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration;
                    //MAINTAIN THE SELECTED VISIT TYPE DURATION FOR THE VARIABLE TO STATE MAINTAIN THE DURATION IF THE PROVIDER CHANGE

                    $scope.PatientApptVisitTypeDurationInfo = 0;
                }
            }

            if (isNeedToCheckVisitTypeChangeForShowingIsFirstMedicalVideoReviewed && $scope.selectedVisitTypeItem.VisitTypeID == 395) { //395 - New client psychiatric assessment-OP
                $scope.showIFirstMedicalVideoReviewedDropDown = true;
            } else {
                $scope.showIFirstMedicalVideoReviewedDropDown = false;
            }

            if (hasValue($scope.selectedVisitTypeItem) && hasValue($scope.selectedVisitTypeItem.CPTCodeDescription)) {
                $scope.addAppointmentCPTToBill = $scope.selectedVisitTypeItem.CPTCodeDescription;
            }
            else {
                $scope.addAppointmentCPTToBill = "";
            }
            $timeout(function () {

                //$scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration.focus();
                if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlSelectVisitType))
                    $scope.existingPatientAppointmentWidgets.ddlSelectVisitType.focus();
            }, 500)

            //IF THE SELECTED VISIT TYPE IS HAVING THE FAMILY IN NAME THEN SHOW THE ATTENDING FAMILY MEMBERS IN THERAPY OPTION IS ENABLED
            //if (hasValue($scope.ddlselectedVisitTypeItemVisitTypeName) && $scope.ddlselectedVisitTypeItemVisitTypeName.toLowerCase().indexOf("family") >= 0) {
            //ABOVE LINE IS COMMNETED BY HEMANTH ON 7TH NOVEMBER 206
            //SHOW THE FAMILY THERAPY BASED ON THE USED FOR TYPE FORM THE VISIT TYPE ADDING   //1- FOR FAMILY THERAPY 2-- HOUSE CALL
            if (hasValue($scope.selectedVisitTypeItem) && hasValue($scope.selectedVisitTypeItem.ApptVisitTypeUsedFor) && $scope.selectedVisitTypeItem.ApptVisitTypeUsedFor == "1") {
                $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow = true;
                $timeout(function () {
                    $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                    //$scope.apply();

                }, 100);
            }
            else {
                $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow = false;
                $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapy = "";
                $scope.NewAppointmentSchedulerModel.PatientContactIDs = undefined;
                $scope.ExistingPatientFamilyMembersAttendingTherapy = "";
            }

            if ($scope.addNewApptSelectResourceProvider == false && $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyShow == true) {
                //$scope.familyMembersAttendingTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";
                //$scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";
                $scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
                $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";

            }
            else {
                $scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
                $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-6 col-xs-12";
            }


            //if ($scope.addNewApptSelectResourceProvider = false) {

            //     if ($scope.SelectedExistingPatApptVisitType == 1093) {
            //      $scope.familyMembersAttendingTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";
            //      $scope.existingApptsSelectTherapyWidthClass = "col-md-6 colReq-sm-12 col-xs-12";
            //   }
            //else {
            //$scope.familyMembersAttendingTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
            //$scope.existingApptsSelectTherapyWidthClass = "col-md-12 colReq-sm-12 col-xs-12";
            //}
            // }

            var patientHomeFacilityExists = false;
            //IF THE SELECTED VISIT TYPE IS HAVING THE FAMILY IN NAME THEN SHOW THE ATTENDING FAMILY MEMBERS IN THERAPY OPTION IS ENABLED
            // if (hasValue($scope.ddlselectedVisitTypeItemVisitTypeName) && $scope.ddlselectedVisitTypeItemVisitTypeName.toLowerCase().indexOf("house call") >= 0) {
            //ABOVE LINE IS COMMNETED BY HEMANTH ON 7TH NOVEMBER 206
            //SHOW THE PATIENT HOME FACILITY AS SELECTED   //1- FOR FAMILY THERAPY 2-- HOUSE CALL
            if (hasValue($scope.selectedVisitTypeItem) && hasValue($scope.selectedVisitTypeItem.ApptVisitTypeUsedFor) && $scope.selectedVisitTypeItem.ApptVisitTypeUsedFor == "2") {
                if (hasValue($scope.ApptSchedView_FacilitiesList) && $scope.ApptSchedView_FacilitiesList.length > 0) {
                    for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                        if (hasValue($scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode) && $scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode == "12" &&
                            hasValue($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityDisplayName) && $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityDisplayName.toLowerCase().indexOf("patient home") >= 0) {
                            $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                            patientHomeFacilityExists = true;
                            break;
                        }
                    }

                    if (patientHomeFacilityExists == false) {
                        for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                            if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].POSCode == "12") {
                                $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                                break;
                            }
                        }
                    }

                }
            }
            //Added by Santhi for Task 2396
            //if (EMRPracticeModel && [285, 267, 565, 999].includes(EMRPracticeModel.PracticeID))
            //	autoPopulateauthcountFromDuration($scope.SelectedExistingPatApptDuration);


        }


        //####################### TO OPEN POPUP BLOCK START ##################################
        //*******PURPOSE: This method used to open popup in existing patient appointment
        //*******CREATED BY: Bhavani T
        //*******CREATED DATE: 09/03/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

        $scope.selectResourceProviderPopupClick = function () {

            //passing the post data to open PopUP
            var physicianPopupInfo = {
                IsFromGiveApptforResource: true,
                ProviderResourceType: 1,//--1 for get Physicians and Non Physicians
                IsFromSelectResourceProvider: true,
            };



            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/73'*/GetEMRPageURLByIndex(1112), physicianPopupInfo, 'sm').then(function (result) {
                $("#spanSelectResourceProvider").focus();
                if (result == 'cancel') return false;
                if (hasValue(result)) {

                    if (hasValue($scope.ExistingPatientReferralAuthProviderId) && $scope.ExistingPatientReferralAuthProviderId > 0 &&
                        !(result[0].PhysicianId == $scope.ExistingPatientReferralAuthProviderId)) {
                        $scope.SelectedExistingPatApptReferralAuth = "";
                        $scope.NewAppointmentSchedulerModel.ReferalAuthID = 0;
                    }

                    $scope.selectResourceProvider = result[0].DoctorName;
                    $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID = result[0].PhysicianId;
                    $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianResourceype = result[0].ResourceType;
                    SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysician = result[0].AuthenticateCalenderTypes;
                    SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysicianEmailID = result[0].AuthenticateCalenderUserMailIDs;

                    //if the same user selected then remove from the participants
                    $scope.existingPatientAppointmentsRemoveselectedPhysicianorResfrmAdditionalParticipant($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID, $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianResourceype);
                }
            });
        }


        //####################### TO CLEAR THE SELECT PROVIDER VALUE FORM THE TEXT BOX START ##################################
        //*******PURPOSE: This method used to CLEAR THE SELECT PROVIDER VALUE FORM THE TEXT BOX ON CLICKING THE REMOVE BUTTON
        //*******CREATED BY: HEMANTH
        //*******CREATED DATE: 09/04/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ClearSelectResourceProviderDetails = function () {
            $scope.selectResourceProvider = "";
            $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID = 0;
            if (hasValue($scope.ExistingPatientReferralAuthProviderId) && $scope.ExistingPatientReferralAuthProviderId > 0) {
                $scope.SelectedExistingPatApptReferralAuth = "";
                $scope.NewAppointmentSchedulerModel.ReferalAuthID = 0;
            }
        }
        //####################### TO CLEAR THE SELECT PROVIDER VALUE FORM THE TEXT BOX END ##################################

        //####################### METHOD TO GET THE GREEN COLOR WHEN PATIENT HAVE REFERRAL AUTHORIZATION DETAILS##################################
        //*******PURPOSE: This METHOD TO GET THE GREEN COLOR WHEN PATIENT HAVE REFERRAL AUTHORIZATION DETAILS
        //*******CREATED BY: S.SUDHEER
        //*******CREATED DATE: 01/13/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentCheckPatientHaveReferralAuthDetails = function () {

            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) return;
            var PostData = {
                patientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                date: $scope.EMRDataFromPopup.SelectedDate
            }

            // AppointmentSchedulerService.ApptSchedView_GetRefAutheDetailsForPatient(PostData).then(function (serviceResponse) {
            GiveNewAppointmentService.ApptSchedView_GetAllRefAutheDetailsForPatient(PostData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                if (hasValue(serviceResponse) && serviceResponse.length > 0) {
                    $scope.authrizationDetailsInfoHideAuthInfo = true;
                    $("#ExistingPatientReferralAuthDetails").css("color", "green");
                    //var authUsedInfo = $.grep(serviceResponse, function (referralAuthInfo, Index) {
                    //    return (hasValue(referralAuthInfo.PreviouslyUsed) && referralAuthInfo.PreviouslyUsed > 0);
                    //});

                    if (hasValue(serviceResponse[0].AuthUsed) && serviceResponse[0].AuthUsed == true) {
                        $scope.showAuthDeductedInfo = true;
                    }
                }
            })
        };
        //####################### TO CLEAR THE SELECT PROVIDER VALUE FORM THE TEXT BOX END ##################################

        //################### GETS LIST OF AUTHORIZATION FOR THE VISIT BLOCK START #########################
        //*******PURPOSE: This method gets the list of prior autherization information for the patient, selected physician and selected date
        //*******CREATED BY:  S.SUDHEER
        //*******CREATED DATE: 01/18/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //needPgmLinkedauthInfo, Programservicelist, InsuranceID
        $scope.existingPatientAppointmentGetAuthorizationDetails = function () {
            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) return;
            var PostData = {
                patientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                date: $scope.EMRDataFromPopup.SelectedDate,
                DonotGetAuthCount: true,
            }



            GiveNewAppointmentService.ApptSchedView_GetAllRefAutheDetailsForPatient(PostData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;

                $scope.existingPatientMainGridOptions.dataSource.data(serviceResponse);
                if (hasValue($scope.existingPatientMainGridOptions.dataSource.data()) && $scope.existingPatientMainGridOptions.dataSource.data().length > 0) {
                    $scope.ExistingPatientAppointmentsShow = true;
                    if ($scope.IsReferralAuthorizationCustomized == true) {
                        $scope.ExistingPatientAppointmentDetailShow = true;
                    }
                    else {
                        $scope.ExistingPatientAppointmentDetailShow = false;
                    }

                    //var authUsedInfo = $.grep(serviceResponse, function (referralAuthInfo, Index) {
                    //    return (hasValue(referralAuthInfo.PreviouslyUsed) && referralAuthInfo.PreviouslyUsed > 0);
                    //});

                    if (hasValue(serviceResponse[0].AuthUsed) && serviceResponse[0].AuthUsed == true) {
                        $scope.showAuthDeductedInfo = true;
                    }
                }
                else {
                    $scope.ExistingPatientAppointmentsShow = false;
                    $scope.ExistingPatientAppointmentDetailShow = false;

                }
            })
            //}

            //AppointmentSchedulerService.ApptSchedView_GetRefAutheDetailsForPatient(PostData).then(function (serviceResponse) {


        };
        //######### GET LIST OF AUTHERIZATION FOR THE VISIT BLOCK END ##############

        //######### KENDO GRID OPTIONS BLOCK START ##############
        //*******PURPOSE: This method is used to bind options 
        //*******CREATED BY: Anusha CH
        //*******CREATED DATE: 01/19/2015
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

        $scope.existingPatientMainGridInfo = []

        $scope.existingPatientMainGridDataSource = new kendo.data.DataSource({
            data: $scope.existingPatientMainGridInfo,//assigning null on default
        });

        $scope.existingPatientMainGridOptions = {
            dataSource: $scope.existingPatientMainGridDataSource,
            sortable: true,
            navigatable: true,
            selectable: "single row",
            //  showCheckBoxColumn: true,
            columns: [

                {
                    field: "Use",
                    title: "Use",
                    width: 73,
                    template: "<div class='input-group'><span><input type='text' class='form-control' ng-model='dataItem.NumberofUnitsForThisVisit' ng-disabled='NumberofUnitsforTheVisitDisable' is-decimal style='border-bottom-right-radius: 4px;border-top-right-radius: 4px;border-top-left-radius:4px;border-bottom-left-radius:4px;height:20px;'/></span></div>"
                },

                {
                    field: "AuthorizationLinkedInsuranceName",
                    title: "Health Plan",
                    width: 134,
                    template: "<div title='#=AuthorizationLinkedInsuranceName#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=AuthorizationLinkedInsuranceName#</div>",
                },

                {
                    field: "VisitsLeftandExpDate",
                    title: "Remaining / Exp Date",
                    width: 159,
                    attributes: {
                        "class": "gridImageAlign"
                    },
                    template: "<div title='#=VisitsLeftandExpDate#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=VisitsLeftandExpDate#</div>",
                },
                {
                    field: "date",
                    title: "Re Auth. Request Date",
                    width: 170,
                    attributes: {
                        "class": "gridImageAlign"
                    },
                    hidden: true,
                },
                {
                    field: "ProviderName",
                    title: "Provider(s)",
                    width: 189,
                    template: "<div title='#=ProviderName#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=ProviderName#</div>",
                },
                {
                    field: "ServiceDescription",
                    title: "Program - Service",
                    width: 142,
                },
                {
                    field: "CPTandDXCodes",
                    title: "CPT - Dx Code(s)",
                    width: 152,
                    template: "<div title='#=CPTandDXCodes#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=CPTandDXCodes#</div>",
                    hidden: true,
                },
                {
                    field: "CountFrequencyDuration",
                    title: "COUNT / FREQ / DUR",
                    width: 230,
                    hidden: true,
                    //template: "<div title='#=COUNTFREQDUR#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=COUNTFREQDUR#</div>",
                },
                {
                    field: "Comments",
                    title: "Comments",
                    width: 190,
                    template: "<div title='#=Comments#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=Comments#</div>",
                },

                {
                    field: "NoofVisistAllowed2",
                    title: "Total Auth. Count",
                    width: 139,
                    template: "<div title='#=NoofVisistAllowed2#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=NoofVisistAllowed2#</div>",
                    hidden: true,
                },
                {
                    field: "AuthNo",
                    title: "Auth No",
                    width: 144,
                    template: "<div title='#=AuthNo#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=AuthNo#</div>",
                    hidden: true,

                },
                {
                    field: "",
                    title: "",
                },
            ]
        };


        //on dataBound event in the grid
        $scope.existingPatientMainGridOptions.dataBound = function (e) {
            kendoGridEmptyDataTemplate(this, '', '');
            var grid = e.sender;
            if (grid.dataSource.data().length > 0) {
                grid.table.attr("tabindex", 4428);
            }
            $timeout(function () {

                //$scope.checkInTimeReferralAuthorizationMainGridWidgets.grdCheckInTimeReferralAuthorizationMainGridInfo.hideColumn("NoofVisistAllowed2");
                //$scope.checkInTimeReferralAuthorizationMainGridWidgets.grdCheckInTimeReferralAuthorizationMainGridInfo.hideColumn("AuthNo");
                //$scope.checkInTimeReferralAuthorizationMainGridWidgets.grdCheckInTimeReferralAuthorizationMainGridInfo.hideColumn("CountFrequencyDuration");

                if ($scope.RefAuthDoNotShowUseColumn == true || [9999, 603, 467, 93].includes(EMRPracticeModel.PracticeID)) {
                    $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.hideColumn("Use");
                }

                if ([9999, 603, 467, 93, 624].includes(EMRPracticeModel.PracticeID)) {
                    $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.showColumn("date");
                }
                else {
                    $scope.existingPatientMainGridWidgets.grdExistingPatientInfo.hideColumn("date");
                }
            }, 300);
        };

        //######### OPEN POP UP FOR ADD NEW PRIOR AUTHORIZATION DETAILS  BLOCK START ##############
        $scope.referralAuthorizationPopupClick = function () {

            //Added by Shabbar Taj on 11/23/2020 for restricting users to add referral auth
            if (EMRCommonFactory.EMRCheckPermissions("BILLING-ADDREFERRALAUTHORIZATIONINFO") == EMRPermissionType.DENIED) {
                ShowErrorMessage(EmrPermissionShowingMessage);
                return false;
            }

            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) return;

            $scope.EMRDataToPopup = {
                patientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                PhysicianID: $scope.NewAppointmentSchedulerModel.PhysicianID,
                ResourceType: $scope.NewAppointmentSchedulerModel.ResourceType,
                DataFromTitle: "ReferralAuthFromEditAppt",
                GetSavedInfo: true,
            }

            ModalPopupService.OpenPopup(/*EMRApplicationPath + "Home/Index/58"*/GetEMRPageURLByIndex(58), $scope.EMRDataToPopup, 'lg').then(function (result) {
                $("#spanReferralAuthorizationAddIcon").focus();
                //if (hasValue(result) && hasValue(result[0])) {
                if (hasValue(result) && result.length > 0) {
                    $scope.ExistingPatientAppointmentsShow = true;
                    if ($scope.IsReferralAuthorizationCustomized == true) {
                        $scope.ExistingPatientAppointmentDetailShow = true;
                    }
                    else {
                        $scope.ExistingPatientAppointmentDetailShow = false;
                    }
                    var existingPatientChildGridData = $scope.existingPatientMainGridOptions.dataSource.data();

                    ////ADDING A NEW RECORD IN THE GRID
                    //existingPatientChildGridData.push({
                    //    "AuthorizationLinkedInsuranceName": result[0].AuthorizationLinkedInsuranceName, "VisitsLeftandExpDate": result[0].VisitsLeftandExpDate,
                    //    "ProviderName": result[0].ProviderName, "CPTandDXCodes": result[0].CPTandDXCodes, "AuthNo": result[0].AuthNo, "NoofVisistAllowed2": result[0].NoofVisistAllowed2, "Comments": result[0].Comments, "ReferalAuthID": result[0].ReferalAuthID, "NoOfVisitsLeft": result[0].NoOfVisitsLeft
                    //});
                    //if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
                    //	$scope.existingPatientAppointmentGetAuthorizationDetails(true, $scope.Programservicelist, $scope.existingPatientAppointmentHealthPlanID);
                    //}

                    //else {
                    for (var item = 0; item < result.length; item++) {
                        //ADDING A NEW RECORD IN THE GRID
                        existingPatientChildGridData.push({
                            "AuthorizationLinkedInsuranceName": result[item].AuthorizationLinkedInsuranceName, "VisitsLeftandExpDate": result[item].VisitsLeftandExpDate,
                            "ProviderName": result[item].ProviderName, "CPTandDXCodes": result[item].CPTandDXCodes, "AuthNo": result[item].AuthNo, "NoofVisistAllowed2": result[item].NoofVisistAllowed2, "Comments": result[item].Comments, "ReferalAuthID": result[item].ReferalAuthID, "NoOfVisitsLeft": result[item].NoOfVisitsLeft,
                            "ReferalAuthAllowedCptCodesInfoID": result[item].ReferalAuthAllowedCptCodesInfoID, "ServiceDescription": result[item].ProgramName,
                            "AuthorizationEndDate": result[item].AuthorizationEndDate
                        });

                    }

                    if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                        exisitingPatientApptReferralAuthorizationPopulateUsedField();

                    //REFRESHING THE GRID
                    $scope.existingPatientMainGridOptions.dataSource.data(existingPatientChildGridData);
                    //}



                }
            });
        }


        $scope.ExistingPatientAppointmentBillThisVisit = function () {
            $scope.NewAppointmentSchedulerModel.IsBillThisVisitAsNewPatient = false;
            if ($scope.NewAppointmentSchedulerModel.BillingNotRequired == true) {
                $scope.NumberofUnitsforTheVisitDisable = false;
            }
            else {
                $scope.NumberofUnitsforTheVisitDisable = true;
            }
        }

        //################### TO OPEN POPUP BLOCK START #########################
        //*******PURPOSE: This method is used to Select Reason for Visit
        //*******CREATED BY: ANUSHA CH
        //*******CREATED DATE:02/18/2016
        $scope.existingPatientReasonForVisitPopupClickEvent = function () {
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1048), null, 'md').then(function (result) {
            });
        }
        //################### TO OPEN POPUP BLOCK END #########################


        //*******PURPOSE:CLEAR CPT CODE TO BILL INFO BLOCK START  ********************//
        //*******CREATED BY: KRANTHI KUMAR G
        //*******CREATED DATE: FEB 24 2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.addAppointmentCPTToBillPopupClickClear = function () {
            $scope.addAppointmentCPTToBill = "";
            $("#spanAddAppointmentCPTToBillPopup").focus();
        }
        //*******PURPOSE:CLEAR CPT CODE TO BILL INFO BLOCK END  ********************//


        //*******PURPOSE:SELECT CPT CODE POPUP BLOCK START  ********************//
        //*******CREATED BY: KRANTHI KUMAR G
        //*******CREATED DATE: FEB 24 2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.addAppointmentCPTToBillPopupClick = function () {
            $scope.cptCodePostData = {
            };
            $scope.cptCodePostData.autoCloseOnSelection = true;
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(547), $scope.cptCodePostData, 'lg').then(function (result) {
                if (isError(result)) {
                    $("#spanAddAppointmentCPTToBillPopup").focus();
                    return false;
                }
                if (hasValue(result) && result.toString().trim().length > 0) {
                    //Assigning Billing Code
                    $scope.addAppointmentCPTToBill = result;
                }
                $("#spanAddAppointmentCPTToBillPopup").focus();
            });

        };
        //*******PURPOSE:SELECT CPT CODE POPUP BLOCK END  ********************//

        ////*******PURPOSE:ASSIGNING OPTIONS FOR APPOINTMENT DURATION DROPDOWN BLOCK START  ********************//
        ////*******CREATED BY: ANUSHA CH
        ////*******CREATED DATE: MARCH 15 2016
        ////*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

        ////dataSource
        //$scope.ApptSchedView_GetMinimumIntervalList = new kendo.data.DataSource({
        //    data: [],//assigning the null on default

        //});
        ////options
        //$scope.selectedExistingPatApptDurationOptions = {
        //    dataSource: $scope.ApptSchedView_GetMinimumIntervalList,
        //    dataTextField: "AppointmentDuration",
        //    dataValueField: "DurationValue",

        //    //placeholder:"test",
        //}
        ////*******PURPOSE:ASSIGNING OPTIONS FOR APPOINTMENT DURATION DROPDOWN BLOCK END  ********************//

        //################### METHOD TO OPEN INCOMING REFERRALS ADD POPUP WINDOW BLOCK START #########################
        //*******PURPOSE: THIS METHOD IS USED TO OPEN ADD INCOMING REFERRAL POPUP
        //*******CREATED BY:Rama M
        //*******CREATED DATE:29 TH MARCH 2016
        $scope.existingPatientAppointmentSelectResourcePopupclick = function (isFromRoom) {
            var selectedFacility = [];

            if (hasValue($scope.ApptSchedView_FacilitiesList) && $scope.ApptSchedView_FacilitiesList.length > 0) {
                selectedFacility = $.grep($scope.ApptSchedView_FacilitiesList, function (item) {
                    if (item.FacilityID == $scope.SelectedExistingPatApptFacilities)
                        return item;
                });
            }

            var datatoPopUp = {
                Requestfrom: "CustomizeResources",
                AppointmentSelectedFacilityID: $scope.SelectedExistingPatApptFacilities,
                isFromRoom: isFromRoom,
            }


            if (hasValue(selectedFacility) && selectedFacility.length > 0) {
                datatoPopUp.FacilityName = selectedFacility[0].FacilityDisplayName;
            }
            //CALLING SERVICE TO OPEN POPUP
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1135), datatoPopUp, 'lg').then(function (result) {
                //MAKING FOCUS ON ADDD ICON

                if (hasValue(result) && result != 'cancel') {
                    //if popup is opened from resource
                    if (!isFromRoom) {
                        $scope.existingPatientAppointmentSelectResource = result.ResourceName;

                        $scope.existingPatientAppointmentSelectResourceID = result.ResourceID;
                        SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoom = result.AuthenticateCalenderTypes;
                        SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoomEmailID = result.AuthenticateCalenderUserMailIDs;
                        //clera if the same user exist in the participants list
                        $scope.existingPatientAppointmentsRemoveselectedPhysicianorResfrmAdditionalParticipant($scope.existingPatientAppointmentSelectResourceID, 2);
                    }
                    //if popup is opened from room
                    else {
                        $scope.existingPatientAppointmentSelectRoom = result.ResourceName;
                        $scope.existingPatientAppointmentSelectRoomID = result.ResourceID;
                    }
                }


            });

        };

        ///THIS IS USED FOR CLEARING THE PREVIOUSLY SELECTD RESOURCE INFORMATION

        $scope.existingPatientAppointmentSelectResourceClear = function () {

            $scope.existingPatientAppointmentSelectResource = "";
            $scope.existingPatientAppointmentSelectResourceID = 0;
            $("#existingPatientAppointmentSelectResource").focus();

        };

        /**
         * @description : to clear selected room details
         * */
        $scope.existingPatientAppointmentSelectRoomlear = function () {

            $scope.existingPatientAppointmentSelectRoom = "";
            $scope.existingPatientAppointmentSelectRoomID = 0;
            $("#existingPatientAppointmentSelectRoom").focus();

        };

        //################### THIS METHOD USED  GET THE LIST OF LINKED INSURENCE POLICIES FOR THE SELECTED PATIENT ######################### 
        //*******PURPOSE: THIS METHOD USED TO GET THE LIST OF iNSURANCE POLICIES
        //*******CREATED BY: Hemanth 
        //*******CREATED DATE: APRIL/11/2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 
        $scope.existingPatientAppointmentBillToClickEvent = function (policiesList) {

            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default
            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = showCopayLinkedtoAppt;
            var DatatoPopup = {
            }
            //checking whether patient id is exist or not
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PatientID)) {
                DatatoPopup.PatientID = $scope.EMRDataFromPopup.SelectedPatient[0].PatientID;
            }

            //VERUFY AND ASSIGN THE PATIENT NAME
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName)) {
                DatatoPopup.PatientName = $scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName;
            }
            DatatoPopup.policiesList = policiesList;
            DatatoPopup.PopupOpenFrom = "AddNewAppointment";
            //-------------- commented by chaitanya seemala on jan 8th 2020 as per priyanka requirment
            //For To Show Primary Insurance Initially
            //  DatatoPopup.InsSeqMoreOptions = true;
            // this is used to handle display of policy sequences
            // earlier it is true. i.e in plocy window we are displaying policy list based on this flag, if it is true, we are displaying only primary policies initally
            // if we set for false, it means - we will display all policies (primary, secondary, tertiary)
            DatatoPopup.InsSeqMoreOptions = false;

            //OPEN POPUP TO LINK THE HEALTH PLANS FOR THE SELECTED PATIENT
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1066), DatatoPopup, 'lg').then(function (result) {  //EMRApplicationPath + "Home/Index/42"

                $("#spanExistingPatientAppointmentBillTo").focus();
                if (result == "cancel") return false;
                if (hasValue(result)) {

                    $scope.existingPatientAppointmentBillToInsuranceNames = result.InsuranceName;
                    if (hasValue(result) && hasValue(result.PolicyEndDate)) { // appending policy expiry date to insurance name  -- added by AHMED BASHA SHAIK 
                        $scope.existingPatientAppointmentBillToInsuranceNames = $scope.existingPatientAppointmentBillToInsuranceNames + " (Exp Date: " + result.PolicyEndDate + ")";
                    }
                    $scope.existingPatientAppointmentBillToInsuranceID = result.PatientInsuranceID;
                    $scope.existingPatientAppointmentHealthPlanID = result.InsuranceID;  //MAINTAIN THE INSURANCE ID AS SCOPE LEVEL VARIABLE TO PASS THE UPDATING SP
                    $scope.existingPatientAppointmentBillToInsuranceIDPriorAuthStatus = result.InsuranceHealthPlanPriorAuth;
                    //$scope.existingPatientAppointmentGrantID = undefined;
                    $scope.existingPatientAppointmentGrantID = result.GrantID;
                    //$scope.NewAppointmentSchedulerModel.IsPatientFlag = false; 
                    $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;
                    $scope.NewAppointmentSchedulerModel.InsuranceComments = result.Comments;//To get the insurance comments form the policy comments
                    if ($scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide || hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue)
                        $scope.existingPatientAppointmentCheckCopayCount($scope.existingPatientAppointmentBillToInsuranceID);
                    if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                        exisitingPatientApptReferralAuthorizationPopulateUsedField();
                    //if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
                    //	$scope.existingPatientAppointmentGetAuthorizationDetails(true, $scope.Programservicelist, $scope.existingPatientAppointmentHealthPlanID);
                    //}
                    //Assigning false to "doNotCheckHealthPlanCustomizationValidation"
                    //assigning false to check the Validation  
                    //Validaton to allow or deny the health plan for the selected program - service
                    $scope.NewAppointmentSchedulerModel.doNotCheckHealthPlanCustomizationValidation = false;
                }
            });
        }
        //################### THIS METHOD USED  GET THE LIST OF LINKED INSURENCE POLICIES FOR THE SELECTED END ######################### 



        //CLEAR THE SELECTED BILL TO DETAILS
        $scope.existingPatientAppointmentBillToPopupClearClick = function () {
            $scope.existingPatientAppointmentBillToInsuranceNames = "";
            $scope.existingPatientAppointmentBillToInsuranceID = 0;
            $scope.existingPatientAppointmentHealthPlanID = 0;  //CLEAR THE SCOPE VARIABLE // HEALTH PLAN ID 
            $scope.existingPatientAppointmentGrantID = 0;
            //$scope.NewAppointmentSchedulerModel.IsPatientFlag = false;
            $scope.NewAppointmentSchedulerModel.ApptBillTo = 0;
            $scope.NewAppointmentSchedulerModel.InsuranceComments = "";//To clear the insurance comments form the policy comments
            $("#spanExistingPatientAppointmentBillTo").focus();
            //Code inserted by Kranthi On April 12 2017 to Clear Copay Amount
            $scope.NewAppointmentSchedulerModel.CopayAmmount = null;
            $scope.NewAppointmentSchedulerModel.CopayOriginalSequence = null;

            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";
            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "";//fc-button  fc-state-default
            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default

            if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                exisitingPatientApptReferralAuthorizationPopulateUsedField();

        }







        //*******PURPOSE:GRANTS INFO POPUP BLOCK END  ********************//



        //################### BILL TO PATIENT CLICK EVENT BLOCK START #########################
        //*******PURPOSE: This method is used to populate patient in bill to filed
        //*******CREATED BY:Lakshmi B
        //*******CREATED DATE:05/10/2016
        $scope.existingPatientAppointmentBillToPatientClick = function () {


            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "ExistingApptActiveColorClass";
            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "";//fc-button  fc-state-default
            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default

            ////checking whether patient id is exist or not
            //if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PatientID)) {
            //    DatatoPopup.PatientID = $scope.EMRDataFromPopup.SelectedPatient[0].PatientID;
            //}

            //VERUFY AND ASSIGN THE PATIENT NAME
            //if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName)) {
            //$scope.existingPatientAppointmentBillToInsuranceNames = $scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName;
            $scope.existingPatientAppointmentBillToInsuranceNames = "Patient";
            $scope.existingPatientAppointmentGrantID = 0;
            $scope.existingPatientAppointmentBillToInsuranceID = 0;
            $scope.existingPatientAppointmentHealthPlanID = 0;  //CLEAR THE SCOPE VARIABLE // HEALTH PLAN ID 
            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = false;
            //$scope.NewAppointmentSchedulerModel.IsPatientFlag = true;
            //$scope.NewAppointmentSchedulerModel.BillingNotRequired = false;
            $scope.NewAppointmentSchedulerModel.ApptBillTo = 3;
            $scope.NewAppointmentSchedulerModel.InsuranceComments = "";//TO CLEAR THE INSURANCE COMMENTS
            //Code inserted by Kranthi On April 12 2017 to Clear Copay Amount
            $scope.NewAppointmentSchedulerModel.CopayAmmount = null;
            $scope.NewAppointmentSchedulerModel.CopayOriginalSequence = null;
            //}
            if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                exisitingPatientApptReferralAuthorizationPopulateUsedField();

            //if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
            //	$scope.existingPatientAppointmentGetAuthorizationDetails(true, undefined, undefined);
            //}
            //Assigning false to "doNotCheckHealthPlanCustomizationValidation"
            //assigning false to check the Validation  
            //Validaton to allow or deny the health plan for the selected program - service
            $scope.NewAppointmentSchedulerModel.doNotCheckHealthPlanCustomizationValidation = false;
        }
        //################### TO OPEN PROGRAM(S) - SERVICES(S) POPUP BLOCK END #########################




        //################### DO NOT  BILL CLICK EVENT BLOCK START #########################
        //*******PURPOSE: This method is used to populate patient in bill to filed
        //*******CREATED BY:HEMANTH U
        //*******CREATED DATE:06/06/2016existingPatientAppointmentBillToPatientClick
        $scope.existingPatientAppointmentDoNotBillClick = function () {

            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "ExistingApptActiveColorClass";
            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "";//fc-button  fc-state-default
            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
            //VERUFY AND ASSIGN THE PATIENT NAME
            $scope.existingPatientAppointmentBillToInsuranceNames = "Do Not Bill";
            $scope.existingPatientAppointmentGrantID = 0;
            $scope.existingPatientAppointmentBillToInsuranceID = 0;
            $scope.existingPatientAppointmentHealthPlanID = 0;  //CLEAR THE SCOPE VARIABLE // HEALTH PLAN ID 
            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = false;
            //$scope.NewAppointmentSchedulerModel.IsPatientFlag = false;
            //$scope.NewAppointmentSchedulerModel.BillingNotRequired = true;
            $scope.NewAppointmentSchedulerModel.ApptBillTo = 4;
            $scope.NewAppointmentSchedulerModel.InsuranceComments = "";//TO CLEAR THE INSURANCE COMMENTS
            //Code inserted by Kranthi On April 12 2017 to Clear Copay Amount
            $scope.NewAppointmentSchedulerModel.CopayAmmount = null;
            $scope.NewAppointmentSchedulerModel.CopayOriginalSequence = null;
            $scope.NewAppointmentSchedulerModel.InsuranceComments = "";

            if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                exisitingPatientApptReferralAuthorizationPopulateUsedField();

            //if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
            //	$scope.existingPatientAppointmentGetAuthorizationDetails(true, undefined, undefined);
            //}
        }
        //################### TO OPEN PROGRAM(S) - SERVICES(S) POPUP BLOCK END #########################


        //################### DO NOT  BILL CLICK EVENT BLOCK START #########################
        //*******PURPOSE: This method is used to populate patient in bill to filed
        //*******CREATED BY:HEMANTH U
        //*******CREATED DATE:06/06/2016
        $scope.existingPatientAppointmentBillToSlidingFeeClick = function () {

            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "ExistingApptActiveColorClass";
            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "";//fc-button  fc-state-default
            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default
            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = false;
            //VERUFY AND ASSIGN THE PATIENT NAME
            $scope.existingPatientAppointmentBillToInsuranceNames = "Sliding Fee";
            $scope.existingPatientAppointmentGrantID = 0;
            $scope.existingPatientAppointmentBillToInsuranceID = 0;
            $scope.existingPatientAppointmentHealthPlanID = 0; //CLEAR THE SCOPE VARIABLE // HEALTH PLAN ID 
            //$scope.NewAppointmentSchedulerModel.IsPatientFlag = false;
            //$scope.NewAppointmentSchedulerModel.BillingNotRequired = true;
            $scope.NewAppointmentSchedulerModel.ApptBillTo = 2;
            $scope.NewAppointmentSchedulerModel.InsuranceComments = "";//TO CLEAR THE INSURANCE COMMENTS
            //Code inserted by Kranthi On April 12 2017 to Clear Copay Amount
            $scope.NewAppointmentSchedulerModel.CopayAmmount = null;
            $scope.NewAppointmentSchedulerModel.CopayOriginalSequence = null;

            if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                exisitingPatientApptReferralAuthorizationPopulateUsedField();

        }
        //################### TO OPEN PROGRAM(S) - SERVICES(S) POPUP BLOCK END #########################



        //################### TO OPEN PROGRAM(S) - SERVICES(S) POPUP BLOCK START #########################
        //*******PURPOSE: This method is used to open program(s) - services(s) Popup
        //*******CREATED BY:Rama M
        //*******CREATED DATE:05/02/2016
        $scope.existingPatientAppointmentProgramsProgramsServicesClickEvent = function (isFromFieldsInit) {
            //var DatatoPopup = {
            //    IsProgramServiceShowMultiple: false,
            //    calledFrom: "FromEditAppointmentPopupProgramOrService",
            //}

            //$scope.Programservicelist = [];

            //To MAKE PROGRAM AND SERVICE POPUP TO SELECT MULTIPLE OPTIONS
            var DataToPopup = {
                calledFrom: "FromAddEditRecurringAppointments",
                PreviousSelectedIDs: $scope.selectedProgramServicesLinkedInfoID,
                DoNotBringSyntheticServices: true,
                ShowinApptsFilterFromApptsORGT: true,
            }
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PatientID) && $scope.EMRDataFromPopup.SelectedPatient[0].PatientID > 0) {
                DataToPopup.PatientID = $scope.EMRDataFromPopup.SelectedPatient[0].PatientID;
            }


            //ADDED BY HEMANTH ON OCT 10 2K18 
            //THIS IS TO GET THE PROGRAM SERVICES LINKED TO SELECTD LOCATION
            if (hasValue($scope.SelectedExistingPatApptFacilities) && $scope.SelectedExistingPatApptFacilities > 0) {
                DataToPopup.FacilityID = $scope.SelectedExistingPatApptFacilities;
            }
            //Sending appointment provider information  to program service pop up
            // if ($scope.SelectedPhysicianData) {
            //     DataToPopup.ProgramProviderID = $scope.SelectedPhysicianData.PhysicianId
            // }
            DataToPopup.ProgramProviderID = Number(SelectedPhysicianID);
            DataToPopup.ResourceType = SelectedResourceType;
            DataToPopup.GetGroupSessions = true;
            DataToPopup.IsAutoPopulateGrants = true;
            //ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1161), DatatoPopup, 'modal-900px').then(function (result) {
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/135'*/GetEMRPageURLByIndex(135), DataToPopup, 'lg').then(function (result) {
                onProgramServiceSelection(result, isFromFieldsInit);
                if (assignFacilityRespectivetoProgramService) {
                    assginFacilityBasedonProgramService(result);
                }
            });
        };
        //################### TO OPEN PROGRAM(S) - SERVICES(S) POPUP BLOCK END #########################

        //################### TO GET AUTO POPULATE GRANT INFO BASED ON PROGRAM AND SERVICE BLOCK START #########################
        ///*******PURPOSE:THIS IS USED TO GET AUTO POPULATE GRANT INFO BASED ON PROGRAM AND SERVICE.
        ///*******CREATED BY:Pavan.Burri
        ///*******CREATED DATE: September 04 2018.
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.AutoPopulateGrantInfoBasedOnProgramAndServiceList = function () {

            //Patient Appointment Programs Services List isn't present or not
            if (!hasValue($scope.existingPatientAppointmentProgramsProgramsServicesList) || $scope.existingPatientAppointmentProgramsProgramsServicesList.length > 1)
                return -1;
            //checking Patient Id isn't present or patient ID Should Be grater than Zero
            if (!hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID) || ExistingPatientSelectedData.SelectedPatient[0].PatientID <= 0)
                return -1;

            //Assign the Programs Services Linked Info ID to local veriable for service call  
            if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesList) && hasValue($scope.existingPatientAppointmentProgramsProgramsServicesList[0]) && hasValue($scope.existingPatientAppointmentProgramsProgramsServicesList[0].ProgramsServicesLinkedInfoID)) {
                var selectedProgramServicesLinkedInfoID = $scope.existingPatientAppointmentProgramsProgramsServicesList[0].ProgramsServicesLinkedInfoID;
            } else {
                var selectedProgramServicesLinkedInfoID = $scope.existingPatientAppointmentProgramsProgramsServicesList.ProgramsServicesLinkedInfoID;
            }
            if (hasValue(ExistingPatientSelectedData) && hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) {
                var PatientId = ExistingPatientSelectedData.SelectedPatient[0].PatientID;
            }
            //input data for service call..
            var postData = {
                ProgramServiceLinkedInfoID: selectedProgramServicesLinkedInfoID,
                PatientID: PatientId,
            };
            //service call
            GiveNewAppointmentService.GetAutoPopulateGrantInfoBasedOnProgramAndServiceList(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;

                //checking service Responce and Grant Info Based On Program And Service List is present or not..and  Grant Info Based On Program And Service List length should be One..
                if (hasValue(serviceResponse) && hasValue(serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo) && serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo.length == 1) {

                    //Checking Auto Link Patient Policy With This Grant Should Be true for the auto populate GrantName 
                    if (serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].IsAutoLinkPatientPolicyWithThisGrant == true) {
                        //Condition for the Grant Linked Patient Insurance ID should grather then zero then Bill To Insurance ID and Bill To Insurance Name assign from Grant Info List
                        if (serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].GrantLinkedPatientInsuranceID > 0) {
                            $scope.existingPatientAppointmentBillToInsuranceID = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].GrantLinkedPatientInsuranceID;

                            //insurence id  for scope level
                            if (serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].InsuranceId > 0) {
                                $scope.existingPatientAppointmentHealthPlanID = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].InsuranceId;
                            }
                            else {
                                $scope.existingPatientAppointmentHealthPlanID = 0;
                            }

                            $scope.existingPatientAppointmentGrantID = 0;

                            $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;
                            $scope.NewAppointmentSchedulerModel.InsuranceComments = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].Comments;//To get the insurance comments form the policy comments
                            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
                            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToInsuranceNames = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].GrantName;
                            $scope.NewAppointmentSchedulerModel.InsuranceIDtoAutoCreatePolicy = 0;
                        }
                    }
                    //Checking Auto Create New Patient Policy With This Grant Should Be true for the auto populate Grant Name 
                    else if (serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].IsAutoCreateNewPatientPolicyWithThisGrant == true) {
                        //Condition for the Grant Linked Patient Insurance ID should grather then zero then Bill To Insurance ID and Bill To Insurance Name assign from Grant Info List
                        if (serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].GrantLinkedPatientInsuranceID > 0) {
                            $scope.existingPatientAppointmentBillToInsuranceID = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].GrantLinkedPatientInsuranceID;
                            //insurence id  for scope level
                            if (serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].InsuranceId > 0) {
                                $scope.existingPatientAppointmentHealthPlanID = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].InsuranceId;
                            }
                            else {
                                $scope.existingPatientAppointmentHealthPlanID = 0;
                            }

                            $scope.existingPatientAppointmentGrantID = 0;

                            $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;
                            $scope.NewAppointmentSchedulerModel.InsuranceComments = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].Comments;//To get the insurance comments form the policy comments
                            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
                            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToInsuranceNames = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].GrantName;
                            $scope.NewAppointmentSchedulerModel.InsuranceIDtoAutoCreatePolicy = 0;
                        }
                        //condition for the Auto Create New Patient Policy  and Auto Link Patient Policy values are not TRUE then the Grant INSURANCE ID will create the new Health Plan
                        else {
                            $scope.existingPatientAppointmentGrantID = 0;
                            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
                            $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default
                            $scope.existingPatientAppointmentBillToInsuranceNames = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].GrantName;
                            $scope.existingPatientAppointmentBillToInsuranceID = 0;
                            $scope.existingPatientAppointmentHealthPlanID = 0;  //CLEAR THE SCOPE VARIABLE // HEALTH PLAN ID 
                            //$scope.existingPatientAppointmentInsuranceIDToAutoCreatePolicy = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].InsuranceId;
                            $scope.NewAppointmentSchedulerModel.InsuranceIDtoAutoCreatePolicy = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].InsuranceId;
                            $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;
                            $scope.NewAppointmentSchedulerModel.InsuranceComments = serviceResponse.GrantInfoBasedOnProgramAndServiceListInfo[0].Comments;//To get the insurance comments form the policy comments

                        }
                    }

                }

            });

        };
        //################### TO GET AUTO POPULATE GRANT INFO BASED ON PROGRAM AND SERVICE BLOCK END #########################

        //################### REMOVE THE SELECTED PROGRAM OR SERVICE FROM THE LIST VIEW BLOCK START #########################
        //*******PURPOSE: This method is used to REMOVE program(s) - services(s) FROM THE LIST VIEW
        //*******CREATED BY:PAVAN KUMAR KANDULA
        //*******CREATED DATE:12/09/2017
        $scope.existingPatientAppointmentClearProgramsProgramsServices = function (selectedProgram) {
            if (hasValue(selectedProgram)) {
                for (var i = 0; i <= $scope.existingPatientAppointmentProgramsProgramsServicesList.length - 1; i++) {
                    if ($scope.existingPatientAppointmentProgramsProgramsServicesList[i].ProgramsServicesLinkedInfoID == selectedProgram.ProgramsServicesLinkedInfoID) {
                        $scope.existingPatientAppointmentProgramsProgramsServicesList.splice(i, 1);
                    }
                }
                if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                    exisitingPatientApptReferralAuthorizationPopulateUsedField();
                //Assigning false to "doNotCheckHealthPlanCustomizationValidation"
                //assigning false to check the Validation  
                //Validaton to allow or deny the health plan for the selected program - service
                $scope.NewAppointmentSchedulerModel.doNotCheckHealthPlanCustomizationValidation = false;
                //if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
                //	clearandGetPriorauthGridinfoByRemainingPgmandServices(selectedProgram);
                //}
            }
            $scope.selectedProgramServicesLinkedInfoID = "";
            $scope.existingPatientAppointmentProgramsProgramsServices = "";
            $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = "";
            $scope.existingPatientAppointmentProgramsProgramsServicesforService = "";
            let programIds = [];
            //ASSIGNING THE REMINGING USER IDS
            if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesList) && $scope.existingPatientAppointmentProgramsProgramsServicesList.length > 0) {
                angular.forEach($scope.existingPatientAppointmentProgramsProgramsServicesList, function (item) {
                    if (!hasValue($scope.selectedProgramServicesLinkedInfoID)) {
                        $scope.selectedProgramServicesLinkedInfoID = item.ProgramsServicesLinkedInfoID.toString();
                    }
                    else {
                        $scope.selectedProgramServicesLinkedInfoID += ',' + item.ProgramsServicesLinkedInfoID;
                    }

                    if (!programIds.includes(item.ProgramID)) {
                        $scope.existingPatientAppointmentProgramsProgramsServices = `${$scope.existingPatientAppointmentProgramsProgramsServices}${item.GroupTherapyCategoryName} - ${getServiceNamesWithCommaSeperated($scope.existingPatientAppointmentProgramsProgramsServicesList, item.ProgramID)}; `;
                        if (hasValue(item.GroupTherapyCategoryName)) {

                            if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesforProgram))
                                $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = $scope.existingPatientAppointmentProgramsProgramsServicesforProgram + "; " + item.GroupTherapyCategoryName;
                            else
                                $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = item.GroupTherapyCategoryName

                        }
                        programIds.push(item.ProgramID);
                    }
                    //if (!hasValue($scope.existingPatientAppointmentProgramsProgramsServices)) {
                    //    $scope.existingPatientAppointmentProgramsProgramsServices = item.GroupTherapySessionTypeName;
                    //}
                    //else {
                    //    $scope.existingPatientAppointmentProgramsProgramsServices += ',' + item.GroupTherapySessionTypeName;
                    //}



                    if (hasValue(item.GroupTherapyName)) {

                        if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesforService))
                            $scope.existingPatientAppointmentProgramsProgramsServicesforService = $scope.existingPatientAppointmentProgramsProgramsServicesforService + "; " + item.GroupTherapyName;
                        else
                            $scope.existingPatientAppointmentProgramsProgramsServicesforService = item.GroupTherapyName;

                    }
                })
                $scope.existingPatientAppointmentProgramsProgramsServices = $scope.existingPatientAppointmentProgramsProgramsServices.trimEnd('; ');

            }

        }
        //################### REMOVE THE SELECTED PROGRAM OR SERVICE FROM THE LIST VIEW BLOCK END #########################


        //################### CLEAR PROGRAM(S) - SERVICES(S) POPUP BLOCK START #########################
        //*******PURPOSE: This method is used to open program(s) - services(s) Popup
        //*******CREATED BY:LAKSHMI B
        //*******CREATED DATE:05/02/2016
        $scope.existingPatientAppointmentProgramsServicesClearClick = function () {
            $scope.existingPatientAppointmentProgramsProgramsServicesList = [];
            $scope.existingPatientAppointmentProgramsProgramsServices = "";
            $scope.selectedProgramServicesLinkedInfoID = "";
            $("#spanRecurringApptsProgramsServices").focus();
            $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = "";
            $scope.existingPatientAppointmentProgramsProgramsServicesforService = "";

            exisitingPatientApptReferralAuthorizationClearUsedField();

            //if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
            //	clearPriorAuthGridInfowhileClearingPgmservice();
            //}

        }
        //################### CLEAR PROGRAM(S) - SERVICES(S) POPUP BLOCK END #########################

        //BIND THE DATA TO THE DROPDOWN DATASOURCE
        $scope.existingPatientAppointmentEncounterModalityOptionDropdownDataSource = new kendo.data.DataSource({
            data: [],//$scope.existingPatientAppointmentEncounterModalityOptionDropdownInfo,//ASSIGNING NULL ON DEFAULT       
        });

        //######### DATA FOR ENCOUNTER MODALITY DROPDOWN BLOCK END #############

        $scope.existingPatientApptModalityOptions = {
            template: '<span style="background-color:{{dataItem.ModalityBackColor}};color:{{dataItem.ModalityForeColor}}" >{{dataItem.AppointmentTypeDesc}}</span>',
        }

        //################### THIS METHOD IS USED TO GET THE APPOINTMENTS ENCOUNTER MODALITY LIST AND BIND TO ENCOUNTER MODALITY DROP DOWN BLOCK START #########################
        //*******PURPOSE: THIS METHOD IS USED TO GET THE APPOINTMENTS ENCOUNTER MODALITY LIST AND BIND TO ENCOUNTER MODALITY DROP DOWN
        //*******CREATED BY: SRINIVAS M
        //*******CREATED DATE: 10/13/2016
        $scope.existingPatientApptEncounterModalityInfo = function () {
            if (needToUserootscopeCacheForSelectivePractices && $rootScope.OneToOneApptWindowEncounterModalityCacheList != undefined && $rootScope.OneToOneApptWindowEncounterModalityCacheList.length >= 0) {
                assignModailityListToDataSourceAndDoNextActions(angular.copy($rootScope.OneToOneApptWindowEncounterModalityCacheList));
                return;
            }

            var postData = {
                isFromLinkedEncounterModality: true,
            };
            GiveNewAppointmentService.ApptSchedGetApptEncounterModalityListInfo(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false; //CHECKING THE SERVICE RESPONSE AFTER EXECUTING THE SERVICE

                if (needToUserootscopeCacheForSelectivePractices) {
                    $rootScope.OneToOneApptWindowEncounterModalityCacheList = angular.copy(serviceResponse.ApptEncounterModalityList) || [];
                }
                assignModailityListToDataSourceAndDoNextActions(angular.copy(serviceResponse && serviceResponse.ApptEncounterModalityList || []));

            });
        }
        //################### THIS METHOD IS USED TO GET THE APPOINTMENTS ENCOUNTER MODALITY LIST AND BIND TO ENCOUNTER MODALITY DROP DOWN BLOCK END #########################



        function assignModailityListToDataSourceAndDoNextActions(modalityList) {
            if (showSelectOptioninModalityDropdown) {
                modalityList.unshift({ AppointmentTypeDesc: ' - Select Modality - ', AppointmentTypeID: 0 });
            }
            $scope.existingPatientAppointmentEncounterModalityOptionDropdownDataSource.data(modalityList);

            if ($scope.EMRDataFromPopup && $scope.EMRDataFromPopup.EncounterModailityID && $scope.EMRDataFromPopup.EncounterModailityID > 0)
                $scope.NewAppointmentSchedulerModel.AppointmentTypeID = $scope.EMRDataFromPopup.EncounterModailityID
            //upgrade to angular 1.7.2
            else if (modalityList && modalityList.length > 0) {
                $scope.NewAppointmentSchedulerModel.AppointmentTypeID = modalityList[0].AppointmentTypeID;
            }



            if ((_.get($scope.EMRDataFromPopup, "SelectedPatient[0].isFromVideoModality", false) || showVideoModalitybyDefault) && _.find(modalityList, { AppointmentTypeID: GiveAppointmentConstantsService.EncounterModality.VIDEO })) {
                $scope.NewAppointmentSchedulerModel.AppointmentTypeID = GiveAppointmentConstantsService.EncounterModality.VIDEO;
            }
            else if (_.get($scope.EMRDataFromPopup, "SelectedPatient[0].isFromFacetoFaceModality", false) && _.find(modalityList, { AppointmentTypeID: GiveAppointmentConstantsService.EncounterModality.FACETOFACE })) {
                $scope.NewAppointmentSchedulerModel.AppointmentTypeID = GiveAppointmentConstantsService.EncounterModality.FACETOFACE;
            }

            checkModalityAndShowHideZoomSaveButton();
            checkModalityAndShowHideTeamSaveButton();

            ChangeFacilityBasedOnModaility();
            checkUserHasGoogleMeetEnabledOrNotAndShowHideSaveButton(true);
        }


        //################### THIS IS USED TO SHOW THE AVAILABLE SLOTS INFO AND EXISTING APPTS INFORMTAION FOR SELECTED DATE BLOCK START #########################
        //*******PURPOSE: This method is used to show the available slots and blocked appts info for seledted date
        //*******CREATED BY:HEMANTH U
        //*******CREATED DATE:05/23/2016
        $scope.availableSlotstoGiveNewAppointmentClick = function () {
            var DatatoPopUp = {
            };

            if (hasValue($scope.AppointmentDateInAddMode)) {
                if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) return;
            }

            if (hasValue($scope.EMRDataFromPopup)) {
                DatatoPopUp.ProviderID = SelectedPhysicianID;
                DatatoPopUp.ResourceType = SelectedResourceType;
            }

            DatatoPopUp.AppointmentDate = $scope.AppointmentDateInAddMode;
            //open popup to show the avilable slots and existing appts for the selected date
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1279), DatatoPopUp, 'modal-1120px').then(function (result) {
                if (!adminIsDevice()) {
                    $("#availableSlotstoGiveNewAppointment_" + $scope.AvailableSlotstoGiveNewAppointmentGUID).focus();
                }
                if (!hasValue(result) || result == "cancel") return false;
                if (hasValue(result)) {
                    $scope.AppointmentDateInAddMode = new Date(result.AppointmentDate).getFormat("MM/dd/yyyy");
                    $scope.AppointmentTimeInAddMode = result.SlotTime;
                    //set time to the time picker from the selected time picker
                    if (hasValue($('#addAppointmentSelectAppointmentTimeId').data("timepicker"))) {
                        $('#addAppointmentSelectAppointmentTimeId').data("timepicker").setTime($scope.AppointmentTimeInAddMode);
                    }

                    if (hasValue($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList) && $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.length > 0) {
                        //SHOW HIDE THE SAVE AND SEND APPOINTMENT REMINDER BUTTON BASED ON APPT SCHEDULER SETTINGS CUSTOMIZATION/ADDED BY PAVAN KUMAR KANDULA ON 25-OCT-2K17
                        if ($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.filter(function (ExistingPatientAppointmentColumnsCustomizationFields) {
                            return ((ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSENDAPPOINTMENTREMINDER || ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSSAVEANDSENDAPPOINTMENTREMINDER));
                        }).length == 0) {
                            $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = false;
                        } else {
                            //WHEN APPOINTMENT DATE SELECTED IS PAST DATE
                            if (hasValue($scope.AppointmentDateInAddMode) && (DateDiff.inDays($scope.AppointmentDateInAddMode, adminGetCurrentDate()) > 0)) {
                                //HIDING SAVE & SEND APPT REMINDER BUTTON
                                $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = false;
                            }
                            else {
                                $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = true;
                            }
                        }
                    }
                }
7

            });
        }


        //################### THIS IS USED CLEAR THE VISIT TYPE MANDATORY AND ASSIGN THE DURATION  BLOCK START #########################
        //*******PURPOSE: This method is used to CLEAR THE MANDATORY MARK AND ASSIGN THE DEFAULT DURATION FOR THE TYPES
        //*******CREATED BY:HEMANTH U
        //*******CREATED DATE:05/23/2016
        $scope.existingPatientAppointmentEncounterModalityOptionChange = function () {

            if ($scope.NewAppointmentSchedulerModel && $scope.NewAppointmentSchedulerModel.AppointmentTypeID) {
                // if ($scope.NewAppointmentSchedulerModel.AppointmentTypeID == 1 || $scope.NewAppointmentSchedulerModel.AppointmentTypeID == visitTypeOptionName.VIDEOVISTITYPE) {
                //$scope.existingPatientAppointmentVisitTypeMandatoryText = "*";
                //$scope.SelectedExistingPatApptVisitTypeMandatoryCheckClass = "mandatoryCheck";
                $scope.existingPatientAppointmentVisitTypeMandatoryText = "*";
                $scope.SelectedExistingPatApptVisitTypeMandatoryCheckClass = "";
                //}
                //else {
                //    $scope.existingPatientAppointmentVisitTypeMandatoryText = "";
                //    $scope.SelectedExistingPatApptVisitTypeMandatoryCheckClass = "";
                //    $scope.SelectedExistingPatApptVisitType = 0;
                //    //if (hasValue($scope.ApptSchedView_GetMinimumIntervalList) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0]) && hasValue($scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration)) {
                //    //    $scope.SelectedExistingPatApptDuration = $scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration;
                //    //}
                //}


                ///THIS CUSTOMIZATION IS USED FOR THE SAVE & SEND VIDEO REMINDER BUTTON 
                if ($scope.NewAppointmentSchedulerModel.AppointmentTypeID == GiveAppointmentConstantsService.visitTypeOptionName.VIDEOVISTITYPE) {
                    if ($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.filter(function (ExistingPatientAppointmentColumnsCustomizationFields) {
                        return ((ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSENDVIDEOREMINDER));
                    }).length == 0) {
                        $scope.existingPatientAppointmentsSaveAndSendVideoReminderShow = false;
                    }
                    else {
                        $scope.existingPatientAppointmentsSaveAndSendVideoReminderShow = true;
                    }
                }
                else {
                    $scope.existingPatientAppointmentsSaveAndSendVideoReminderShow = false;
                }
                checkModalityAndShowHideZoomSaveButton();
                checkModalityAndShowHideTeamSaveButton();

                ChangeFacilityBasedOnModaility();
                checkUserHasGoogleMeetEnabledOrNotAndShowHideSaveButton(true);

                if (practiceBasedConditions.hideSaveButtonOnVideoModalityForPracticeIds) {
                    $scope.hideSaveButtonOnVideoModalityForPractices = ($scope.NewAppointmentSchedulerModel.AppointmentTypeID == 7); //7 -  video
                }
            }
        }


        function checkModalityAndShowHideZoomSaveButton() {
            if (isScheduleZoomMeetingButtonCustomizedInSetting && !viewButtonsForAllModalities) {
                $scope.existingPatientAppointmentsSaveAndScheduleTeletherapyMeetingButtonShow = modalityIdsToShowZoomAndTeamButtons.includes(parseInt($scope.NewAppointmentSchedulerModel.AppointmentTypeID)) || showHideZoomandTeamButtonsforOtherModality();
            }
        }


        function checkModalityAndShowHideTeamSaveButton() {
            if (isScheduleTeamMeetingButtonCustomizedInSetting && !viewButtonsForAllModalities) {
                $scope.existingPatientAppointmentsSaveAndScheduleTeletherapyMeetingTeamsButtonShow = modalityIdsToShowZoomAndTeamButtons.includes(parseInt($scope.NewAppointmentSchedulerModel.AppointmentTypeID)) || showHideZoomandTeamButtonsforOtherModality();
            }
        }

        function showHideZoomandTeamButtonsforOtherModality() {
            if (showZoomandTeamButtonsforOtherModailty && $scope.NewAppointmentSchedulerModel.AppointmentTypeID == 4) {
                return true;
            }
            return false;
        }

        //################### SAVE APPOINTMENT INFO AND OPEN BILLING DOUBLE DOLLAR POPUP BLOCK START #########################
        //*******PURPOSE: This method used to SAVE APPOINTMENT INFO AND OPEN BILLING DOUBLE DOLLAR POPUP
        //*******CREATED BY: KRANTHI KUMAR G
        //*******CREATED DATE: JUNE 10 2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_SaveAppointmentsforExistingPatientAndDocumentBillingInfo = function (isSendApptRemainder) {

            //FROM EMERGENCY WEB SITE EDIT AND UPDATE BILLING INFO IS NOT ACCESSIABLE
            //if (EMRCommonFactory.EMRCheckPermissions("APPOINTMENTSCHEDULER - SAVEANDADDBILLINGINFO") == EMRPermissionType.DENIED) {
            //    ShowErrorMessage(EmrPermissionShowingMessage);
            //    return false;
            //}
            //Restricting Indian users to save appointments only for test patients
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.SelectedPatient[0]) &&
                hasValue($scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName)) {
                if (verifySaveIsPerformedFromIndianIP($scope.EMRDataFromPopup.SelectedPatient[0].PersonLastNameFirstName)) return;
            }

            if (hasValue($scope.AppointmentDateInAddMode) && (DateDiff.inDays($scope.AppointmentDateInAddMode, adminGetCurrentDate()) < 0)) {
                ShowErrorMessage("To document Billing Information Appointment Date should not be more than Current Date.");
                $scope.addAppointmentSelectAppointmentDate = true;
                return false;
            }
            //Variable Assign the Send Appointment Remaider Falg.
            //We need to use send Appointment Remider base on this flag
            //maintain Send Appt Remainder Status
            $scope.existingPatientAppointmentIsSendApptRemainder = isSendApptRemainder;
            $scope.ApptSchedView_SaveAppointmentsforExistingPatient(true, isSendApptRemainder);
        };
        //################### SAVE APPOINTMENT INFO AND OPEN BILLING DOUBLE DOLLAR POPUP BLOCK END #########################


        //################### THIS IS USED TO SELECT REASON FOR APPT FROM POPUP BLOCK START #########################
        //*******PURPOSE: THIS IS USED TO  GIVE THE REASON FOR APPT FROM THE DIAGNOSIS WINDOW
        //*******CREATED BY: HEMANTH U
        //*******CREATED DATE: JUNE 20 2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentopenICD10Click = function (isfrom) {
            if (!hasValue(isfrom)) return;
            if (hasValue(isfrom) && isfrom == true) {///for ICD CODE DATA


                var ProblemListChiefComplaintName = "";
                var dataToPopup = {
                    //RequestingFrom: "FROMPROBLEMLIST",
                    RequestingFrom: "FROMAPPTSCHEDULER",
                    ////SearchString: SearchString,
                    //ComboSelection: "ICDCODES",
                    ////  PatientInfo: $scope.PatientInfo
                    PopupCallingFrom: 1,
                };
                var popupSize = 'modal-1060px';
                if ($(window).width() >= 1100 && $(window).width() <= 1200) {
                    popupSize = 'modal-1060px';
                }
                else if ($(window).width() < 1100 && $(window).width() > 995) {
                    popupSize = 'modal-960px';
                }



                //CHECKING THE DATA PRESENT IN LIST AND SENDING THE INPUT TO MODAL POPUP SERVICE
                if (hasValue($scope.NewAppointmentICDCodeDataList) && $scope.NewAppointmentICDCodeDataList.length > 0) {
                    dataToPopup.LinkedDiagnosis = $scope.NewAppointmentICDCodeDataList;
                }

                //OPEN DIAGNOSIS POPUP
                ModalPopupService.OpenPopup(GetEMRPageURLByIndex(739), dataToPopup, 'emrAddEditDxCateDiagnosisPopupWidthClass').then(function (result) {
                    if (hasValue(result)) {

                        if (result == "cancel") {
                            $("#spanExistingPatientAppointmentOpenICD10").focus();
                            return false;
                        }

                        if (result.length > 0) {
                            // $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = "";
                            $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes = ""
                            $scope.NewAppointmentICDCodeDataList = result;
                            $scope.ICDCodesDetailsList = [];
                            angular.forEach(result, function (item) {
                                if (hasValue(item.DiagnosisBriefDescalongwithSearchWord) && item.DiagnosisBriefDescalongwithSearchWord.indexOf('¦¦¦') > 0) {
                                    if (hasValue(item.DxCodeANDDXDescription) && item.DxCodeANDDXDescription.toString().contains('[') && item.DxCodeANDDXDescription.toString().contains(']')) {

                                        var DxCodeANDDXDescriptionNamePrefix = item.DxCodeANDDXDescription.split('[');

                                        var DxCodeANDDXDescriptionNameSufix = item.DxCodeANDDXDescription.split(']');

                                        var WithOutSearchWord = "";

                                        if (hasValue(DxCodeANDDXDescriptionNamePrefix) && DxCodeANDDXDescriptionNamePrefix.length > 0 && hasValue(DxCodeANDDXDescriptionNamePrefix[0]))
                                            WithOutSearchWord += DxCodeANDDXDescriptionNamePrefix[0].toString().trim(' ');

                                        if (hasValue(DxCodeANDDXDescriptionNameSufix) && DxCodeANDDXDescriptionNameSufix.length > 0 && hasValue(DxCodeANDDXDescriptionNameSufix[DxCodeANDDXDescriptionNameSufix.length - 1]))
                                            WithOutSearchWord += DxCodeANDDXDescriptionNameSufix[DxCodeANDDXDescriptionNameSufix.length - 1];

                                        item.DxCodeANDDXDescription = WithOutSearchWord;
                                    }
                                }
                                //var DxcodeAndDescriptionWithoutSearchWord = item.DXCode + " - " +item.DXCodeDescription;
                                if (!hasValue($scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes)) {
                                    $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes = item.DxCodeANDDXDescription;
                                }
                                else {
                                    $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes += "; " + item.DxCodeANDDXDescription;
                                    //$scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes += "; " + DxcodeAndDescriptionWithoutSearchWord;
                                }
                                $scope.ICDCodesDetailsList.push({
                                    CCID: item.CCID,
                                    DiagnosisBriefDescIDs: item.DiagnosisBriefDescIDs,
                                    DXCode: item.DXCode,
                                    DXCodeDescription: item.DXCodeDescription,
                                    DxCodeANDDXDescription: item.DxCodeANDDXDescription,
                                    ProblemListID: null,
                                })
                            })
                        }

                        $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = "";
                        var ApptReasonICDCodesList = [];
                        $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = []
                        if (hasValue($scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes) && $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes.length > 0
                            && hasValue($scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames) && $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames.length > 0) {
                            $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes + "; " + $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames;

                            ApptReasonICDCodesList = $scope.ICDCodesDetailsList.concat($scope.ProblemListDetailsList);
                            if (hasValue(ApptReasonICDCodesList) && ApptReasonICDCodesList.length > 0) {
                                $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = ApptReasonICDCodesList;
                            }

                        } else if (hasValue($scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes) && $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes.length > 0
                            && (!hasValue($scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames) || $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames.length <= 0)) {
                            $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes;

                            if (hasValue($scope.ICDCodesDetailsList) && $scope.ICDCodesDetailsList.length > 0) {
                                $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = $scope.ICDCodesDetailsList;
                            }

                        } else if ((!hasValue($scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes) || $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes.length <= 0)
                            && hasValue($scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames) && $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames.length > 0) {
                            $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames;

                            if (hasValue($scope.ProblemListDetailsList) && $scope.ProblemListDetailsList.length > 0) {
                                $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = $scope.ProblemListDetailsList;
                            }

                        }

                    }
                });
            } else {///FOR PROBLEM LIST DATA

                var dataToPopup = {
                    PatientName: ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName,
                    PatientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                    DOB: ExistingPatientSelectedData.SelectedPatient[0].DateOFBirth,
                    PopupOpenFrom: "FromApptAddEdit",
                };

                //IF ALREADY PRBLEMS SELECTED 
                if (hasValue($scope.NewAppointmentSchedulerModel.ReasonforApptProblemListIDs)) {
                    dataToPopup.BillableDxCodesList = $scope.NewAppointmentSchedulerModel.ReasonforApptProblemListIDs.split(',');
                }
                else {
                    dataToPopup.BillableDxCodesList = [];
                }

                var ProblemNames = "";
                var ProblemListIDs = "";
                ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/224'*/GetEMRPageURLByIndex(224), dataToPopup, 'modal-1100px').then(function (result) {
                    if (result == "cancel") return false;

                    if (hasValue(result) && result.length > 0) {
                        $scope.ProblemListDetailsList = [];
                        angular.forEach(result, function (problemInfo) {

                            if (hasValue(problemInfo.ProblemNameWithDXCode)) {
                                ProblemNames += problemInfo.ProblemNameWithDXCode + "; ";
                            }

                            if (hasValue(problemInfo.ProblemListID)) {
                                ProblemListIDs += problemInfo.ProblemListID + ", ";
                            }

                            $scope.ProblemListDetailsList.push({
                                CCID: problemInfo.CCID,
                                DiagnosisBriefDescIDs: problemInfo.DiagnosisBriefDescID,
                                DXCode: problemInfo.DXCode,
                                DXCodeDescription: problemInfo.ProblemName,
                                DxCodeANDDXDescription: problemInfo.ProblemNameWithDXCode,
                                ProblemListID: problemInfo.ProblemListID,
                            })
                        })
                    }

                    if (hasValue(ProblemNames)) {
                        $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames = ProblemNames.trimEnd('; ');
                    }

                    if (hasValue(ProblemListIDs)) {
                        $scope.NewAppointmentSchedulerModel.ReasonforApptProblemListIDs = ProblemListIDs.trimEnd(', ');
                    }

                    $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = "";
                    var ApptReasonICDCodesList = [];
                    $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = []
                    if (hasValue($scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes) && $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes.length > 0
                        && hasValue($scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames) && $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames.length > 0) {
                        $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes + "; " + $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames;

                        ApptReasonICDCodesList = $scope.ICDCodesDetailsList.concat($scope.ProblemListDetailsList);
                        if (hasValue(ApptReasonICDCodesList) && ApptReasonICDCodesList.length > 0) {
                            $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = ApptReasonICDCodesList;
                        }

                    } else if (hasValue($scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes) && $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes.length > 0
                        && (!hasValue($scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames) || $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames.length <= 0)) {
                        $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes;

                        if (hasValue($scope.ICDCodesDetailsList) && $scope.ICDCodesDetailsList.length > 0) {
                            $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = $scope.ICDCodesDetailsList;
                        }
                    } else if ((!hasValue($scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes) || $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes.length <= 0)
                        && hasValue($scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames) && $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames.length > 0) {
                        $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames;

                        if (hasValue($scope.ProblemListDetailsList) && $scope.ProblemListDetailsList.length > 0) {
                            $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = $scope.ProblemListDetailsList;
                        }
                    }

                });
            }
        }


        $scope.existingPatientAppointmentReasonforApptClearClick = function () {
            $scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit = "";
            $("#spanExistingPatientAppointmentOpenSelectAdmissionReason").focus();
        }


        $scope.existingPatientAppointmentReasonforVisitsClearClick = function () {
            $scope.ProblemListDetailsList = [];
            $scope.ICDCodesDetailsList = [];
            $scope.NewAppointmentSchedulerModel.ReasonForApptICDCodes = "";
            $scope.NewAppointmentSchedulerModel.ReasonforApptProblemNames = "";
            $scope.NewAppointmentSchedulerModel.ReasonForVisitICDCodes = "";
            $scope.NewAppointmentSchedulerModel.ReasonforApptProblemListIDs = "";
            $scope.NewAppointmentSchedulerModel.AppointmentICDCodesModelList = [];
            $scope.NewAppointmentICDCodeDataList = [];
            $("#spanExistingPatientAppointmentOpenICD10").focus();
        }


        //################### THIS IS USED TO SELECT PROVIDER OR RESOURCE SELECTION  BLOCK START #########################
        //*******PURPOSE: THIS IS USED TO  CHANGE THE PROVIDER OR RESOURCE TO GIVE THE APPTS
        //*******CREATED BY: HEMANTH U
        //*******CREATED DATE: JULY 01 2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentSelectProviderorResourcePopupclick = function () {

            var ExistingPatientApptStartdatePicker;
            //Get the selected date value from the date picker after clearing and selected the same date
            if (hasValue($("#txtPatientAppointmentDateInAddMode").data("kendoDatePicker")))
                ExistingPatientApptStartdatePicker = $("#txtPatientAppointmentDateInAddMode").data("kendoDatePicker").value();
            if (hasValue(ExistingPatientApptStartdatePicker) && !hasValue($scope.AppointmentDateInAddMode)) {
                $scope.AppointmentDateInAddMode = new Date(ExistingPatientApptStartdatePicker).getFormat("MM/dd/yyyy"); //Assigning the date value to the text box
            }

            //validation added by Ganesh V.
            if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) {
                ShowErrorMessage("Please Select /Enter Appointment Date. ");
                $scope.addAppointmentSelectAppointmentDate = true;
                return;
            }

            if (!hasValue($scope.AppointmentTimeInAddMode)) {
                ShowErrorMessage("Please Select Appointment time.")
                $scope.addAppointmentSelectAppointmentTime = true;
                return;
            }

            if (hasValue($scope.editAppointmentDisableControlsWhileInCallCenterMode) && $scope.editAppointmentDisableControlsWhileInCallCenterMode == true) {
                return;
            }
            //APPOINTMETN DATE AND TIME TO SELECT PROVIDER
            var ExistingPatientApptDateandTime = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;


            var physicianPopupInfo = {
                //"providerName": $scope.existingPatientAppointmentSelectedProviderorResource,
                //"ProviderID": SelectedPhysicianID,
                //"ResourceType": SelectedResourceType,
                "apptschedulerSelectPhysianAppointmentDate": ExistingPatientApptDateandTime,

            };

            //calling the popup navigation from
            physicianPopupInfo.RequestingFrom = "AddAppointment";
            if (hasValue($scope.SelectedExistingPatApptFacilities)) {
                physicianPopupInfo.FacilityID = $scope.SelectedExistingPatApptFacilities;
            }


            //filter the therapists details in the select provider or resource Popup when new appt given from the gilbert clinic
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList) && $scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList.length > 0) {
                physicianPopupInfo.gilbertClinicSelectedTherapistsList = $scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList;
            }
            if ($scope.EMRDataFromPopup && $scope.EMRDataFromPopup.isFromApptSchedulerFormat3New) {
                physicianPopupInfo.ResourceType = 1;//1-providers
            }

            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/73'*/GetEMRPageURLByIndex(1112), physicianPopupInfo, 'sm').then(function (result) {
                if (result == 'cancel') return false;
                if (!hasValue(result)) return false;
                //if the proivders or resources selected then assign the name and ID
                if (hasValue(result) && result.length > 0) {
                    $scope.existingPatientAppointmentSelectedProviderorResource = result[0].DoctorName;
                    SelectedPhysicianID = result[0].PhysicianId;
                    SelectedResourceType = result[0].ResourceType;

                    $scope.SelectedPhysicianData = result[0];   //hold the physician total data

                    SelectedUserAuthenticatedMailCalenderTypes = result[0].AuthenticateCalenderTypes;

                    //ADDED BY PAVAN KUMAR KANDULA ON 19-12-2K17 FOR GETTING THE RESOURCE LINKED FACILITY  START ////////
                    //here while changing the provider for the appointment then we will get the facilities linked to that provider
                    //but here if the resource type is 2 then only sending the provider id 
                    //if that provider details is not sent then we will not get the facility linked to that provider
                    //so due to this here resource type is sending as input
                    if (hasValue(SelectedPhysicianID) && hasValue(SelectedResourceType)) {
                        $scope.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList(SelectedPhysicianID, SelectedResourceType, true);
                    }
                    else {
                        $scope.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList(SelectedPhysicianID, null, true);
                    }
                    //ADDED BY PAVAN KUMAR KANDULA ON 19-12-2K17 FOR GETTING THE RESOURCE LINKED FACILITY  END /////////

                    //calling the service to get the minimim interval  and default duraton based on the provider or resource selection
                    $scope.SelectedExistingPatApptVisitType = 0;
                    $scope.ApptSchedView_GetApptsVisitType();//to refresh the visit types based on the selected provider

                    $scope.existingPatientAppointmentsRemoveselectedPhysicianorResfrmAdditionalParticipant(SelectedPhysicianID, SelectedResourceType);

                    //$scope.SelectedExistingPatApptDuration = "";
                    $scope.ApptSchedView_GetMinimumInterval(false, true);  //calling the minimum interval
                    $scope.existingApptSelectedResourceType = SelectedResourceType;

                    //LIST OF LINKED USRS FOR THE SELECTED PROVIDER IN HOUSE CALL TIMINGS
                    $scope.existingPatientAppointmentsGetLinkedUserslistforHouseCall();

                    //hiding Resource or Room
                    if ($scope.ExistingPatientAppointmentColumnsCustomizationInfoList.filter(function (ExistingPatientAppointmentColumnsCustomizationFields) {
                        return ((ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.RESOURCE ||
                            ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSRESOURCEORROOM));
                    }).length == 0 || SelectedResourceType == 2 && result[0].ResourceorRoomType == 1) {
                        $scope.existingappointmentshowSelectResourceOrRoom = false;
                        $scope.existingPatientAppointmentSelectResource = "";
                        $scope.existingPatientAppointmentSelectResourceID = 0;
                        //angular.element("#existingPatientAppointmentSelectResource").unbind("click");
                    }
                    else {
                        $scope.existingappointmentshowSelectResourceOrRoom = true;
                        $timeout(function () {
                            $scope.existingappointmentshowSelectResourceOrRoomWidthClass = "colReq-sm-6 col-xs-12 col-md-6";
                            //$scope.apply();

                        }, 100);
                    }
                    //if the Room field is customized and the selected value from popup is Room then Hide room field
                    if ($scope.ExistingPatientAppointmentColumnsCustomizationInfoList.filter(function (ExistingPatientAppointmentColumnsCustomizationFields) {
                        return (ExistingPatientAppointmentColumnsCustomizationFields.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ROOM);
                    }) && SelectedResourceType == 2 && result[0].ResourceorRoomType == 2) {
                        $scope.existingappointmentshowSelectRoom = false;
                        $scope.existingPatientAppointmentSelectRoomID = 0;
                        $scope.existingPatientAppointmentSelectRoom = "";
                    }
                    else {
                        $scope.existingappointmentshowSelectRoom = true;

                    }

                    if (SelectedResourceType == 2) {
                        $scope.ExistingPatientAppt_GetResourceType();//TO SHOW HIDE THE RESOURCE PROVIDER OR RESOURCE/ ROOM BASED ON THE SELECTION
                        //$scope.existingappointmentshowSelectResourceOrRoom = false;
                        $scope.existingpatientappointmentButtonsWidthClass = "colReq-sm-12 col-md-12 col-xs-12";

                        $scope.existingPatientAppointmentSelectResource = "";
                        $scope.existingPatientAppointmentSelectResourceID = 0;
                    }
                    else {
                        //$scope.existingappointmentshowSelectResourceOrRoom = true;
                        $scope.existingpatientappointmentButtonsWidthClass = "colReq-sm-12 col-md-6 col-xs-12";

                        $scope.addNewApptSelectResourceProvider = false;
                        $scope.selectResourceProvider = "";
                        $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID = 0;
                    }

                    checkUserHasGoogleMeetEnabledOrNotAndShowHideSaveButton();
                    //$timeout(function () {
                    //	if (EMRPracticeModel && [285, 267, 565, 999].includes(EMRPracticeModel.PracticeID))
                    //		autoPopulateauthcountFromDuration($scope.SelectedExistingPatApptDuration);
                    //}, 200)
                }
            });
        }


        //################### THIS IS USED TO CLEAR PROVIDER OR RESOURCE SELECTION  BLOCK START #########################
        //*******PURPOSE: THIS IS USED TO  CHANGE THE PROVIDER OR RESOURCE TO GIVE THE APPTS
        //*******CREATED BY: HEMANTH U
        //*******CREATED DATE: JULY 01 2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentSelectProviderClearClick = function () {

            $scope.existingPatientAppointmentSelectedProviderorResource = "";
            SelectedPhysicianID = 0;
            SelectedResourceType = 0;
            $scope.SelectedPhysicianData = {};
            $scope.SelectedPatientData = "";
            $("#existingPatientAppointmentSelectProvider").focus();
        }
        //################### SAVE APPOINTMENT INFO AND OPEN SEND APPOINTMENT REMAINDER POPUP BLOCK START #########################
        //*******PURPOSE: This method used to SAVE APPOINTMENT INFO AND OPEN SEND APPOINTMENT REMAINDER POPUP 
        //*******CREATED BY: PHANI KUMAR M
        //*******CREATED DATE: JULY 4 th 2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.ApptSchedView_SaveAppointmentsforExistingPatientAndSendAppointmentRemainder = function () {

            //FROM EMERGENCY WEB SITE EDIT AND UPDATE BILLING INFO IS NOT ACCESSIABLE
            if (EMRCommonFactory.EMRCheckPermissions("APPOINTMENTS-SENDAPPOINTMENTREMINDER") == EMRPermissionType.DENIED) {
                ShowErrorMessage(EmrPermissionShowingMessage);
                return false;
            }
            //if (hasValue($scope.AppointmentDateInAddMode) && (DateDiff.inDays($scope.AppointmentDateInAddMode, adminGetCurrentDate()) > 0)) {
            //    ShowErrorMessage("Appointment Date Should be Greater than or Equal to Current Date");
            //    $scope.addAppointmentSelectAppointmentDate = true;
            //    return false;
            //}

            $scope.ApptSchedView_SaveAppointmentsforExistingPatient(false);
        };
        //################### SAVE APPOINTMENT INFO AND OPEN SEND APPOINTMENT REMAINDER POPUP BLOCK END #########################



        //################### THIS IS USED TO SELECT MULTIPLE PROVIDER OR RESOURCE BLOCK START #########################
        //*******PURPOSE: THIS IS USED TO  SELECT MULTIPLE PROVIDER OR RESOURCE TO GIVE THE APPTS ONLY FOR EVENT OR ORGANISATION
        //*******CREATED BY:Rama M
        //*******CREATED DATE:07/21/2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentAdditionalParticipantsPopupclick = function () {

            if (!hasValue($scope.AppointmentDateInAddMode)) {
                ShowErrorMessage("Please Select / Enter Appointment Date.");
                $scope.addAppointmentSelectAppointmentDate = true;
                return;
            }
            //Check valid date format
            if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) return;

            if (!hasValue($scope.AppointmentTimeInAddMode)) {
                ShowErrorMessage("Please Select / Enter Appointment time.");
                $scope.addAppointmentSelectAppointmentTime = true;
                return;
            }

            if (!hasValue($scope.SelectedExistingPatApptDuration)) {
                ShowErrorMessage("Please Enter / Select Duration.");
                if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration))
                    $scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration.focus();
                return;
            }


            var postData = {
                RequestingFrom: "AdditionalParticipantsForAppointments",
                SelectedPhsysicansList: $scope.SelectedParticipantList,
                SelectedAppointmentDateTime: $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode,
                SelectedAppointmentDate: $scope.AppointmentDateInAddMode,
                SelectedAppointmentDuration: $scope.SelectedExistingPatApptDuration,
            }

            if (!hasValue(SelectedPhysicianID) || SelectedPhysicianID <= 0) {
                ShowErrorMessage("Please Select Provider / Resource. ");
                $("#existingPatientAppointmentSelectProvider").focus();
                return false;
            }


            //filter the therapists details in the select provider or resource Popup when new appt given from the gilbert clinic
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList) && $scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList.length > 0) {
                postData.gilbertClinicSelectedTherapistsList = $scope.EMRDataFromPopup.gilbertClinicSelectedTherapistsList;
            }

            postData.ProviderID = SelectedPhysicianID;
            postData.ResourceType = SelectedResourceType;

            if ($scope.addNewApptSelectResourceProvider == true) {
                if (!hasValue($scope.selectResourceProvider)) {
                    ShowErrorMessage(`Please ${$scope.existingPatientApptResourceRoomProviderLabelName}. `);
                    $("#spanSelectResourceProvider").focus();
                    return false;
                }
            }
            //Resourc linked physician then assign resource type as 1
            if (hasValue($scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID) && $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID > 0) {
                postData.ResourceProviderorRoomID = $scope.NewAppointmentSchedulerModel.ResourceLinkedPhysicianID;
                postData.ResourceProviderorRoomType = 1;
            }
            //for resource or room it will be 2
            else if (hasValue($scope.existingPatientAppointmentSelectResourceID) && parseInt($scope.existingPatientAppointmentSelectResourceID) > 0) {
                postData.ResourceProviderorRoomID = $scope.existingPatientAppointmentSelectResourceID;
                postData.ResourceProviderorRoomType = 2;
            }
            //open the popup to select the participants 
            //ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/73'*/GetEMRPageURLByIndex(1112), postData, 'sm').then(function (result) {
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/73'*/GetEMRPageURLByIndex(2990), postData, 'md').then(function (result) {
                if (isError(result)) return false;
                if (result == "cancel") return false;
                $scope.addAppointmentsForSelectedPatientNameAdditionalParticipantsIDS = "";
                $scope.existingPatientAppointmentAdditionalParticipants = "";
                $scope.additionalParticipantInfo = result;  //HOLD THE ADDITIONAL PARTICIPANTS INFORMATION FOR CHRECKING THE PROVIDER HAS INACTIVE STATE
                $scope.SelectedParticipantList = [];
                $scope.AdditionalParticipantsNames = "";
                angular.forEach(result, function (item) {
                    if (hasValue(item)) {

                        $scope.SelectedParticipantList.push({
                            PhysicianID: item.PhysicianId, ResourceType: item.ResourceType, AdditionalParticipantName: item.DoctorName, AuthenticateCalenderTypes: item.AuthenticateCalenderTypes, AuthenticateCalenderUserMailIDs: item.AuthenticateCalenderUserMailIDs,
                            AuthenticatedOutlookCalenderUserMailIDs: item.AuthenticatedOutlookCalenderUserMailIDs,
                        });  //Assign the physician ID and Resource Types to list
                        //$scope.SelectedParticipantList.push({ PhysicianID: item.PhysicianId, ResourceType: item.ResourceType, AdditionalParticipantName: item.DoctorName, });  //Assign the physician ID and Resource Types to list

                        if (hasValue(item) && hasValue(item.DoctorName)) {
                            $scope.existingPatientAppointmentAdditionalParticipants += item.DoctorName.trim() + "; ";
                            $scope.AdditionalParticipantsNames += item.DoctorName.trim() + ";";
                        }
                    }

                });
                if (hasValue($scope.existingPatientAppointmentAdditionalParticipants)) {
                    $scope.existingPatientAppointmentAdditionalParticipants = $scope.existingPatientAppointmentAdditionalParticipants.substring(0, $scope.existingPatientAppointmentAdditionalParticipants.length - 2);//removing the last character
                }
            });
        }
        //################### THIS IS USED TO SELECT MULTIPLE PROVIDER OR RESOURCE BLOCK END #########################

        $scope.existingPatientAppointmentAdditionalParticipantsClear = function () {
            $scope.SelectedParticipantList = [];
            $scope.existingPatientAppointmentAdditionalParticipants = "";
            $scope.AdditionalParticipantInfo = "";  //CLEAR THE ADDITIONAL PARTICIPANTS INFORMATION
            $scope.AdditionalParticipantsNames = "";

        }



        $scope.existingPatientAppointmentsRemoveselectedPhysicianorResfrmAdditionalParticipant = function (PhysicianID, ResourceType) {

            if (hasValue($scope.SelectedParticipantList) && $scope.SelectedParticipantList.length > 0) {
                var existingParticipantsList = [];
                var existingParticipants = "";
                //existingParticipantsList = angular.copy($scope.SelectedParticipantList);
                angular.forEach($scope.SelectedParticipantList, function (item) {
                    if (hasValue(item)) {
                        if ((PhysicianID != item.PhysicianID)) {
                            //existingParticipantsList.push({ PhysicianID: item.PhysicianID, ResourceType: item.ResourceType, AdditionalParticipantName: item.AdditionalParticipantName });  //Assign the physician ID and Resource Types to list
                            existingParticipantsList.push({
                                PhysicianID: item.PhysicianID, ResourceType: item.ResourceType, AdditionalParticipantName: item.AdditionalParticipantName, AuthenticateCalenderTypes: item.AuthenticateCalenderTypes, AuthenticateCalenderUserMailIDs: item.AuthenticateCalenderUserMailIDs,
                                AuthenticatedOutlookCalenderUserMailIDs: item.AuthenticatedOutlookCalenderUserMailIDs,
                            });  //Assign the physician ID and Resource Types to list
                            if (hasValue(item) && hasValue(item.AdditionalParticipantName)) {
                                existingParticipants += item.AdditionalParticipantName + ", ";
                            }
                        }
                    }
                });

                $scope.SelectedParticipantList = [];
                $scope.existingPatientAppointmentAdditionalParticipants = "";

                if (hasValue(existingParticipants)) {
                    $scope.existingPatientAppointmentAdditionalParticipants = existingParticipants.substring(0, existingParticipants.length - 2);//removing the last character
                }

                if (hasValue(existingParticipantsList) && existingParticipantsList.length > 0) {
                    $scope.SelectedParticipantList = existingParticipantsList;
                }

            }
        }


        //################### THIS IS USED TO SAVE THE CONCURRENT USER DETAILS BLOCK START #########################
        //*******PURPOSE: THIS IS USED TO  SAVE THE CONCURRENT USERS DETAILS 
        //*******CREATED BY:HEMANTH U
        //*******CREATED DATE:01/AUG/2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentSaveUserInformationWhileGivingConcurrentAppts = function () {

            var apptSchedulerConcurrentmodel = {
                PhysicianID: SelectedPhysicianID,
                ResourceType: SelectedResourceType,
                StartTime: $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "MM/dd/yyyy") + " " + $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "hh:mm a"),
                ConcurrentUsersBlockingNavigationFrom: 1,
            };
            //SAVING THE CONCURRENT USERS DETAILS 
            GiveNewAppointmentService.apptSchedulerSaveUserInfomationWhileGivingConcurrentAppointments(apptSchedulerConcurrentmodel).then(function (result) {
                if (isError(result)) return;
            });

        }


        //################### THIS IS USED TO DELETE THE CONCURRENT USER DETAILS DELTE AFTER 3 MINUTES BLOCK START #########################
        //*******PURPOSE: THIS IS USED TO  DELETE TEH CONCURRENT USERS DETAILS DELETE 
        //*******CREATED BY:HEMANTH U
        //*******CREATED DATE:01/AUG/2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentDeleteUserInformationWhileGivingConcurrentAppts = function () {
            var apptSchedulerConcurrentmodel = {
                PhysicianID: ExistingPatientSelectedData.SelectedPhysicianID,
                ResourceType: ExistingPatientSelectedData.SelectedResourceType,
                StartTime: $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "MM/dd/yyyy") + " " + $.format.date(new Date($scope.EMRDataFromPopup.SelectedDate), "hh:mm a"),
            };
            GiveNewAppointmentService.apptSchedulerDeleteUserInfomationWhileGivingConcurrentAppointments(apptSchedulerConcurrentmodel).then(function (result) {
                if (isError(result)) return;
            });

        }



        $scope.ExistingPatientAppointmentsCancelClick = function () {
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.RequestingFromFormat) && $scope.EMRDataFromPopup.RequestingFromFormat == 1) {
                //Added by Pavan Kumar Kandula on july 27 2k17 for Deleting the Concurrent Users Appt Details
                $scope.existingPatientAppointmentDeleteUserInformationWhileGivingConcurrentAppts();
            }
            $scope.CancelWithEvent();
        }

        //commented by mahesh p on 04/20/2018 for destroying
        //if (hasValue($scope.$parent.EMRDataFromPopup) && hasValue($scope.$parent.EMRDataFromPopup.RequestingFromFormat) && $scope.$parent.EMRDataFromPopup.RequestingFromFormat == 1) {
        $scope.$on('$destroy', function () {

                angular.forEach(kendoSelectors, function (item) {
                    if (item && typeof item.destroy === 'function') {
                        item.destroy();
                    }
        
                });
                $timeout.cancel(kendoEventsTimeout);
                $timeout.cancel(existingApptGeneralCommentTimeOut)
            //added by mahesh p on 04/20/2018 for destroying
            ehrDestroyKendoRealteElementsWithChildrens(angular.element("#divExistingApptsDynamicFieldsPopupDynamicContent_" + $scope.existingPatientApptDynamicFieldsPopupGUID));

            $timeout.cancel($scope.existingPatientAppointmentSaveUserInformationWhileGivingConcurrentApptsTimerId);

        });
        //}

        //#region    "   CHECK ELIGIBILITY METHOD  "
        /**
         * @function   $scope.existingPatientAppointmentopenCheckEligibilityClick()
         * @description METHOD USED TO CHECK THE INSURANCE ELIGIBILITY OF THE PATIENT
         * @author HARISH CH
         * @since 10/22/2020
         * */
        $scope.existingPatientAppointmentopenCheckEligibilityClick = function () {
            // ExistingPatientSelectedData IS HAVING THE ALL EMRDATATOPOUP DATA
            //CHECKING THE SELECTED PATIENT DATA IS AVAILABLE AND PATINET ID INIT
            //IF THE VALUE OF PATIENT ID IS LEESA THAN 0 MEANS NO PATIENT ID AVAILABLE 
            if (_.get(ExistingPatientSelectedData, 'SelectedPatient[0].PatientID') <= 0) {
                return;   //RETURNING (STOPPING) FUNCTION HERE
            }
            //OBJECT USED TO HOLD THE PATIENTID AND PATIENT NAME DATA USED TO SEND TO POPUP
            var dataToCheckEligibilityPopup = {
                PatientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,    //ASSIGING THE SELECTED PATEINT ID
            };
            //HERE CHECKING THE PATIENTLASTNAMEFIRSTNAME MEANS PATEINT FULL NAME AVAILABLE OR NOT IF AVAILABLE ADDING TO POPUP OBJECT PROPERTY
            if (_.get(ExistingPatientSelectedData, 'SelectedPatient[0].PersonLastNameFirstName')) {
                dataToCheckEligibilityPopup.PatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName.replace(",", "");
            }
            //IF FULLNAME IS NOT AVAILABLE TO THE PATIENT THEN COMBINING THE LAST AND FULL NAME
            //CHECKING THE SELECTED PATIENT LASTNAME AND FULL NAME
            else if (_.get(ExistingPatientSelectedData, 'SelectedPatient[0].LastName') && _.get(ExistingPatientSelectedData, 'SelectedPatient[0].FirstName')) {
                dataToCheckEligibilityPopup.PatientName = ExistingPatientSelectedData.SelectedPatient[0].LastName + " " + ExistingPatientSelectedData.SelectedPatient[0].FirstName;
            }
            // IS THE SERVICE USED TO OPEN THE PARTIICULAR WINDOW (DIRECTIVE OR CONTROLLER AVAIALABLE IN ENTIRE WEB)
            //WE HAVE TO PASS THE ENUM VALUE OF RESPECTIVE WINDOW TO THE SERVICE THERE BASED ON THE ENUM NUMBER WE CAN OPEN THE WINDOW
            //2620 I THE ENUM NUMBER OF THE SINGLE PATIENT ELIGIBILITY CHECK WINDOW NUMBER
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(2620), dataToCheckEligibilityPopup, 'modal-420px').then(function (result) {

            });
        }
        //#endregion

        //################### OPEN ADMISSION REASON  POPUP BLOCK START ####################
        ///*******PURPOSE: THIS IS USED TO OPEN ADMISSION REASON  POPUP 
        ///*******CREATED BY:Rama M
        ///*******CREATED DATE:08/02/2016
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientAppointmentopenSelectAdmissionReasonClick = function () {

            //CREATING POST DATA OBJ 
            var postData = {
                PatientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                calledFrom: "Appointments",
                ReasonToText: $scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit,
            };

            //OPENING ADM REAONS POPUP...
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1317), postData, 'md').then(function (result) {

                if (result == "cancel") {
                    $("#spanExistingPatientAppointmentOpenSelectAdmissionReason").focus();
                    return false;
                }

                //IF RESULT HAS VALUE THEN LOOPING THEM 
                if (hasValue(result) && result.length > 0) {

                    $scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit = "";

                    var reasonForVisit = "";

                    angular.forEach(result, function (item) {

                        if (hasValue(item.DXCode)) {
                            reasonForVisit = reasonForVisit + item.DXCode + " - ";
                        }

                        reasonForVisit = reasonForVisit + item.ProgramName + "; ";
                    });

                    $scope.NewAppointmentSchedulerModel.MU2ApptReasonForVisit = reasonForVisit.trimEnd(" ").trimEnd(";");
                }

            });
        };
        //################### OPEN ADMISSION REASON  POPUP BLOCK ENDS ####################



        //################### OPEN RELATIONS  POPUP BLOCK START ####################
        ///*******PURPOSE: this method is useful in opening the relations information popup for the current opened patient
        ///*******CREATED BY:Rama M
        ///*******CREATED DATE:09/08/2016
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyPopupClick = function () {
            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) return false;
            var DataToPopup = {
            };
            DataToPopup.PatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;
            DataToPopup.PatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;
            DataToPopup.DateOFBirth = ExistingPatientSelectedData.SelectedPatient[0].DateOFBirth;
            DataToPopup.isCallingFrom = 1; //Used to Show the Active Patients Only(Not Showing the Diseased Patients and Event or Organizations Info from the Edit Appt Window)
            DataToPopup.IsFromApptsAddingFamilyMembersTheraphy = true;
            //$scope.DataToPopup.LastName = $scope.patientChart1PatientInfo.LastName;
            //$scope.DataToPopup.FirstName = $scope.patientChart1PatientInfo.FIrstName;

            if (ExistingPatientSelectedData.SelectedPatient[0].Gender == "Male") {
                DataToPopup.PatientGender = 2;
            }
            else if (ExistingPatientSelectedData.SelectedPatient[0].Gender == "Female") {
                DataToPopup.PatientGender = 3;
                //GenderType
            }
            DataToPopup.SelectedCotactIDs = $scope.NewAppointmentSchedulerModel.PatientContactIDs;

            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(442), DataToPopup, 'vlg').then(function (result) {
                if (!hasValue(result)) return false;
                if (result != "cancel") {
                    $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyContactIDs = "";
                    $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyContactNames = "";

                    angular.forEach(result, function (item) {
                        if (hasValue(item)) {
                            $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyContactIDs += item.PersonRelationshipIdColumn + ",";
                            $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyContactNames += item.LastName + " " + item.FirstName + ", ";
                        }
                    });

                    $scope.NewAppointmentSchedulerModel.PatientContactIDs = $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyContactIDs.trimEnd(",");
                    $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapy = $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyContactNames.trim().trimEnd(",");
                    $scope.ExistingPatientFamilyMembersAttendingTherapy = $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapy;
                }
            });
        };
        //################### OPEN RELATIONS  POPUP BLOCK END ####################



        //################### OPEN RELATIONS  POPUP BLOCK START ####################
        ///*******PURPOSE: this method is useful in opening the relations information popup for the current opened patient
        ///*******CREATED BY:LAKSHMI B
        ///*******CREATED DATE:03/18/2017
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.selectAdditionalParticipantsPopupClick = function () {

            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) return false;
            $scope.DataToPopup = {
            };
            $scope.DataToPopup.PatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;
            $scope.DataToPopup.PatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;
            $scope.DataToPopup.isCallingFrom = 1;
            if (hasValue($scope.NewAppointmentSchedulerModel.AdditionalParticipantIDs)) {
                $scope.DataToPopup.SelectedAccompaniedByIDs = $scope.NewAppointmentSchedulerModel.AdditionalParticipantIDs;
            }
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/94'*/GetEMRPageURLByIndex(386), $scope.DataToPopup, 'modal-960px').then(function (result) {

                if (!hasValue(result) || result == "cancel") {
                    $timeout(function () {
                        $("#spanSelectAdditionalParticipants").focus();
                    }, 500);
                    return;
                }
                else {


                    $scope.existingPatientAppointmentSelectAdditionalParticipantContactIDs = "";
                    $scope.existingPatientAppointmentSelectAdditionalParticipantContactNames = "";

                    $scope.existingPatientsAdditionalParticipantsList = [];

                    angular.forEach(result, function (item) {
                        if (hasValue(item)) {
                            $scope.existingPatientAppointmentSelectAdditionalParticipantContactIDs += item.PersonRelationshipIdColumn + ",";
                            $scope.existingPatientAppointmentSelectAdditionalParticipantContactNames += item.LastName + ", " + item.FirstName + "; ";
                        }
                        //Added isPatient flag to check whether additional participant is patient while auto uploading easy form to portal based on customizations
                        $scope.existingPatientsAdditionalParticipantsList.push({
                            AccompaniedByID: item.PersonRelationshipIdColumn, AccompaniedByLinkedRelationType: item.LinkedRelationorProvidersType, isPatient: item.IsPatient
                        });
                    });

                    $scope.NewAppointmentSchedulerModel.AdditionalParticipantIDs = $scope.existingPatientAppointmentSelectAdditionalParticipantContactIDs.trimEnd(",");
                    $scope.existingPatientAppointmentSelectAdditionalParticipantContactNames = $scope.existingPatientAppointmentSelectAdditionalParticipantContactNames.trim().trimEnd(";");
                    $scope.existingPatientselectedAdditionalParticipants = $scope.existingPatientAppointmentSelectAdditionalParticipantContactNames;
                }
            });
        };
        //################### OPEN RELATIONS  POPUP BLOCK END ####################


        $scope.ClearSelectedAdditionalParticipantsDetails = function () {
            $scope.existingPatientselectedAdditionalParticipants = "";
            $scope.existingPatientsAdditionalParticipantsList = [];
            $scope.NewAppointmentSchedulerModel.AdditionalParticipantIDs = "";
            $scope.NewAppointmentSchedulerModel.ApptAdditionalParticipantsWithOutClient = false;
            $scope.NewAppointmentSchedulerModel.IsInterpreterRequired = false;
        }




        //################### OPEN LEVEL OF CARE  POPUP BLOCK START ####################
        ///*******PURPOSE: this method is useful in opening the relations information popup for the current opened patient
        ///*******CREATED BY:Rama M
        ///*******CREATED DATE:09/08/2016
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientAppointmentSelectLevelOfCarePopupclick = function () {
            var postData = {
                RequestingFrom: "AddAppointment",
            }
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1621), postData, 'vlg').then(function (result) {
                $("#existingPatientAppointmentSelectLevelOfCare").focus();
                if (result == "cancel") return false;
                $scope.existingPatientAppointmentSelectLevelOfCare = result.LOCName;
                $scope.NewAppointmentSchedulerModel.AppointmentsLevelOfCareMasterListID = result.levelofcareMasterListID;
            });
        };
        //################### OPEN LEVEL OF CARE  POPUP BLOCK END ####################




        $scope.existingPatientAppointmentSelectFacilityPopup = function () {
            var datatoPopup = {
                IsFromApptsAdding: true,
                callCenterSelectedPracticeModelData: callCenterSelectedPracticeModel,
                providerID: SelectedPhysicianID,
                ResourceType: SelectedResourceType,
                selectExternalFacilityAsDefault: true,
            };
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(926), datatoPopup, 'lsm').then(function (result) {
                if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlAppointmentFacility))
                    $scope.existingPatientAppointmentWidgets.ddlAppointmentFacility.focus();
                if (result == "cancel") return false;
                if (hasValue(result)) {
                    $scope.SelectedExistingPatApptFacilities = result.FacilityID;
                    $scope.SelectedFacilityDisplayName = result.FacilityDisplayName;
                }
            });
        }


        $scope.existingPatientAppointmentSelectLevelOfCareClearClick = function () {
            $scope.existingPatientAppointmentSelectLevelOfCare = "";
            $scope.NewAppointmentSchedulerModel.AppointmentsLevelOfCareMasterListID = 0;
            $("#existingPatientAppointmentSelectLevelOfCare").focus();
        }

        $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapyClear = function () {
            $scope.existingPatientAppointmentSelectFamilyMembersAttendingTherapy = "";
            $scope.NewAppointmentSchedulerModel.PatientContactIDs = undefined;
            $("#existingPatientAppointmentSelectFamilyMembersAttendingTherapy").focus();
            $scope.ExistingPatientFamilyMembersAttendingTherapy = "";
        }



        //################### GET THE LIST OF LINKED USRS FOR THE SELECTED PROVIDER IN HOUSE CALL TIMINGS BLOCK START ####################
        ///*******PURPOSE: this method is used to get the list of liked users for the slected Provider
        ///*******CREATED BY:HEMANTH U
        ///*******CREATED DATE:11/03/2016
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientAppointmentsGetLinkedUserslistforHouseCall = function () {

            var postData = {
            };

            if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) {
                ShowErrorMessage("Please Enter Valid Date Format MM/DD/YYYY.");
                $scope.addAppointmentSelectAppointmentDate = true;
                return;
            }

            if (!hasValue($scope.AppointmentTimeInAddMode)) {
                ShowErrorMessage("Please Select Appointment time.")
                $scope.addAppointmentSelectAppointmentTime = true;
                return;
            }

            //date time to get the linked users
            var SelectedDate = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;

            postData.TypeOfAppointment = 1;  // FOR HOUSE CALL TYPE AS " 1"
            postData.SlotTime = SelectedDate;
            postData.PhysicianId = SelectedPhysicianID;
            if (new Date(SelectedDate).toString().toLowerCase() == "Invalid Date".toLowerCase()) return;
            //CALLING THE SERVICE TO GET THE LIKED USERS FOR THE SELECTED HOUSE CALL TIMINGS
            GiveNewAppointmentService.apptSchedulergetLinkedusersListforHouseCall(postData).then(function (result) {
                if (isError(result)) return false;

                //ONLY IF THE LINKED USERS EXISTS FOR THE SELECTED TIME DURING HOUSE CALL
                if (hasValue(result) && result.length > 0) {
                    $scope.addAppointmentsForSelectedPatientNameAdditionalParticipantsIDS = "";
                    $scope.existingPatientAppointmentAdditionalParticipants = "";
                    $scope.AdditionalParticipantInfo = result;
                    $scope.SelectedParticipantList = [];

                    angular.forEach(result, function (item) {
                        if (hasValue(item)) {
                            //ASSING THE USERS FOR THE SLEECTED 
                            $scope.SelectedParticipantList.push({
                                PhysicianID: item.PhysicianId, ResourceType: 1, AdditionalParticipantName: item.DoctorName, AuthenticateCalenderTypes: item.AuthenticateCalenderTypes, AuthenticateCalenderUserMailIDs: item.AuthenticateCalenderUserMailIDs,
                                AuthenticatedOutlookCalenderUserMailIDs: item.AuthenticatedOutlookCalenderUserMailIDs,
                            });  //Assign the physician ID and Resource Types to list

                            if (hasValue(item) && hasValue(item.DoctorName)) {
                                $scope.existingPatientAppointmentAdditionalParticipants += item.DoctorName + "; ";
                            }
                        }

                    });
                    if (hasValue($scope.existingPatientAppointmentAdditionalParticipants)) {
                        $scope.existingPatientAppointmentAdditionalParticipants = $scope.existingPatientAppointmentAdditionalParticipants.substring(0, $scope.existingPatientAppointmentAdditionalParticipants.length - 2);//removing the last character
                    }

                }

            });
        }

        //################### GET THE LIST OF LINKED USRS FOR THE SELECTED PROVIDER IN HOUSE CALL TIMINGS BLOCK END ####################

        //APPOINTMENT REMINDERS AUTO REFRESH
        //DEVELOPED BY RAVI TEJA.P
        //DATE:8/22/2016
        $scope.appointmentRemindersAutoRefresh = function () {

            if (!hasValue(SelectedPatientID) || (hasValue(SelectedPatientID) && parseInt(SelectedPatientID) <= 0)) return;

            var refreshData = {
                HMRulesAutoExecutionModuleType: enumEasyFormReminderRulesType.Appointments,
                HMRulesAutoExecutionPatientID: SelectedPatientID,
                WhenToPerformRuleInfoID: EasyFormReminderWhenToPerformActionEnum.Appointment_Creation_Update_Action_Performs
            }
            // console.log(SelectedPatientID);
            EMRCommonFactory.RefreshAllModulesEasyFormRemainderRules(refreshData);

            //// REMINDERS OPTIMIZATION CHANGES -----------
            //// CODE ADDED BY AJAY ON 04/02/2019

            //var reminderRuleDuesRefreshData = {
            //    ReminderRuleExecutionModuleTypeID: enumEasyFormReminderRulesType.Appointments,     // MODULE TYPE ID 
            //    ReminderRuleExecutionPatientID: SelectedPatientID,                                 // PATEINT ID
            //    ModuleID: EHRModulesLKPForRemindersRules.APPOINTMENTS,                             // MODULE ID  
            //    WhenToPerformRuleInfoID: EasyFormReminderWhenToPerformActionEnum.Appointment_Creation_Update_Action_Performs, // WHEN TO PERFORM RULE INFO ID
            //};

            //// MAKE A CALL TO EXECUTE BOTH HM AND EASYFORM REMINDER RULE DUES EXECUTION 
            //// FIRST PARAMETER TO INDICATE WHICH REMINDER RULES NEED TO EXECUTE
            //// SECOND PARAMETER DATA NEED TO EXECUTE REMINDER RULES
            //// THIRD PARAMETER FLAG IS TO INDICATE NEED TO EXECUTE REFRESH REMINDER RULES BASED ON MODULE WISE
            //RemindersCommonFactory.ExecuteHMAndEasyFormsReminderRulesDuesRefresh(EHRRemindersRulesExecutionType.EASYFORM_REMINDER_RULES, reminderRuleDuesRefreshData, false);

            //// REMINDERS OPTIMIZATION CHANGES -----------
        }


        //################### OPEN SELECT EPISODE POPUP BLOCK START #########################
        //*******PURPOSE: This Popup is for Select Episode
        //*******CREATED BY:Rama M
        //*******CREATED DATE: 12/21/2016
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.openExistingPatientEpisodePopupClick = function () {


            var postdata = {
                PatientDetails: ExistingPatientSelectedData.SelectedPatient[0],
                EpisodesList: $scope.existingPatientAppointmentDetailsEpisodeNamesDetailsList,
                AppointmentDate: $scope.AppointmentDateInAddMode
            }


            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/39'*/GetEMRPageURLByIndex(1923), postdata, 'modal-600px').then(function (result) {
                if (result == "cancel") return false;
                //ONLY IF THE LINKED USERS EXISTS FOR THE SELECTED TIME DURING HOUSE CALL
                if (hasValue(result)) {
                    $scope.InPatCareLevelEventEndDate = result.EnrollmentEndDate;
                    $scope.InPatCareLevelAdmittedDate = result.AdmittedDate;
                    $scope.InPatCareLevelEventInfoID = result.InPatCareLevelEventInfoID;

                    //SHOWING THE EPISODE NUMBER ALONG WITH ADMITTED DATE
                    //IN BOTH ADD AND EDIT MODE WE WILL SHOW THE SAME FORMAT
                    //PLACED BY SRINIVAS M ON 28TH APRIL 2020 BLOCK START
                    //$scope.OpenExistingPatientEpisodeNumber = result.EpisodeNameDesc;
                    if (hasValue(result.EpisodeNumber) && hasValue(result.AdmittedDate)) {
                        $scope.OpenExistingPatientEpisodeNumber = result.EpisodeNumber + "   (Admit Date: " + result.AdmittedDate + ")";
                    }
                    else if (hasValue(result.EpisodeNumber)) {
                        $scope.OpenExistingPatientEpisodeNumber = result.EpisodeNumber;
                    }
                    else {
                        $scope.OpenExistingPatientEpisodeNumber = result.EpisodeNameDesc;
                    }
                    //SHOWING THE EPISODE NUMBER ALONG WITH ADMITTED DATE
                    //IN BOTH ADD AND EDIT MODE WE WILL SHOW THE SAME FORMAT
                    //PLACED BY SRINIVAS M ON 28TH APRIL 2020 BLOCK END

                }
            });
        }
        //################### OPEN SELECT EPISODE POPUP BLOCK END #########################


        $scope.ClearOpenExistingPatientEpisode = function () {
            $scope.InPatCareLevelEventInfoID = 0;
            $scope.OpenExistingPatientEpisodeNumber = "";
        }



        //################### GET THE LIST OF LINKED USRS FOR THE SELECTED PROVIDER IN HOUSE CALL TIMINGS BLOCK START ####################
        ///*******PURPOSE: this method is used to get the list of liked users for the slected Provider
        ///*******CREATED BY:HEMANTH U
        ///*******CREATED DATE:11/03/2016
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientAppointmentsGetPatientEpisodeDetailsList = function () {

            var postData = {
            };



            //date time to get the linked users
            postData.PatientID = ExistingPatientSelectedData.SelectedPatient[0].PatientID;

            if (hasValue($scope.AppointmentDateInAddMode)) {
                //validation added by Ganesh V.
                if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) {
                    ShowErrorMessage("Please Enter Valid Date Format MM/DD/YYYY.");
                    $scope.addAppointmentSelectAppointmentDate = true;
                    return false;
                }

                postData.AppointmentDate = $scope.AppointmentDateInAddMode;
            }


            //CALLING THE SERVICE TO GET THE LIKED USERS FOR THE SELECTED HOUSE CALL TIMINGS
            GiveNewAppointmentService.ApptSched_GetPatientEpisodeNumbersDetailsList(postData).then(function (result) {
                if (isError(result)) return false;
                //ONLY IF THE LINKED USERS EXISTS FOR THE SELECTED TIME DURING HOUSE CALL
                if (hasValue(result) && hasValue(result.linkServicestoProgramsModelList) && result.linkServicestoProgramsModelList.length > 0) {
                    if (result.linkServicestoProgramsModelList.length == 1) {
                        $scope.InPatCareLevelEventInfoID = result.linkServicestoProgramsModelList[0].InPatCareLevelEventInfoID;
                        $scope.OpenExistingPatientEpisodeNumber = getEpisodeText(result.linkServicestoProgramsModelList[0])
                    }
                    $scope.existingPatientAppointmentDetailsEpisodeNamesDetailsList = result.linkServicestoProgramsModelList;
                }
            });
        }


        /**
         * Get Text to be shown in episode text box
         * @param {{ EpisodeNumber: number, AdmittedDate: string, EpisodeNameDesc: string }} episodeDetails 
         * @returns {string} Returns concatinated property values
         */
        function getEpisodeText(episodeDetails) {
            if (!episodeDetails) return

            if (episodeDetails.EpisodeNumber && episodeDetails.AdmittedDate) {
                return episodeDetails.EpisodeNumber + "   (Admit Date: " + episodeDetails.AdmittedDate + ")";
            }
            else if (episodeDetails.EpisodeNumber) {
                return episodeDetails.EpisodeNumber;
            }
            else {
                return episodeDetails.EpisodeNameDesc;
            }
        }

        //################### GET THE LIST OF LINKED USRS FOR THE SELECTED PROVIDER IN HOUSE CALL TIMINGS BLOCK END ####################


        //######### DATA FOR MEDICATION SIDE EFFECTS BLOCK START #############
        ///*******PURPOSE: THIS IS USED TO PROVIDE  DATA FOR MEDICATION SIDE  effects dropdowN
        ///*******CREATED BY: Rama M
        ///*******CREATED DATE:01/03/2017
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientMedicationSideEffectsDropdownInfo = [
            {
                "existingPatientMedicationSideEffectsOption": " - Select - ", "existingPatientMedicationSideEffectsOptionId": "0"
            },
            {
                "existingPatientMedicationSideEffectsOption": "Yes", "existingPatientMedicationSideEffectsOptionId": "2"
            },
            {
                "existingPatientMedicationSideEffectsOption": "No", "existingPatientMedicationSideEffectsOptionId": "1"
            },
        ]

        //BIND THE DATA TO THE DROPDOWN DATASOURCE
        $scope.existingPatientMedicationSideEffectsDropdownDataSource = new kendo.data.DataSource({
            data: $scope.existingPatientMedicationSideEffectsDropdownInfo,//ASSIGNING NULL ON DEFAULT       
        });
        //######### DATA FOR MEDICATION SIDE EFFECTS BLOCK END #############

        $scope.existingPatientMedicationSideEffectsOptionChange = function () {
            if ($scope.existingPatientMedicationSideEffects == 2) {
                if (!adminIsDevice()) {
                    setTimeout(function () {
                        $("#txtExistingPatientAppointmentSideEffectComment").focus();
                    }, 100);
                }
                $scope.existingPatientSideEffectCommentShow = true;
                //$scope.existingPatientMedicationSideEffectsWidthClass = "colReq-sm-6 col-xs-12";

            }
            else {
                $scope.existingPatientAppointmentSideEffectComment = "";
                $scope.existingPatientSideEffectCommentShow = false;
                //$scope.existingPatientMedicationSideEffectsWidthClass = "colReq-sm-12 col-xs-12";

            }
        }



        //######### SHOW SCHEDULES POPUP BLOCK START ##############
        //*******PURPOSE: This method gets the Check Availability
        //*******CREATED BY:Rama M
        //*******CREATED DATE: 01/09/2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentsShowSchedulesPopupClick = function () {


            if (!hasValue($scope.AppointmentDateInAddMode)) {
                ShowErrorMessage("Please Select / Enter Appointment Date.");
                $scope.addAppointmentSelectAppointmentDate = true;
                return;
            }
            //Check valid date format
            if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) return;

            if (!hasValue($scope.AppointmentTimeInAddMode)) {
                ShowErrorMessage("Please Select / Enter Appointment time.");
                $scope.addAppointmentSelectAppointmentTime = true;
                return;
            }

            if (!hasValue($scope.existingPatientAppointmentAdditionalParticipants)) {
                ShowErrorMessage("Please Select Additional Provider Participants.");
                $("#existingPatientAppointmentAdditionalParticipants").focus();
                return;
            }

            var selectedUsersList = [];

            if (hasValue($scope.SelectedParticipantList) && $scope.SelectedParticipantList.length > 0) {
                angular.forEach($scope.SelectedParticipantList, function (item) {
                    if (hasValue(item)) {
                        selectedUsersList.push({
                            PhysicianID: item.PhysicianID, ResourceType: item.ResourceType, ProviderName: item.AdditionalParticipantName
                        });  //Assign the physician ID and Resource Types to list
                    }

                });

            }

            var datatoPopup = {
                selectedAddlParticipantsList: selectedUsersList,
                SelectedAppointmentDateTime: $scope.AppointmentDateInAddMode,
            }

            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1964), datatoPopup, 'modal-1000px').then(function (result) {
                $("#txtExistingPatientAppointmentsShowSchedules").focus();

            });
        }
        //######### SHOW SCHEDULES POPUP BLOCK END ##############



        //######### CHECK AVAILABILITY POPUP BLOCK START ##############
        //*******PURPOSE: This method gets the Check Availability
        //*******CREATED BY:Rama M
        //*******CREATED DATE: 01/09/2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentsCheckAvailabilityPopupClick = function () {
            if (!hasValue($scope.AppointmentDateInAddMode)) {
                ShowErrorMessage("Please Select / Enter Appointment Date.");
                $scope.addAppointmentSelectAppointmentDate = true;
                return;
            }
            //Check valid date format
            if (!validateDateOnDemand($scope.AppointmentDateInAddMode)) return;

            if (!hasValue($scope.AppointmentTimeInAddMode)) {
                ShowErrorMessage("Please Select / Enter Appointment time.");
                $scope.addAppointmentSelectAppointmentTime = true;
                return;
            }

            if (!hasValue($scope.SelectedExistingPatApptDuration)) {
                ShowErrorMessage("Please Enter / Select Duration.");
                if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration))
                    $scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration.focus();
                return;
            }

            if (!hasValue($scope.existingPatientAppointmentAdditionalParticipants)) {
                ShowErrorMessage("Please Select Additional Provider Participants.");
                $("#existingPatientAppointmentAdditionalParticipants").focus();
                return;
            }

            var datatoPopup = {
                selectedAddlParticipantsList: $scope.SelectedParticipantList,
                SelectedAppointmentDateTime: $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode,
                SelectedAppointmentDuration: $scope.SelectedExistingPatApptDuration,
            }
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1963), datatoPopup, 'modal-620px').then(function (result) {
                if (isError(result)) return false;

                $("#existingPatientAppointmentsCheckAvailability").focus();
            });
        }
        //######### CHECK AVAILABILITY POPUP BLOCK END ##############


        //######### METHOD FOR COUNT COPAY BASED ON PATIENT INSURANCE ID BLOCK START ##############
        //*******PURPOSE: THIS METHOD  USED TO COUNT COPAY BASED ON PATIENT INSURANCE ID
        //*******CREATED BY: PAVAN KUMAR B
        //*******CREATED DATE: 02/17/2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentCheckCopayCount = function (PatientInsuranceID, isFromClickEvent) {


            var PatientInsuranceId = "";
            if (hasValue(PatientInsuranceID)) {
                PatientInsuranceId = PatientInsuranceID;
            } else if (hasValue($scope.existingPatientAppointmentBillToInsuranceID) && $scope.existingPatientAppointmentBillToInsuranceID > 0) {
                PatientInsuranceId = $scope.existingPatientAppointmentBillToInsuranceID;
            }

            if (!hasValue(PatientInsuranceId)) return;
            var inputData = {
                PatientInsuranceID: PatientInsuranceId,
            };


            if ($scope.selectedProgramServicesLinkedInfoID) {
                inputData.ProgramServiceLinkedInfoIDs = $scope.selectedProgramServicesLinkedInfoID;
            }

            GiveNewAppointmentService.GetAppointmentsPatientInsuranceCopay(inputData).then(function (ServiceResponce) {
                if (isError(ServiceResponce)) return;

                if (isFromClickEvent && (!ServiceResponce || !ServiceResponce.length)) {
                    ShowErrorMessage("Copay not available.");
                }

                if (hasValue(ServiceResponce)) {
                    if (ServiceResponce.length > 0) { // IF THAT PATIENT INSURANCE ID HAVE MORE THAN ONE COPAY THEN OPEN POPUP TO SELECT COPAY
                        if (hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue || $scope.hideBilltoField) {
                            assignCopayAmountAndSequence(ServiceResponce[0]);
                            return;
                        }
                        var datatoPopup = {
                            PatientInsuranceID: PatientInsuranceId,
                            ProgramServiceLinkedInfoIDs: $scope.selectedProgramServicesLinkedInfoID

                        };

                        datatoPopup.NeedSelectedItem = true;
                        if (hasValue(isFromClickEvent) && isFromClickEvent == true) {
                            datatoPopup.IsFrom = "AddEditAppointments";
                        }

                        if (ServiceResponce.length > 0) {
                            datatoPopup.insuranceLinkedCopayDataList = ServiceResponce;
                        }
                        //check "isFromClickEvent" is true 
                        //check "isFromClickEvent" is true 
                        //check "isFromClickEvent" is true 
                        //if "isFromClickEvent" is true means click from copay popup
                        //And length of "ServiceResponce" > 1 means Copay list contains more than one copay
                        if (isFromClickEvent == true || ServiceResponce.length > 1) {
                            //Function call to open copay popup
                            //"PatientInsuranceId" is send as input to the popup
                            //And the result from copay popup is assigned to copay field by calling function "assignCopayAmountAndSequence"
                            exitingPatientApptOpenCopayPopup(datatoPopup).then(assignCopayAmountAndSequence);
                        }
                        else {
                            //Function call to get billing setting value 
                            //Function call to get billing setting value 
                            //Function call to get billing setting value 
                            //"getBillingSettingValueToDisplayCopayPopup" is used to access method in AddPatientPoliciesService
                            //seeting value is the respoanse from the method
                            getBillingSettingValueToDisplayCopayPopup().then(function (settingValue) {
                                //Setting value = 0(open Copay popup)
                                //Setting value = 1(auto populate Copay value in the copay field)
                                if (settingValue == 1) {
                                    //Populating copay value by accessing function  "assignCopayAmountAndSequence"
                                    //Copay list contained object is send as input to populate
                                    assignCopayAmountAndSequence(ServiceResponce[0]);
                                } else {
                                    //Function call to open copay popup
                                    //"PatientInsuranceId" is send as input to the popup
                                    //And the result from copay popup is assigned to copay field by calling function "assignCopayAmountAndSequence"
                                    exitingPatientApptOpenCopayPopup(datatoPopup).then(assignCopayAmountAndSequence);
                                }
                            });
                        }
                    }
                    else {

                    }



                }
                else if (editAppointmentCopayLinkedtoApptPoulationBasedOnPracticeId) {
                    $scope.NewAppointmentSchedulerModel.CopayAmmount = null;
                    $scope.NewAppointmentSchedulerModel.CopayOriginalSequence = null;
                }
            });
        };
        //######### METHOD FOR COUNT COPAY BASED ON PATIENT INSURANCE ID BLOCK END ##############

        //#################### FUNCTION TO ASSIGN COPAY BLOCK START ######################
        //*******PURPOSE: THIS FUNCTION IS USED TO ASSIGN COPAY POPUP
        //*******CREATED BY: RAJASEKHAR M
        //*******CREATED DATE: 10/31/2019
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ######################
        //changes done as per task 5058 when copay skipped getting undefined, need to return as discussed with vamsi garu.
        function assignCopayAmountAndSequence(objectToAssign) {
            if (_.isEmpty(objectToAssign)) return;
            //Assgnig copay value to the copay field based on the object received as input
            $scope.NewAppointmentSchedulerModel.CopayAmmount = objectToAssign.Copay1;
            //Assgnig Copay Original Sequence value to the variable based on the object received as input
            $scope.NewAppointmentSchedulerModel.CopayOriginalSequence = objectToAssign.CopayOriginalSequence1;
        }











        //#################### METHOD TO GET CUSTOMIZED FIELDS LIST BLOCK START ######################
        //*******PURPOSE: THIS METHOD TO GET CUSTOMIZED FIELDS LIST
        //*******CREATED BY: LAKSHMI B
        //*******CREATED DATE: 03/07/2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ######################
        $scope.existingPatientApptDynamicFieldsPopupGetCustomizedFieldsList = function () {

            if (needToUserootscopeCacheForSelectivePractices
                && _.get($rootScope.OneToOneApptWindowCustomizedFieldsListCacheData, "['addWindowFieldsList'].length") >= 0) {
                $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList = angular.copy($rootScope.OneToOneApptWindowCustomizedFieldsListCacheData['addWindowFieldsList']);
                $timeout(function () {
                    assignCustomizedFieldsListAndDoNextActions();
                }, 0, false);
                return;
            }

            var postData = {
            };
            var methodName = "GetLoggedUserApptAddEditorRecurringWindowCustomizedFieldsList";
            //ADDED BY HEMANTH ON DEC 27 2017 
            //WHEN GIVE APPT WINDWO IS OPEND FORM THE ALL CLIENT SCHEDULER THEN GETTING THE OBJECTES BASED ON ALL CLIENTS OBJECTS CUSTOMIZATION 
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PopupOpenFrom) && $scope.EMRDataFromPopup.PopupOpenFrom == "AllClientScheduler") {
                postData.ApptWindowType = 7; //ALL CLIENTS SCHDULER GIVE APPT WINDOW 
                methodName = "apptSchedulerSettingsFieldsCustomizationFieldsforAddEditAppointmentsList";
            }


            GiveNewAppointmentService[methodName](postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                if (hasValue(serviceResponse) && hasValue(serviceResponse.apptSchedulerFieldsCustomizationList) && serviceResponse.apptSchedulerFieldsCustomizationList.length > 0) {
                    $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList = serviceResponse.apptSchedulerFieldsCustomizationList;
                    $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.forEach(function (eachItem) {
                        if (eachItem.AppointmentSettingFieldID == 50) {
                            isRefferralAuthorizationFieldCustomizedOrNot = true;
                        }
                    })
                    if (needToUserootscopeCacheForSelectivePractices) {
                        if (!$rootScope.OneToOneApptWindowCustomizedFieldsListCacheData) {
                            $rootScope.OneToOneApptWindowCustomizedFieldsListCacheData = {};
                        }
                        $rootScope.OneToOneApptWindowCustomizedFieldsListCacheData['addWindowFieldsList'] = angular.copy($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList);
                    }
                }


                assignCustomizedFieldsListAndDoNextActions();
            });


        };
        //#################### METHOD TO GET CUSTOMIZED FIELDS LIST BLOCK END ######################


        function assignCustomizedFieldsListAndDoNextActions() {


            //added by heamnth on SEP 25 2K18 
            //TO SHOW THE VALIDTIONS BASED ON THE ROW AND COLUMN POSITIONS 
            $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList = $filter('orderBy')($scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList, 'RowPosition');

            //FINDING THE CHECK ELIBILITY APPOINMENTSETTING FIELDS ID AVAIALBALE INT THE CUSTOMIZED LSIT OR NOT
            //CONVERTING THE RESULT AFTER FIND  TO TRUE OR FALSE
            //IF TRUE SHOWING THE CHECK ELIGIBILITY HYPELINK ,IF FALSE HIDING CHECK ELIGIBILITY HYPELINK
            $scope.existingPatientAppointmentopenCheckEligibilityShowHide = false;
            $scope.existingPatientAppointmentsSaveAppointmentButtonShow = false;
            $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = false;
            $scope.apptSchedViewSaveAppointmentsforExistingPatientAndPrintPortalLoginsbtnHideShow = true;
            $scope.existingPatientAppointmentsSaveAndSendVideoReminderShow = false;

            isProgramServiceFieldCustomizedAndMandatory = false;

            $scope.existingPatientAppointmentsSaveAndPrintButtonShow = false;

            $scope.ExistingPatientAppointmentGetAddAppointmentCustomizedFiledsList.forEach(function (eachItem) {
                if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.CHECKELIGIBILITY) {
                    $scope.existingPatientAppointmentopenCheckEligibilityShowHide = true;
                }
                //SHOW HIDE THE SAVE APPOINTMENT BUTTON BASED ON APPT SCHEDULER SETTINGS CUSTOMIZATION//ADDED BY PAVAN KUMAR KANDULA ON 25-OCT-2K17
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEAPPOINTMENTBUTTON || eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSSAVEAPPOINTMENTBUTTON) {
                    $scope.existingPatientAppointmentsSaveAppointmentButtonShow = true;
                }
                //SHOW HIDE THE SAVE AND SEND APPOINTMENT REMINDER BUTTON BASED ON APPT SCHEDULER SETTINGS CUSTOMIZATION/ADDED BY PAVAN KUMAR KANDULA ON 25-OCT-2K17
                else if ((eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSENDAPPOINTMENTREMINDER || eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSSAVEANDSENDAPPOINTMENTREMINDER)
                    && ($scope.AppointmentDateInAddMode && (DateDiff.inDays($scope.AppointmentDateInAddMode, adminGetCurrentDate()) <= 0))) {
                    $scope.existingPatientAppointmentsSaveAndSendAppointmentReminderButtonShow = true;
                }
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSCHEDULETELETHERAPYMEETING) {
                    $scope.existingPatientAppointmentsSaveAndScheduleTeletherapyMeetingButtonShow = true;
                    isScheduleZoomMeetingButtonCustomizedInSetting = true;
                    checkModalityAndShowHideZoomSaveButton();
                }
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSCHEDULETELETHERAPYTEAMSMEETING) {
                    $scope.existingPatientAppointmentsSaveAndScheduleTeletherapyMeetingTeamsButtonShow = true;
                    isScheduleTeamMeetingButtonCustomizedInSetting = true;
                    checkModalityAndShowHideTeamSaveButton();
                }
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSMS) {
                    $scope.existingPatientAppointmentsSaveAndSendSMSButtonShow = true;
                }
                //SHOW HIDE THE SAVE APPOINTMENT BUTTON BASED ON APPT SCHEDULER SETTINGS CUSTOMIZATION//ADDED BY PAVAN KUMAR KANDULA ON 25-OCT-2K17
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDPRINTAPPOINTMENTINFO) {
                    $scope.existingPatientAppointmentsSaveAndPrintButtonShow = true;
                }
                ///THIS CUSTOMIZATION IS USED FOR THE PORTAL LOGINS BUTTION CUSTOMIZATION 
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.PRINTPORTALLOGINSBUTTON || eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSPRINTPORTALLOGINSBUTTON
                    && EMRCommonFactory.EMRCheckPermissions('APPOINTMENTSCHEDULER-PRINTPORTALLOGINSINFORMATION') != EMRPermissionType.DENIED) {
                    $scope.apptSchedViewSaveAppointmentsforExistingPatientAndPrintPortalLoginsbtnHideShow = false;
                }
                ///THIS CUSTOMIZATION IS USED FOR THE SAVE & SEND VIDEO REMINDER BUTTON 
                else if ($scope.NewAppointmentSchedulerModel.AppointmentTypeID == GiveAppointmentConstantsService.visitTypeOptionName.VIDEOVISTITYPE && eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSENDVIDEOREMINDER) {
                    $scope.existingPatientAppointmentsSaveAndSendVideoReminderShow = true;
                }
                //the method to open selected program / therapy popup only when the field is customized and make it as mandatory
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.PROGRAMORSERVICE_THERAPYORACTIVITY && eachItem.IsMandatory == true) {
                    isProgramServiceFieldCustomizedAndMandatory = true;
                    // Method to Open Select Program / theropy Popup
                    // this code to open program service pop up is commented here because if user selected any default population of program service then 
                    //we need to state maintain the same data since this opens the pop up even after population of data this will lead to ambiguity
                    //so removed it here and placed after verifying whether user have any default populations.
                    //if no default programs then we will open  pop up 
                    //$scope.existingPatientAppointmentProgramsProgramsServicesClickEvent(true);
                }
                else if (eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.SAVEANDSCHEDULEGOOGLEMEET) {
                    isSaveAndScheduleGoogleMeetButtonCustomized = true;
                    checkUserHasGoogleMeetEnabledOrNotAndShowHideSaveButton(true);
                }

                //SHOW HIDE THE UPDATE AND ADD BILLING INFO BUTTON BASED ON APPT SCHEDULER SETTINGS CUSTOMIZATION
                if ((eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.UPDATEANDADDBILLININFO || eachItem.AppointmentSettingFieldID == $scope.ExitingPatientApptCustomizedFields.ALLCLIENTSUPDATEANDADDBILLININFO) && _.get($scope.EMRDataFromPopup, "PopupOpenFrom") != "NewClientNewApptRequestFromPortal") {
                    $scope.apptSchedViewSaveAppointmentsforExistingPatientAndDocumentBillingInfobtnHideShow = false;
                } else {
                    $scope.apptSchedViewSaveAppointmentsforExistingPatientAndDocumentBillingInfobtnHideShow = true;
                }
            })


            $scope.existingPatientApptDynamicFieldsPopupGenerateFieldsInHTMLDIV();
        }


        $scope.emrAddNewPatientSelectLanguageClickInNewApptPopup = function () {
            var postdata = {
                LanguageID: -1,
            };
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/316'*/GetEMRPageURLByIndex(2765), postdata, 'modal-360px').then(function (result) {
                if (!hasValue(result) || result == "cancel") return;


                $scope.existingPatientsInterpreter = GiveNewAppointmentService.ablityToChangeInterpreterLanguage($scope.NewAppointmentSchedulerModel.interpreterLanguage, $scope.NewAppointmentSchedulerModel.interpreter, result.LanguageName);
                $scope.NewAppointmentSchedulerModel.InterpreterDescription = $scope.existingPatientsInterpreter

            });


        };

        //#################### METHOD TO GENERATE HTML FIELDS IN DIV BLOCK START ######################
        //*******PURPOSE: THIS METHOD TO GENERATE HTML FIELDS IN DIV 
        //*******CREATED BY: LAKSHMI B
        //*******CREATED DATE: 03/07/2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ######################
        $scope.existingPatientApptDynamicFieldsPopupGenerateFieldsInHTMLDIV = function () {
            GiveAppointmentFieldGenerationService.existingPatientApptDynamicFieldsPopupGenerateFieldsInHTMLDIV($scope, EMRPracticeModel, defaultProgamServiceBasedonPractice, getPatientLinkedPrimaryInusranceDetailsForPopulation,
                isProgramServiceFieldCustomizedAndMandatory, showorHideDemogrphicsCommentsField, handleDefaultPopulationOfProgramServices, removeSelectinRoomAvailabilityLabelname);
        }        
        //#################### METHOD TO GENERATE HTML FIELDS IN DIV BLOCK ENDS ######################


        //###################APPT HX POPUP BLOCK START #########################
        //*******PURPOSE: This method used to open Appt Hx pop up
        //*******CREATED BY:  Sai Sindhu Ch
        //*******CREATED DATE: 06/6/2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.existingPatientAppointmentopenApptHxClick = function () {

            //CHECKING WHETHER THE PATIENT ID IS EXISTS OR NOT
            if (!hasValue(ExistingPatientSelectedData) || !hasValue(ExistingPatientSelectedData.SelectedPatient) || !hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID)) return false;
            var DataToPopup = {
                personid: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                patientName: ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName,
            }



            //CALLING THE PAST 6 MONTHS APPTS SHOWING WINDOW
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(2425), DataToPopup, 'modal-800px').then(function () {
            });
        }

        //###################APPT HX POPUP BLOCK END #########################

        //Program Service List 
        $scope.existingPatientAppointmentProgramsProgramsServicesList = [
            //{ "programServiceName": "Joel Alexander Last Name BCBA" },
            //{ "programServiceName": "000 Provider" },
            //{ "programServiceName": "aa aa AQ123" },
        ]



        //################### OPEN LINK TO SELECT FACILITIES LINKED TO PATIENT BLOCK START #########################
        //*******PURPOSE: THIS METHOD USED TO OPEN SELECT FACILITIES LINKED TO PATIENT
        //*******CREATED BY: SRINIVAS M
        //*******CREATED DATE: 17TH OCT 2017
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.exitingPatientApptPatientLinkedLocationPopupClick = function (isFromPageLoad, dataFromPageLoad) {

            //CHECKING WHETHER THE PATIENT IS SELECTED OR NOT
            if (!hasValue(ExistingPatientSelectedData.SelectedPatient[0].PatientID) && ExistingPatientSelectedData.SelectedPatient[0].PatientID <= 0) {
                ShowErrorMessage("Please Select Patient.");
                $("#spanExistingPatientFacility").focus();
                return false;
            }

            //ASSIGNING POST DATA
            var postData = {
                FacilityDisplayName: "",
                PatientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
            }

            //CALLING THE SERVICE TO GET THE FACILITIES LINKED TO THE PATIENT
            GiveNewAppointmentService.ApptSchedView_GetFacilitiesLinkedtoPatientList(postData).then(function (result) {
                if (isError(result)) return false; //CHECKING THE SERVICE RESPONSE

                if (hasValue(result) && result.length > 0) {

                    if (result.length == 1) {
                        var facilityIDExists = false;
                        var faciltiyId;
                        if (hasValue($scope.ApptSchedView_FacilitiesList) && $scope.ApptSchedView_FacilitiesList.length > 0) {
                            for (var index = 0; index < $scope.ApptSchedView_FacilitiesList.length; index++) {
                                //faciltiyId = $.grep(result, function (item) {
                                //    return item.FacilityID == $scope.ApptSchedView_FacilitiesList[index].FacilityID;
                                //});
                                for (var resulIndex = 0; resulIndex < result.length; resulIndex++) {
                                    if (result[resulIndex].FacilityID == $scope.ApptSchedView_FacilitiesList[index].FacilityID) {
                                        faciltiyId = result[resulIndex].FacilityID;
                                        break;
                                    }
                                }

                                if (hasValue(faciltiyId) && faciltiyId > 0) {
                                    facilityIDExists = true;
                                    break;
                                }
                            }
                        }

                        if (hasValue(facilityIDExists) && facilityIDExists == true) {
                            $scope.SelectedExistingPatApptFacilities = result[0].FacilityID;
                            $scope.SelectedFacilityDisplayName = result[0].FacilityDisplayName;
                        }
                        else {
                            if (isFromPageLoad)
                                existingPatientAppointmentLoadFacilityForUser(dataFromPageLoad, isFromPageLoad);
                            else {
                                ShowErrorMessage("Appointment Scheduler not Generated for the Patient Linked Location.");
                                return false;
                            }
                        }
                    }
                    else {

                        var datatoPopup = {
                            PatientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                            ExistingFacilitiesInfo: $scope.ApptSchedView_FacilitiesList,
                        }

                        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/39'*/GetEMRPageURLByIndex(2729), datatoPopup, 'modal-400px').then(function (result) {
                            if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlAppointmentFacility))
                                $scope.existingPatientAppointmentWidgets.ddlAppointmentFacility.focus();
                            if (result == "cancel") return false;
                            if (hasValue(result)) {
                                $scope.SelectedExistingPatApptFacilities = result.FacilityID;
                                $scope.SelectedFacilityDisplayName = result.FacilityDisplayName;
                            }
                        });
                    }
                }
                else {
                    //if client linked facility is called when page loading based on settings and
                    //the user didnt have any linked facilities then loading logged facility
                    if (isFromPageLoad)
                        existingPatientAppointmentLoadFacilityForUser(dataFromPageLoad, isFromPageLoad);
                    else {
                        ShowErrorMessage("Patient Linked Location(s) does not Exist.");
                        return false;
                    }
                }
            });

        }
        //################### OPEN LINK TO SELECT FACILITIES LINKED TO PATIENT BLOCK END #########################

        $scope.exitingPatientApptUserLoggedInLocationPopupClick = function () {

            if (hasValue($scope.ApptSchedView_FacilitiesList) && $scope.ApptSchedView_FacilitiesList.length > 0) {
                var facilityExists = false;
                for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                    if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID == EMRPracticeModel.LoggedFacilityID) {
                        $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                        facilityExists = true;
                        break;
                    }
                }

                if (!hasValue(facilityExists) || facilityExists == false) {
                    ShowErrorMessage("Appointment Scheduler Not Generated for User Logged Facility.");
                    return false;
                }

            }

        }




        //################### GET APPOINTMENT  DETAILS FOR REMAINDERS SENDING BASED ON APPOINTMENT ID BLOCK START #########################
        ///*******PURPOSE:THIS METHOD IS USED TO GET APPOINTMENT  DETAILS FOR SENDING THE CONFIRMATION 
        ///*******CREATED BY: HEMANTH U 
        ///*******CREATED DATE: NOVEMVBER 11 2017 
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientAppointmentsGetSelectedAppointmentDetailstoSendConfirmation = function (AppointmentID) {
            if (!hasValue(AppointmentID) || AppointmentID <= 0) return;
            $scope.appointmentRemainderConfirmationTemplatesAppointmentDetails = [];
            var ServiceData = {
                AppointmentID: AppointmentID,
                isFromAddorEditAppt: true,
            };
            //CALLING WCF SERVICE
            GiveNewAppointmentService.EMRAppointmentRemainderGetAppointmentDetailsBasedOnAppointmentID(ServiceData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                $scope.appointmentRemainderConfirmationTemplatesAppointmentDetails = serviceResponse;

                $scope.existingPatientAppointmentsGetConfirmationTempatesList(AppointmentID);

            });
        };
        //################### GET APPOINTMENT  DETAILS FOR REMAINDERS SENDING BASED ON APPOINTMENT ID BLOCK END #########################


        //################### GET CONFIRMATION TEMPLATES LIST  BLOCK START #########################
        ///*******PURPOSE:THIS METHOD IS USED TO GET APPOINTMENT  CONFIAMTION TEMPLATES LIST
        ///*******CREATED BY: HEMANTH U 
        ///*******CREATED DATE: NOVEMVBER 11 2017 
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
        $scope.existingPatientAppointmentsGetConfirmationTempatesList = function (AppointmentID) {
            var ServiceData = {
                AppointmentID: AppointmentID,
                isFromAddorEditAppt: true,
            };
            //CALLING WCF SERVICE
            GiveNewAppointmentService.EMRAppointmentRemainderGetAppontmentReminderConfirmationTemapltesList(ServiceData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                $scope.appointmentRemainderConfirmationTemplatesList = serviceResponse;

                angular.forEach($scope.appointmentRemainderConfirmationTemplatesList, function (selectedItem) {
                    //IF TEMPLATE TYPE IS VOICE TEMPLATE THEN
                    if (selectedItem.AppointmentReminderTemplateType == 1 && $scope.appointmentRemainderConfirmationTemplatesAppointmentDetails.PatCommPreferenceVoice) {

                        $scope.appointmentRemainderTemplatesSendVoiceApptConfirmation($scope.appointmentRemainderConfirmationTemplatesAppointmentDetails, selectedItem);
                    }
                    //SMS CONFIRMATION
                    if (selectedItem.AppointmentReminderTemplateType == 2 && $scope.appointmentRemainderConfirmationTemplatesAppointmentDetails.PatCommPreferenceSMS) {

                        $scope.appointmentRemainderTemplatesSendSMSApptConfirmation($scope.appointmentRemainderConfirmationTemplatesAppointmentDetails, selectedItem);
                    }
                    //EMAIL  CONFIRMATION
                    if (selectedItem.AppointmentReminderTemplateType == 3 && $scope.appointmentRemainderConfirmationTemplatesAppointmentDetails.PatCommPreferenceEMail) {

                        $scope.appointmentRemainderTemplatesSendEMAILApptConfirmation($scope.appointmentRemainderConfirmationTemplatesAppointmentDetails, selectedItem);
                    }
                });

            });
        };
        //################### GET APPOINTMENT  DETAILS FOR REMAINDERS SENDING BASED ON APPOINTMENT ID BLOCK END #########################


        //################## SEND VOICE APPT CONFIRMATION BLOCK START #######################
        //*******PURPOSE: THIS METHOD IS USED TO SEND VOICE APPT CONFIRMATION 
        //*******CREATED BY: HEMANTH U
        //*******CREATED DATE: NOV 10 2017 
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.appointmentRemainderTemplatesSendVoiceApptConfirmation = function (ApptDetails, templateDetails) {
            var apptDetailsArray = [];
            apptDetailsArray.push({
                AppointmentID: ApptDetails.AppointmentID,
                PhoneNumber: ApptDetails.PhoneNumber,
                Email: ApptDetails.Email,
                PatientName: ApptDetails.PatientName
            });
            //GETTING APPTS NOT HAVING PHONE NUMEBTS
            var apptsNotHavingPhoneNumbers = $.grep(apptDetailsArray, function (item, index) {
                return !hasValue(item.PhoneNumber);
            });
            //ALERTING USER TAT NOT HAING OF PHONE NUMEBERS ....
            if (hasValue(apptsNotHavingPhoneNumbers) && apptsNotHavingPhoneNumbers.length > 0) {
                return false;
            }
            else {
                var postData = angular.copy(templateDetails);
                //GETTING APPTS HAVING PHONE NUMBERS....
                postData.sendappointmentsmodelList = apptDetailsArray;
                GiveNewAppointmentService.EMRAppointmentRemainderSendAppointmentReminder(postData).then(function (serviceResponse) {
                    if (isError(serviceResponse)) return;
                });
            }

        };
        //################## SEND VOICE APPT REMINDER BLOCK ENDS #######################

        //################## SEND SMS APPT CONFIRMATION BLOCK START #######################
        //*******PURPOSE: THIS METHOD IS USED TO SEND SMS APPT CONFIRMATION 
        //*******CREATED BY: HEMANTH U
        //*******CREATED DATE: NOV 10 2017 
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.appointmentRemainderTemplatesSendSMSApptConfirmation = function (ApptDetails, templateDetails) {
            var apptDetailsArray = [];
            apptDetailsArray.push({
                AppointmentID: ApptDetails.AppointmentID,
                PhoneNumber: ApptDetails.PhoneNumber,
                Email: ApptDetails.Email,
                PatientName: ApptDetails.PatientName
            });
            //GETTING APPTS NOT HAVING PHONE NUMEBTS
            var apptsNotHavingPhoneNumbers = $.grep(apptDetailsArray, function (item, index) {
                return !hasValue(item.PhoneNumber);
            });

            //ALERTING USER TAT NOT HAING OF PHONE NUMEBERS ....
            if (hasValue(apptsNotHavingPhoneNumbers) && apptsNotHavingPhoneNumbers.length > 0) {
                return false;
            }
            else {
                var postData = angular.copy(templateDetails);
                //GETTING APPTS HAVING PHONE NUMBERS....
                postData.sendappointmentsmodelList = apptDetailsArray;
                GiveNewAppointmentService.EMRAppointmentRemainderSendAppointmentReminder(postData).then(function (serviceResponse) {
                    if (isError(serviceResponse)) return;
                });
            }

        };
        //################## SEND SMS APPT REMINDER BLOCK ENDS #######################


        //################## SEND EMAIL APPT CONFIRMATION BLOCK START #######################
        //*******PURPOSE: THIS METHOD IS USED TO SEND EMAIL APPT CONFIRMATION 
        //*******CREATED BY: HEMANTH U
        //*******CREATED DATE: NOV 10 2017 
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.appointmentRemainderTemplatesSendEMAILApptConfirmation = function (ApptDetails, templateDetails) {
            var apptDetailsArray = [];
            apptDetailsArray.push({
                AppointmentID: ApptDetails.AppointmentID,
                PhoneNumber: ApptDetails.PhoneNumber,
                Email: ApptDetails.Email,
                PatientName: ApptDetails.PatientName
            });

            //GETTING APPTS NOT HAVING PHONE NUMEBTS
            var apptsNotHavingEmails = $.grep(apptDetailsArray, function (item, index) {
                return !hasValue(item.Email);
            });

            //ALERTING USER TAT NOT HAING OF PHONE NUMEBERS ....
            if (hasValue(apptsNotHavingEmails) && apptsNotHavingEmails.length > 0) {
                return false;
            }
            else {
                var postData = angular.copy(templateDetails);
                //GETTING APPTS HAVING PHONE NUMBERS....
                postData.sendappointmentsmodelList = apptDetailsArray;
                postData.ToUsePracticeEmailForSendingManualEmailReminders = true;// FOR SENDING MANUAL EMAIL REMINDER FROM PRACTICE EMAILS ADDED BY PAVAN KUMAR KANDULA
                GiveNewAppointmentService.EMRAppointmentRemainderSendAppointmentReminder(postData).then(function (serviceResponse) {
                    if (isError(serviceResponse)) return;
                });
            }

        };
        //################## SEND EMAIL APPT REMINDER BLOCK ENDS #######################



        //################### METHOD TO PRINT THE ALL FUTURE APPOINTMENTS INFORAMTION OF THE PATIENT BLOCK START ###############################
        //*******PURPOSE        : METHOD TO PRINT PRINT THE ALL FUTURE APPOINTMENTS INFORAMTION OF THE PATIENT
        //*******CREATED BY     : PAVAN KUMAR KANDULA
        //*******CREATED DATE   : 12/26/2017
        $scope.exisitingPatientSaveandPrintApptInformation = function (PatientID, ApptData) {

            try {
                var ServiceInputData = {
                };
                if (hasValue(PatientID) && PatientID > 0) {
                    ServiceInputData.PersonID = PatientID;
                }
                GiveNewAppointmentService.apptmentSchedulerServiceGetAppointmentInformationBasedOnApptID(ServiceInputData).then(function (serviceResponse) {
                    if (isError(serviceResponse)) return false;
                    if (!hasValue(serviceResponse) || !hasValue(serviceResponse[0]) || !hasValue(serviceResponse[0].ApptScheduledBy) || serviceResponse.length <= 0) {
                        ShowErrorMessage("No Future Appointments is Available.");
                        return false;
                    }
                    if (hasValue(serviceResponse) && hasValue(serviceResponse[0]) && hasValue(serviceResponse[0].ApptScheduledBy)) {
                        var BodyContent = serviceResponse[0].ApptScheduledBy;

                        var postData = {
                        };
                        postData.PhysicianIDs = ApptData.PhysicianID;
                        var FacilityHeader;

                        GiveNewAppointmentService.ApptSchedulerGetFacilityHeaderInformationInStringFormat(postData).then(function (serviceResponse) {
                            if (isError(serviceResponse)) return;
                            if (hasValue(serviceResponse) && hasValue(serviceResponse.FacilityHeader)) {
                                FacilityHeader = serviceResponse.FacilityHeader;
                            }

                            var headerStyles = '<head>'
                                + GetScriptsAndStylesBaseURLTagsInfo()
                                + '<link href="UITheme/css/KendoUI/kendo.common.min.css" rel="stylesheet">'
                                + '<link href="UITheme/css/KendoUI/kendo.rtl.min.css" rel="stylesheet">'
                                + '<link href="UITheme/css/KendoUI/kendo.default.min.css" rel="stylesheet">'
                                + '<link href="UITheme/css/KendoUI/kendo.dataviz.min.css" rel="stylesheet">'
                                + '<link href="UITheme/css/KendoUI/kendo.dataviz.default.min.css" rel="stylesheet">'
                                + '<link href="UITheme/css/EMRWeb/EMRWeb.css" rel="stylesheet">'
                                + '</head>';


                            var contWidth = 708;
                            var bodyHtml;
                            if (hasValue(FacilityHeader))
                                bodyHtml = "<body style='width:" + contWidth.toString() + "px;padding-right:10px;'>" + FacilityHeader + "<div>" + "<hr style='border-top: solid 2px; !important>" + "</div>" + "<div style='text-align:center;font-size=150%'>" + BodyContent + "</div>" + "</body>";
                            else
                                bodyHtml = "<body style='width:" + contWidth.toString() + "px;padding-right:10px;'>" + "<div>" + "<hr style='border-top: solid 2px; !important>" + "</div>" + "<div style='text-align:center;font-size=150%'>" + BodyContent + "</body>";

                            $(".ehrapptschedulerweekviewprintingiframeehr").remove();

                            //CHECKING FOR THE PREVIOUS INSTANCE OF THE IFRAME
                            if ($(".ehrapptschedulerweekviewprintingiframeehr").length <= 0) {
                                var $rcFrame = $(document.createElement('iframe'));
                                $rcFrame.attr({
                                    //id: this.rcId,
                                    id: adminGetGUID(),
                                    frameborder: 0,
                                    width: "100%",
                                    height: "100%",
                                    allowFullScreen: true,
                                    webkitallowfullscreen: true,
                                    mozallowfullscreen: true,
                                    class: 'ehrapptschedulerweekviewprintingiframeehr'
                                });
                                $rcFrame.css({ height: "1px", width: "1px" });
                                //appending the created iframe to the div created by the useR
                                $(document.body).append($rcFrame);


                                //on load event for the iframe created
                                $rcFrame.load(function () {
                                    try {


                                        //a4 size or letter size print i.e 8.5in
                                        var availableWidth = 816, contentWidth = 1008, scalefactor = 0;

                                        if (availableWidth < contentWidth) {
                                            scalefactor = contentWidth / availableWidth;
                                            scalefactor = scalefactor + 0.12;
                                        }
                                        else {
                                            scalefactor = contentWidth / availableWidth;
                                            scalefactor = scalefactor + 0.12;
                                        }

                                        //CALLING THE PRINT FUNCTION
                                        this.contentWindow.print();

                                    } catch (e) {

                                    }
                                });

                            }
                            else {
                                var $rcFrame = $(".ehrapptschedulerweekviewprintingiframeehr");
                            }

                            //$rcFrame.removeClass('hide');

                            if (!hasValue($rcFrame) || $rcFrame.length <= 0) return;

                            //WRITING THE CONTENT TO IFRAME BY CLEARING THE PREVIOUS CONTENET
                            $rcFrame.get(0).contentDocument.clear();
                            $rcFrame.get(0).contentDocument.open();
                            $rcFrame.get(0).contentDocument.writeln('<html>' + headerStyles + bodyHtml + '</html>');
                            $rcFrame.get(0).contentDocument.close();

                        });
                    }
                });

            }
            catch (e) {

            }
        }
        //################### METHOD TO PRINT THE ALL FUTURE APPOINTMENTS INFORAMTION OF THE PATIENT BLOCK END ###############################



        //BIND THE DATA TO THE DROPDOWN DATASOURCE
        $scope.existingPatientAppointmentPatientApptTypeDropdownDataSource = new kendo.data.DataSource({
            data: [],//$scope.existingPatientAppointmentPatientApptTypeDropdownInfo,//ASSIGNING NULL ON DEFAULT       
        });
        //######### DATA FOR PATIENT APPT TYPE DROPDOWN BLOCK END #############

        ///*******PURPOSE:THIS METHOD IS USED TO FOR GET PATIENT APPOINTMENT TYPES LIST
        ///*******CREATED BY:PAVAN KUMAR KANDULA 
        ///*******CREATED DATE:12/06/2018
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ************************* 
        $scope.existingappointmentGetPatientAppointmentTypesList = function () {
            var postData = {};
            GiveNewAppointmentService.ApptSchedServiceGetPatientAppointmentTypesList(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                if (hasValue(serviceResponse) && hasValue(serviceResponse.patientAppointmentDescriptionList && serviceResponse.patientAppointmentDescriptionList.length > 0)) {
                    serviceResponse.patientAppointmentDescriptionList.unshift({ PatientAppointmentTypeDescription: ' - Select - ', PatientAppointmentTypeID: 0 });
                    $scope.existingPatientAppointmentPatientApptTypeDropdownDataSource.data(serviceResponse.patientAppointmentDescriptionList);
                    $scope.PatientAppointmentTypeID = 0; ////upgrade to angular 1.7.2
                }
            });
        }

        ///*******PURPOSE:THIS METHOD IS USED TO CLEAR THE COPAY INFORMATION START HERE
        ///*******CREATED BY:PAVAN KUMAR KANDULA 
        ///*******CREATED DATE:09/07/2018
        ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ************************* 
        $scope.existingPatientCopayLinkedToApptPopupClear = function () {
            $scope.NewAppointmentSchedulerModel.CopayAmmount = null;
            $scope.NewAppointmentSchedulerModel.CopayOriginalSequence = null;
        }
        ///*******PURPOSE:THIS METHOD IS USED TO CLEAR THE COPAY INFORMATION END HERE







        //page init ends here
        //$scope.existingPatientApptPageInit();


        //=====================================                 EXECUTE AUTO UPLOAD TO PORTAL FUNCTIONALITY FOR EASY FORM - BLOCK START                  =================================== 
        //DEVELOPED BY RAVI TEJA.P
        //DATE:6/15/2017
        //PURPOSE : THIS IS USED TO EXECUTE AUTOUPLOAD FUNCTIONALITY FOR EASY FORMS TO UPLLOAD TO PORTAL ON FIRST APPT GIVE TO PATIENT OF APPT GIVEN PER EPISODE
        $scope.ExistingPatientAppointmentExecuteAutoUploadReminderRules = function (inputobject) {

            if (!hasValue(inputobject)) return;

            var EventstoExecute = [];
            EventstoExecute.push({
                EventType: EasyFormAutoUPloadEventTypeEnum.APPOINTMENTS,
                EventID: EasyFormAutoUploadEventInfo.APPOINTMENTGIVEN1STTIME,
            });

            var postData = {
                PatientID: inputobject.PatientID,
                AppointmentID: inputobject.AppointmentID,
                EventstoExecute: EventstoExecute,
            }
            //here we are checking whether patient had any other patient as additional participant and if yes then we are sending his id
            //so that customized easy form will get auto uploaded for additinal participant patients
            if (_.size($scope.existingPatientsAdditionalParticipantsList))
                postData.ApptAdditionalParticipantPatientIdsArr = _.map(_.filter($scope.existingPatientsAdditionalParticipantsList, 'isPatient'), 'AccompaniedByID');

            EMRCommonFactory.ExecuteEasyFormAutoUploadToPortalRules(postData);

        }



        //SELECT ATTENDETS ALONG WITH THE PATEINT BLOCK START 
        // ADDED BY HEMANTH ON DEC 27  2017 
        $scope.existingPatientAppointmentSelectLinkToAttendantGoingWithThePatientPopupclick = function () {
            var postData = {
            };
            postData.RequestingFrom = "AllClientSchedulerNewAppt";
            postData.SelectedProviderIDs = $scope.NewAppointmentSchedulerModel.AttendentUserIDs;

            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/131'*/GetEMRPageURLByIndex(278), postData, 'sm').then(function (resultProvidersInfo) {
                if (resultProvidersInfo == "cancel") return false;

                if (hasValue(resultProvidersInfo)) {
                    $scope.GroupTherapyAttendenceProvidersList = resultProvidersInfo;
                    var groupTherapyProviderIDs = "";
                    var groupTherapyProviderNames = "";

                    for (var Index = 0; Index <= resultProvidersInfo.length - 1; Index++) {
                        groupTherapyProviderIDs += resultProvidersInfo[Index].user_id + ", ";
                        groupTherapyProviderNames += resultProvidersInfo[Index].UserName + ", ";
                    }
                    //ATTENDENT USER IDS ALONG WITH THE PATIENT 
                    $scope.NewAppointmentSchedulerModel.AttendentUserIDs = groupTherapyProviderIDs.replace(/, +$/, '');
                    $scope.NewAppointmentSchedulerModel.AttendentUserNames = groupTherapyProviderNames.replace(/, +$/, '');
                }
            });
        }

        //clear the selected attendent details info 
        $scope.existingPatientAppointmentSelectLinkToAttendantGoingWithThePatientClearClick = function () {
            $scope.NewAppointmentSchedulerModel.AttendentUserIDs = "";
            $scope.NewAppointmentSchedulerModel.AttendentUserNames = "";
        }
        //=====================================                 EXECUTE AUTO UPLOAD TO PORTAL FUNCTIONALITY FOR EASY FORM - BLOCK END                  =================================== 


        //###################  SELECTED DUATION FROM HYPERLINK  BLOCK START ###############################
        //*******PURPOSE        : SELECT DURATION FROM HYPERLINK BLOCK 
        //*******CREATED BY     : HEMANTH U
        //*******CREATED DATE   : FEB 15 2K18 
        $scope.existingPatientApptDurationClick = function (Duration) {

            if (Duration > 0) {
                $scope.SelectedExistingPatApptDuration = parseInt(Duration);
                //if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
                //	autoPopulateauthcountFromDuration($scope.SelectedExistingPatApptDuration);
                //}

            }
        }


        //###################  GET THE PROVIDER RELATED LATEST PROGRAM SERVICES DETAILS  BLOCK START ###############################
        //*******PURPOSE        : METHOD TO GET THE PROVIDER REALTED PROGRAM SERVICE DETAILS 
        //*******CREATED BY     : HEMANTH 
        //*******CREATED DATE   : FEB 15 2K18 
        $scope.existingPatientApptGetProviderRelatedLatestProgramServiceDetails = function (CallingFrom) {

            var PostData = {};
            //1-LATEST APPT RELATED PROGRAM SERVICE DETAILS  FOR SELECTED PROVIDER 
            if (CallingFrom == 1) {
                //if the provider or resource is not  selected then show the validation
                if (!hasValue(SelectedPhysicianID) || SelectedPhysicianID == 0) {
                    ShowErrorMessage("Please Select " + $scope.SelectedProviderOrUserOrResourceAliasNameToShowWhileSaving + " .")
                    setTimeout(function () {
                        $("#existingPatientAppointmentSelectProvider").focus();
                    }, 200);
                    return false;
                }
            }
            //FOR THE SELECTED PROVIDER LATEST APPT PROGRAM SERVICE DETAILS 
            if (CallingFrom == 1) {
                PostData.ProviderID = SelectedPhysicianID;
                PostData.ResourceType = SelectedResourceType;
            }
            PostData.PatientID = SelectedPatientID;

            //GETTINT THE PROGRAM SERVIE DETAILS INFO
            GiveNewAppointmentService.GetPatientAndProviderPrevApptActiveProgramServiceDetails(PostData).then(function (serviceResponse) {
                //CHECKING THE SERVICE RESPONSE
                if (isError(serviceResponse)) return;

                if (hasValue(serviceResponse) && hasValue(serviceResponse.LinkedProgramServiceModelList) && serviceResponse.LinkedProgramServiceModelList.length > 0) {
                    //ASSIGNING THE PROGRAM SERVICES LIST
                    $scope.selectedProgramServicesLinkedInfoID = "";
                    $scope.existingPatientAppointmentProgramsProgramsServices = "";
                    $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = "";
                    $scope.existingPatientAppointmentProgramsProgramsServicesforService = "";

                    $scope.existingPatientAppointmentProgramsProgramsServicesList = serviceResponse.LinkedProgramServiceModelList;

                    let programOrServiceDefaultDuration = undefined;
                    let programIds = [];
                    //To Selected Multiple Programs and services 
                    angular.forEach($scope.existingPatientAppointmentProgramsProgramsServicesList, function (item) {
                        if (hasValue(item)) {
                            if (hasValue(item.GroupTherapySessionTypeName)) {
                                if (!programIds.includes(item.ProgramID)) {
                                    $scope.existingPatientAppointmentProgramsProgramsServices = `${$scope.existingPatientAppointmentProgramsProgramsServices}${item.GroupTherapyCategoryName} - ${getServiceNamesWithCommaSeperated($scope.existingPatientAppointmentProgramsProgramsServicesList, item.ProgramID)}; `;
                                    if (hasValue(item.GroupTherapyCategoryName)) {
                                        if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesforProgram))
                                            $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = $scope.existingPatientAppointmentProgramsProgramsServicesforProgram + "; " + item.GroupTherapyCategoryName;
                                        else
                                            $scope.existingPatientAppointmentProgramsProgramsServicesforProgram = item.GroupTherapyCategoryName
                                    }
                                    programIds.push(item.ProgramID);
                                }

                            }

                            if (hasValue(item.GroupTherapyName)) {
                                if (hasValue($scope.existingPatientAppointmentProgramsProgramsServicesforService))
                                    $scope.existingPatientAppointmentProgramsProgramsServicesforService = $scope.existingPatientAppointmentProgramsProgramsServicesforService + "; " + item.GroupTherapyName;
                                else
                                    $scope.existingPatientAppointmentProgramsProgramsServicesforService = item.GroupTherapyName;
                            }
                            if (!programOrServiceDefaultDuration && item.InPatGroupTherapySessionDurationValue && item.InPatGroupTherapySessionDurationValue > 0)
                                programOrServiceDefaultDuration = item.InPatGroupTherapySessionDurationValue;
                        }
                        //PROGRAM SERVICE LINKED INFO IDS
                        if (hasValue(item.ProgramsServicesLinkedInfoID)) {
                            $scope.selectedProgramServicesLinkedInfoID = $scope.selectedProgramServicesLinkedInfoID + item.ProgramsServicesLinkedInfoID + ",";
                        }
                    });
                    if (programOrServiceDefaultDuration) $scope.SelectedExistingPatApptDuration = programOrServiceDefaultDuration;

                    //At the end of the list removing the semicolon 
                    $scope.existingPatientAppointmentProgramsProgramsServices = _.trimEnd($scope.existingPatientAppointmentProgramsProgramsServices, "; ");
                    $scope.selectedProgramServicesLinkedInfoID = _.trimEnd($scope.selectedProgramServicesLinkedInfoID, ",");
                    if (!dontNeedExistingsingleAuthDeductionForthisPractices())
                        exisitingPatientApptReferralAuthorizationPopulateUsedField();
                    //Assigning false to "doNotCheckHealthPlanCustomizationValidation"
                    //assigning false to check the Validation  
                    //Validaton to allow or deny the health plan for the selected program - service
                    $scope.NewAppointmentSchedulerModel.doNotCheckHealthPlanCustomizationValidation = false;

                    //only when program / services are selected then only getting the latest linked grants are autopopulated 
                    if (hasValue($scope.selectedProgramServicesLinkedInfoID)) {
                        //GETTING THE LATEST GRANTS RELATD POLICIES INFO 
                        $scope.existingPatientApptsGetLinkedGrantsBasedonSelectedProgramService($scope.selectedProgramServicesLinkedInfoID);
                        autoPopulateFieldsBasedonProgramSelectionforSpecificPractices();
                    }
                }

                autoSelectVistTypeForProgramService(serviceResponse.LinkedProgramServiceModelList);

                //if after changing the  the duration field is empty then we are assinging the scehdule generated time
                if (!$scope.SelectedExistingPatApptDuration && _.get($scope.ApptSchedView_GetMinimumIntervalList, "[0].AppointmentDuration") > 0)
                    $scope.SelectedExistingPatApptDuration = $scope.ApptSchedView_GetMinimumIntervalList[0].AppointmentDuration;

            });
        }
        //###################  GET THE PROVIDER RELATED LATEST PROGRAM SERVICES DETAILS  BLOCK END  ###############################




        //###################    GET THE POLICY DETAILS WHICH ARE LINKED TO SELECTED PROGRAM SERVICES BLOCK START ###############################
        //*******PURPOSE        : METHOD TO GET THE POLICY DETAILS WHICH ARE LINKED TO THE SELECTED PROGRAM SERVICES 
        //*******CREATED BY     : HEMANTH U
        //*******CREATED DATE   : FEB 15 2K18 
        $scope.existingPatientApptsGetLinkedGrantsBasedonSelectedProgramService = function (ProgramServiceLinkedInfoIDs) {
            if (!hasValue(ProgramServiceLinkedInfoIDs)) return false;
            var postData = {};
            postData.PatientID = SelectedPatientID;
            postData.ProgramServiceLinkedInfoIDs = ProgramServiceLinkedInfoIDs.trimEnd(',');
            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = showCopayLinkedtoAppt;
            //GETTINT THE PROGRAM SERVIE DETAILS INFO
            GiveNewAppointmentService.ApptSchedulerGetLatestGrantsInfoBasedonselectedProgramServices(postData).then(function (serviceResponse) {
                //CHECKING THE SERVICE RESPONSE
                if (isError(serviceResponse)) return;

                if (hasValue(serviceResponse) && hasValue(serviceResponse.LinkGrantsToProgramServicesModelList) && serviceResponse.LinkGrantsToProgramServicesModelList.length > 0) {

                    var LinkedGrantInfo = serviceResponse.LinkGrantsToProgramServicesModelList[0];
                    if (hasValue(LinkedGrantInfo.PatientInsuranceID) && LinkedGrantInfo.PatientInsuranceID > 0) {
                        $scope.existingPatientAppointmentBillToInsuranceNames = LinkedGrantInfo.InsuranceName;
                        if (hasValue(LinkedGrantInfo.InsurancePolicyEndDate)) { // appending policy expiry date to insurance name  -- added by AHMED BASHA SHAIK 
                            $scope.existingPatientAppointmentBillToInsuranceNames = $scope.existingPatientAppointmentBillToInsuranceNames + " (Exp Date: " + LinkedGrantInfo.InsurancePolicyEndDate + ")";
                        }
                        $scope.existingPatientAppointmentBillToInsuranceID = LinkedGrantInfo.PatientInsuranceID;

                        // THIS IS USED TO HOLD THE APPOINTMNENT LINKED HELTHPLAN IS INTO THE SCOPE VARIABLE
                        if (hasValue(LinkedGrantInfo.InsuranceID) && LinkedGrantInfo.InsuranceID > 0) {
                            $scope.existingPatientAppointmentHealthPlanID = LinkedGrantInfo.InsuranceID;
                        }
                        else {
                            $scope.existingPatientAppointmentHealthPlanID = 0;
                        }

                        $scope.existingPatientAppointmentGrantID = 0;
                        if ($scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide || hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue)
                            $scope.existingPatientAppointmentCheckCopayCount($scope.existingPatientAppointmentBillToInsuranceID);
                        //$scope.existingPatientAppointmentBillToInsuranceButtonClass = "fc-button ExistingApptActiveColorClass fc-corner-left";
                        $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
                        $scope.existingPatientAppointmentBillToSlidingFeeButtonClass = "";//fc-button fc-state-default
                        $scope.existingPatientAppointmentBillToCashPaymentButtonClass = "";//fc-button fc-state-default
                        $scope.existingPatientAppointmentBillToDoNotBillButtonClass = "";//fc-button fc-state-default
                        ///WHEN LOADING THE PRIMARY INSURANCE THEN APPT  BILL TO TYPE IS 1 FOR THE INSURANCE IS SAVED
                        $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;
                        $scope.NewAppointmentSchedulerModel.InsuranceComments = LinkedGrantInfo.Comments;//To get the insurance comments form the policy comments
                        //if patient has primary insurance then this flag is false
                        $scope.NewAppointmentSchedulerModel.BillingNotRequired = false;
                    }
                }
            })
        }
        //###################    GET THE POLICY DETAILS WHICH ARE LINKED TO SELECTED PROGRAM SERVICES BLOCK END ###############################



        //##################  METOD TO SEND VIDEO REMINDERS   BLOCK START #######################
        //*******PURPOSE: THIS METHOD TO SEND VIDEO REMIDNERS FOR PROVIDER AND PATIENT EMAIL 
        //*******CREATED BY: HEMANTH U
        //*******CREATED DATE: OCT 23 2K18 
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.exisitingPatientSaveandSendVideoRemindertoPatientandProvider = function (PatientID, AppointmentID, ProviderID) {

            if (!hasValue(AppointmentID) || AppointmentID <= 0) return;
            $scope.existingpatientApptSaveandSendVideoReminderAppointmentDetails = [];
            var ServiceData = {
                AppointmentID: AppointmentID,
                isFromAddorEditAppt: true,
            };
            //CALLING WCF SERVICE TO GET THE APPOINEMENT DETAILS 
            GiveNewAppointmentService.EMRAppointmentRemainderGetAppointmentDetailsBasedOnAppointmentID(ServiceData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                $scope.existingpatientApptSaveandSendVideoReminderAppointmentDetails = serviceResponse;

                var postData = {
                    AppointmentID: AppointmentID,
                    IsDefaultVideoMeetingReminder: true,
                    isFromAddorEditAppt: true,
                };
                //CALLING WCF SERVICE TO DEFAULT TEMPLATE RELATED INFORMATION TO SEND VIDEO REMINDER FOR PATIENT 
                GiveNewAppointmentService.EMRAppointmentRemainderGetAppontmentReminderConfirmationTemapltesList(postData).then(function (result) {
                    if (isError(result)) return;
                    $scope.appointmentRemainderVideoTemplatesList = result;
                    //ATLEAST ONE DEFAULT TEMPALTED FOR SEND VIDEO REMINDER WITH MEETING DETAILS 
                    if (hasValue($scope.appointmentRemainderVideoTemplatesList) && $scope.appointmentRemainderVideoTemplatesList.length > 0) {
                        angular.forEach($scope.appointmentRemainderVideoTemplatesList, function (selectedItem) {
                            //EMAIL  CONFIRMATION WITH MEETING DETAILS 
                            if (selectedItem.AppointmentReminderTemplateType == 11) {
                                $scope.exisitingPatientSaveandSendVideoMeetinIDEmailReminder($scope.existingpatientApptSaveandSendVideoReminderAppointmentDetails, selectedItem, ProviderID);
                            }
                        });
                    }
                });

            });
        }
        //##################  METOD TO SEND VIDEO REMINDERS   BLOCK END  #######################




        //################## SENDING THE VIDEO APPT REMINDERS VIA EMAIL  BLOCK START #######################
        //*******CREATED BY: HEMANTH U
        //*******PURPOSE: THIS METHOD IS USED TO SEND VIDEO APPT REMINDERS VIA EMAIL 
        //*******CREATED DATE: OCT 23 2K18 
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.exisitingPatientSaveandSendVideoMeetinIDEmailReminder = function (ApptDetails, templateDetails, ProviderID) {
            var apptDetailsArray = [];
            apptDetailsArray.push({
                AppointmentID: ApptDetails.AppointmentID,
                PhoneNumber: ApptDetails.PhoneNumber,
                Email: ApptDetails.Email,
                PatientName: ApptDetails.PatientName,
                PhysicianID: ProviderID,
            });

            //if patient or provider not having email id then no need to send video remidner 
            if (hasValue(ApptDetails.Email) && ApptDetails.IsPatientPortalLoginsActive) {

                var guid = adminGetGUID();
                var queryStringParams = "";
                var MeetingInfoLink = "";
                queryStringParams = CryptoJS.AES.encrypt(EMRPracticeModel.PracticeID + "~" + "007" + "~" + (new Date()).getTime() + "~" + ApptDetails.PatientID + "~" + guid, "ExternalEHRYourWayWebSite");

                if (window.location.href.indexOf("localhost") > -1)
                    MeetingInfoLink = "http://localhost/login?" + queryStringParams;
                else if (window.location.href.indexOf("192.168.0.87") > -1)
                    MeetingInfoLink = "http://192.168.0.87/portallogin?" + queryStringParams;
                //below else if block code writen by Mahesh.P Sir
                else if (window.location.href.indexOf("weblocal") > -1)
                    MeetingInfoLink = "https://weblocal.ehryourway.com/portallogin/?" + queryStringParams;
                else
                    MeetingInfoLink = "https://portal.ehryourway.com/?" + queryStringParams;




                //PROVIDER EMAIL ID 
                if (hasValue(ApptDetails) && hasValue(ApptDetails.ProviderEmailID)) {
                    apptDetailsArray[0].ProviderEmailID = ApptDetails.ProviderEmailID;
                }

                //meeting id information
                if (hasValue(MeetingInfoLink)) {
                    apptDetailsArray[0].VideoMeetingLink = MeetingInfoLink;
                }

                //GETTING APPTS NOT HAVING PHONE NUMEBTS
                var apptsNotHavingEmails = $.grep(apptDetailsArray, function (item, index) {
                    return !hasValue(item.Email);
                });

                //ALERTING USER TAT NOT HAING OF PHONE NUMEBERS ....
                if (hasValue(apptsNotHavingEmails) && apptsNotHavingEmails.length > 0) {
                    return false;
                }
                else {
                    var postData = angular.copy(templateDetails);
                    //GETTING APPTS HAVING PHONE NUMBERS....
                    postData.sendappointmentsmodelList = apptDetailsArray;
                    postData.ToUsePracticeEmailForSendingManualEmailReminders = true;// FOR SENDING MANUAL EMAIL REMINDER FROM PRACTICE EMAILS ADDED BY PAVAN KUMAR KANDULA
                    GiveNewAppointmentService.EMRAppointmentRemainderSendAppointmentReminder(postData).then(function (serviceResponse) {
                        if (isError(serviceResponse)) return;
                    });
                }
            }
            else {
                ShowErrorMessage("Patient not having Email Id / Portal Logins.")
            }

        };
        //################## SEND EMAIL APPT REMINDER BLOCK ENDS #######################

        //################## METHOD TO GET CHARGE MASTER BILLING TRIGGER CUST LIST  BLOCK START #######################
        //*******PURPOSE: THIS METHOD IS USED TO GET CHARGE MASTER BILLING TRIGGER CUST LIST
        //*******CREATED BY:  Pavan Bharide
        //*******CREATED DATE: 11 feb 2019
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.checkBillingTriggerCustomizedList = function () {
            var postData = {};
            EMRCommonFactory.getEHRSettingsInformationForCurrentlyLoggedUserForAlltheModules(EHRSettingsByModuleRelatedKeysEnum.BILLING_TRIGGER_CUSTOMIZED_LIST, postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                $scope.billingChrageCaptureTriggerCustList = serviceResponse;

                // initializing charge capture trigger customization list in BillingTriggerCustomizationService
                // this list variable is used in the service to be used for trigger customization
                GiveNewAppointmentService.billingChargeCaptureTriggerCustomizationList = serviceResponse;
            });


            var postDataInfo = {};
            //CREATING INPUT OBJECT WITH STATUS NAME SEARCH
            var postDataInfo = {
                AppointmentStatusTypes: "1",
                IsShowQuickCheckIn: true, // to show quick check in option from appointment scheduler and hide from show existing appointments detail view drop drown
            };
            EMRCommonFactory.getEHRSettingsInformationForCurrentlyLoggedUserForAlltheModules(EHRSettingsByModuleRelatedKeysEnum.APPOINTMENT_SCHEDULER_CUSTOMIZED_STATUS_INFO, postDataInfo).then(function (responsedata) {
                if (isError(responsedata)) return false;
                $scope.exisitingPatientAppointmentStatusInformation = responsedata;
            });


            billingSettingsFieldValueListSharedService.billingCustomizationServiceGetBillingSettingFieldValuesList({ MultipleSettingInfoIDs: '55' }).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                if (hasValue(serviceResponse) && hasValue(serviceResponse.BillingSettingValuesList) && serviceResponse.BillingSettingValuesList.length > 0 && hasValue(serviceResponse.BillingSettingValuesList[0])
                    && hasValue(serviceResponse.BillingSettingValuesList[0].BillingSettingValue) && serviceResponse.BillingSettingValuesList[0].BillingSettingValue == 1) {
                    $scope.exisitingPatientAppointmentIsAutoCreateSuperBill = true;
                }
                else {
                    $scope.exisitingPatientAppointmentIsAutoCreateSuperBill = false;
                }

            });


            var postData = {};//INITIALIZING OBJECT
            //WCF CALL TO GET ADMISSION STATUS DETAILS
            // LevelOfCareService.levelOfCareGetAdmissionsSettingsObject(postData).then(function (serviceResponse) {
            EMRCommonFactory.getEHRSettingsInformationForCurrentlyLoggedUserForAlltheModules(EHRSettingsByModuleRelatedKeysEnum.ADMISSIONSETTINGS, postData).then(function (serviceResponse) {
                //IN FAILURE CASE:RETURN
                if (isError(serviceResponse)) { return; }
                //ASSIGNING DATA TO ADMISSION SETTINGS OBJECT
                $scope.exisitingPatientAppointmentLevelOfCareSelectAdmissionStatusAdmissionsSettings = serviceResponse;
            });

        };
        //################## METHOD TO GET CHARGE MASTER BILLING TRIGGER CUST LIST  BLOCK END #######################


        ////################## METHOD TO GET CHARGE MASTER BILLING TRIGGER CUST LIST  BLOCK START #######################
        //   //*******PURPOSE: THIS METHOD IS USED TO GET CHARGE MASTER BILLING TRIGGER CUST LIST
        //   //*******CREATED BY: NAGA TEJA N
        //   //*******CREATED DATE: 09 MAY 2019
        //   //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //   $scope.ExistingPatinetApptAllValidationsChecking = function (ISFROM) {

        //       IF(ISFROM == 1){


        //       }




        //   }
        /**
         * Populate Number of units for this visit field of every referral authorization 
         * 
         * 
         * Documentation:
         *          referralAuthorizationList -> The selected referral authorization list for this appointment
         *          appointmentProgramServiceList -> List of program services of the appointment
         * 
         * @author Sanjay Idpuganti
         */
        function exisitingPatientApptReferralAuthorizationPopulateUsedField() {
            var appointmentProgramServiceList = $scope.existingPatientAppointmentProgramsProgramsServicesList || []
                , referralAuthorizationList = $scope.existingPatientMainGridOptions && $scope.existingPatientMainGridOptions.dataSource.data() || []
                , healthPlanName = $scope.NewAppointmentSchedulerModel.ApptBillTo == 1 ? $scope.existingPatientAppointmentBillToInsuranceNames : undefined
                ;

            // initially clear all fields
            exisitingPatientApptReferralAuthorizationClearUsedField();

            //as per task 5797 and as discussed with vamsi garu, need to allow for only ins/grants selected...
            if (enableVistsUnitsTypeOnlyForInsOrGrantsBasedOnPractices && (!healthPlanName || !appointmentProgramServiceList || !appointmentProgramServiceList.length)) return;

            // QA Persons related to this task: Hari Kurmar, Santhi Priyanka Garu
            // As asked by QA person we are clearing and re assigning 1 when referral auth conditions matched
            referralAuthorizationList
                .map(function (referralAuth, index) { return new ReferralAuth(referralAuth, appointmentProgramServiceList, $scope.AppointmentDateInAddMode, healthPlanName, index); })
                /* For every Referral Auth object filter only those whose Use field should be autopopulated */
                .filter(function (referralAuth) { return referralAuth.shouldAutopopulateUse() })
                /* From the  Referral auth object convert it to original referral auth object from index */
                .map(function (referralAuth) { return referralAuthorizationList[referralAuth.index] })
                /* For every referral auth here assing 1 to it */
                .forEach(function (referralAuth) { referralAuth.NumberofUnitsForThisVisit = 1 });
        }


        /**
         * Clear all the referral authorization row Use Count field
         */
        function exisitingPatientApptReferralAuthorizationClearUsedField() {
            var referralAuthorizationList = $scope.existingPatientMainGridOptions && $scope.existingPatientMainGridOptions.dataSource.data() || [];

            referralAuthorizationList.forEach(function (referralAuthInfo) { referralAuthInfo.NumberofUnitsForThisVisit = null; });
        }

        //#################### METHOD TO OPEN SHOW RESOURCE AVAILABILITY SELECT POPUP BLOCK START ######################
        //*******PURPOSE: THIS METHOD TO OPEN SHOW RESOURCE AVAILABILITY SELECT POPUP
        //*******CREATED BY: JayaSree Y
        //*******CREATED DATE: 10/30/2019
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ######################
        $scope.existingPatientApptShowResourceAvailabilitySelectPopupClick = function (isFromRoom) {


            //ModalPopupService.OpenPopup(GetEMRPageURLByIndex(4010), null, 'modal-1000px').then(function () {

            //WHILE OPENING THE RESOURCE AVAILABILITY FOR THE SELECTED FACILITY THE USER HAVE TO SELECT THE FACILITY
            //SO IF THE USER DID NOT SELECT THE FACILITY THEN SHOWING THE VALIDATION
            //HERE VALIDATION IS SHOWN RELATED TO THE FACILITY DISPLAY NAME IN THE APPOINTMENT SCHEDULER SETTINGS
            if (!hasValue($scope.SelectedExistingPatApptFacilities)) {
                ShowErrorMessage("Please Select " + $scope.SelectedFacilityAliasNameToShowWhileSaving + ".");
                if (hasValue($scope.existingPatientAppointmentWidgets) && hasValue($scope.existingPatientAppointmentWidgets.ddlAppointmentFacility))
                    $scope.existingPatientAppointmentWidgets.ddlAppointmentFacility.focus();
                return false;
            }
            //grep function to get facility desplay names of the selected facility based on facility Id
            var SelectedItems = $.grep($scope.ApptSchedView_FacilitiesList, function (item) {
                return item.FacilityID.toString() == $scope.SelectedExistingPatApptFacilities;
            });
            //declaring SelectedFacilityDisplayName variable
            var SelectedFacilityDisplayName = "";
            //condition to check whether selected items has Facility value
            if (hasValue(SelectedItems) && SelectedItems.length > 0)
                //facility dropdown is a single row selectable dropdown
                //so we will have only one value that is why we re taking first value in selectedItems
                SelectedFacilityDisplayName = SelectedItems[0].FacilityDisplayName;

            //HERE TO OPEN THE RESOURCE AVAILABILITY FOR THE SELECTED FACILITY 
            //WE NEED TO SEND THE SELECTED FACILITY ID & SELECTED DATE WHILE GIVING THE APPOINTMENT
            //IF THE USER DID NOT SELECT WE WILL SHOW THE VALIDATION
            var InputToOpenResourceAvailability = {
                FacilityID: $scope.SelectedExistingPatApptFacilities,
                FacilityNames: SelectedFacilityDisplayName,
                ApptDate: $scope.AppointmentDateInAddMode,
                isForResourceAvailability: $scope.$parent.EMRDataFromPopup && $scope.$parent.EMRDataFromPopup.isForResourceAvailability,
                isFromOptmization: _.get($scope.$parent.EMRDataFromPopup, "isFromOptmization"),
                isFromRoom: isFromRoom,
            };
            //CONDITION TO CHECK WHETHER IT IS APPOINTMENT SCHEDULER FORMAT 1 OR APPOINTMENT SCHEDULER 2
            //CHECKING HAS VALUE EXISTS OF VARIABLE EMRDataFromPopup
            //CHECKING THE VALUE IN RequestFromFormat AND ASSIGNING IT TO InputToOpenResourceAvailability
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.RequestFromFormat)) {
                InputToOpenResourceAvailability.RequestFromFormat = $scope.EMRDataFromPopup.RequestFromFormat;
            }
            //SERVICE CALL TO OPEN THE RESOURCE AVAILABILITY POPUP
            //IN THIS POPUP THE USER CAN VIEW THE RESOURCE AVAILABILITY
            //BASED ON THE AVAILABILITYTHE USER CAN SELECT THE RESOURCE
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(4010), InputToOpenResourceAvailability, 'modal-1000px').then(function (ResultFromPopup) {
                if (!hasValue(ResultFromPopup) || ResultFromPopup == "cancel") return false;
                //if the popup is opened from Resource then flag will be undefined aand assigning selected data from popup to Resource Field
                if (!isFromRoom) {
                    //IF THE USER SELECTED THE ANY RESOURCE FROM THE POPUP BASED ON THE AVAILABILITY
                    //THEN WE ARE ASSIGNING THE PARTICULAR RESOURCE TO THE RESOURCE FIELD IN THE GIVE APPT. WINDOW
                    //HERE FROM THE POPUP WE WILL GET THE ID ALONG WITH THE TYPE
                    // TO SAVE RESOURCE ID WE NEED TO SPLIT WITH THE SEPERATOR
                    $scope.existingPatientAppointmentSelectResource = ResultFromPopup.title;
                    if (hasValue(ResultFromPopup.field))
                        $scope.existingPatientAppointmentSelectResourceID = ResultFromPopup.field.split('~')[0];
                }
                //if the popup is opened from Room then the flag will true so assiging selected data will be assigned to Room fields
                else {
                    $scope.existingPatientAppointmentSelectRoom = ResultFromPopup.title;
                    $scope.existingPatientAppointmentSelectRoomID = _.split(_.get(ResultFromPopup, "field"), "~")[0];
                }

            });
        }
        //#################### METHOD TO OPEN SHOW RESOURCE AVAILABILITY SELECT POPUP BLOCK END ######################


        /**
         * Function to check if trigger is customized for given Appointment's program services
         * @returns {Boolean} True if trigger is customized otherwise false
         */
        function existingPatientApptIsTriggerCustomized() {
            /**
             * SystemDefined Id for Appointment Give / Create. Used during trigger customization settings
             * @constant
             * @type {number}
             */
            var APPOINTMENT_GIVE_SYSTEMDEFNEDTYPEID = 0;


            // Parameters required to check if trigger is customized
            var params = {
                programServiceList: $scope.existingPatientAppointmentProgramsProgramsServicesList,
                ModuleFormSchedulerType: BillingChargeCaputureModuleTypeEnum.ONETOONEAPPT,
                AppointmentStatusSystemDefinedTypeID: APPOINTMENT_GIVE_SYSTEMDEFNEDTYPEID
            };

            // check if trigger is customized for inputs
            return processProgramServiceListAndCheckForTriggerCustomization.call(GiveNewAppointmentService, params);
        }



        //################### GET PHYSICIAN AND RESOURCE LIST  BLOCK START #########################
        //*******PURPOSE: THIS IS USED FOR POPULATING THE PHYSICIAN AND THE RESOURCE LIST IN THE EDIT APPOINTEMNT WINDOW , SO THAT THE USER WILL SELECT  FOR WHOM THE APPOINTMENT IS GOING TO GIVE 
        //*******CREATED BY: JASHUVA S
        //*******CREATED DATE: 11/23/2019
        $scope.ApptShed_PhyResourceandNonPhyList1 = function () {
            //HERE TAKING A APPT SHEDULER OBJECT
            //APPT SCHEDULER OBJECT IS USED TO PASS THE DATA TO  APPOINTMENT SCHEDULER SERVICE
            //--1 Physician,2 Resource, 0 for all
            var ApptShed_PhyResourceandNonPhyListinputValues = {
                "PhysicianId": 0,
                "ResourceType": 0,
                "practicemodel": EMRPracticeModel,
            };
            //HERE TAKING A FLAG IS FROM ADD APPT WINDOW A
            //AND ASSIGNING THE VALUE IS TRUE
            ApptShed_PhyResourceandNonPhyListinputValues.isFromAddApptWindow = true;
            //HERE TAKING CALL CENTRAL SELECT PRACTICE MODEL VALUE UNDEFINE
            //THIS FLAG  IS USED TO PASS THE DATA TO  APPOINTMENT SCHEDULER SERVICE
            var callCenterSelectedPracticeModel = undefined;
            //CALLING THE APPT SERVICE TO GET THE PHYSICIAN AND NON PHYSICIAN LIST
            GiveNewAppointmentService.ApptSched_SelectPhysicianandNonPhysician(ApptShed_PhyResourceandNonPhyListinputValues, callCenterSelectedPracticeModel).then(function (serviceResponse) {
                //HERE CHECKING THE SERVICE RESPONSE IS ERROR OR NOT
                //IF IT IS ERROR THEN DIRECTLY RETURNING OUT OF THE FUNCTION
                if (isError(serviceResponse)) return;
                // no need to provide assigned provider in provider field if default provider is customized from appt info in demographics
                if (isDefaultProviderCustomizationFromDemographicsExists) return;
                //HERE CHECKING SERVICE RESPONSE HAS A VALUE OR NOT & CHECKING IT CONTAINS PHYSIACINS AND NON PHYSICIANS LIST
                //AND CHECKING ITS LENGTH IS GREATER THAN ZERO OR NOT
                if (hasValue(serviceResponse) && hasValue(serviceResponse.physicianNonPhysicianAndResourcesOutputList) && serviceResponse.physicianNonPhysicianAndResourcesOutputList.length > 0) {
                    var ResourceTypeToFilter = 1;
                    if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") != "StaffActivitiesNotesSavingWindow") {
                        //HERE USING GREP FUNCTION FOR CHECKING USER SELECTED ASSIGNED PROVIDER ID IS MATCH WITH PHYSICIAN LIST OR NOT
                        //REASON : PREVIOUSLY THEY ASSIGN LOGIN USER AS A PHSIAN BUT BASED ON THE PRESENT REQUIRMENT IF U HAVE 
                        //ASSIGNED PROVIDER THEN ASSIGN THAT ASSIGNED PROVIDER WHEN GIVING NEW  APPOINTMENT TO PATIENT
                        var selectedAssignedProviderExistInList = $.grep(serviceResponse.physicianNonPhysicianAndResourcesOutputList, function (EachPhysianList) {
                            return EachPhysianList.PhysicianId == $scope.SelectedAssignedProviderID && EachPhysianList.ResourceType == ResourceTypeToFilter; //ResourceType 1 means filtering for provider 
                        });
                        //HERE CHECKING SELECTED ASSIGN PROVIDER HAS A VALUE OR NOT
                        if (hasValue(selectedAssignedProviderExistInList)) {
                            //HERE ASSIGNING ASSIGNED PROVIDER NAME VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER NAME
                            //ASSIGNED PROVIDER NAME IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
                            //BY PASSING THIS ASSIGNED PROVIDER NAME WE SAVE THE APPOINTMENT
                            $scope.existingPatientAppointmentSelectedProviderorResource = selectedAssignedProviderExistInList[0].DoctorName;
                            //HERE ASSIGNING ASSIGNED PROVIDER ID VALUE FROM EXISTING PATIENT SELECT VARIABLE TO SELECTED ASSIGNED PROVIDER ID
                            //ASSIGNED PROVIDER ID IS USED TO KNOW PATIENT SELECTED ASSIGNED PROVIDER
                            //BY PASSING THIS ASSIGNED PROVIDER ID WE SAVE THE APPOINTMENT
                            SelectedPhysicianID = selectedAssignedProviderExistInList[0].PhysicianId;
                        }
                    }
                }

                if ((populatePorgramServiceByDefault && !defaultProgamServiceBasedonPractice[EMRPracticeModel.PracticeID]) || _.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "StaffActivitiesNotesSavingWindow") {
                    autoPopulateProgramService();
                }

            });
        };

        //################### METHOD TO GET COUNTRY AND STATE WISE TIME ZONES NAMES BLOCK START #########################
        //*******PURPOSE: THIS METHOD IS GET COUNTRY AND STATE WISE TIME ZONES NAMES
        //*******CREATED BY:Praveen sanaka 
        //*******CREATED DATE: 01/22/2020
        //############### MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; ###############
        $scope.ExistingPatientApptSchedulerGetCountryAndStateTimeZoneNames = function () {
            //TO SHOW PATIENT TRACKER IN THE DASHBOARD ON THE LEFT FOLDERS BY CHCECKING WHEATHER THE SETTING IS CUSTOMIZED OR NOT
            //LOOPING ON appointmentSchedulerFieldsCustOutputList LIST TO GET THE 247 ID WHICH IS RELATED TO TIME ZONE
            if (hasValue($scope.ExistingPatientAppointmentColumnsCustomizationInfoList) && $scope.ExistingPatientAppointmentColumnsCustomizationInfoList.length > 0) {
                angular.forEach($scope.ExistingPatientAppointmentColumnsCustomizationInfoList, function (item) {
                    //FILTERING TIME ZONE RELATED ID AND THEN ASSIGNING AppointmentSettingFieldValue 
                    //INTO TO SCOPE VARIABLE TO SEND IT INTO CalendarListObject
                    if (hasValue(item) && hasValue(item.AppointmentSettingFieldID) && item.AppointmentSettingFieldID == 247) {
                        //CREATED SCOPE VARIABLE TO STORE COUNTRY AND STATE WISE TIME ZONE NAME AND WHICH IS ASSIGNING IN TimeZoneName PROPERTY IN 
                        //CalendarListObject TO SEND AS INPUT VARIABLE TO STORE IN GOOGLE CALENDAR
                        $scope.ExistingPatientAppointmentSchedulerEMRStateWiseTimeZone = item.AppointmentSettingFieldValue;
                    }
                });

            }
        }
        //################### METHOD TO GET COUNTRY AND STATE WISE TIME ZONES NAMES BLOCK END #########################

        //################### OPEN SEND APPOINTMENT REMAINDER POPUP BLOCK START #########################
        //*******PURPOSE: This method Used To Open Send Appointment Remainder Popup 
        //*******CREATED BY: Pavan.Burri
        //*******CREATED DATE: January 27 2019
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.appointmentSchedulerOpenSendRemainderPopup = function (AppointMentID) {
            var PopupData = {
                PopUpOpeningFrom: "AddAppointments",
                AppointmentID: AppointMentID
            };
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(1021), PopupData, 'md');
        };
        //################### OPEN SEND APPOINTMENT REMAINDER POPUP BLOCK end #########################

        //*******PURPOSE: This method Used To clear Added new patient selected language from popup
        //*******CREATED BY: praveen sanaka
        //*******CREATED DATE: Aug 10 2020
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        $scope.emrAddNewPatientSelectLanguageClickInNewApptPopupClear = function () {
            $scope.existingPatientsInterpreter = "";
            $scope.NewAppointmentSchedulerModel.InterpreterDescription = ""
        }
        async function existingPatientAppointmentAuthenticateToGoogleCalendar(serviceResponse) {
            await getPatientNameToBeShownInCalander();

            //GETTING THE APPT START DATE AND TIME
            var StartDateInfo = $scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode;

            //GETTING THE APPT END DATE AND TIME
            var EndDateInfo = new Date($scope.AppointmentDateInAddMode + " " + $scope.AppointmentTimeInAddMode).addMinutes(parseInt($scope.SelectedExistingPatApptDuration)).getFormat("MM/dd/yyyy hh:mm a");

            if (SelectedUserAuthenticatedMailCalenderTypes.indexOf("1") > -1) {
                //GETTING THE PATIENT NAME
                var PatientName = "";
                if (hasValue(ExistingPatientSelectedData) && hasValue(ExistingPatientSelectedData.SelectedPatient[0]) && hasValue(ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName)) {
                    PatientName = ExistingPatientSelectedData.SelectedPatient[0].PersonLastNameFirstName;
                }
                else {
                    PatientName = $scope.existingPatientAppointmentsPatientName;
                }

                var EmailAddressOfAdditionalParticipants = '';
                if (hasValue($scope.SelectedParticipantList) && $scope.SelectedParticipantList.length > 0) {
                    angular.forEach($scope.SelectedParticipantList, function (item) {
                        if (hasValue(item)) {
                            EmailAddressOfAdditionalParticipants += item.AuthenticateCalenderUserMailIDs + ",";
                        }
                    });

                    if (hasValue(EmailAddressOfAdditionalParticipants))
                        EmailAddressOfAdditionalParticipants = EmailAddressOfAdditionalParticipants.trimEnd(",");

                }


                if (hasValue(SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysician) && hasValue(SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysicianEmailID)) {
                    if (hasValue(EmailAddressOfAdditionalParticipants)) {
                        EmailAddressOfAdditionalParticipants = EmailAddressOfAdditionalParticipants + "," + SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysicianEmailID;
                    }
                    else {
                        EmailAddressOfAdditionalParticipants = SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedPhysicianEmailID;
                    }

                }

                if (hasValue(SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoom) && hasValue(SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoomEmailID)) {
                    if (hasValue(EmailAddressOfAdditionalParticipants)) {
                        EmailAddressOfAdditionalParticipants = EmailAddressOfAdditionalParticipants + "," + SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoomEmailID;
                    }
                    else {
                        EmailAddressOfAdditionalParticipants = SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoomEmailID;
                    }

                }

                if (hasValue(EmailAddressOfAdditionalParticipants))
                    EmailAddressOfAdditionalParticipants = EmailAddressOfAdditionalParticipants.trimEnd(",");

                var CalenderListObject = {
                    AuthenticatedTo: 1,
                    AppointmentId: serviceResponse && serviceResponse.ResponseID,
                    appointmentType: 1, // 1: REGULAR APPT, 2: GROUP THEREPY APPT
                    startTime: StartDateInfo,
                    endTime: EndDateInfo,
                    location: getResourceandRoomNameNamesBasedonPractice(),
                    summary: getPatientNameAlongwithEmailandPhonenumberBasedonPractice(),
                    timezone: $scope.ExistingPatientAppointmentSchedulerEMRStateWiseTimeZone,
                    attendees: EmailAddressOfAdditionalParticipants ? _.split(EmailAddressOfAdditionalParticipants, ",") : [], // "alexanderjoel516@gmail.com,joeljames516@gmail.com",     //$scope.SelectedParticipantList,
                    ProgramServiceName: _.join(_.map($scope.existingPatientAppointmentProgramsProgramsServicesList, "GroupTherapySessionTypeName"), "\n"),
                    isFromSchedulerRecurringApptsMenu: true,
                };

                var userInfo = {
                    id: $scope.NewAppointmentSchedulerModel.PhysicianID,
                    resourceType: $scope.NewAppointmentSchedulerModel.ResourceType,
                    type: 1, //1 for Creating Appt
                }

                if (isFromSaveAndScheduleGoogleMeet) {
                    CalenderListObject.CreateGoogleMeet = isFromSaveAndScheduleGoogleMeet;
                    CalenderListObject.PatientID = $scope.NewAppointmentSchedulerModel.PatientID;

                    if (doNotShowGoogleAddWindowPracticeIds) {
                        getFacilityTimeZoneandSaveApptinGoogleCalendar(CalenderListObject, userInfo);
                    } else {
                        var dataToPopup = {
                            AppointmentID: serviceResponse && serviceResponse.ResponseID,
                            FacilityID: $scope.NewAppointmentSchedulerModel.FacilityID,
                            openedFromNonScheduelrNavigation: true,
                        }

                        ModalPopupService.OpenPopup(GetEMRPageURLByIndex(5924), dataToPopup, "modal-420px");
                    }
                } else {
                    getFacilityTimeZoneandSaveApptinGoogleCalendar(CalenderListObject, userInfo)
                }


            }
            if (SelectedUserAuthenticatedMailCalenderTypes.indexOf("2") > -1 && serviceResponse && serviceResponse.ResponseID > 0) {
                createApptinOutlookCalendar(serviceResponse.ResponseID, StartDateInfo, EndDateInfo);
            }
        }
        function hideReferalAuthorizationAddPopUpForPractice() {
            if (EMRPracticeModel.PracticeID === 565 && EMRPracticeModel.LoggedUserID !== 16)
                $scope.referralAuthorizationAddPopupHide = true;
        }
        //function to load logged facility for the user
        function existingPatientAppointmentLoadFacilityForUser(serviceResponse, isFromPageLoad) {
            $scope.SelectedExistingPatApptFacilities = 0;
            if (donotAutoPopulateFacilityOnInit) return;
            if (hasValue(serviceResponse[0].FacilityID) && (serviceResponse[0].FacilityID > 0)) {
                //FOR ASSIGNING SELECTED DEFAULT FACILITY ON PAGE LOAD
                if (hasValue($scope.autoPopulateFacilityinGiveApptWindow) && (!hasValue($scope.EMRDataFromPopup) || !hasValue($scope.EMRDataFromPopup.PopupOpenFrom))) {
                    for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                        if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID == $scope.autoPopulateFacilityinGiveApptWindow) {
                            $scope.SelectedExistingPatApptFacilities = $scope.autoPopulateFacilityinGiveApptWindow;
                        }
                    }
                }
                //UNCOMMENTED BY HEMANTH 06/22/2016
                //FOR THE SEELCTED DATE SCHDULER GENEREATED FACILITY IS EXISTING IN FACILITIES LIST THEN ONLY AUTO SELECT THE FACILITY
                //IF THE SLECTED PROVIDER IS LINKED TO PARTICUER FACILITY AND THAT FACILITY IS NOT EXIST IN THE LIST THEN SHOW THE VALDAION
                else {
                    for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                        if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID == serviceResponse[0].FacilityID) {
                            $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                            if (isFromPageLoad && !_.get($scope.EMRDataFromPopup, "SelectedFacilityID"))
                                ChangeFacilityBasedOnModaility();
                            return;
                        }
                    }
                }
            }
            else {
                //FOR ASSIGNING SELECTED DEFAULT FACILITY ON PAGE LOAD
                if (hasValue($scope.autoPopulateFacilityinGiveApptWindow) && (!hasValue($scope.EMRDataFromPopup) || !hasValue($scope.EMRDataFromPopup.PopupOpenFrom))) {
                    for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {
                        if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID == $scope.autoPopulateFacilityinGiveApptWindow) {
                            $scope.SelectedExistingPatApptFacilities = $scope.autoPopulateFacilityinGiveApptWindow;
                        }
                    }
                }
                //IF DEFAULT FACILITY EXISTS FOR  SPECIFIED TIME THEN AUTO POPULATING
                //COMMENTED BY HEMANTH  06/22/2016(SCHEDUELR GENEREATED FACILITY IS NOT EXISTING IN THE FACILITES LIST)
                // $scope.SelectedExistingPatApptFacilities = serviceResponse[0].FacilityID;
                else {
                    var facilityID = $scope.EMRDataFromPopup && $scope.EMRDataFromPopup.isFromApptSchedulerFormat3New &&
                        $scope.EMRDataFromPopup.ResourceOrRoomType == 2 && $scope.EMRDataFromPopup.FacilityID > 0 ? $scope.EMRDataFromPopup.FacilityID : EMRPracticeModel.LoggedFacilityID;
                    //CHECKING WHETHER THE LOGGED FACILITYID IS EXISTS OR NOT
                    for (var FacilityIndex = 0; FacilityIndex <= $scope.ApptSchedView_FacilitiesList.length - 1; FacilityIndex++) {

                        if ($scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID == facilityID) {
                            $scope.SelectedExistingPatApptFacilities = $scope.ApptSchedView_FacilitiesList[FacilityIndex].FacilityID;
                            if (isFromPageLoad && !_.get($scope.EMRDataFromPopup, "SelectedFacilityID"))
                                ChangeFacilityBasedOnModaility();
                            return;
                        }
                    }
                }
            }
            if (isFromPageLoad && !_.get($scope.EMRDataFromPopup, "SelectedFacilityID"))
                ChangeFacilityBasedOnModaility();
        }
        function validateEncounterModalityLinkedFacilityForPractice() {
            //if telephone is selected as modality then phone 02 must be facility and vice versa
            //if there is mismatch in this combination then we are showing below validations for Desert rain behavioural health services practice(361)
            if ($scope.SelectedExistingPatApptFacilities == 22 && $scope.NewAppointmentSchedulerModel.AppointmentTypeID != 2) {
                ShowErrorMessage("Please select Encounter Modality Telephone for  Facility Phone(02)  to save Appt.");
                if (_.get($scope.existingPatientAppointmentWidgets, `ddlExistingPatientAppointmentEncounterModalityInfo`))
                    $scope.existingPatientAppointmentWidgets.ddlExistingPatientAppointmentEncounterModalityInfo.focus();
                return true;
            }
        }
        $scope.existingPatientAppointmentsSettingsContextMenuSelect = function (e) {
            AppointmentWindowsSettingsService.openSettingsPopUp(e, APPOINTMENTSCHEDULER.COMMONFORALL);
        }


        //THIS METHOD IS USED TO ASSIGN AUTH USED COUNT BY GETTING DURATION 
        // AS PER REQUIREMENT GIVEN BY PRIYANKA GARU MENTIONED IN TASK ID  1946  AUTH USED COUNT GET FORM DURATION BY CONSIDERING 15 MINS AS A 1 UNIT
        //*******PURPOSE: THIS METHOD IS USED TO ASSIGN AUTH USED COUNT BY GETTING DURATION 
        //*******CREATED BY: PAVAN BHARIDE
        //*******CREATED DATE: April 17 2021
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //function autoPopulateauthcountFromDuration(Duration) {
        //    if (!hasValue(Duration) || Duration <= 0) return;
        //    if (hasValue($scope.existingPatientMainGridOptions) && hasValue($scope.existingPatientMainGridOptions.dataSource.data()) && $scope.existingPatientMainGridOptions.dataSource.data().length > 0) {
        //        if ($scope.existingPatientMainGridOptions.dataSource.data().length == 1) {
        //            $scope.existingPatientMainGridOptions.dataSource.data()[0].NumberofUnitsForThisVisit = (Duration / 15);
        //        }
        //    }
        //};


        //*******PURPOSE: THIS METHOD IS USED TO CLEAR AUTH GRID WHEN PGM AND SERVICES ARE TOTALLY CLEARED
        //*******CREATED BY: PAVAN BHARIDE
        //*******CREATED DATE: April 17 2021
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //function clearPriorAuthGridInfowhileClearingPgmservice() {

        //    if (hasValue($scope.existingPatientMainGridOptions) && hasValue($scope.existingPatientMainGridOptions.dataSource.data()) && $scope.existingPatientMainGridOptions.dataSource.data().length > 0) {
        //        $scope.existingPatientMainGridOptions.dataSource.data([]);
        //        $scope.ExistingPatientAppointmentsShow = false;
        //        $scope.ExistingPatientAppointmentDetailShow = false;
        //    }
        //};

        //*******PURPOSE: THIS METHOD IS USED TO REFRESH PRIOR AUTH GRID WHEN EACH PGM AND SERVICES ARE CLEARED
        //*******CREATED BY: PAVAN BHARIDE
        //*******CREATED DATE: April 17 2021
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        //function clearandGetPriorauthGridinfoByRemainingPgmandServices(selectedProgram) {
        //    if (hasValue(selectedProgram) && hasValue($scope.Programservicelist) && $scope.Programservicelist.length > 0) {
        //        for (var i = 0; i <= $scope.Programservicelist.length - 1; i++) {
        //            if ($scope.Programservicelist[i].Programs_Services_LinkedInfo_ID == selectedProgram.ProgramsServicesLinkedInfoID) {
        //                $scope.Programservicelist.splice(i, 1);
        //                break;
        //            }
        //        }
        //        if (hasValue($scope.Programservicelist) && $scope.Programservicelist.length > 0) {
        //            $scope.existingPatientAppointmentGetAuthorizationDetails(true, $scope.Programservicelist, $scope.existingPatientAppointmentHealthPlanID);
        //        }
        //    }

        //};


        /***[
            * DOMAIN NAME: Give Appointment; Window - Add Mode
            * CLASS NAME: ExistingPatientAppointmentsController.js
            * CONDITION METHOD: this condition is used at existingPatientAppointmentGetAuthorizationDetails,existingPatientAppointmentClearProgramsProgramsServices,existingPatientAppointmentProgramsServicesClearClick, existingPatientApptDurationClick
            * FOR SINGLE CUSTOMER :Yes
            * PRACTICEIDS: HAND OF MERCY - 565 (For testing : 999 (Local), 285 (Gamma), 267(Production))
            * NEXT REVIEW DATE: NOT REQUIRED
            * SOLUTION NAME: WEB
            * NAVIGATION: Dash board >> Appt schedular Format x >> Give appointment
            * TASK DESCRIPTION: FOR HAND OF MERCY  (PRACTICE ID 565) want to get Auth records which having Program and serivece that are documented at appt window
            ]***/
        //function needProgramservicelinkedAuthRecordsForthesepractices() {
        //	return [999, 36, 285, 267, 565].includes(EMRPracticeModel.PracticeID);
        //}

        //function dontNeedExistingsingleAuthDeductionForthisPractices() {
        //	return [9999, 257, 543, 285, 267, 565, 93].includes(EMRPracticeModel.PracticeID);
        //}

        //customize this feild at appt settings window to make below flag true >> 'Add Appt. Provider as Additional Provider in Patient Demographics'
        function dontNeedExistingsingleAuthDeductionForthisPractices() {
            //need work for all practices
            if (isRefferralAuthorizationFieldCustomizedOrNot) {
                return false;
            } else {
                return true;
            }
            //return ([632, 565, 617].includes(EMRPracticeModel.PracticeID)|| (EMRPracticeModel.PracticeID == 999 && EMRPracticeModel.LoggedUserID == 11585));
        }

        //function dontNeedProgramservicelinkedAuthRecordsForthesepractices() {
        //	return [9999, 257, 543, 93].includes(EMRPracticeModel.PracticeID);
        //}

        //###################  CLEAR AUTH COUNT WHEN DUREATION GOT CLEARD ###############################
        //*******PURPOSE        : clear auth count 
        //*******CREATED BY     : Pavan Bharide
        //*******CREATED DATE   : April 23 2021
        //$scope.aptdurationOnLeave = function () {
        //    if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() && needProgramservicelinkedAuthRecordsForthesepractices()) {
        //        autoPopulateauthcountFromDuration($scope.SelectedExistingPatApptDuration);
        //    }
        //    if (!dontNeedProgramservicelinkedAuthRecordsForthesepractices() &&
        //        needProgramservicelinkedAuthRecordsForthesepractices() && (!hasValue($scope.SelectedExistingPatApptDuration) || $scope.SelectedExistingPatApptDuration <= 0)) {
        //        if (hasValue($scope.existingPatientMainGridOptions) && hasValue($scope.existingPatientMainGridOptions.dataSource.data()) && $scope.existingPatientMainGridOptions.dataSource.data().length > 0) {
        //            if (hasValue($scope.existingPatientMainGridOptions.dataSource.data()[0])) {
        //                $scope.existingPatientMainGridOptions.dataSource.data()[0].NumberofUnitsForThisVisit = undefined;
        //            }
        //        }
        //    }
        //    else
        //        return;
        //};
        /**
        /**
         * @Description : The Method to Assign Appointment Duration to the Patient Appointment
         * For 601 Practice non Need to Popuplate Provider Scheduler Duration when provider Change
         * For Remaining Practices Provider Scheduler Duration will populate when provider change
         * @CreatedDate : 10/18/2021
         * */
        function assignAppointmentDuration(apptDuration) {
            if ([601, 660, 672, 705, 706, 722].includes(EMRPracticeModel.PracticeID) && isFromProviderResourcePopupClick === true && $scope.SelectedExistingPatApptDuration) { return; }
            $scope.SelectedExistingPatApptDuration = apptDuration;

        }
        /**
        * The Method to Get Services Name with Comman Seperated
        * @param {any} result
        * @param {any} ProgramID
        */
        const getServiceNamesWithCommaSeperated = (result, ProgramID) => {
            return _.filter(result, function (categoryitem) {
                if (categoryitem.ProgramID == ProgramID) { return categoryitem }
            }).map(function (obj) { return obj.GroupTherapyName; }).join(", ");
        }


        /**
         * @description changing the facility based on the encounter modality
         *              . for now practice id 118 wants the facility change on modaility so we are placed practice id check
         * @since 02//18/2022
         */
        function ChangeFacilityBasedOnModaility() {
            if ([118, 467].includes(EMRPracticeModel.PracticeID)) {
                if ($scope.NewAppointmentSchedulerModel.AppointmentTypeID == GiveAppointmentConstantsService.encounterModalityIds.FACETOFACE
                    && _.find($scope.ApptSchedView_FacilitiesList, { FacilityID: GiveAppointmentConstantsService.FacilitydsFor118Practice.HPHC })) {
                    $scope.SelectedExistingPatApptFacilities = GiveAppointmentConstantsService.FacilitydsFor118Practice.HPHC;
                }

                else if ($scope.NewAppointmentSchedulerModel.AppointmentTypeID == GiveAppointmentConstantsService.encounterModalityIds.VIDEO
                    && _.find($scope.ApptSchedView_FacilitiesList, { FacilityID: GiveAppointmentConstantsService.FacilitydsFor118Practice.HPHC_TELE })) {
                    $scope.SelectedExistingPatApptFacilities = GiveAppointmentConstantsService.FacilitydsFor118Practice.HPHC_TELE;
                }

            }
        }







        //Added By Lakshmi On 01/05/2017 because focus not Applicable for customized fields,for this NeedToFocusElement Code Commented
        function EHRPerformMandatoryValidationsInFormWithOutFocusForCustomizationFields(formElementId) {

            var mandatoryElementsCount = 0;
            //var NeedToFocusElement = undefined;

            if (!hasValue(formElementId)) return true;

            if (!hasValue(angular.element('#' + formElementId)) || angular.element('#' + formElementId).length <= 0) return true;

            //removing the previous validations
            removeMandatoryForElementsInForm(formElementId);

            //getting only the required elements to check validations
            var ElementsCollection = angular.element('#' + formElementId + ' select.mandatoryCheck,input.mandatoryCheck,div.mandatoryCheck');

            var ElementsCollectionLength = ElementsCollection.length;

            for (var indexInElements = 0; indexInElements < ElementsCollectionLength; indexInElements++) {

                var currentElementValue = undefined;

                var currentElement = ElementsCollection[indexInElements];

                if (hasValue(angular.element(currentElement).prop('tagName'))) {

                    var currentElementTagName = angular.element(currentElement).prop('tagName').toLowerCase();

                    switch (currentElementTagName) {

                        case 'select':

                            if (hasValue(angular.element(currentElement).attr("data-role"))) {

                                var dataRoleType = angular.element(currentElement).attr("data-role").toLowerCase();

                                if (hasValue(dataRoleType)) {

                                    switch (dataRoleType.toLowerCase()) {

                                        case 'dropdownlist':
                                            currentElementValue = angular.element(currentElement).data("kendoDropDownList").value();

                                            if (hasValue(currentElementValue)) {
                                                if ((typeof currentElementValue).toLowerCase() == "string") {
                                                    if (currentElementValue == "-1" || currentElementValue == "0" || currentElementValue.trim().length <= 0 || currentElementValue.toLowerCase() == "-select-" || currentElementValue.replace(/\ -/ig, "").toLowerCase() == "select") {
                                                        currentElementValue = "";
                                                    }
                                                }
                                            }
                                            break;
                                        case 'multiselect':
                                            currentElementValue = angular.element(currentElement).data("kendoMultiSelect").value();
                                            break;
                                        case 'combobox':
                                            currentElementValue = angular.element(currentElement).val();
                                            if (!hasValue(currentElementValue))
                                                currentElementValue = angular.element(currentElement).data("kendoComboBox").dataItem();
                                            break;
                                        default:
                                            if (angular.element(currentElement).hasClass('k-input'))
                                                currentElementValue = 1;
                                            else
                                                currentElementValue = angular.element(currentElement).val();
                                            break;
                                    }
                                }
                            }
                            break;
                        case 'input':

                            if (hasValue(angular.element(currentElement).prop("type"))) {

                                var elementType = angular.element(currentElement).prop("type").toLowerCase();

                                switch (elementType) {

                                    case 'number':
                                        currentElementValue = angular.element(currentElement).val();
                                        break;
                                    case 'text':
                                        if (angular.element(currentElement).hasClass('k-input')) {

                                            var dataRoleType = angular.element(currentElement).attr("data-role");

                                            if (hasValue(dataRoleType) && dataRoleType.toLowerCase() == "datepicker") {
                                                currentElementValue = angular.element(currentElement).val();
                                            }
                                            else
                                                currentElementValue = 1;

                                        }
                                        else
                                            currentElementValue = angular.element(currentElement).val();
                                        break;
                                    case 'checkbox':
                                        currentElementValue = angular.element(currentElement).prop("checked");
                                        //when checked then there exists data
                                        if (currentElementValue)
                                            currentElementValue = "1";
                                        //when not checked then there is no data 
                                        else
                                            currentElementValue = "-1";
                                        break;
                                    case 'radio':
                                        currentElementValue = angular.element(currentElement).prop("checked");
                                        //when checked then there exists data
                                        if (currentElementValue)
                                            currentElementValue = "1";
                                        //when not checked then there is no data 
                                        else
                                            currentElementValue = "-1";
                                        break;
                                    default:
                                        if (angular.element(currentElement).hasClass('k-input'))
                                            currentElementValue = 1;
                                        else
                                            currentElementValue = angular.element(currentElement).val();
                                        break;
                                }
                            }
                            break;

                        case 'div':

                            var GridInstance = angular.element(currentElement).data('kendoGrid');

                            if (hasValue(GridInstance)) {
                                //when check box is show then get the selected rows list from the grid
                                if (GridInstance.options.showCheckBoxColumn) {
                                    currentElementValue = getSelectedRowsFromGridGlobal(GridInstance);
                                }
                                else {
                                    if (hasValue(GridInstance.select())) {
                                        currentElementValue = GridInstance.dataItem(GridInstance.select());
                                    }
                                }
                            }
                            break;

                        case 'span':
                        case 'label':
                        case 'i':
                            currentElementValue = "1";
                            break;

                        default:
                            if (angular.element(currentElement).hasClass('k-input'))
                                currentElementValue = 1;
                            else
                                currentElementValue = angular.element(currentElement).val();
                            break;
                    }
                }


                var labelTargetToHighLight = angular.element("#" + formElementId + " label[for='" + angular.element(currentElement).prop("id") + "']");

                if (!hasValue(labelTargetToHighLight) || labelTargetToHighLight.length <= 0) {
                    labelTargetToHighLight = angular.element(currentElement);
                }

                if (!hasValue(currentElementValue)) {
                    angular.element(labelTargetToHighLight).addClass('ehrmandatory');
                    mandatoryElementsCount += 1;
                }

                else {

                    if ((typeof currentElementValue).toLowerCase() == "string") {
                        if (currentElementValue == "-1" || currentElementValue.trim().length <= 0 || currentElementValue.toLowerCase() == "-select-") {
                            angular.element(labelTargetToHighLight).addClass('ehrmandatory');
                            mandatoryElementsCount += 1;
                        }
                        else {
                            angular.element(labelTargetToHighLight).removeClass('ehrmandatory');
                        }
                    }
                    else {
                        angular.element(labelTargetToHighLight).removeClass('ehrmandatory');
                    }
                }


            }
            if (mandatoryElementsCount > 0) {


                return false;
            }
            else
                return true;
        }




        //removing the previous validations for elements in the form
        function removeMandatoryForElementsInForm(formElementId) {

            if (!hasValue(formElementId)) return;

            if (!hasValue(angular.element('#' + formElementId)) || angular.element('#' + formElementId).length <= 0) return;
            //removing the previous validations
            angular.element('#' + formElementId).find(".ehrmandatory").removeClass('ehrmandatory');
        }




        //******************************** AUTO ADD SERVICE(S) TO THE PROGRAM(S) WHILE GIVING THE ONE TO ONE / GROUP THERAPY APPOINTMENT TO THE PATIENT ******************
        //*******PURPOSE: This method is used to AUTO ADD SERVICE(S) TO THE PROGRAM(S) WHILE GIVING THE ONE TO ONE / GROUP THERAPY APPOINTMENT TO THE PATIENT
        //*******CREATED BY: PHANI KUMAR M
        //*******CREATED DATE: 31 ST MARCH 2018
        //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        function AutoAddServicestoProgramsGivenInApptWindowBasedonSettings(InputData) {
            if (!hasValue(InputData) || !hasValue(InputData.PatientIDs) || InputData.PatientIDs.length <= 0 || !hasValue(InputData.ServiceStartDateTime) || !hasValue(InputData.ProgramServiceLinkedInfoIDs) || InputData.ProgramServiceLinkedInfoIDs.length <= 0) return;


            var PostData = {
                practicemodel: EMRPracticeModel,
            }
            GiveNewAppointmentService.settingsGetAdmissionEnrollmentTypeSettings(PostData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                if (hasValue(serviceResponse) && hasValue(serviceResponse.AutoAddServicesGivenInApptWindow) && serviceResponse.AutoAddServicesGivenInApptWindow == true) {
                    var AutoCreationData = {
                        AutoCreateServicePatientIDs: InputData.PatientIDs,
                        AutoCreateServiceStartDateTime: InputData.ServiceStartDateTime,
                        AutoCreateProgramsServicesLinkedInfoIDs: InputData.ProgramServiceLinkedInfoIDs,
                        AutoCreateServiceIdentityID: InputData.IdentityID
                    }
                    if (!hasValue(InputData.NavigationFrom) || InputData.NavigationFrom <= 0) {
                        AutoCreationData.AutoCreateServiceNavigationID = 1;
                    } else {
                        AutoCreationData.AutoCreateServiceNavigationID = InputData.NavigationFrom;
                    }
                    var ServiceData = {
                        autocreateservicedatamodel: AutoCreationData
                    }
                    GiveNewAppointmentService.levelOfCareAdmissionDetailsAutoAddServicesSelectedWhileGivingAppointments(ServiceData).then(function (autoCreateserviceResponse) {
                        if (isError(autoCreateserviceResponse)) return;
                    });
                }
            });

        }

        //******************************** AUTO ADD SERVICE(S) TO THE PROGRAM(S) WHILE GIVING THE ONE TO ONE / GROUP THERAPY APPOINTMENT TO THE PATIENT ******************
        /**
     * The Method To check Validation Before Saving an Appointment
     * Scenario : if User Trying to Give More than one Appt to Same Patient with same program Service on Same Day
     * if Validation satisfies then not allowing user to Save Appt.
     * @param {any} inputData
     */
        async function ValidateWhileGivingMoreThanOneAppttoSamePatientwithSameProgramonSameDay() {
            if ((EMRPracticeModel.PracticeID != 11111 && parseInt($scope.NewAppointmentSchedulerModel.PhysicianID) == 2 && parseInt($scope.NewAppointmentSchedulerModel.ResourceType) == 2)
                || (EMRPracticeModel.PracticeID == 11111 && parseInt($scope.NewAppointmentSchedulerModel.PhysicianID) == 31 && parseInt($scope.NewAppointmentSchedulerModel.ResourceType) == 2)) return $q.when(false);
            const inputModel = {
                PatientID: $scope.NewAppointmentSchedulerModel.PatientID,
                ProgramsServicesLinkingInfoIDs: $scope.NewAppointmentSchedulerModel.ApptProgramsServicesLinkingInfoIDs.toString().split(","),
                ApptDateTime: $scope.NewAppointmentSchedulerModel.StartTime,
            }
            const response = await GiveNewAppointmentService.ValidateWhileGivingMoreThanOneAppttoSamePatientwithSameProgramonSameDay(inputModel);
            if (_.isEmpty(response.ApptDateTimeandPhysiciansList)) return $q.when(false);
            const result = await ModalPopupService.OpenPopup(GetEMRPageURLByIndex(4770), response.ApptDateTimeandPhysiciansList, "modal-500px");
            if (result == "cancel") {
                return $q.when(true);
            }

        }

        /**
         * As Per Kumara Sir need to Accept Appt Duration with Multiples of 5 Only
         * if Other than Multiples of 5 is selected then showing validation.
         * */
        $scope.existingPatientAppointmentDurationChange = function () {
            if (ignoreMultiplesofFiveValidationforDuration) return;
            const apptDuration = parseInt($scope.SelectedExistingPatApptDuration)
            if (hasValue($scope.SelectedExistingPatApptDuration) && (apptDuration == 0 || apptDuration % 5 != 0)) {
                ShowErrorMessage("Please Enter Duration in Multiples of 5.");
                if ($scope.existingPatientAppointmentWidgets && $scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration)
                    $scope.existingPatientAppointmentWidgets.ddlBoxAppointmentDuration.focus();
                return true;
            }

        }


        /**
         * The Method is used for Creating appt in outlook calendar
         * @param {any} appointmentID
         * @param {any} apptStartTime
         * @param {any} apptEndTime
         */
        function createApptinOutlookCalendar(appointmentID, apptStartTime, apptEndTime) {
            const timeZone = getTimeZoneNameforOutlookCalendar();
            const inputModel = {
                AppointmentID: appointmentID,
                AppointmentType: 1, // 1: REGULAR APPT, 2: GROUP THEREPY APPT,
                ResourceType: $scope.NewAppointmentSchedulerModel.ResourceType,
                Location: {
                    displayName: $scope.NewAppointmentSchedulerModel.FacilityName,
                },
                Subject: [467, 565, 999].includes(EMRPracticeModel.PracticeID) ? `MR: ${$scope.NewAppointmentSchedulerModel.PatientID}` : $scope.NewAppointmentSchedulerModel.PersonName,
                Start: {
                    DateTime: new Date(apptStartTime).getFormat("yyyy-MM-ddTHH:mm:ss"),
                    TimeZone: timeZone,
                },
                End: {
                    DateTime: new Date(apptEndTime).getFormat("yyyy-MM-ddTHH:mm:ss"),
                    TimeZone: timeZone,
                },
                Attendees: buildAdditionalProviderEmailAddressListforOutlookCalendar(),
                Type: 1,//Create Appt
                UserID: $scope.NewAppointmentSchedulerModel.PhysicianID,
                TransactionId: adminGetGUID(),
            }
            CalendarIntegrationService.SendOutlookCalendarApptstoQueue(inputModel).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
            });

        }

        /**
         * The Method to Get Outlook Calendar time zone from appointment Scheudler Settings
         * if no timezone then consider practice timezone
         * */
        function getTimeZoneNameforOutlookCalendar() {
            const outlookCalendarTimeZoneItem = _.find($scope.ExistingPatientAppointmentColumnsCustomizationInfoList || [], { AppointmentSettingFieldID: 281 });
            if (_.size(outlookCalendarTimeZoneItem) > 0) {
                return TimeZoneNameEnums[parseInt(outlookCalendarTimeZoneItem.AppointmentSettingFieldValue)];
            }
            else if (EMRPracticeModel && EMRPracticeModel.practicesettingsmodel && EMRPracticeModel.practicesettingsmodel.PracticeTimeZone) {
                return EMRPracticeModel.practicesettingsmodel.PracticeTimeZone.split(" - ")[1];
            }
        }
        /**
         * The Method to Build Additional Provider Email ids for outlook calendar
         * */
        function buildAdditionalProviderEmailAddressListforOutlookCalendar() {
            let attendees = [];
            angular.forEach($scope.SelectedParticipantList || [], function (item) {
                if (item && item.AuthenticatedOutlookCalenderUserMailIDs) {
                    attendees.push({ emailAddress: { address: item.AuthenticatedOutlookCalenderUserMailIDs }, type: "optional" });
                }
            });
            return attendees;
        }

        var isFirstMedicalVideoReviewedList = [
            { "TypeId": 0, "TypeName": "-- Select --" },
            { "TypeId": 1, "TypeName": "Yes" },
            { "TypeId": 2, "TypeName": "No" },
        ];


        $scope.isFirstMedicalVideoReviewedDataSource = new kendo.data.DataSource({
            data: isFirstMedicalVideoReviewedList,//ASSIGNING NULL ON DEFAULT       
        });


        function getPatientPastApptDataAndShowLabels() {
            var PostData = {
                PatientID: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
            }

            //CALLING THE SERVICE TO GET THE LIST OF DRIVER DETAILS TO SHOW IN THE GRID
            GiveNewAppointmentService.GetPatientAppointmentDetailsToAutoPopulate(PostData).then(function (serviceResponse) {

                //CHECKING THE SERVICE RESPONSE
                if (isError(serviceResponse) || !serviceResponse) return;

                if (serviceResponse.ShowAlertsPopUp) {
                    $scope.exisitingPateintApptLoadPatientAlertsInPopup();
                }

                if (serviceResponse.AppointmentstartDateTime) {
                    //TO SHWO THE PREVIOUS APPT DETAIOLS INFORMATION 
                    $scope.ExistingPatientAppointmentPrevApptDetailsShow = true;
                    $scope.existingPatientAppointmentopenApptHxShowHideLastApptDate = true;
                    //ASSIGNING THE APPT DATE DESCRIPTION INFORMATION 
                    $scope.existingPatientApptLastApptDate = serviceResponse.AppointmentstartDateTime;

                    if (serviceResponse.AppointmentStatusDesc) {
                        $scope.existingPatientAppointmentopenApptHxShowHideStatus = true;
                        $scope.existingPatientApptLastApptStatus = serviceResponse.AppointmentStatusDesc;
                    }
                    //if the visit type exists then only show the visit tyep 
                    if (hasValue(serviceResponse.VisitType)) {
                        $scope.existingPatientApptLastApptVisitType = serviceResponse.VisitType;
                        $scope.existingPatientAppointmentopenApptHxShowHideVisitType = true;
                    }
                    else {
                        $scope.existingPatientAppointmentopenApptHxShowHideVisitType = false;
                    }

                } else {
                    $scope.ExistingPatientAppointmentPrevApptDetailsShow = false;
                }
            });
        }






        function sendAppointmentRemindertoAdditionalParticipants(AppointMentID) {
            if (!additionalParticipantsRemindersSendingBasedOnPractice || !$scope.existingPatientselectedAdditionalParticipants || !AppointMentID) return;

            GiveNewAppointmentService.EMRGetPracticeBasedAppointmentReminderInformation({}).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;


                if (serviceResponse.EnableAdditionalParticipantReminders) {
                    var PostData = {
                        AppointmentIdsArr: [AppointMentID],
                    };
                    GiveNewAppointmentService.SendAppointmentRemindertoAdditionalParticipants(PostData).then(function (serviceResponse) {
                        if (isError(serviceResponse)) return;
                        ShowSuccessMessage("Your Appointment Reminder will be Sent Shortly to Patient Contacts.");
                    });
                }
            })
        }

        function bindInsuranceDetailsinBilltoField(insuranceInfo) {
            // binding health plan to respectiv feild
            $scope.existingPatientAppointmentBillToInsuranceNames = (showPrimarySecondaryandTeritiaryPoliciesInfoBasedonPractice || $scope.hideBilltoField) ? insuranceInfo.InsuranceName : insuranceInfo.HealthPlanName;
            if (hasValue(insuranceInfo.PolicyEndDate)) { // appending policy expiry date to insurance name  -- added by AHMED BASHA SHAIK 
                $scope.existingPatientAppointmentBillToInsuranceNames = $scope.existingPatientAppointmentBillToInsuranceNames + " (Exp Date: " + insuranceInfo.PolicyEndDate + ")";
            }
            // copay flag for hide show
            $scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide = showCopayLinkedtoAppt;
            // insurence id from selected record
            $scope.existingPatientAppointmentBillToInsuranceID = insuranceInfo.PatientInsuranceID;
            if ($scope.ExistingPatientAppointmentsCopayLinkedtoApptShowHide || hideCopyLinkedtoApptForProvidersandAutopopulateCopayValue || $scope.hideBilltoField)
                $scope.existingPatientAppointmentCheckCopayCount($scope.existingPatientAppointmentBillToInsuranceID);
            //ADDED BY HEMANTH ON APR 12 TO EFFECT THE CHANGES REALTED TO --  RESTRICT PROGRIAM - SEERVICES LINKED TO GRANTS WHILE GIVING NEW APPT 
            if (hasValue(insuranceInfo.GrantID) && insuranceInfo.GrantID > 0) {
                $scope.existingPatientAppointmentGrantID = insuranceInfo.GrantID;
            }
            else {
                $scope.existingPatientAppointmentGrantID = 0;
            }

            //MAINTAIN THE INSURANCE ID AS SCOPE LEVEL VARIABLE TO PASS THE UPDATING SP
            if (hasValue(insuranceInfo.InsuranceID) && insuranceInfo.InsuranceID > 0) {
                $scope.existingPatientAppointmentHealthPlanID = insuranceInfo.InsuranceID;
            }
            else {
                $scope.existingPatientAppointmentHealthPlanID = 0;
            }

            //Button Active When Data Auto Populated
            //$scope.existingPatientAppointmentBillToInsuranceButtonClass = "fc-button ExistingApptActiveColorClass fc-corner-left";
            $scope.existingPatientAppointmentBillToInsuranceButtonClass = "ExistingApptActiveColorClass";
            ///WHEN LOADING THE PRIMARY INSURANCE THEN APPT  BILL TO TYPE IS 1 FOR THE INSURANCE IS SAVED
            $scope.NewAppointmentSchedulerModel.ApptBillTo = 1;
            $scope.NewAppointmentSchedulerModel.InsuranceComments = insuranceInfo.Comments;//To get the insurance comments form the policy comments
            //if patient has primary insurance then this flag is false
            $scope.NewAppointmentSchedulerModel.BillingNotRequired = false;
            if (!dontNeedExistingsingleAuthDeductionForthisPractices()) {
                exisitingPatientApptReferralAuthorizationPopulateUsedField();
            }
        }
        /**
        * The Method to Show / hide Demographics Comments Field
        * Comments Field will be Hide only when the comments field is empty and not mandatory
        */
        function showorHideDemogrphicsCommentsField() {
            if (!$scope.isDemographicsCommentsFieldMandatory && !$scope.DemographicsAppointmentComments) {
                $scope.hideDemographicsCommentsField = true;
            }
            else {
                $scope.hideDemographicsCommentsField = false;
            }
        }

        function getPatientAssignedProviderID() {
            var patientID = ExistingPatientSelectedData && ExistingPatientSelectedData.SelectedPatient[0] && ExistingPatientSelectedData.SelectedPatient[0].PatientID || 0;
            if (patientID <= 0) return;
            GiveNewAppointmentService.GetPatientAssignedProviderID({ PatientID: patientID }).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;
                patientAssignedProviderID = serviceResponse && serviceResponse.ProviderID || 0;
            });
        }
        /**
        * The Method to Show COnfirmation Popup when Slected Provider is not a Patient Assigned Provider
        * @param {any} isSaveAndAddBillingInfo
        * @param {any} isSendApptRemainder
        * @param {any} isFromSaveAndZoomLink
        * @param {any} isFromSaveAndTeamLink
        */
        function showCofirmationPopupWhenSelectedProviderisnotPatientAssignedProvider(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {
            var confirmationMessage = "Selected Provider is not a Patient Assigned Provider. <br><br> Still Do you Want to Continue to Update Appt with Existing Provider?";
            ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), confirmationMessage, 'md').then(function (result) {
                if (result == "NO") return;
                if (showConfirmationifApptDurationExceedsClinicApptDuration) {
                    openConfirmationPopupifApptDurationExceedsClinicApptDuration(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }
                else {
                    saveApptforPatientAfterCheckingValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }
            })
        }
        let descriptionData = [
            { descriptionName: "DIVERSION – New Referral – Telephonic", descriptionID: 1 },
            { descriptionName: "DIVERSION – Re Referral – Telephonic", descriptionID: 2 },
            { descriptionName: "VETERANS – New Referral – Telephonic", descriptionID: 3 },
            { descriptionName: "CURFEW", descriptionID: 4 },
            { descriptionName: "New Referral – Telephonic", descriptionID: 5 },
            { descriptionName: "Re Referral – Telephonic", descriptionID: 6 },
            { descriptionName: "JUV GPS ALF - Telephonic", descriptionID: 7 },
            { descriptionName: "JUV GPS DAT - Telephonic", descriptionID: 7 },
            { descriptionName: "STATUS REVIEW", descriptionID: 8 },
            { descriptionName: "JUV GPS ALF - New Referral", descriptionID: 9 },
            { descriptionName: "JUV GPS ALF - Re-Referral", descriptionID: 10 },
            { descriptionName: "JUV GPS DAT - New Referral", descriptionID: 11 },
            { descriptionName: "JUV GPS DAT - Re-Referral", descriptionID: 12 },
        ];
        $scope.descriptionDataSource = new kendo.data.DataSource({
            data: descriptionData,
        });
        $scope.apptCommentsOption = {
            placeholder: "",
            dataTextField: "descriptionName",
            dataValueField: "descriptionID",
            valuePrimitive: true,
            dataSource: $scope.descriptionDataSource,
            open: function (e) {
                var isClose = false;
                var value = e.sender.value();
                if (!value)
                    isClose = true;
                if (isClose) {//Autocomplete Suggestion Close 
                    e.preventDefault();
                }
            },
        }
        $scope.getComments = function () {
            $scope.descriptionDataSource.data(descriptionData);
            existingApptGeneralCommentTimeOut = $timeout(function () {
                if (kendoSelectors)
                    kendoSelectors.existingApptGeneralComment = $(`#txtGeneralComments`).data("kendoAutoComplete")
            })
        }


        function getPatientLinkedPrimaryInusranceDetailsForPopulation() {
            var postData = {
                PatientId: ExistingPatientSelectedData.SelectedPatient[0].PatientID,
                DOS: $scope.AppointmentDateInAddMode
            }
            var methodName = showPrimarySecondaryandTeritiaryPoliciesInfoBasedonPractice ? "Insurance_GetPatientPoliciesInfo" : "PatientPoliciesInfoServiceGetPatientPrimaryPoliciesInfoList";
            //CALLING THE SERVICE TO GET THE INSURANCE POLICY DETAILS FOR THE PATIENT
            //CreateCharges.billingGetPatientBillToInfo(postData).then(function (serviceResponse) {
            GiveNewAppointmentService[methodName](postData).then(function (serviceResponse) {


                if (hasValue(serviceResponse) && serviceResponse.length > 0) {
                    if (showPrimarySecondaryandTeritiaryPoliciesInfoBasedonPractice) {
                        var primaryInsuranceList = _.filter(serviceResponse, ['InsuranceResponsibility', 'Primary']);
                        if ($scope.showIsCashPatientAndPrimaryInsurance && primaryInsuranceList.length > 0) {
                            $scope.existingPatientAppointmentPrimaryInsurance = _.join(_.map(primaryInsuranceList, "InsuranceName"), ", ");
                        }
                    } else {
                        $scope.existingPatientAppointmentPrimaryInsurance = _.join(_.map(serviceResponse, "HealthPlanName"), ", ");
                    }
                }
            })
        }






        function checkPatientRestrictionForSchedulingAppts(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            if ($rootScope.apptSchedulingPatientRestrictedData) {
                validateProviderPatientRestrictionData(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                return;
            }

            GiveNewAppointmentService.GetApptSchedulingRestrictedPatientsList({}).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;

                $rootScope.apptSchedulingPatientRestrictedData = serviceResponse.ApptSchedulingRestrictedPatientsList;

                validateProviderPatientRestrictionData(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            })
        }

        function validateProviderPatientRestrictionData(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {

            var groupByProviderData = _.groupBy($rootScope.apptSchedulingPatientRestrictedData, "UserID");

            if (SelectedPatientID &&
                SelectedResourceType == 1 &&
                groupByProviderData[SelectedPhysicianID] &&
                groupByProviderData[SelectedPhysicianID].length > 0) {

                var providerLinkedPatientsList = groupByProviderData[SelectedPhysicianID];

                var needToShowValidation = false, filteredPatientdata;

                var filteredPatientList = _.filter(providerLinkedPatientsList, { "PatientID": parseInt(SelectedPatientID) });

                for (var index = 0; index < filteredPatientList.length && !needToShowValidation; index++) {
                    filteredPatientdata = filteredPatientList[index];
                    if (filteredPatientdata) {

                        if (!filteredPatientdata.StartDate && !filteredPatientdata.EndDate) {
                            needToShowValidation = true;
                        }
                        else if (filteredPatientdata.StartDate && filteredPatientdata.EndDate &&
                            DateDiffInDays($scope.AppointmentDateInAddMode, new Date(filteredPatientdata.StartDate)) >= 0 &&
                            DateDiffInDays(new Date(filteredPatientdata.EndDate), $scope.AppointmentDateInAddMode) >= 0) {

                            needToShowValidation = true;
                        }
                        else if (filteredPatientdata.StartDate && DateDiffInDays($scope.AppointmentDateInAddMode, new Date(filteredPatientdata.StartDate)) >= 0 && !filteredPatientdata.EndDate) {
                            needToShowValidation = true;
                        }
                    }
                }


                if (needToShowValidation) {
                    ShowErrorMessage("Patient has Restriction to Schedule Appt for Selected Provider, Please Select Another Patient / Client.");
                    return;
                } else {
                    procceedAfterPatientRestrictionChecking(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                }
            } else {
                procceedAfterPatientRestrictionChecking(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }
        }



        function procceedAfterPatientRestrictionChecking(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {
            if (patientAssignedProviderID > 0 && !(SelectedPhysicianID == patientAssignedProviderID && SelectedResourceType == 1)) {
                showCofirmationPopupWhenSelectedProviderisnotPatientAssignedProvider(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }
            else if (showConfirmationifApptDurationExceedsClinicApptDuration) {
                openConfirmationPopupifApptDurationExceedsClinicApptDuration(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }
            else {
                saveApptforPatientAfterCheckingValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }

        }

        function handleApptDefaultsPopulationCustomizedFromDemographics() {
            if (apptDefaultsInfo.ProviderID > 0) {
                SelectedPhysicianID = apptDefaultsInfo.ProviderID;
                SelectedResourceType = 1;//static value 1 assigned as only provider will be selected as default
                $scope.existingPatientAppointmentSelectedProviderorResource = apptDefaultsInfo.ProviderName;
                isDefaultProviderCustomizationFromDemographicsExists = true;
                $scope.existingPatientAppointmentsRemoveselectedPhysicianorResfrmAdditionalParticipant(SelectedPhysicianID, SelectedResourceType);
            };
            $scope.existingPatientApptWindowGetUserAuthenticatedMailInfo();
            $scope.ApptSchedView_GetFacilitiesToBeShownInApptSchdulerList(SelectedPhysicianID, SelectedResourceType, undefined, true);
            $scope.existingPatientAppointmentsGetLinkedUserslistforHouseCall();
            if (apptDefaultsInfo.ProgramServiceLinkedInfoIDs && !defaultProgamServiceBasedonPractice[EMRPracticeModel.PracticeID] && _.get($scope.EMRDataFromPopup, "PopupOpenFrom") != "StaffActivitiesNotesSavingWindow")
                handleDefaultPopulationOfProgramServices(apptDefaultsInfo.ProgramServiceLinkedInfoIDs);

            $timeout(function () {
                if (apptDefaultsInfo.Duration > 0)
                    $scope.SelectedExistingPatApptDuration = apptDefaultsInfo.Duration;
                if (apptDefaultsInfo.EncounterModalityID > 0 && !showVideoModalitybyDefault) {
                    $scope.NewAppointmentSchedulerModel.AppointmentTypeID = apptDefaultsInfo.EncounterModalityID;
                    checkModalityAndShowHideZoomSaveButton();
                    ChangeFacilityBasedOnModaility();
                    checkUserHasGoogleMeetEnabledOrNotAndShowHideSaveButton(true);
                }

                if ($scope.NeedToOpenProgramServiceSelectionPopUp_StaffActivities) {
                    $scope.existingPatientAppointmentProgramsProgramsServicesClickEvent(true);
                }
                else if (isProgramServiceFieldCustomizedAndMandatory && !apptDefaultsInfo.ProgramServiceLinkedInfoIDs && !defaultProgamServiceBasedonPractice[EMRPracticeModel.PracticeID] && _.get($scope.EMRDataFromPopup, "PopupOpenFrom") != "StaffActivitiesNotesSavingWindow" )
                    $scope.existingPatientAppointmentProgramsProgramsServicesClickEvent(true);
                if ($scope.isVisitTypeFieldCustomized)
                    $scope.ApptSchedView_GetApptsVisitType();

            }, 100, false);
        };
        function populateDefaultDurationFromDemographicsApptInfo() {
            if (apptDefaultsInfo.Duration > 0)
                $scope.SelectedExistingPatApptDuration = apptDefaultsInfo.Duration;

            if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "StaffActivitiesNotesSavingWindow") {
                $scope.SelectedExistingPatApptDuration = $scope.EMRDataFromPopup.SelectedAppointmentDuration;
            }
        };
        function handleDefaultPopulationOfProgramServices(programServiceLinkedIds = "") {
            const postData = {
                ProgramServiceLinkedInfoIDs: programServiceLinkedIds
            };
            const grantsPromise = GiveNewAppointmentService.appointmentSchedulerGetGrantNamesListLinkedToProgramService(postData).then(handleApiResponse);
            const programDetailsPromise = GiveNewAppointmentService.getPatientApptDefaultProgramServicesList(postData).then(handleApiResponse);
            $q.all([grantsPromise, programDetailsPromise]).then(function (result) {
                const grantsData = result[0];
                let programServiceData = result[1];
                if (grantsData && !_.isEmpty(grantsData.LinkGrantsToProgramServicesModelList)) { // not using _.size keeping in mind of performance
                    programServiceData.GrantDetails = grantsData.LinkGrantsToProgramServicesModelList[0];//assigning the first grant 
                    programServiceData.selectedProgramsorTherapyList = programServiceData.PtApptDefaultProgramServicesList;
                }
                else
                    programServiceData = programServiceData.PtApptDefaultProgramServicesList;
                onProgramServiceSelection(programServiceData, true, apptDefaultsInfo.Duration > 0);
            });
        };
        function handleApiResponse(response) {
            if (!response || isError(response)) return {};
            return response;
        };
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


        function autoSelectVistTypeForProgramService(listToAssignVisistType) {

            var multipleDefaultVisitTypeExists = [];
            var avaialableVisitTypes = new Set(_.map($scope.ApptSchedView_GetApptsVisitTypeList, "VisitTypeID"));
            if (listToAssignVisistType.length && avaialableVisitTypes.size) {
                listToAssignVisistType.forEach(function (each) {
                    if (avaialableVisitTypes.has(each.VisitTypeID) && each.VisitTypeID > 0) {

                        if (multipleDefaultVisitTypeExists.length > 1) return false;

                        if (!multipleDefaultVisitTypeExists.includes(each.VisitTypeID)) {
                            multipleDefaultVisitTypeExists.push(each.VisitTypeID);
                        }
                    }
                })
            }

            if (multipleDefaultVisitTypeExists.length == 1) {
                $scope.SelectedExistingPatApptVisitType = multipleDefaultVisitTypeExists[0];
                $scope.SelectedExistingPatApptDuration = _.find($scope.ApptSchedView_GetApptsVisitTypeList, { "VisitTypeID": multipleDefaultVisitTypeExists[0] }).Duration;
            }
        }
        function autoPopulateFieldsBasedonProgramSelectionforSpecificPractices() {
            let programServiceLinkedObj = programServiceBasedFieldsSelection[EMRPracticeModel.PracticeID];
            if (!programServiceLinkedObj) return;
            _.forEach(programServiceLinkedObj.programsServicesLinkedInfoIds, function (eachProgramServiceLinkedId) {
                if ($scope.selectedProgramServicesLinkedInfoID.toString().includes(eachProgramServiceLinkedId)) {
                    if (programServiceLinkedObj.facilityId && _.find($scope.ApptSchedView_FacilitiesList || [], { FacilityID: programServiceLinkedObj.facilityId })) {
                        $scope.SelectedExistingPatApptFacilities = programServiceLinkedObj.facilityId;
                    }
                    if (programServiceLinkedObj.modality && _.find($scope.existingPatientAppointmentEncounterModalityOptionDropdownDataSource.data(), { AppointmentTypeID: programServiceLinkedObj.modality })) {
                        $scope.NewAppointmentSchedulerModel.AppointmentTypeID = programServiceLinkedObj.modality;
                    }
                    if (programServiceLinkedObj.resourceId) getResourcesListandPopulate(programServiceLinkedObj);

                    if (programServiceLinkedObj.BillTo) checkBillToAndCallAsPerID(programServiceLinkedObj.BillTo);

                    return false; // to break the loop
                }
            })
        };
        function getResourcesListandPopulate(programServiceLinkedObj) {
            if (!$scope.resouceFieldCustomized) return;
            let postData = {
                FacilityID: $scope.SelectedExistingPatApptFacilities,
                DonotGetResourceType: 2,
                ResourceorRoomType: 0,
                isFromApptScheduler: 1
            };
            GiveNewAppointmentService.selectOutsidedoctorServiceGetResourcesList(postData).then(function (response) {
                if (!response || isError(response)) return;
                let result = _.find(response.ResourceNewModellist, { ResourceID: programServiceLinkedObj.resourceId });
                if (!result) return;
                $scope.existingPatientAppointmentSelectResource = result.ResourceName;
                $scope.existingPatientAppointmentSelectResourceID = result.ResourceID;
                SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoom = result.AuthenticateCalenderTypes;
                SelectedUserAuthenticatedMailCalenderTypesforResourceSelectedResourceorRoomEmailID = result.AuthenticateCalenderUserMailIDs;
                $scope.existingPatientAppointmentsRemoveselectedPhysicianorResfrmAdditionalParticipant($scope.existingPatientAppointmentSelectResourceID, 2);
            });
        };

        //1- Insurance, 2- Patient, 3- Do not bill
        function checkBillToAndCallAsPerID(BillTo) {
            if (!$scope.billtoPatientHyperLinkHide && !$scope.billtoPatientHyperLinkHideFor671 && BillTo == 2) $scope.existingPatientAppointmentBillToPatientClick()
            else if ($scope.existingPatientAppointmentBillToDoNotBillShowHide && BillTo == 3) $scope.existingPatientAppointmentDoNotBillClick();
        }

        function getLoggedUserHideOrShowValue(HidingENUM) {
            if (EMRPracticeModel.PracticeID && HidingENUM[EMRPracticeModel.PracticeID] && (HidingENUM[EMRPracticeModel.PracticeID].length == 0 || !HidingENUM[EMRPracticeModel.PracticeID].includes(EMRPracticeModel.LoggedUserID))) {
                return false
            }
            return true;
        }


        let isProgramAutopopulated_StaffActivitiesNotesSavingWindow = false;     
        function autoPopulateProgramService() {
            var dataToService = {
                DoNotBringSyntheticServices: true,
                GroupTherapyLinkedProgramsType: 1,
                ShowInAppointmentScheduler: true,
                ShowInIndexDocs: false,
                ShowinApptsFilterFromApptsORGT: true,
                GetGroupSessions: true,
                GroupTherapyCategoryID: 0,
                ProgramProviderID: SelectedPhysicianID
            }


            GiveNewAppointmentService.groupTherapyGetProgramServiceLinkedAllList(dataToService).then(function (serviceResponse) {
                if (isError(serviceResponse)) return;

                var filteredProgramService = [];
                //block only if appt giving from staff activities pop up 726 practice
                if (_.get($scope.EMRDataFromPopup, "PopupOpenFrom") == "StaffActivitiesNotesSavingWindow") {
                    $scope.NeedToOpenProgramServiceSelectionPopUp_StaffActivities = false;  
                    if (serviceResponse.programServiceLinkedGroupTherapyOutputList && serviceResponse.programServiceLinkedGroupTherapyOutputList.length > 0) {
                        filteredProgramService = _.filter(serviceResponse.programServiceLinkedGroupTherapyOutputList, function (item) { return item.ProgramsServicesLinkedInfoID == $scope.EMRDataFromPopup.ProgramsServicesLinkedInfoID });
                        if (filteredProgramService && filteredProgramService.length > 0) { // for 
                            if (isProgramAutopopulated_StaffActivitiesNotesSavingWindow != undefined) //this function is executing 2 times so to avoid popup opening 2 times i used this variabel
                            isProgramAutopopulated_StaffActivitiesNotesSavingWindow = true;                                   
                            getGrantDetailsForProgram(filteredProgramService[0]);
                        } else {
                            $scope.NeedToOpenProgramServiceSelectionPopUp_StaffActivities = true;
                        }
                    } else {
                        $scope.NeedToOpenProgramServiceSelectionPopUp_StaffActivities = true;
                    }
                } else {
                    if (serviceResponse.programServiceLinkedGroupTherapyOutputList.length == 1) {
                        getGrantDetailsForProgram(serviceResponse.programServiceLinkedGroupTherapyOutputList[0]);
                    } else {
                        $scope.existingPatientAppointmentProgramsProgramsServicesClickEvent();
                    }
                }           

                
            });
        }


        function getGrantDetailsForProgram(programserviceDetails) {
            var programServicesWithGrantDetails = {};
            var dataToService = {
                ProgramServiceLinkedInfoIDs: programserviceDetails.ProgramsServicesLinkedInfoID
            };

            GiveNewAppointmentService.appointmentSchedulerGetGrantNamesListLinkedToProgramService(dataToService).then(function (responce) {

                if (hasValue(responce) && hasValue(responce.LinkGrantsToProgramServicesModelList) && responce.LinkGrantsToProgramServicesModelList.length > 0) {

                    if (hasValue(responce) && hasValue(responce.LinkGrantsToProgramServicesModelList) && responce.LinkGrantsToProgramServicesModelList.length == 1) {
                        programServicesWithGrantDetails.GrantDetails = responce.LinkGrantsToProgramServicesModelList[0];
                        proceedWithGrantDetailsIncluded(programserviceDetails, programServicesWithGrantDetails)
                    }
                    else {

                        var dataToPopup = {
                            LinkGrantstoProgramServiceList: responce.LinkGrantsToProgramServicesModelList,
                        }

                        ModalPopupService.OpenPopup(GetEMRPageURLByIndex(3072), dataToPopup, 'modal-1000px').then(function (result) {
                            if (hasValue(result) && result != 'cancel') {

                                programServicesWithGrantDetails.GrantDetails = result;

                                proceedWithGrantDetailsIncluded(programserviceDetails, programServicesWithGrantDetails);
                            }
                            else {
                                proceedWithGrantDetailsIncluded(programserviceDetails);
                            }

                        });
                    }

                } else {
                    proceedWithGrantDetailsIncluded(programserviceDetails);
                }
            })
        }


        function proceedWithGrantDetailsIncluded(programserviceDetails, programServicesWithGrantDetails) {
            if (programServicesWithGrantDetails) {
                programServicesWithGrantDetails.selectedProgramsorTherapyList = [programserviceDetails];
                onProgramServiceSelection(programServicesWithGrantDetails);
            } else {
                onProgramServiceSelection([programserviceDetails]);
            }
        }

        function autoSelectBilltoasPatientIfIsCashPatientisYes() {
            if ($scope.isBillTooFieldCustomized) {
                if (isCashPatient) {
                    $scope.existingPatientAppointmentBillToPatientClick();
                    getPatientLinkedPrimaryInusranceDetailsForPopulation();
                }
                else if (!isProgramServiceFieldCustomizedAndMandatory) {
                    $scope.existingPatientApptgetPatientLatestPrimaryInsurancePolicyDetails();
                }
            }
        }

        function showWarningorBlockMessageWhileSamePatientHavingMultipleApptsonSameDay(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink, message) {
            if (showConfirmationMessageWhileSamePatientHavingMultipleApptsonSameDay) {
                var confirmationMessage = `${message}<br /><br />Still do you want to Continue ? `;
                ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), confirmationMessage, 'md').then(function (result) {
                    if (result == "NO") return;
                    $scope.NewAppointmentSchedulerModel.DoNotCheckWhileSamePatientHavingMultipleApptsonSameDay = true;
                    $scope.apptScheduler_SaveAppointmentDetailsInfo(callCenterSelectedPracticeModel, isSaveAndAddBillingInfo, isHouseCallConfirmationRequired, MultipleApptConfirmation, ApptGivenForSameDaySameTimeWithDifferentProvider, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink)
                });
            }
            else {
                ShowErrorMessage(message);
            }
        }

        function openConfirmationPopupifApptDurationExceedsClinicApptDuration(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink) {
            const duration = parseInt($scope.SelectedExistingPatApptDuration);
            const clinicApptDuration = 90;
            if (previousDuration != duration && duration >= clinicApptDuration) {
                const confirmationMessage = "Extended Session Time - Do You Want to Proceed";
                ModalPopupService.OpenPopup(GetEMRPageURLByIndex(50), confirmationMessage, 'md').then(function (result) {
                    if (result == "NO") return;
                    previousDuration = duration;
                    saveApptforPatientAfterCheckingValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
                })
            }
            else {
                saveApptforPatientAfterCheckingValidations(isSaveAndAddBillingInfo, isSendApptRemainder, isFromSaveAndZoomLink, isFromSaveAndTeamLink);
            }
        }

        function getPatientNameAlongwithEmailandPhonenumberBasedonPractice() {
            if (bindPatientEmailandPhoneNumbertoPatientNameWhileGoogleCalendarSync) {
                if (patientPhoneNumber) {
                    GoogleOrOutlookSummaryName += ` (${patientPhoneNumber})`;
                }
                if (patientEmail) {
                    GoogleOrOutlookSummaryName += `, (${patientEmail})`;
                }
            }
            return GoogleOrOutlookSummaryName;
        }

        async function checkVisitTypeValidationWhileGivingAppt() {
            const inputModel = {
                PatientID: $scope.NewAppointmentSchedulerModel.PatientID,
                VisitTypeIDs: [5, 6].includes($scope.NewAppointmentSchedulerModel.VisitType) ? [8, 9, 43] : [5, 6],
                ApptDateTime: $scope.NewAppointmentSchedulerModel.StartTime,
            }
            const response = await GiveNewAppointmentService.GetVisitTypeLinkedApptsListforSelectedDate(inputModel);
            if (!response || !response.ApptDateTimeandPhysiciansList || response.ApptDateTimeandPhysiciansList.length <= 0) return $q.when(false);
            response.ApptDateTimeandPhysiciansList = _.orderBy(response.ApptDateTimeandPhysiciansList, function (each) { return each.ApptDateTime ? new Date(each.ApptDateTime) : "" }, "asc");
            const result = await ModalPopupService.OpenPopup(GetEMRPageURLByIndex(5705), response.ApptDateTimeandPhysiciansList, "modal-500px");
            if (result == "cancel") return $q.when(true);
            return $q.when(false);

        }



        function showOrHideGoogleMeetButtonBasedOnMailAuthDetails(CreateGoogleMeet, isFromModalityChange) {
            if (doNotShowGoogleAddWindowPracticeIds && isFromModalityChange) return;

            if (doNotShowGoogleAddWindowPracticeIds) {
                $scope.showSaveAndScheduleGoogleMeetButton = CreateGoogleMeet && isSaveAndScheduleGoogleMeetButtonCustomized;
            } else {
                $timeout(function () {
                    $scope.showSaveAndScheduleGoogleMeetButton = CreateGoogleMeet && isSaveAndScheduleGoogleMeetButtonCustomized && $scope.NewAppointmentSchedulerModel.AppointmentTypeID == 7
                })
            }
        }

        function checkUserHasGoogleMeetEnabledOrNotAndShowHideSaveButton(isFromModalityChange) {
            var calenderAuthUsersList = EMRCommonFactory.GetEMRThridPartyUserAuthenticationInfoList();

            if (!calenderAuthUsersList) {

                GiveNewAppointmentService.GetThridPartyUserAuthenticationInfoList().then(function (result) {
                    if (isError(result)) return;

                    EMRCommonFactory.EMRThridPartyUserAuthenticationInfoList(result.ThirdPartyUserApplicationInfoDataModelList);

                    var slectedUserDetails = _.find(result.ThirdPartyUserApplicationInfoDataModelList, { "AuthenticatedUserID": parseInt(SelectedPhysicianID) }) || { "CreateGoogleMeet": false };
                    showOrHideGoogleMeetButtonBasedOnMailAuthDetails(slectedUserDetails.CreateGoogleMeet, isFromModalityChange);

                });
            } else {
                var slectedUserDetails = _.find(calenderAuthUsersList, { "AuthenticatedUserID": parseInt(SelectedPhysicianID) }) || { "CreateGoogleMeet": false };
                showOrHideGoogleMeetButtonBasedOnMailAuthDetails(slectedUserDetails.CreateGoogleMeet, isFromModalityChange);

            }
        }

        function billtoFieldHyperlinksLabelNameChangesBasedonPractice() {

            $scope.insuranceorGrantLabel = "Ins./Grant";
            $scope.insuranceOrGrantLabelToolTip = "Insurance / Grant";
            $scope.billtoFieldPatientLabel = "Patient";
            $scope.billtoFieldPatientLabelToolTip = "Cash Patient";

            if (new Set([640]).has(EMRPracticeModel.PracticeID)) { //640 - His Story Coaching & Counseling.
                $scope.insuranceOrGrantLabelToolTip = $scope.insuranceorGrantLabel = "Payor";
            }
            else if (showinsuranceorGrantLableNamsasInsurance) {
                $scope.insuranceOrGrantLabelToolTip = $scope.insuranceorGrantLabel = "Insurance";
            }

            if (showPatientNamsasInsurance) {
                $scope.billtoFieldPatientLabelToolTip = $scope.billtoFieldPatientLabel = "Self-Pay";
            }

        }

        function getApptDurationsListBasedonPractice(apptdurationsList) {
            if (showApptDurationsUpToPracticeRequestedMinutes && showApptDurationsUpToPracticeRequestedMinutes[EMRPracticeModel.PracticeID] > 0) {
                apptdurationsList = _.filter(apptdurationsList, function (eachDuration) { return eachDuration.AppointmentDuration <= showApptDurationsUpToPracticeRequestedMinutes[EMRPracticeModel.PracticeID]; }) || [];
            }
            return apptdurationsList;

        }

        function getFacilityTimeZoneandSaveApptinGoogleCalendar(CalenderListObject, userInfo) {
            if (!$scope.NewAppointmentSchedulerModel || !$scope.NewAppointmentSchedulerModel.FacilityID || !parseInt($scope.NewAppointmentSchedulerModel.FacilityID) > 0) {
                return saveApptinGoogleCalendar(CalenderListObject, userInfo);
            }
            let faciliTimeZoneInfo = WebWorkerService.getSelectedFacilityTimeZoneInfo($scope.NewAppointmentSchedulerModel.FacilityID);
            if (_.size(faciliTimeZoneInfo)) {
                saveApptinGoogleCalendar(CalenderListObject, userInfo, faciliTimeZoneInfo.FacilityTimeZoneID);
            }
            else {
                getApptLinkedFacilityTimeZoneInfo(CalenderListObject, userInfo);
            }
        }
        function getApptLinkedFacilityTimeZoneInfo(CalenderListObject, userInfo) {
            GiveNewAppointmentService.GetFacilitiesTimeZoneList({}).then(function (response) {
                if (!response || isError(response)) return;
                WebWorkerService.setFacilitiesTimeZoneInfo(response);
                let faciliTimeZoneInfo = WebWorkerService.getSelectedFacilityTimeZoneInfo($scope.NewAppointmentSchedulerModel.FacilityID);
                saveApptinGoogleCalendar(CalenderListObject, userInfo, faciliTimeZoneInfo && faciliTimeZoneInfo.FacilityTimeZoneID || 0);
            })
        }

        function saveApptinGoogleCalendar(CalenderListObject, userInfo, timeZoneID) {
            if (parseInt(timeZoneID) > 0) {
                CalenderListObject.timezone = timeZoneID;
            }
            CalendarIntegrationService.CalendarIntegrationServicePerformThirdPartyCalenderEvent(CalenderListObject, userInfo);
        }

        function getResourceandRoomNameNamesBasedonPractice() {
            if (showResourceandRoomNamesinGoogleCalendar) {
                let resourceandRoomNames = "";
                if ($scope.existingPatientAppointmentSelectResource && $scope.existingPatientAppointmentSelectRoom) {
                    resourceandRoomNames = `${$scope.existingPatientAppointmentSelectResource}, ${$scope.existingPatientAppointmentSelectRoom} `;
                }
                else {
                    resourceandRoomNames = $scope.existingPatientAppointmentSelectResource || $scope.existingPatientAppointmentSelectRoom;
                }
                return resourceandRoomNames;
            }
            return $scope.NewAppointmentSchedulerModel.FacilityName;
        }

        function assginFacilityBasedonProgramService(programServicesList) {
            let programServiceLinkedInfoID = EMRPracticeModel.PracticeID == 999 ? 21103 : 57;
            let facilityID = EMRPracticeModel.PracticeID == 999 ? 870 : 11;
            if (_.find(programServicesList || [], { ProgramsServicesLinkedInfoID: programServiceLinkedInfoID })
                && _.find($scope.ApptSchedView_FacilitiesList || [], { FacilityID: facilityID })) {
                $scope.SelectedExistingPatApptFacilities = facilityID;
            }
        }

        $scope.existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysDropdownInfo = [
            {
                "existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysOption": " - Select - ", "existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysOptionId": 0
            },
            {
                "existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysOption": "Yes", "existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysOptionId": 1
            },
            {
                "existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysOption": "No", "existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysOptionId": 2
            },
        ]

        //BIND THE DATA TO THE DROPDOWN DATASOURCE
        $scope.existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysDropdownDataSource = new kendo.data.DataSource({
            data: $scope.existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysDropdownInfo,//ASSIGNING NULL ON DEFAULT       
        });

        $scope.existingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDaysOptionChange = function () {
            if ($scope.IsClientInsuranceVerifiedinpast30to60Days == 1) {
                $scope.existingPatientVerifiedDateShow = true;
                $scope.existingPatientVerifiedDateFocus = true;

                $scope.ClientInsuranceNotVerifiedComments = "";
                $scope.showClientInsuranceNotVerifiedComments = false;
            }
            else if ($scope.IsClientInsuranceVerifiedinpast30to60Days == 2) {
                $scope.ClientInsuranceNotVerifiedCommentsFocus = true;
                $scope.showClientInsuranceNotVerifiedComments = true;

                $scope.ClientInsuranceVerifiedDate = "";
                $scope.existingPatientVerifiedDateShow = false;
            }
            else {
                $scope.ClientInsuranceVerifiedDate = "";
                $scope.existingPatientVerifiedDateShow = false;

                $scope.ClientInsuranceNotVerifiedComments ="";
                $scope.showClientInsuranceNotVerifiedComments = false
            }
        }

        function getPatientNameToBeShownInCalander(){
            return GiveNewAppointmentService.GetGoogleOrOutlookPatientSummaryName({PatientID:$scope.NewAppointmentSchedulerModel.PatientID}).then(function(result){
                if(isError(result)) return;

                GoogleOrOutlookSummaryName = result.PatientName;
            })
        }

        function existingApptKendoEvents() {
            kendoSelectors = {
                'existingApptEncounterType':$(`#ddlEncounterType`).data("kendoDropDownList"),
                'existingApptMedicationEffect': $(`#ddlExistingPatientMedicationSideEffects`).data("kendoDropDownList"),
                'existingApptGeneralComment': $(`#txtGeneralComments`).data("kendoAutoComplete"),
                'existingApptDateInMode': $(`#txtPatientAppointmentDateInAddMode`).data("kendoDatePicker"),
                'existingApptDuration': $(`#ddlAppointmentDurationmin`).data("kendoComboBox"),
                'existingApptEncounterModality': $(`#ddlExistingPatientAppointmentEncounterModality`).data("kendoDropDownList"),
                'existingApptSelectFacility': $(`#ddlSelectFacility`).data("kendoDropDownList"),
                'existingApptVisitType': $(`#ddlSelectVisitType`).data("kendoDropDownList"),
                'existingApptPatientMainGrid': $(`#divExistingPatientMainGrid`).data("kendoGrid"),
                'existingApptType':$(`#ddlExistingPatientAppointmentPatientApptType`).data("kendoDropDownList"),
                'existingApptVerified':$(`#ddlExistingPatientClientInsuranceBeenVefifiedinPastThirtytoSixtyDays`).data("kendoDropDownList"),

            }
    
        }
        
      
       
    }]);


