/**
* Localization Tool
*
* This script helps managing the localization files for android and ios
* apps.
*
* Author: Felipe Silveira
* 
* Licensed under GPL v2.0
* version 0.5
*
* More info on felipesilveira.com.br/localizationtool or github.com/felipesilveira/localizationtool
*
*/

/**
* Generates android and ios i18n files based on the data from the spreadsheet.
*/
function generateFiles() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var app = UiApp.createApplication();
  
  var titleRow = values[0];
  
  showLoadingDialog("Generating files...");
  
  // Generating Android file
  for (var j = 2; j < titleRow.length; j++) {
    
    var contents = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<resources>\n";
    
    for (var i = 1; i <= numRows - 1; i++) {
      var row = values[i];
      if((row[j] != "") && (row[0] != "")) {
        contents += "    <string name=\"" + row[0] + "\">" + substitutionsForAndroid(replaceSpecialChars(row[j])) + "</string>\n";
      }
      var range = sheet.getRange(i+1, j+1, 1);
      if((row[j] == "") && (row[2] != "")) {
        range.setBackground("#FA8072");
      } else {
        range.setBackground("#FFFFFF");
      }
    }
    contents += "</resources>\n";
    
    var folder = getOrCreateFolder('LocalizationTool');
    var androidFolder = getOrCreateFolder("android", folder, 'LocalizationTool/android');
    var resFolder = getOrCreateFolder("res", androidFolder, 'LocalizationTool/android/res');
    
    var valuesFolder;
    if(j == 2) {
      valuesFolder = getOrCreateFolder("values", resFolder, 'LocalizationTool/android/res' + "/values");
    } else {
      valuesFolder = getOrCreateFolder('values-'+titleRow[j], resFolder, 'LocalizationTool/android/res/' + 'values-'+titleRow[j]);
    }
        
    recreateFile(valuesFolder, 'strings.xml', contents, 'application/xml');
  }
  
  // Generating ios file
  for (var j = 2; j < titleRow.length; j++) {
    
    var contents = "";
    
    for (var i = 1; i <= numRows - 1; i++) {
      var row = values[i];
      if((row[j] != "") && (row[1] != "")) {
        contents += "\"" + row[1] + "\" = \"" + row[j] + "\";\n";
      }
    }
    
    var resFolder = getFolderByPath('LocalizationTool/ios');
    
    var valuesFolder;
    
    valuesFolder = getFolderByPath('LocalizationTool/ios/' + titleRow[j] + ".lproj");
    
    recreateFile(valuesFolder, 'Localizable.string', contents, "text/plain");
  }
  
  showSuccessGeneratedMessage();
  
  return app;
};

function recreateFile(valuesDir, fileName, document, type) {
  var iterator = valuesDir.getFilesByName(fileName);
  if (iterator.hasNext()) {
    valuesDir.removeFile(iterator.next());
  }

  return valuesDir.createFile(fileName, document, type);
}

/**
* Creates XML-formatted item.
*/
function makeXML(key, value) {
  var xml = new XML('<string/>');
  xml['@attrib1'] = key;
  xml.string = value;
  return xml.toString();
}

/**
* Returns the folder or creates it, if not found.
*/
function getFolderByPath(path) {
  var parts = path.split("/");

  if (parts[0] == '') parts.shift(); // Did path start at root, '/'?

  var folder = DriveApp.getRootFolder();
  for (var i = 0; i < parts.length; i++) {
    var result = folder.getFoldersByName(parts[i]);
    if (result.hasNext()) {
      folder = result.next();
    } else {
      folder = folder.createFolder(parts[i]);
    }
  }
  return folder;
}

/**
* Shows the success message after generating localization files.
*/
function showSuccessGeneratedMessage() {
  var html = HtmlService.createHtmlOutput(getSuccessGeneratedMessageHtml())
  .setWidth(220)
  .setHeight(160);
  
  SpreadsheetApp.getUi()
  .showModalDialog(html, 'Generate Localization Files');
}

