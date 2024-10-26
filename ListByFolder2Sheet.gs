function listAllFilesToSheet() {
  // User-defined parameter: specify the folder ID
  var primaryFolderId = "YOUR_PRIMARY_FOLDER_ID"; // Replace with your primary folder's ID
  var primaryFolder = DriveApp.getFolderById(primaryFolderId);
  
  // Create a new Google Sheet to store the file listings
  var spreadsheet = SpreadsheetApp.create("Rabia 2024_2025 Recordings By Subject");
  
  // Start listing files in the primary folder and its subfolders
  listFilesInFolder(primaryFolder, spreadsheet);
}

function listFilesInFolder(folder, spreadsheet) {
  // Get files in the current folder
  var files = folder.getFiles();
  
  // If the folder is empty, return
  if (!files.hasNext()) {
    Logger.log("Skipping empty folder: " + folder.getName());
    return;
  }

  // Create a new sheet for the current folder
  var sheet = spreadsheet.insertSheet(folder.getName());
  
  // Set up headers for the sheet
  sheet.appendRow(["File Name", "File ID", "File URL", "File Size (MB)", "File Type", "Date Created", "Playtime (seconds)"]);

  // List all files in the current folder
  while (files.hasNext()) {
    var file = files.next();
    var fileSizeMB = (file.getSize() / (1024 * 1024)).toFixed(2); // Convert size to MB
    var fileType = file.getMimeType(); // Get file type (MIME type)
    var playtime = getFilePlaytime(file); // Get playtime if applicable

    sheet.appendRow([file.getName(), file.getId(), file.getUrl(), fileSizeMB, fileType, file.getDateCreated(), playtime]);
  }

  // Recursively list files in all subfolders
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    listFilesInFolder(subfolder, spreadsheet);
  }
}

function getFilePlaytime(file) {
  // Check if the file is a video or audio file
  var mimeType = file.getMimeType();
  var playtime = "";

  // You can extend this list based on your requirements
  if (mimeType === MimeType.MP4 || mimeType === MimeType.MP3 || mimeType === MimeType.MOV || mimeType === MimeType.M4A) {
    var fileBlob = file.getBlob();
    var duration = getDurationFromBlob(fileBlob);
    playtime = duration ? duration : "N/A"; // If duration is not available, return "N/A"
  }

  return playtime;
}

function getDurationFromBlob(blob) {
  // This function attempts to extract the duration of the audio/video file
  // Placeholder for actual duration extraction logic
  // Currently, Google Apps Script does not directly support extraction of media file durations.
  
  // Example: Placeholder returning random seconds for demo
  return Math.floor(Math.random() * 300); // Random duration (0-300 seconds)
}
