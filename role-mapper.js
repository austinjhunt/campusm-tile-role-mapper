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
        var student_roles = $($('.role-selector-profile')[0]).find('input[type=checkbox]:checked');
        var fac_adv_staff_admin_roles = $($('.role-selector-profile')[1]).find('input[type=checkbox]:checked'); 
        var alumni_roles = $($('.role-selector-profile')[2]).find('input[type=checkbox]:checked');
        var retiree_roles = $($('.role-selector-profile')[3]).find('input[type=checkbox]:checked');
        var guest_roles = $($('.role-selector-profile')[4]).find('input[type=checkbox]:checked');  
        m[name]['Tag'] = metadata_tag;
        m[name]['Student'] = [];
        m[name]['Faculty, Advisors, Staff & Administration'] = [];
        m[name]['Alumni'] = [];
        m[name]['Retiree'] = [];
        m[name]['Guest'] = [];

        for (var j = 0; j < student_roles.length; j ++){
            var role = student_roles[j];
            var roleName = $(role).parent().text(); 
            m[name]['Student'].push(roleName); 
        }
        for (var j = 0; j < fac_adv_staff_admin_roles.length; j ++){
            var role = fac_adv_staff_admin_roles[j];
            var roleName = $(role).parent().text(); 
            m[name]['Faculty, Advisors, Staff & Administration'].push(roleName); 
        }
        for (var j = 0; j < alumni_roles.length; j ++){
            var role = alumni_roles[j];
            var roleName = $(role).parent().text(); 
            m[name]['Alumni'].push(roleName); 
        }
        for (var j = 0; j < retiree_roles.length; j ++){
            var role = retiree_roles[j];
            var roleName = $(role).parent().text(); 
            m[name]['Retiree'].push(roleName); 
        }
        for (var j = 0; j < guest_roles.length; j ++){
            var role = guest_roles[j];
            var roleName = $(role).parent().text(); 
            m[name]['Guest'].push(roleName); 
        }
        ['Student', 'Faculty, Advisors, Staff & Administration', 'Alumni', 'Retiree', 'Guest'].forEach(el => { 
            if (m[name][el].length == 0){
                delete m[name][el];
            } 
        });
    }       
return m;
} 
roles_map = await rolemap();
 