/**
* Returns the HTML to be displayed after localization files
* generation.
*/
function getSuccessGeneratedMessageHtml() {

  var folder = getFolderByPath('LocalizationTool');
  
  return "<link rel=\"stylesheet\" href=\"https://ssl.gstatic.com/docs/script/css/add-ons.css\">" +
    "<div>The localization files were successfully created in the folder <b>LocalizationTool</b>." +
    " <br><br><a href=\"" + folder.getUrl() + "\" target=\"_blank\">Click here to access the folder.</a><br></div>" +
    "<form id=\"myForm\">" +
    " <br><br> <center><input type=\"button\" style=\"background:#376FF4;color:#FFF;\" value=\"Close\"" +
    "      onclick=\"google.script.host.close()\" /></center> "+
    "</form> ";
}

/**
* Creates the menu on spreadsheet menu bar.
*/
function onOpen(e) {
   SpreadsheetApp.getUi()
       .createMenu('Localization Tool')
       .addItem('Initialize Spreadsheet', 'initialize')
       .addSeparator()
       .addSubMenu(SpreadsheetApp.getUi().createMenu('Import')
           .addItem('Import Android File', 'importAndroidFile')
           .addItem('Import iOS File', 'importiosFile'))
       .addItem('Generate Localization Files', 'generateFiles')
       .addItem('Highlight different keys', 'highlightDifferentKeys')
       .addSeparator()
       .addItem('Help', 'showHelp')
       .addItem('About', 'showAbout')
       .addToUi();
 }

function onInstall() {
  onOpen();
}

/**
* Shows the help dialog.
*/
function showHelp() {
  var html = HtmlService.createHtmlOutput(getHelpHtml())
  .setWidth(600)
  .setHeight(400);
  
  SpreadsheetApp.getUi()
  .showModalDialog(html, 'Help');
}
function getHelpHtml() {
  // Minified version of http://www.felipesilveira.com.br/localizationtool/help.html
  return "<html><head><title>Localization Tool Help</title><link rel=\"stylesheet\" href=\"https://ssl.gstatic.com/docs/script/css/add-ons.css\"></head><body><img src=\"http://www.felipesilveira.com.br/localizationtool/logo.png\"><p>Localization Tool is made for Google Apps Script platform and provides an easy and efficient way to manage strings for Android and iOS localized apps.</p><p>The tool runs as an addon for Google Spreadsheet and creates an extra menu option with the following options: \"Import Android/iOS\" files and \"Generate Localization Files\". With those options, you can fill the spreadsheet based on your localization file and/or create the localization files (Android's strings.xml and iOS Localizable.string) based on the data from the spreadsheet.</p><h2>The Spreadsheet</h2><p>Localization Tool works on a spreadsheet in the following format:</p><img src=\"http://www.felipesilveira.com.br/localizationtool/spreadsheetformat.png\" align=\"center\"/><p>The spreadsheet should contain one column for the android key, one column for the ios key and an extra column for each supported language, with the language code in the header. Each line in the spreadsheet corresponds to a string to be generated in the localization files.</p><p>To initialize the header you can use the menu option <i>Localization Tool > Initialize</i>. This option creates the header in the format above.</p><h2>Generating the localization files</h2><p>To generate android and iOS files, use the \"Generate Localization Files\" menu option:</p><img src=\"http://www.felipesilveira.com.br/localizationtool/generateitem.png\" align=\"center\"/><p>Using this option, the spreadsheet data will be processed and the localization files will be generated in the Google Drive directory called \"LocalizationTool\":</p><img src=\"http://www.felipesilveira.com.br/localizationtool/directory.png\" align=\"center\"/><p>After the files generation, the script also highlights the strings without translation.</p><img src=\"http://www.felipesilveira.com.br/localizationtool/spreadsheetafter.png\" align=\"center\"/><h2>Importing Android/iOS files</h2><p>You can also <b>fill</b> the spreadsheet based in a localization file from Android or iOS using the function <b>Import</b>. Click on <i>Localization Tool > Import > Import Android File or Import iOS File</i> and then upload the file and select its language:</p><img src=\"http://www.felipesilveira.com.br/localizationtool/import.png\" align=\"center\"/></body></html>";
}

