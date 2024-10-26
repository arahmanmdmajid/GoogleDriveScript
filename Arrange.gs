function moveFilesBasedOnWildcardKeywords() {
  var folderId = "YOUR_PRIMARY_FOLDER_ID";  // ID for Recording Folder
  var folder = DriveApp.getFolderById(folderId);
  
  // Define the "Subject Wise" folder
  var subjectWiseFolder = folder.getFoldersByName("Subject Wise").next();
  
  // Define mappings of keywords to target folders (with wildcards in mind)
  var folderMappings = {
    "jami": "Sharah Jami",
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
