
// next line is your output document name, it will appear at the root level of My Drive
var outputDocumentName = "APPSHEET-REST-API-MERGE";

// next line refers to a template to copy from, we have provided a world-readable example
// to get you started
var templateForHeadersAndFooters = "15essUDitFh8Hr5jHN8Hurs-2uUSIEktD6uOlrSg4vwk";

// AppSheet general constants: API key and App ID
var applicationAccessKey = "APPSHEET REST API KEY";
var appsheetAppID = "APPSHEET APP ID";

// Parent Table constants
var appsheetParentTableName = "Header";

// If there is a child table, refer to it here:
var appsheetChildTableName = "DocumentFragment";

// output folder
var outputfolderID = "THE GOOGLE DRIVE ID OF A FOLDER WHERE YOU WANT YOUR OUTPUT TO GO";


// 
//
//
//
// everything below this line should not have to be changed, unless you are experimenting

var postParentURL = "https://api.appsheet.com/api/v2/apps/" + appsheetAppID + "/tables/" + appsheetParentTableName + "/Action";
var postChildURL = "https://api.appsheet.com/api/v2/apps/" + appsheetAppID + "/tables/" + appsheetChildTableName + "/Action";