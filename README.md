![My image](http://www.felipesilveira.com.br/localizationtool/logo.png)

Localization Tool is made for Google Apps Script and helps managing strings for Android and iOS localized apps.

The tool runs as an addon for Google Spreadsheet and creates an extra menu option with the following options: "Import Android/iOS" files and "Generate Localization Files". With those options, you can fill the spreasheet based on your localization file and/or create the localization files (Android's strings.xml and iOS Localizable.string) based on the data from the spreadsheet.

The Spreadsheet
===============

Localization Tool works on a spreadsheet in the following format:

![My image](http://www.felipesilveira.com.br/localizationtool/spreadsheetformat.png)

The spreadsheet should contain one column for the android key, one column for the ios key and an extra column for each supported language, with the language code in the header. Each line in the spreadsheet corresponds to a string to be generated in the localization files.

To initialize the header you can use the menu option Localization Tool > Initialize. This option creates the header in the format above.

Localization Files Generation
===============

To generate android and iOS files, use the "Generate Localization Files" menu option:

![My image](http://www.felipesilveira.com.br/localizationtool/generateitem.png)

Using this option, the spreadsheet data will be processed and the localization files will be generated.