/**
* Shows the about dialog.
*/
function showAbout() {
  var html = HtmlService.createHtmlOutput(getAboutHtml())
  .setWidth(280)
  .setHeight(180);
  
  SpreadsheetApp.getUi()
  .showModalDialog(html, 'About');
}

/**
* Returns the HTML to be displayed with the 'about' information.
*/
function getAboutHtml() {
  
  return "<link rel=\"stylesheet\" href=\"https://ssl.gstatic.com/docs/script/css/add-ons.css\">" +
    "<div><b>Localization Tool</b> is a open source script developed by "+
    " <a href=\"http://www.felipesilveira.com.br\" target=\"_blank\">Felipe Silveira</a>." +
    " <br><br><a href=\"https://github.com/felipesilveira/localizationtool\" target=\"_blank\">github.com/felipesilveira/localizationtool</a><br></div>" +
    "<form id=\"myForm\">" +
    "<br><div align=\"right\"><img src=\"http://www.felipesilveira.com.br/localizationtool/logosmall.png\"></div>"+
    "</form> ";
}

/**
* Initializes the current spreadsheet in the format used by the tool.
*/
function initialize () {
  var ui = SpreadsheetApp.getUi();
  
  var result = ui.alert(
    'Please confirm',
    'To start using this tool, the first line of this spreadsheet (the header) needs to be modified. ' +
    '\nIf it is already filled, the data will be lost. Are you sure you want to continue?',
    ui.ButtonSet.YES_NO);
  
  if (result == ui.Button.YES) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var range = sheet.getRange(1, 1, 1);
    range.setValue("Android Key");
    range = sheet.getRange(1, 2, 1);
    range.setValue("iOS Key");
    range = sheet.getRange(1, 3, 1);
    range.setValue("en");    
    range = sheet.getRange(1, 1, 1, 30);
    range.setBackground("#CCFFCC");
    range.setBorder(false, false, true, false, false, false);
    range.setFontStyle("bold");
    sheet.setFrozenRows(1);
    
    ui.alert('The spreadsheet header was created successfully.\n\n' +
             'Now you can start editing the spreadsheet. \n\nAdd extra ' +
             'language columns by setting it\'s code in the header (for example: es, pt-br, etc)' +
             ' \nto the ' +
             'right of the default language (cells D1, E1 and and so on). ');
    range = sheet.getRange(1, 4, 1);
    range.activate();
  } 
}

/**
* Checks if the folder exists in DocList and returns it 
* If it doesn't exist, it will be created.
*/
function getOrCreateFolder(folderName, optFolder, optFolderPath){ 
  try { 
    if (optFolderPath != undefined){ 
      var folder = getFolderByPath(optFolderPath); 
    } else { 
      var folder = getFolderByPath(folderName); 
    } 
    return folder; 
  } catch(e) { 
    if (optFolder == undefined) { 
      var folder = DriveApp.createFolder(folderName); 
    } else { 
      var folder = optFolder.createFolder(folderName); 
    } 
    return folder; 
  } 
}

function replaceSpecialChars(text) {
  if(!text) return "";
  if(!isNaN(text)) return text;
  var converted = text.replace(/[\u00A0-\u2666]/g, function(c) {
    return unicodeValue(c);
  });
  
  converted = converted.replace("'", "\\'");
  
  return converted;
}

function replaceUnicode(text) {
  if(!text) return "";
  if(!isNaN(text)) return text;
  var converted = text.replace(/\\u([0-9A-E]{4})/g, function(a, b){
    return String.fromCharCode(parseInt(b, 16));
  });
  
  converted = converted.replace("\\'", "'");
  return converted;
}

