<img src="thumbnail.png" alt="DriveManagerScript Logo" width="200">

# Google Apps Script for File Management and Organization in Google Drive

Google Apps Script functions that list, sort and clean up files in Google Drive.

## Scripts

| File | Entry function | What it does |
|------|----------------|--------------|
| `ListAll2Sheet.gs` | `listAllFilesInFolderAndSubfolders` | Writes every file in a folder and its subfolders to one sheet: name, ID and path. |
| `ListByFolder2Sheet.gs` | `listAllFilesToSheet` | Creates a spreadsheet with one sheet per folder. Columns: name, ID, URL, size in MB, type, date created and playtime in seconds for audio and video. |
| `Arrange.gs` | `moveFilesBasedOnWildcardKeywords` | Moves files into folders under "Subject Wise" based on keywords in the file name. |
| `ArrangeWithSortCheck.gs` | `moveFilesWithCustomSettings` | Same as above, with a flag (`sortInsideSubjectWise`) to also sort files that are already inside "Subject Wise". |
| `CleanUp.gs` | `deleteEmptyFolders` | Moves empty folders to the trash, starting from a folder you choose. |

## Setup

1. Open [script.google.com](https://script.google.com) and create a project.
2. Copy the `.gs` files you need into the project. To use `clasp` instead, run `clasp clone <your script ID>` or point `.clasp.json` at your own project.
3. In each script, replace `YOUR_PRIMARY_FOLDER_ID` with the ID of your folder. The ID is the last part of the folder URL in Drive.
4. For playtime in `ListByFolder2Sheet.gs`, turn on the Drive advanced service (Drive API v3). `appsscript.json` already lists it.
5. In the editor, pick the entry function from the table and click Run. Google asks you to authorise the script the first time.

## Customise

- The arrange scripts use a `folderMappings` object. Each key is a keyword to look for in the file name (lower case), and each value is the target folder name. Edit it to match your files.
- The arrange scripts expect a folder named "Subject Wise" inside your primary folder.
- The sheet names in the list scripts are examples. Change them in the code.

## Warning

`CleanUp.gs` moves empty folders to the trash, and the arrange scripts move files. Try them on a test folder first. Trashed items can be restored from Drive's trash.

## License

[MIT](LICENSE)
