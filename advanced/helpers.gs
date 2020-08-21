// send an email when we are done generating content
// this needs some cleanup
function sendNotification(emailaddr,requestid,docid) {
  
  
  var now = new Date() + 1;
  
  var googleLogoUrl = "https://cloud.google.com/images/social-icon-google-cloud-1200-630.png";
  var googleLogoBlob = UrlFetchApp
                         .fetch(googleLogoUrl)
                         .getBlob()
                         .setName("googleLogoBlob");
  MailApp.sendEmail({
    to: emailaddr,
    subject: "your google doc is ready!",
    htmlBody: "<br/><br/><b>open this link to view it:</b> https://docs.google.com/document/d/" + docid,
    inlineImages:
      {
        googleLogo: googleLogoBlob
      }
  });
}



//construct a full rest api post
function buildPost(Selector) {
  

  
  
  var postparentbody = 
      {
        "Action": "Find",
        "Properties": {
          "Locale": "en-US",
          "Location": "47.623098, -122.330184",
          "Selector" : Selector,
          "Timezone": "Pacific Standard Time",
          "RunAsUserEmail": "ty@appsheet.com"
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
  
  return postParentOptions;
}



// helper function to copy headers and footers from a google doc template
function addHeaderFooterFromTemplate(document){
  
  var body = document.getBody();
  
  var headerSection = document.addHeader();
  var footerSection = document.addFooter();
  
  var headerFooterTemplateDoc = DocumentApp.openById(templateForHeadersAndFooters);
  var headerTemplate = headerFooterTemplateDoc.getHeader();
  var footerTemplate = headerFooterTemplateDoc.getFooter();
  
  var headerParagraphs = headerTemplate.getParagraphs();
  var footerParagraphs = footerTemplate.getParagraphs();
  
  var bodyParagraphsAttributes = headerFooterTemplateDoc.getBody().getAttributes();
  var bodyParagraphs = headerFooterTemplateDoc.getBody().getParagraphs();
  
  body.setMarginTop(headerFooterTemplateDoc.getBody().getMarginTop());
  body.setMarginBottom(headerFooterTemplateDoc.getBody().getMarginBottom());
  body.setMarginLeft(headerFooterTemplateDoc.getBody().getMarginLeft());
  body.setMarginRight(headerFooterTemplateDoc.getBody().getMarginRight());
  
  body.setAttributes(bodyParagraphsAttributes);
  
  
  for (i = 0; i < headerParagraphs.length; ++i) {
    headerSection.appendParagraph(headerParagraphs[i].copy());
    headerSection.setAttributes(pageHeaderStyle);
  }
  for (i = 0; i < footerParagraphs.length; ++i) {
    footerSection.appendParagraph(footerParagraphs[i].copy());
    footerSection.setAttributes(footerParagraphs[i].getAttributes());    
  }
  for (i = 0; i < bodyParagraphs.length; ++i) {
    body.appendParagraph(bodyParagraphs[i].copy());  
  }
  
  return document;
}





// helper function 'getFileByName'
// example lifted from the google app script community and cleaned up here. 
// finding ID's by filename can result in more than one file found, this function tries to deal with that.
// but in the AppSheet world it's nearly impossible for an 
// uploaded image or file to end up with multiple parent folders,
// so a lot of this code is not really needed.

function getFileByName(fileName, fileInFolder){
  
  var filecount = 0;
  var dupFileArray = [];
  var folderID = "";
  
  var files = DriveApp.getFilesByName(fileName);
  
  while(files.hasNext()){
    var file = files.next();
    dupFileArray.push(file.getId());
    
    filecount++;
  };
  
  if(filecount > 1){
    if(typeof fileInFolder === 'undefined'){
      folderID = {"id":false,"error":"More than one file with name: "+fileName+". \nTry adding the file's folder name as a reference in Argument 2 of this function."}
      
    }else{
      //iterate through list of files with the same name
      for(fl = 0; fl < dupFileArray.length; fl++){
        var activeFile = DriveApp.getFileById(dupFileArray[fl]);
        var folders = activeFile.getParents();
        var folder = ""
        var foldercount = 0;
        
        //Get the folder name for each file
        while(folders.hasNext()){
          folder = folders.next().getName(); 
          foldercount++;
        };
        
        if(folder === fileInFolder && foldercount > 1){
          folderID = {"id":false,"error":"There is more than one parent folder: "+fileInFolder+" for file "+fileName}
        };
        
        if(folder === fileInFolder){
          folderID = {"id":dupFileArray[fl],"error":false};
          
        }else{
          folderID = {"id":false,"error":"There are multiple files named: "+fileName+". \nBut none of them are in folder, "+fileInFolder}
        };
      };
    };
    
  }else if(filecount === 0){
    folderID = {"id":false,"error":"No file in your drive exists with name: "+fileName};
    
  }else{ //IF there is only 1 file with fileName
    folderID = {"id":dupFileArray[0],"error":false};
  };
  
  return folderID;
};

