/* Copy this into the dev tools console in the App Builder to generate a map showing 
which tiles are associated with which roles 
*/ 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
async function rolemap(){
    var m = {};
    var tiles = $('li[data-menu-item-id]'); 
    for (var index = 0 ; index < tiles.length; index ++){ 
        elem = tiles[index]; 
        var id = $(elem).attr('data-menu-item-id');
        var name = $(elem).find('a').text(); 
        m[name] = {}
       try{  $(elem).click(); } catch(error){/* do nothing */ }
          await sleep(200);
        var rolesdiv = $("div.form-row.data-widget-field:contains('Roles')"); 
        var metadata_tag = $("#id_metadata_tag").val();
        try{  $(rolesdiv).find('a.roles-widget')[0].click(); } catch(error){/* do nothing */ }
        await sleep(200); 
        var authenticated_roles = $($('.role-selector-profile')[0]).find('input[type=checkbox]:checked');
        var unauthenticated_roles = $($('.role-selector-profile')[1]).find('input[type=checkbox]:checked');
        m[name]['Tag'] = metadata_tag;
        m[name]['Authenticated'] = [];
        m[name]['Unauthenticated'] = [];
        for (var j = 0; j < authenticated_roles.length; j ++){
            var role = authenticated_roles[j];
            var roleName = $(role).parent().text(); 
            m[name]['Authenticated'].push(roleName); 
        }
        for (var j = 0; j < unauthenticated_roles.length; j ++){
            var role = unauthenticated_roles[j];
            var roleName = $(role).parent().text(); 
            m[name]['Unauthenticated'].push(roleName); 
        }
        if (m[name]['Authenticated'].length == 0){
            delete m[name]['Authenticated'];
        } 
        if (m[name]['Unauthenticated'].length == 0){
            delete m[name]['Unauthenticated'];
        }
    }       
return m;
} 
roles_map = await rolemap();
 