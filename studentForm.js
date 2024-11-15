
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "STD-DB";
var empRelationName = "StdData";
var connToken = "YOUR_CONNECTION_TOKEN";

$("#studentId").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no)
}



function resetForm() {
    // Reset each field
    $('#studentId').val('');
    $('#studentName').val('');
    $('#class').val('');
    $('#birthDate').val('');
    $('#address').val('');
    $('#enrollmentDate').val('');

    // Enable student ID field, disable others
    $('#studentId').prop('disabled', false);
    $('#saveBtn').prop('disabled', true);
    $('#changeBtn').prop('disabled', true);
    $('#resetBtn').prop('disabled', true);

    $('#studentId').focus();
}

function validateData() {
    var stdId = $('#studentId').val();
    var stdName = $('#studentName').val();
    var stdClass = $('#class').val();
    var stdBDay = $('#birthDate').val();
    var stdAddress = $('#address').val();
    var stdEnroll = $('#enrollmentDate').val();

    // Validation for each field
    if (stdId === '') {
        alert('student ID is missing');
        $('#studentId').focus();
        return '';
    }
    if (stdName === '') {
        alert('student Name is missing');
        $('#studentName').focus();
        return '';
    }
    if (stdClass === '') {
        alert('Student class is missing');
        $('#class').focus();
        return '';
    }
    if (stdBDay === '') {
        alert('BirthDate is missing');
        $('#birthDate').focus();
        return '';
    }
    if (stdAddress === '') {
        alert('Address is missing');
        $('#address').focus();
        return '';
    }
    if (stdEnroll === '') {
        alert('Enrollment Date is missing');
        $('#enrollmentDate').focus();
        return '';
    }

    // Prepare JSON object for saving or updating
    return JSON.stringify({
        id: stdId,
        name: stdName,
        class: stdClass,
        birthDate: stdBDay,
        address: stdAddress,
        enrollmentDate: stdEnroll
    });
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#studentId").focus();
}

function changeData() {
    $("#changeBtn").prop("disabled", true);
    var jsonCng = validateData();

    var updateRequest = createUPDATERecordRequest(connToken, jsonCng, empDBName, empRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#studentId").focus();
}



function saveRecNO2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function fillData(jsonObj) {
    saveRecNO2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;

    $('#studentName').val(record.name);
    $('#class').val(record.class);
    $('#birthDate').val(record.birthDate);
    $('#address').val(record.address);
    $('#enrollmentDate').val(record.enrollmentDate);
}

function getStdIdAsJsonObj() {
    var stdId = $('#studentId').val();
    return JSON.stringify({ id: stdId });
}

function getStd() {
    var stdIdJsonObj = getStdIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, stdIdJsonObj);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        // If record not found
        $('#saveBtn').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
        $('#studentName').focus();
    } else if (resJsonObj.status === 200) {
        // If record found
        $('#studentId').prop('disabled', true);
        fillData(resJsonObj);

        $('#changeBtn').prop('disabled', false);
        $('#resetBtn').prop('disabled', false);
        $('#studentName').focus();
    }
}
