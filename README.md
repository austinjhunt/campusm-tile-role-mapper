# MyPortal Tile Role Mapper 

This is a simple project that allows one to easily build a JSON map of the tiles and their associated roles in the [CampusM App Builder](https://appmanager-na.campusm.exlibrisgroup.com/app-builder#) (inside App Manager). It also pulls in the metadata tag for each tile, whose value is used to indicate whether the tile is available on mobile, desktop, or both. If it's both, the tag contains both `mobile` and `desktop`. 

## How to Use It
1. Copy the Javascript from [role-mapper.js](role-mapper.js). 
2. Open the [CampusM App Builder](https://appmanager-na.campusm.exlibrisgroup.com/app-builder#)
3. Open the dev tools in your browser. 
4. Open the Console tab in your dev tools. 
5. Paste the copied JS into the console.
6. Run it. 
7. When it finishes executing, copy the created map to your clipboard with 
``` 
copy(roles_map);
```
8. Paste the copied JSON object into a JSON file in this project, or wherever you want the map to be stored. 