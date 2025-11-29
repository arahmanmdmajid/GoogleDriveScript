function moveFilesBasedOnWildcardKeywords() {
  var folderId = "17ZAIZH7oMH8kmGGJeIXP34AxQuO-kdap";  // ID for Recording Folder
  var folder = DriveApp.getFolderById(folderId);

  // Define the "Subject Wise" folder
  var subjectWiseFolder = folder.getFoldersByName("Tafseer").next();

  // Define mappings of keywords to target folders (with wildcards in mind)
  var folderMappings = {
    // "jami": "Sharah Jami",
    // "noor": "Noor Ul Anwar",
    // "anwar": "Noor Ul Anwar",
    // "anwar1": "Noor Ul Anwar1",
    // "anwar2": "Noor Ul Anwar2",
    // "anwar3": "Noor Ul Anwar3",
    // "5.1": "Noor Ul Anwar1",
    // "5.2": "Noor Ul Anwar2",
    // "5.3": "Noor Ul Anwar3",
    // "jami1": "Sharah Jami1",
    // "jami2": "Sharah Jami2",
    // "jami3": "Sharah Jami3",
    // "8.1": "Sharah Jami1",
    // "8.2": "Sharah Jami2",
    // "8.3": "Sharah Jami3",
    // "Wadiha": "Balaghat ul Waziha",
    // "7.2": "Balaghat ul Waziha",
    // "Doroos": "Duroos ul Balagha",
    // "Droos": "Duroos ul Balagha",
    // "Doroose": "Duroos ul Balagha",
    // "7.1": "Duroos ul Balagha",
    // "balagha": "Balagha",
    // "balahgah": "Balagha",
    // "wadiha": "Balagha",
    // "alwadiha": "Balagha",
    // "droos": "Balagha",
    // "doroose": "Balagha",
    // "riaz": "Hadees",
    // "saliheen": "Hadees",
    // "salihen": "Hadees",
    // "salheen": "Hadees",
    // "kanz": "Kanz Ul Daqaiq",
    // "Kanz1": "Kanz1",
    // "Kanz2": "Kanz2",
    // "Kanz3": "Kanz3",
    // "3.1": "Kanz1",
    // "3.2": "Kanz2",
    // "3.3": "Kanz3",
    // "muqamat": "Maqamat",
    // "maqamat": "Maqamat",
    // "noor": "Noor Ul Anwar",
    // "anwar": "Noor Ul Anwar",
    // "quran": "Tafseer",
    "1.1 Qu": "Para 11-15",
    "1.2 Qu": "Para 16-20",
    // "qran": "Tafseer",
    // "qutbi": "Qutbi",
    // Add more mappings as needed
  };

  // Start the recursive file moving process
  moveFilesInFolderAndSubfoldersWithWildcards(folder, subjectWiseFolder, folderMappings);
}

function moveFilesInFolderAndSubfoldersWithWildcards(folder, subjectWiseFolder, folderMappings) {
  var files = folder.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName().toLowerCase();
    var parents = file.getParents();
    var isInSubjectWise = false;

    // Check if the file name contains any of the predefined keywords (wildcard matching)
    for (var keyword in folderMappings) {
      var regex = new RegExp("\\b" + keyword + "(\\d*)\\b", "i");  // \d* matches any number of digits and \b is used for word boundaries

      if (regex.test(fileName)) {  // If the file name matches the keyword pattern
        var targetFolderName = folderMappings[keyword];
        var targetFolder = subjectWiseFolder.getFoldersByName(targetFolderName);

        if (targetFolder.hasNext()) {
          var destinationFolder = targetFolder.next();
          Logger.log("Moving file: " + file.getName() + " to folder: " + targetFolderName);
          file.moveTo(destinationFolder);
        } else {
          Logger.log("Folder not found: " + targetFolderName);
        }
        break;  // Stop checking other keywords for this file
      }
    }
  }

  // Process subfolders recursively
  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var subfolder = subfolders.next();
    moveFilesInFolderAndSubfoldersWithWildcards(subfolder, subjectWiseFolder, folderMappings);
  }
}
