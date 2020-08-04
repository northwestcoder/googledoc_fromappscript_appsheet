/**

This entire example assumes that you have

1. An AppSheet.com app with two tables called "Header" and "DocumentFragments" with a parent/child relationship
2. They each contain these fields: Name, Description, Image

*/

function main() {
  
  
  // the google doc we are going to create, at the top level of your drive (or, you can change this easily)
  newDoc = DocumentApp.create(outputDocumentName);
  // we use a world readable template to copy the header and footer, this part is pretty janky
  // through no fault of our own, the DocumentApp class has limited support here
  finalDoc = addHeaderFooterFromTemplate(newDoc);
  // in fact does it even work? We are skeptical. We were able to get headers/footers working.
  body = finalDoc.getActiveSection();

  
  // OK, our call to AppSheet's Rest API, params are encapsulated in constants.gs 
  // the next line is the call to the parent table
  parentresponse = UrlFetchApp.fetch(postParentURL, postParentOptions);

  var parentparsed = JSON.parse(parentresponse.getContentText());
  
  
  for (row = 0; row < parentparsed.length; ++row) {
    
    var headerkey = parentparsed[row].Key;
    var jsonImage = parentparsed[row].Image;
    var name = parentparsed[row].Name;
    var description = parentparsed[row].Description;  
    var documentFragments = parentparsed[row].DocumentFragments;  
    
    var bodyheadername = body.appendParagraph(name);
    bodyheadername.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    
    var thisParagraph = body.appendParagraph("\r\r");
    thisParagraph.appendText(description);
    thisParagraph.appendText("\r\r");
    thisParagraph.setAttributes(parentParagraphStyle);
     
    if (jsonImage) {
      var driveImage = jsonImage.split("/")[1];
      var specified =  DriveApp.getFilesByName(driveImage).next().getId();
      var insertable = DriveApp.getFileById(specified).getBlob(); 
      var finalImage = body.appendImage(insertable);
      // for kicks, let's reduce the image size by 50%
      finalImage.setHeight(finalImage.getHeight()/2.0);
      finalImage.setWidth(finalImage.getWidth()/2.0);
    }
    
    // if there are child records
    if (documentFragments) {
      
      
      // if you are following along with the example, this nested
      // api call should work. if not, pls check constants.gs
      var PostChildSelector = "Filter(DocumentFragment, [Header] = '" + headerkey + "')";
      var postChildURL = "https://api.appsheet.com/api/v2/apps/" + appsheetAppID + "/tables/" + appsheetChildTableName + "/Action";
      
      var postchildbody = 
          {
            "Action": "Find",
            "Properties": {
              "Locale": "en-US",
              "Location": "47.623098, -122.330184",
              "Selector" : PostChildSelector,
              "Timezone": "Pacific Standard Time",
              "RunAsUserEmail": "ty@appsheet.com"
            },
            "Rows": []
          };
      
      var postChildOptions = 
          {
            "method" : "POST",
            "headers" : {
              "applicationAccessKey" : applicationAccessKey,
              "Content-Type" : "application/json"
            },
            "payload" : JSON.stringify(postchildbody)
          };
      
      childresponse = UrlFetchApp.fetch(postChildURL, postChildOptions);
      var childrenparsed = JSON.parse(childresponse.getContentText());
      
      for (childrow = 0; childrow < childrenparsed.length; ++childrow) {
        
        var childImage = childrenparsed[childrow].Image;
        var childname = childrenparsed[childrow].Name;
        var childdescription = childrenparsed[childrow].Description;  
        
        
        var fragmentTitle = body.appendParagraph(childname);
        fragmentTitle.setHeading(DocumentApp.ParagraphHeading.HEADING4);
        fragmentTitle.setAttributes(fragmentHeaderStyle);
        
        var fragmentBody = body.appendParagraph(childdescription);
        fragmentBody.appendText("\r\r");
        fragmentBody.setAttributes(fragmentParagraphStyle);
        
        if (childImage) {
          var driveImage = childImage.split("/")[1];
          var specified =  DriveApp.getFilesByName(driveImage).next().getId();
          var insertable = DriveApp.getFileById(specified).getBlob(); 
          
          var imageParagraph = body.appendParagraph("");
          var finalImage = imageParagraph.appendInlineImage(insertable);
          imageParagraph.setAttributes(fragmentImageStyle);
          
          // for kicks, let's reduce the image size by 50%
          finalImage.setHeight(finalImage.getHeight()/2.0);
          finalImage.setWidth(finalImage.getWidth()/2.0);
        }
        
      }

    }
        
    // some padding between each record
    finalSpaces = body.appendParagraph("\r\r\r"); 
    
  }
  
}
