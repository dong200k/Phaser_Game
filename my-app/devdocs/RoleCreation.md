# Role/Character Creation

This document will explain how to add a new role/character to the game. At the moment it is intended for the developers. 

Note: Editing an existing role is done in a similar fashion except that step 3 is not done.

## 
1. Open the my-app tool and login to admin account.

2. Click on Roles in the navigation bar at the top.

3. Click on the create a new role button on the top left. This will create a empty role titled "role-name" on the same page. Click on the edit button next to the created role to start editing.

4. Give your role a name, description, and coin cost. Ignore the display sprite and the spriteKeys for now. 

5. Now select a weapon that this role uses by default with the weapon upgrade drop down button. If this is empty the bow is used by default.

6. Next select an ability through a similar fashion with the ability dropdown button. If this is empty the ranger's ability is used by default.

7. Now we will choose starting stats for our character. Keep in mind that the stat tree and weapon are also another stat source outside of this. Click on the Show Zero checkbox to show all the stats. Fill in the stats as you see fit.

8. Finally click on the save button and run npm move-db in the terminal inside the my-app folder directory and everything should be synced.



