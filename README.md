![My image](http://www.felipesilveira.com.br/localizationtool/logo.png)

Localization Tool is made for Google Apps Script and helps managing strings for Android and iOS localized apps.

The tool runs as an addon for Google Spreadsheet and creates an extra menu option with the following options: "Import Android/iOS" files and "Generate Localization Files". With those options, you can fill the spreasheet based on your localization file and/or create the localization files (Android's strings.xml and iOS Localizable.string) based on the data from the spreadsheet.

<h2>The Spreadsheet</h2>

Localization Tool works on a spreadsheet in the following format:

![My image](http://www.felipesilveira.com.br/localizationtool/spreadsheetformat.png)

The spreadsheet should contain one column for the android key, one column for the ios key and an extra column for each supported language, with the language code in the header. Each line in the spreadsheet corresponds to a string to be generated in the localization files.

To initialize the header you can use the menu option Localization Tool > Initialize. This option creates the header in the format above.

<h2>Localization Files Generation</h2>

To generate android and iOS files, use the "Generate Localization Files" menu option:

![My image](http://www.felipesilveira.com.br/localizationtool/generateitem.png)

Using this option, the spreadsheet data will be processed and the localization files will be generated in the Google Drive directory called "LocalizationTool":

![My image](http://www.felipesilveira.com.br/localizationtool/directory.png)

After the files generation, the script also highlights the strings without translation.

![My image](http://www.felipesilveira.com.br/localizationtool/spreadsheetafter.png)

<h2> Android/iOS Files Import </h2>

You can also <b>fill</b> the spreadsheet based in a localization file from Android or iOS using the function <b>Import</b>. Click on Import > Import Android File or Import iOS Files and then upload the file and select its language:

![My image](http://www.felipesilveira.com.br/localizationtool/import.png)


