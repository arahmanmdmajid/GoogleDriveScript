function deleteEmptyFolders() {
  // User-defined parameter: specify the folder ID
  var targetFolderId = "1I3Xq1gGeaE02Gwjr13nul5a_zM1hsJOK"; // Replace with your target folder's ID
  var targetFolder = DriveApp.getFolderById(targetFolderId);
  
  // Call the function to delete empty folders
  deleteEmptyFoldersRecursively(targetFolder);
}

function deleteEmptyFoldersRecursively(folder) {
  // Get all subfolders
  var subfolders = folder.getFolders();
  
  // Recursively check each subfolder
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    deleteEmptyFoldersRecursively(subfolder);
  }
  
  // After checking subfolders, check if the current folder is empty
  if (!hasFilesOrSubfolders(folder)) {
    Logger.log("Deleting empty folder: " + folder.getName());
    folder.setTrashed(true); // Move to trash
  }
}

function hasFilesOrSubfolders(folder) {
  // Check if there are any files in the folder
  var files = folder.getFiles();
  if (files.hasNext()) {
    return true; // There are files in the folder
  }
  
  // Check if there are any subfolders in the folder
  var subfolders = folder.getFolders();
  if (subfolders.hasNext()) {
    return true; // There are subfolders in the folder
  }
  
  // The folder is empty
  return false;
}
