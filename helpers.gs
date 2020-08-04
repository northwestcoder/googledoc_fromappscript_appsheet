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
