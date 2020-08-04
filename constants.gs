/**

This entire example assumes that you have

an AppSheet.com app with two tables called "Header" and "DocumentFragments"
They each contain these fields: Name, Description, Image

*/

// next line is your output document name, it will appear at the root level of My Drive
var outputDocumentName = "APPSHEET-REST-API-MERGE";

// next line refers to a template to copy from, 
// we have provided a world-readable example to get you started
var templateForHeadersAndFooters = "15essUDitFh8Hr5jHN8Hurs-2uUSIEktD6uOlrSg4vwk";

// AppSheet general constants, API key and App ID
var applicationAccessKey = "YOURAPPSHEETAPIACCESSKEY";
var appsheetAppID = "YOURAPPSHEETAPPID";

// Parent Table constants
var appsheetParentTableName = "Header";

// If there is a child table, refer to it here:
var appsheetChildTableName = "DocumentFragment";

// an optional filter. 
// var PostParentSelector = "Filter(Header, [Name] = 'Header 1')";
var PostParentSelector = "";

// 
//
//
//
// everything below this line should not have to be changed, unless you are experimenting

var postParentURL = "https://api.appsheet.com/api/v2/apps/" + appsheetAppID + "/tables/" + appsheetParentTableName + "/Action";


var postparentbody = 
    {
      "Action": "Find",
      "Properties": {
        "Locale": "en-US",
        "Location": "47.623098, -122.330184",
        "Selector" : PostParentSelector,
        "Timezone": "Pacific Standard Time",
        "RunAsUserEmail": "youremail@yourcompany.com"
      },
      "Rows": []
    };

var postParentOptions = 
    {
      "method" : "POST",
      "headers" : {
        "applicationAccessKey" : applicationAccessKey,
        "Content-Type" : "application/json"
      },
      "payload" : JSON.stringify(postparentbody)
    };


