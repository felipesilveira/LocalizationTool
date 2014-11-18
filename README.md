![My image](http://www.felipesilveira.com.br/localizationtool/logo.png)

Localization Tool is made for Google Apps Script platform and provides an easy and efficient way to manage strings for Android and iOS localized apps.

The tool runs as an addon for Google Spreadsheet and creates an extra menu option with the following options: "Import Android/iOS" files and "Generate Localization Files". With those options, you can fill the spreasheet based on your localization file and/or create the localization files (Android's strings.xml and iOS Localizable.string) based on the data from the spreadsheet.

<h3>The Spreadsheet</h3>

Localization Tool works on a spreadsheet in the following format:

<img src="http://www.felipesilveira.com.br/localizationtool/spreadsheetformat.png" align="center" />

The spreadsheet should contain one column for the android key, one column for the ios key and an extra column for each supported language, with the language code in the header. Each line in the spreadsheet corresponds to a string to be generated in the localization files.

To initialize the header you can use the menu option <i>Localization Tool > Initialize</i>. This option creates the header in the format above.

<h3>Generating the localization files</h3>

To generate android and iOS files, use the "Generate Localization Files" menu option:

<img src="http://www.felipesilveira.com.br/localizationtool/generateitem.png" align="center" />

Using this option, the spreadsheet data will be processed and the localization files will be generated in the Google Drive directory called "LocalizationTool":

<img src="http://www.felipesilveira.com.br/localizationtool/directory.png" align="center" />

After the files generation, the script also highlights the strings without translation.

<img src="http://www.felipesilveira.com.br/localizationtool/spreadsheetafter.png" align="center" />

<h3>Importing Android/iOS files</h3>

You can also <b>fill</b> the spreadsheet based in a localization file from Android or iOS using the function <b>Import</b>. Click on <i>Localization Tool > Import > Import Android File or Import iOS File</i> and then upload the file and select its language:

<img src="http://www.felipesilveira.com.br/localizationtool/import.png" align="center" />