function substitutionsForAndroid(text) {
  if(!text) return "";
  if(!isNaN(text)) return text;
  // %@ doesn't exist in android, so replace it by %s
  var converted = text.replace(/%@/g, "%s");
  converted = converted.replace(/\$@/g, "$s");
  
  return converted;
}

/**
* Returns the given character in the format
* \u<UNICODE_VALUE>
*/
function unicodeValue(input) {
  function pad_four(input) {
    var l = input.length;
    if (l == 0) return '0000';
    if (l == 1) return '000' + input;
    if (l == 2) return '00' + input;
    if (l == 3) return '0' + input;
    return input;
  }
  var output = '';
  for (var i = 0, l = input.length; i < l; i++) {
    output += '\\u' + pad_four(input.charCodeAt(i).toString(16));
  }
  return output;
}

/**
* Android Import Functions
*/
function importAndroidFile(e) {
  
  var html = HtmlService.createHtmlOutput(getAndroidFormHtml())
  .setWidth(250)
  .setHeight(200);
  SpreadsheetApp.getUi()
  .showModalDialog(html, 'Upload Android Strings XML File');
}

function processAndroidForm(formObject) {
  
  var formBlob = formObject.myFile;
  var driveFile = DriveApp.createFile(formBlob);
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var lastIndex = numRows;
  var langIndex = formObject.lang;
  langIndex++;
  
  var document = XmlService.parse(driveFile.getBlob().getDataAsString());
  var root = document.getRootElement();
  var i = 0;
  var entries = root.getChildren();
  var spareEntries = entries.slice();
  for (i = 0; i < entries.length; i++) {
    var key = entries[i].getAttribute("name").getValue();
    var text = entries[i].getText();
    
    for (var x = 1; x <= numRows - 1; x++) {
      var row = values[x];
      if(row[0] == key) {
        // if key already exists, just import the text
        spareEntries[i].setText("");
        if(!row[langIndex - 1]) {
          var range = sheet.getRange(x+1, langIndex);
          range.setValue(replaceUnicode(text));
        } 
      }

      if(row[langIndex - 1] != "") {
        // if text already exists, just import the key
        if((substitutionsForAndroid(row[langIndex - 1]).trim() == replaceUnicode(text).trim()) ||
          (row[langIndex - 1] == text)) {
          var range = sheet.getRange(x+1, 1);
          range.setValue(key);
          spareEntries[i].setText("");
        } 
      }
    }
  }

  // Adding the strings not found
  lastIndex++;
  for (var j = 0; j < spareEntries.length; j++) {
    var key = spareEntries[j].getAttribute("name").getValue();
    var text = spareEntries[j].getText();
    if(text != "") {
      var range = sheet.getRange(lastIndex, 1);
      range.setValue(key);
      range = sheet.getRange(lastIndex, langIndex);
      range.setValue(replaceUnicode(text));
      lastIndex++;
    }
  }
  
  driveFile.setTrashed(true);
  
  showSuccessImportedMessage(i + " strings found. <br>");
  
}

function getAndroidFormHtml() {
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var values = rows.getValues();
  
  var titleRow = values[0];
  
  var combo = "<select name=\"lang\">";
  for (var j = 2; j < titleRow.length; j++) {
    combo += "<option value=\""+ j +"\">" + titleRow[j] + "</option>";
  }
  
  combo += "</select>";  
  
  return "<link rel=\"stylesheet\" href=\"https://ssl.gstatic.com/docs/script/css/add-ons.css\">" +
    "<form id=\"myForm\">" +
    "<input name=\"myFile\" type=\"file\" />" +
    "<br /><br />Language: " + combo +
    " <br><br> <div align=\"right\"><input type=\"button\" value=\"Close\"" +
    "      onclick=\"google.script.host.close()\" /> "+
      "  <input type=\"button\" style=\"background:#376FF4;color:#FFF;\" value=\"Import\"" +
    "      onclick=\"google.script.run" +
    "          .processAndroidForm(this.parentNode.parentNode)\" /></div>" +
    "</form> " +
    "<div id=\"output\"></div> ";
}

