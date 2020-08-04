// begin formatting styles
var parentParagraphStyle = {};
parentParagraphStyle[DocumentApp.Attribute.FONT_SIZE] = 11;
parentParagraphStyle[DocumentApp.Attribute.FONT_FAMILY] = 'Open Sans';

var fragmentParagraphStyle = {};
fragmentParagraphStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
fragmentParagraphStyle[DocumentApp.Attribute.FONT_FAMILY] = 'Calibri';
fragmentParagraphStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
fragmentParagraphStyle[DocumentApp.Attribute.BOLD] = false;
fragmentParagraphStyle[DocumentApp.Attribute.INDENT_FIRST_LINE] = 50;
fragmentParagraphStyle[DocumentApp.Attribute.INDENT_START] = 50;
fragmentParagraphStyle[DocumentApp.Attribute.INDENT_END] = 50;

var fragmentHeaderStyle = {};
fragmentHeaderStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;

var fragmentImageStyle = {};
fragmentImageStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
fragmentImageStyle[DocumentApp.Attribute.INDENT_FIRST_LINE] = 50;
fragmentImageStyle[DocumentApp.Attribute.INDENT_START] = 50;
fragmentImageStyle[DocumentApp.Attribute.INDENT_END] = 50;
fragmentImageStyle[DocumentApp.Attribute.MARGIN_LEFT] = 50;

var pageHeaderStyle = {}
pageHeaderStyle[DocumentApp.Attribute.MARGIN_TOP] = 0.0;
// end formatting styles