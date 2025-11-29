function listAllFilesInFolderAndSubfolders() {
  var folderId = "YOUR_PRIMARY_FOLDER_ID";  // ID for Recording Folder
  var folder = DriveApp.getFolderById(folderId);

  //Creating new Google Sheet
  var spreadsheet = SpreadsheetApp.create("Rabia 2024_2025 Recordings");
  var sheet = spreadsheet.getActiveSheet();

  //Set up headers
  sheet.getRange("A1").setValue("File Name");
  sheet.getRange("B1").setValue("File ID");
  sheet.getRange("C1").setValue("File Path");

  // Start the recursive file listing
  var row = 2;
  row = listFilesInFolderAndSubfolders(folder, "", sheet, row);
}

function listFilesInFolderAndSubfolders(folder, path, sheet, row) {

  //Update the current path
  var currentPath = path + "/" + folder.getName();

  // List files in the current folder
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    sheet.getRange("A" + row).setValue(file.getName());
    sheet.getRange("B" + row).setValue(file.getId());
    sheet.getRange("C" + row).setValue(currentPath);
    row++;

    Logger.log("File Name: " + file.getName() + ", File ID: " + file.getId());
  }

  // Process subfolders recursively
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    Logger.log("Entering Folder: " + subfolder.getName());
    row = listFilesInFolderAndSubfolders(subfolder, currentPath, sheet, row);  // Recursive call
  }

  return row; //Return the updated row number for continuity
}