// iOS Import functions
function importiosFile(e) {
  
  var html = HtmlService.createHtmlOutput(getIosHtml())
  .setWidth(260)
  .setHeight(220);
  SpreadsheetApp.getUi()
  .showModalDialog(html, 'Upload iOS Strings File');
}

function processiosForm(formObject) {
  
  var formBlob = formObject.myFile;
  var driveFile = DriveApp.createFile(formBlob);
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var lastIndex = numRows;
  var langIndex = formObject.lang;
  langIndex++;
  
  var content = driveFile.getBlob().getDataAsString();
  
  var i = 0;
  var found  = 0;
  var logs = "";
  
  var entries = content.split("\n");
  var spareEntries = entries.slice(0);
  for (i = 0; i < entries.length; i++) {
  
    logs += "Parsing ("+entries[i]+")\n";
    
    // regex to capture the key and the text in the format:
    // "key" = "text"; 
    var regex = /"([^"\\]*(?:\\.[^"\\]*)*)"\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*;/g;
    
    var match = regex.exec(entries[i]);
    logs += "match -> ("+match+")\n";
    var retries = 0;
    while ((match == null) && (retries < 3)) {
      // Sometimes the match fails in the first time. It's probably a bug
      // on javascript. So, let's try again.
      var retryRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*;/g;
      match = retryRegex.exec(entries[i]);
      logs += "retryMatch -> ("+match+") retry #" + retries +  "\n" ;

      if(match != null) {
        break;
      }
      retries++;
    }
    
    if(match != null) {
      logs += "match ("+match.toString()+")\n";
      var key = match[1];
      var text = match[2];
      found++;

      for (var x = 1; x <= numRows - 1; x++) {
        var row = values[x];
         
        if(row[1].length > 1 && row[1] == key) {
          // if key already exists, just import the text
          spareEntries[i] = "";
          if(!row[langIndex - 1]) {
            var range = sheet.getRange(x+1, langIndex);
            range.setValue(text);
          } 
        }

        if(row[langIndex] && ((row[langIndex] == text) 
          || (text == substitutionsForAndroid(replaceSpecialChars(row[langIndex]))))) {
            // if text already exists, just import the key
            var range = sheet.getRange(x+1, 2);
            range.setValue(key);
            spareEntries[i] = "";
        }
      }
    } 
  }
  
  // Adding the strings not found
  lastIndex++;
  for (var j = 0; j <= spareEntries.length; j++) {
    if(spareEntries[j] != "") {
      var regex = /"([^"\\]*(?:\\.[^"\\]*)*)"\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*;/g;
      var match = regex.exec(spareEntries[j]);
      
      var retries = 0;
      while ((match == null) && (retries < 5)) {
        // Sometimes the match fails in the first time. It's probably a bug
        // on javascript. So, let's try again.
        var retryRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*;/g;
        match = retryRegex.exec(spareEntries[j]);
        logs += "retryMatch -> ("+match+") retry #" + retries +  "\n" ;
        
        if(match != null) {
          break;
        }
        retries++;
      }
      
      if(match != null) {
        var key = match[1];
        var text = match[2];
        
        var range = sheet.getRange(lastIndex, 2);
        range.setValue(key);
        range = sheet.getRange(lastIndex, langIndex);
        range.setValue(text);
        lastIndex++;
      }
    }
  }
  
  var folder = getFolderByPath('easyi18n');
  folder.createFile('log.txt', logs);

  driveFile.setTrashed(true);
  
  showSuccessImportedMessage(found + " strings found. <br>" + texts);
}

// Debug function
function toUnicode(text) {
  var converted = "";
  for (var i = 0; i < text.length; i++) {
    converted += text.charCodeAt(i) + " ";
  }
  return converted;
}

function getIosHtml() {

  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var values = rows.getValues();
  
  var titleRow = values[0];
  
  var combo = "<select name=\"lang\">";
  for (var j = 2; j < titleRow.length; j++) {
    combo += "<option value=\""+ j +"\">" + titleRow[j] + "</option>";
  }
  
  combo += "</select>";  

  return "<link rel=\"stylesheet\" href=\"https://ssl.gstatic.com/docs/script/css/add-ons.css\">" +
    "<form id=\"myForm\">" +
    "<input name=\"myFile\" type=\"file\" />" +
    "<br /><br />Language: " + combo +
    " <br><br> <div align=\"right\"><input type=\"button\" value=\"Close\"" +
    "      onclick=\"google.script.host.close()\" /> "+
    "  <input type=\"button\" style=\"background:#376FF4;color:#FFF;\" value=\"Import\"" +
    "      onclick=\"google.script.run" +
    "          .processiosForm(this.parentNode.parentNode)\" /></div>" +
    "" +
    "</form> " +
    "<div id=\"output\"></div> ";
}

/**
* Shows a loading dialog.
*/
function showLoadingDialog(text) {
  var html = HtmlService.createHtmlOutput(getLoadingHtml(text))
  .setWidth(180)
  .setHeight(60);
  
  return SpreadsheetApp.getUi()
  .showModalDialog(html, " ");
}

/**
* Returns the HTML for loading dialog.
*/
function getLoadingHtml(text) {
  return "<link rel=\"stylesheet\" href=\"https://ssl.gstatic.com/docs/script/css/add-ons.css\">" +
    "<div><img src=\"http://www.felipesilveira.com.br/localizationtool/loading.gif\" align=\"middle\"" +
    "style=\"margin:10px;vertical-align:middle;\"><b>" + text + "</b></div> ";
}

/**
* Shows the success message after importing localization files.
*/
function showSuccessImportedMessage(message) {
  var html = HtmlService.createHtmlOutput(getSuccessImportedMessageHtml(message))
  .setWidth(220)
  .setHeight(130);
  
  SpreadsheetApp.getUi()
  .showModalDialog(html, 'Import Localization Files');
}

/**
* Returns the HTML to be displayed after localization files
* import.
*/
function getSuccessImportedMessageHtml(message) {
  var folder = DocsList.getFolder('LocalizationTool');

  return "<link rel=\"stylesheet\" href=\"https://ssl.gstatic.com/docs/script/css/add-ons.css\">" +
    "<div>The file was sucessfully imported." +
    " <br><br>" + message + "</div>" +
    "<form id=\"myForm\">" +
    " <br><br> <center><input type=\"button\" style=\"background:#376FF4;color:#FFF;\" value=\"Close\"" +
    "      onclick=\"google.script.host.close()\" /></center> "+
    "</form> ";
}


/**
* Highlights the keys not present on both Android and iOS.
* This is useful for projects using the same text keys accross the two platforms.
*/
function highlightDifferentKeys() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  
  var titleRow = values[0];
  
  // highlighting android keys not present on iOS
  for (var i = 1; i <= numRows - 1; i++) {
      var row = values[i];
      var androidKey = row[0];
      var keyfound = false;
 
      for (var j = 1; j <= numRows - 1; j++) {
        var row2 = values[j];
        
        if(androidKey == row2[1]) {
          keyfound = true;
          break;
        }
      }
    
      var range = sheet.getRange(i+1, 1, 1);
    
      if(!keyfound) {
        range.setBackground("#FA8072");
      } 
  }
  
  // highlighting iOS keys not present on Android
  for (var i = 1; i <= numRows - 1; i++) {
      var row = values[i];
      var iosKey = row[1];
      var keyfound = false;
 
      for (var j = 1; j <= numRows - 1; j++) {
        var row2 = values[j];
        
        if(iosKey == row2[0]) {
          keyfound = true;
          break;
        }
      }
    
      var range = sheet.getRange(i+1, 2, 1);
    
      if(!keyfound) {
        range.setBackground("#FA8072");
      } 
  }
    
}
