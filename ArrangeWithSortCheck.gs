function moveFilesWithCustomSettings() {
  // User-defined parameters
  var primaryFolderId ="YOUR_PRIMARY_FOLDER_ID";  // ID for Recording Folder
  var sortInsideSubjectWise = false; // Set to true to sort files inside "Subject Wise" folder
  
  // Define mappings of keywords to target folders (with wildcards in mind)
  var folderMappings = {
    "jami": "Sharah Jami",
    "balagha": "Balagha",
    "balahgah": "Balagha",
    "balahga": "Balagha",
    "balgha": "Balagha",
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
    // Add more mappings as needed
  };

  // Call the sorting function
  moveFiles(primaryFolderId, folderMappings, sortInsideSubjectWise);
}

function moveFiles(primaryFolderId, folderMappings, sortInsideSubjectWise) {
  var primaryFolder = DriveApp.getFolderById(primaryFolderId);
  var subjectWiseFolder = primaryFolder.getFoldersByName("Subject Wise").next();

  // Start moving files based on user selection
  moveFilesInFolderAndSubfolders(primaryFolder, subjectWiseFolder, folderMappings, sortInsideSubjectWise);
}

function moveFilesInFolderAndSubfolders(folder, subjectWiseFolder, folderMappings, sortInsideSubjectWise) {
  var files = folder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName().toLowerCase();
    var isInSubjectWise = false;

    // Determine if file is in the "Subject Wise" folder or its subfolders
    var parents = file.getParents();
    while (parents.hasNext()) {
      var parentFolder = parents.next();
      if (parentFolder.getId() === subjectWiseFolder.getId()) {
        isInSubjectWise = true;
        break;
      }
    }

    // Check sorting condition based on user's choice
    if ((sortInsideSubjectWise && !isInSubjectWise) || (!sortInsideSubjectWise && isInSubjectWise)) {
      Logger.log("Skipping file based on sorting preference: " + file.getName());
      continue;
    }

    // Check for matching keywords in the file name
    for (var keyword in folderMappings) {
      // Updated regex to include any characters (including numbers and special characters) as prefixes/postfixes
      var regex = new RegExp("[^a-zA-Z0-9]" + keyword + "[^a-zA-Z0-9]", "i");  // Ensures keyword is surrounded by non-word characters
      // var regex = new RegExp("\\b" + keyword + "(\\d*)\\b", "i");
      
      if (regex.test(fileName)) {
        var targetFolderName = folderMappings[keyword];
        var targetFolder = subjectWiseFolder.getFoldersByName(targetFolderName);

        if (targetFolder.hasNext()) {
          var destinationFolder = targetFolder.next();

          // Check if a file with the same name already exists in the target folder
          var existingFiles = destinationFolder.getFilesByName(file.getName());
          if (!existingFiles.hasNext()) {
            Logger.log("Moving file: " + file.getName() + " to folder: " + targetFolderName);
            file.moveTo(destinationFolder);
          } else {
            Logger.log("Duplicate file found, not moving: " + file.getName());
          }
        } else {
          Logger.log("Target folder not found: " + targetFolderName);
        }
        break;
      }
    }
  }

  // Process subfolders recursively
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    moveFilesInFolderAndSubfolders(subfolder, subjectWiseFolder, folderMappings, sortInsideSubjectWise);
  }
}
