# Backup and Restore

This document will show you how to backup and restore user data and game data from
firebase.

## Backup

Creating a backup will allow you to backup firestore and cloud storage data. You may choose which collections and documents to backup. The data will be downloaded as a zip file.

1. Open up my-app.
2. Login as an admin.
3. Select Backup from the navbar.
4. Click on the Backup button.
5. Click on the Download backup file button.

## Restore

Restore a backup from a previously downloaded zip file. You can then choose which collection and documents to restore. The selected files will either be added to firestore and cloud storage if it does not yet exist. Or it will replace the existing data.

1. Open up my-app.
2. Login as an admin.
3. Select Backup from the navbar.
4. Click on the Restore button.
5. Click on choose file and select the backup zip file you want to restore.
6. Click on Restore to firebase.