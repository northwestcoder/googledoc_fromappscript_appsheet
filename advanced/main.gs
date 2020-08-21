/**

This entire example assumes that you have

1. An AppSheet.com app with three tables:

A) "Header", a parent table,
B) "DocumentFragments", a child table with a REF to the parent, and
C) "Requests", a table to receive requests to generate a Google Doc

2. Header and DocumentFragments each contain these fields: Name, Description, Image, Category
(and possibly other fields which should safely be ignored by this script)

*/



function trigger(e) {
  
  
  var ssht = e.source;
  var activesheet = ssht.getActiveSheet();
  var sheetName = activesheet.getName();
  var activeRange = activesheet.getActiveRange();
  var activeRow = activeRange.getRow();
  
  
  var RequestID = activesheet.getRange(activeRow,1).getValue();
  var UserEmail = activesheet.getRange(activeRow,2).getValue();
  //var Category = activesheet.getRange(activeRow,3).getValue();
  var Selector = activesheet.getRange(activeRow,4).getValue();
  var RowTimestamp = activesheet.getRange(activeRow,5).getValue();
  
  // next line makes the filtering inside of appsheet as easy as possible for the business user
  // read up on the appsheet rest api and its 'selector' option for more info
  var constructedFilter = "Filter(" + appsheetParentTableName + ", " + Selector + ")"
  
  var docresponse = main(RequestID,UserEmail,constructedFilter,RowTimestamp);
  
  // TODO: wrap this in try/catch
  // if our main function returns, we can then set the result columns for Google Doc ID and Doc Name  
  activesheet.getRange(activeRow,6).setValue(docresponse[0]);
  activesheet.getRange(activeRow,7).setValue(docresponse[1]);
  
  // optionally: uncomment next line to chill out for 60 seconds while everything async gets a sync  
  // Utilities.sleep(60000)
  
  
  sendNotification(UserEmail,RequestID,docresponse[0])
  
}


function main(RequestID,UserEmail,Selector,RowTimestamp) {
  
  
  // these next few lines overcome a google drive limitation of always creating documents at the top level
  // herein, we 1. create a doc, 2. copy it to a designated folder "outputfolderID" and 3. remove the original from the top level
  // kind of janky
  var newDoc = DocumentApp.create(UserEmail + " Report: " + RequestID),
      docFile = DriveApp.getFileById( newDoc.getId() );
  DriveApp.getFolderById(outputfolderID).addFile( docFile );
  DriveApp.getRootFolder().removeFile(docFile);
    
  // we use a world readable template to copy the header and footer, this part is also pretty janky
  // through no fault of our own, the DocumentApp class seems to have limited support around headers and footers
  // addHeaderFooterFromTemplate is in helpers.gs and refers to a template in constants.gs
  finalDoc = addHeaderFooterFromTemplate(newDoc);
  // in fact does it even work? We are skeptical. We were able to get headers/footers working.
  body = finalDoc.getActiveSection();
  
  
  // OK, now we call BACK into AppSheet's Rest API, params are encapsulated in constants.gs 
  // the next line is the call to the parent table
  // buildPost() is in helpers.gs
  parentresponse = UrlFetchApp.fetch(postParentURL, buildPost(Selector));
  
  // parse the response
  var parentparsed = JSON.parse(parentresponse.getContentText());
  
  //iterate the parsed response and append to our Google Doc
  for (row = 0; row < parentparsed.length; ++row) {
    
    var headerkey = parentparsed[row].Key;
    var jsonImage = parentparsed[row].Image;
    var name = parentparsed[row].Name;
    var thiscategory = parentparsed[row].Category;
    var thisstatus = parentparsed[row].Status;
    var thisowner = parentparsed[row].Owner;
    var description = parentparsed[row].Description;  
    var documentFragments = parentparsed[row].DocumentFragments;  
    
    var bodyheadername = body.appendParagraph(name);
    bodyheadername.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    
    var metadata = body.appendParagraph("\r");
    metadata.appendText("Category: " + thiscategory + "\r");
    metadata.appendText("Status: " + thisstatus + "\r");
    metadata.appendText("Owner: " + thisowner + "\r");
    metadata.setAttributes(parentParagraphBoldStyle);
    
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
      
      childresponse = UrlFetchApp.fetch(postChildURL, buildPost(PostChildSelector));
      var childrenparsed = JSON.parse(childresponse.getContentText());
      
      for (childrow = 0; childrow < childrenparsed.length; ++childrow) {
        
        var childImage = childrenparsed[childrow].Image;
        var childname = childrenparsed[childrow].Name;
        var childdescription = childrenparsed[childrow].Description;  
        var childurl = childrenparsed[childrow].URL;  
        
        var fragmentTitle = body.appendParagraph(childname);
        fragmentTitle.setHeading(DocumentApp.ParagraphHeading.HEADING4);
        fragmentTitle.setAttributes(fragmentHeaderStyle);
        
        var fragmentBody = body.appendParagraph(childdescription);
        fragmentBody.appendText("\r\r");
        fragmentBody.setAttributes(fragmentParagraphStyle);
        
        var fragmentURL = body.appendParagraph(childurl);
        fragmentURL.setLinkUrl(childurl);
        fragmentURL.setAttributes(fragmentParagraphStyle);
        fragmentURL.appendText("\r\r");
        
        
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
  
  var results = [finalDoc.getId(), finalDoc.getName()];
  
  return results;
  
}
