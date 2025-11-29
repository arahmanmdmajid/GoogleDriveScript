function listAllFilesToSheet() {
  // User-defined parameter: specify the folder ID
  var primaryFolderId = "12eRJuYClN8IVtISuiVqThrqWTNx6dKdn"; // Replace with your primary folder's ID
  var primaryFolder = DriveApp.getFolderById(primaryFolderId);

  // Create a new Google Sheet to store the file listings
  var spreadsheet = SpreadsheetApp.create("Rabia 2024_2025 Recordings By Subject Qutbi");

  // Start listing files in the primary folder and its subfolders
  listFilesInFolder(primaryFolder, spreadsheet);
}

function listFilesInFolder(folder, spreadsheet) {
  // Get files in the current folder
  var files = folder.getFiles();

  // Create a new sheet for the current folder
  var sheet = spreadsheet.insertSheet(folder.getName());

  // Set up headers for the sheet
  sheet.appendRow(["File Name", "Date", "File ID", "File URL", "File Size (MB)", "File Type", "Date Created", "Playtime (seconds)"]);

  // List all files in the current folder
  while (files.hasNext()) {
    file
    var file = files.next();
    var fileSizeMB = (file.getSize() / (1024 * 1024)).toFixed(2); // Convert size to MB
    var fileType = file.getMimeType(); // Get file type (MIME type)
    var playtime = getPlaytimeDuration(file.getId()); // Get playtime if applicable
    var dateOfFile = extractDateFromFileName(file.getName()); // Date when the lecture was delivered from file name

    sheet.appendRow([file.getName(), dateOfFile, file.getId(), file.getUrl(), fileSizeMB, fileType, file.getDateCreated(), playtime]);
  }

  // Recursively list files in all subfolders
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    listFilesInFolder(subfolder, spreadsheet);
  }
}

function getPlaytimeDuration(fileId) {
  try {
    // Ensure the Drive API is enabled in your project
    var metadata = Drive.Files.get(fileId, { fields: "id, name, mimeType, videoMediaMetadata" });

    // Log file details for debugging
    Logger.log(`File Name: ${metadata.name}`);
    Logger.log(`MIME Type: ${metadata.mimeType}`);

    // Validate if the file is a video
    if (!metadata.mimeType.startsWith("video/")) {
      Logger.log(`This file is not a video. MimeType: ${metadata.mimeType}`);
      return "N/A"
    }

    // Check if videoMediaMetadata exists
    Logger.log(metadata.videoMediaMetadata)
    if (metadata.videoMediaMetadata && metadata.videoMediaMetadata.durationMillis) {
      var durationMillis = metadata.videoMediaMetadata.durationMillis;
      var totalMinutes = Math.floor(durationMillis / 60000); // Get whole minutes
      var remainingSeconds = Math.floor((durationMillis % 60000) / 1000); // Get remaining seconds
      return `${totalMinutes} minutes ${remainingSeconds} seconds`;
    } else {
      return "N/A";
    }
  } catch (e) {
    if (e.message.includes("File not found")) {
      return "Error: File not found. Check the file ID and ensure the file is shared with the script.";
    }
    return `Error: ${e.message}`;
  }
}

function extractDateFromFileName(fileName) {
  // Regex to find a 6-digit date in DDMMYY format
  var dateMatch = fileName.match(/\b\d{6}\b/);
  if (dateMatch) {
    var dateStr = dateMatch[0]; // Extract the matched date
    var day = dateStr.substring(0, 2); // DD
    var month = dateStr.substring(2, 4); // MM
    var year = "20" + dateStr.substring(4, 6); // YYYY
    return day + "/" + month + "/" + year; // Return in DD/MM/YYYY format
  }
  return "N/A"; // Return "N/A" if no valid date is found
}

// function extractDateFromFileName(fileName) {
//   // Regex to find a 6-digit date in DDMMYY format
//   var dateMatch = fileName.match(/\b\d{6}\b/);
//   if (dateMatch) {
//     var dateStr = dateMatch[0]; // Extract the matched date
//     var formattedDate = dateStr.replace(/(\d{2})(\d{2})(\d{2})/, "$1/$2/20$3"); // Convert to DD/MM/YYYY
//     return formattedDate;
//   }
//   return "N/A"; // Return "N/A" if no date is found
// }