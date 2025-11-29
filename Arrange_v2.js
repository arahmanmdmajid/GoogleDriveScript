function sortFilesToSubjectWise() {
  var recordingFolderId = "1I3Xq1gGeaE02Gwjr13nul5a_zM1hsJOK"; // Replace with your Recording folder ID
  var recordingFolder = DriveApp.getFolderById(recordingFolderId);

  var subjectWiseFolder = recordingFolder.getFoldersByName("Subject Wise").next(); // Get "Subject Wise" folder

  // Mapping of keywords to subfolders inside "Subject Wise"
  var folderMappings = {
    "jami": "Sharah Jami",
    "noor": "Noor Ul Anwar",
    "anwar": "Noor Ul Anwar",
    "balagha": "Balagha",
    "balahgah": "Balagha",
    "wadiha": "Balagha",
    "alwadiha": "Balagha",
    "droos": "Balagha",
    "doroose": "Balagha",
    "riaz": "Hadees",
    "saliheen": "Hadees",
    "salihen": "Hadees",
    "salheen": "Hadees",
    "kanz": "Kanz Ul Daqaiq",
    "muqamat": "Maqamat",
    "maqamat": "Maqamat",
    "noor": "Noor Ul Anwar",
    "anwar": "Noor Ul Anwar",
    "quran": "Tafseer",
    "qran": "Tafseer",
    "qutbi": "Qutbi",
  };

  // Process all folders inside the "Recording" folder
  var subfolders = recordingFolder.getFolders();
  while (subfolders.hasNext()) {
    var folder = subfolders.next();
    if (folder.getId() === subjectWiseFolder.getId()) {
      Logger.log(`Skipping the "Subject Wise" folder`);
      // Skip the "Subject Wise" folder
      continue;
    }

    processFolder(folder, subjectWiseFolder, folderMappings);
  }
}

function processFolder(folder, subjectWiseFolder, folderMappings) {
  Logger.log(`Inside processFolder`);
  var files = folder.getFiles();
  Logger.log(`${files.hasNext()}`);
  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    Logger.log(`${fileName}`);

    for (var keyword in folderMappings) {
      var regex = new RegExp("\\b" + keyword + "(\\d*)\\b", "i");  // \d* matches any number of digits and \b is used for word boundaries
      // var regex = new RegExp(`[^a-zA-Z0-9]*${keyword}[^a-zA-Z0-9]*`, "i");
      if (regex.test(fileName)) {
        var targetSubfolderName = folderMappings[keyword];
        var targetSubfolder = getOrCreateFolder(subjectWiseFolder, targetSubfolderName);

        // Check if the file already exists in the target subfolder
        if (!fileExistsInFolder(targetSubfolder, fileName)) {
          file.moveTo(targetSubfolder);
          Logger.log(`Moved file: ${fileName} to ${targetSubfolderName}`);
        }
        break; // Stop checking other keywords once a match is found
      }
    }
  }
}

function getOrCreateFolder(parentFolder, subfolderName) {
  var subfolders = parentFolder.getFoldersByName(subfolderName);
  if (subfolders.hasNext()) {
    return subfolders.next();
  }
  return parentFolder.createFolder(subfolderName);
}

function fileExistsInFolder(folder, fileName) {
  var files = folder.getFilesByName(fileName);
  return files.hasNext();
}
