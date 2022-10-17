/* Copy this into the dev tools console in the App Builder to generate a map showing 
which tiles are associated with which roles 
*/
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CampusmConfigManager {
  getProfilesAndRoles = async (m, name) => {
    m["tiles"][name]["profiles"] = {};
    document
      .querySelectorAll(".role-selector-profile")
      .forEach((profileElem, i) => {
        let profileLabel = profileElem.querySelector("h3").textContent;
        let checkedRoles = profileElem.querySelectorAll(
          "input[type=checkbox]:checked"
        );
        let rolesList = [];
        checkedRoles.forEach((roleElem, j) => {
          rolesList.push(roleElem.parentNode.textContent);
        });
        // only include profiles with checked roles
        if (rolesList.length > 0) {
          m["tiles"][name]["profiles"][profileLabel] = { roles: rolesList };
        }
      });
  };

  openProfilesRolesViewForActiveMenuItem = async () => {
    try {
      // open the view of profiles & roles for this menu item
      Array.from(document.querySelectorAll("div.form-row.data-widget-field"))
        .filter((el, i) => el.textContent.includes("Roles"))[0]
        .querySelector("a.roles-widget")
        .click();
    } catch (error) {
      /* do nothing */
    }
    await sleep(200);
  };

  buildTilesList = async (m) => {
    let tiles = document.querySelectorAll("li[data-menu-item-id]");
    tiles.forEach(async (elem, i) => {
      let id = elem.dataset.menuItemId;
      let name = elem.querySelector("a").textContent;
      m["tiles"][name] = {};
      await sleep(200);
    });
    return tiles;
  };

  openTileMenu = async (elem) => {
    try {
      $(elem).click();
    } catch (error) {
      /* do nothing */
    }
  };

  getTileTagProperty = async (name, m) => {
    m["tiles"][name]["tag"] = document.getElementById("id_metadata_tag").value;
  };

  getTileConfigProperty = async (name, m) => {
    let tileConfigSection = document.querySelectorAll("div.editor-field")[7];
    // show raw json tile config
    tileConfigSection.querySelector(".raw-button").click();
    // don't hide/re-click JSOn view until its value is applied
    await this.getJSONConfigWithJSONView(
      m,
      name,
      "tileConfig",
      tileConfigSection
    );
    // toggle back to normal view
    tileConfigSection.querySelector(".raw-button").click();
  };

  getJSONConfigWithJSONView = async (m, name, key, configSection) => {
    let jsonConfigString = JSON.parse(
      configSection.querySelector("textarea").value
    );
    m["tiles"][name][key] = jsonConfigString;
  };

  getMenuOptionConfigProperty = async (name, m) => {
    let menuOptionConfigSection =
      document.querySelectorAll("div.editor-field")[6];
    // show raw json menu option config
    menuOptionConfigSection.querySelector(".raw-button").click();
    // don't hide/re-click JSOn view until its value is applied
    await this.getJSONConfigWithJSONView(
      m,
      name,
      "menuOptionConfig",
      menuOptionConfigSection
    );
    menuOptionConfigSection.querySelector(".raw-button").click();
  };

  openPanel = async (index) => {
    document
      .querySelectorAll("#appBuilderEditor .panel")
      [index].querySelector("h3")
      .click();
    await sleep(200);
  };

  getJsonFromSection = async (section) => {
    section.querySelector(".raw-button").click();
    let json = JSON.parse(section.querySelector("textarea").value);
    section.querySelector(".raw-button").click();
    return json;
  };

  getPanelConfig = async (m, panelIndex, panelName, profileName) => {
    m[panelName] = {};
    await this.openPanel(panelIndex);
    let panel = document.querySelectorAll("#appBuilderEditor .panel")[
      panelIndex
    ];
    let configSection = panel.querySelectorAll(".editor-field")[0];
    let configSectionJson = await this.getJsonFromSection(configSection);
    let tileStyleSection = panel.querySelectorAll(".editor-field")[1];
    let tileStyleSectionJson = await this.getJsonFromSection(tileStyleSection);
    let iOSConfigSection = panel.querySelectorAll(".editor-field")[2];
    let iOSConfigSectionJson = await this.getJsonFromSection(iOSConfigSection);

    if (profileName !== undefined) {
      m[panelName][profileName] = {};
      m[panelName][profileName]["config"] = configSectionJson;
      m[panelName][profileName]["tileStyle"] = tileStyleSectionJson;
      m[panelName][profileName]["iOSConfig"] = iOSConfigSectionJson;
    } else {
      m[panelName]["config"] = configSectionJson;
      m[panelName]["tileStyle"] = tileStyleSectionJson;
      m[panelName]["iOSConfig"] = iOSConfigSectionJson;
    }
  };

  chooseProfile = async (profile) => {
    profile.querySelector("input").click();
    await sleep(2000);
  };
  // getter
  get config() {
    return (async () => {
      let m = {};
      let tiles = await this.buildTilesList(m);
      // store the app config.
      await this.getPanelConfig(m, 0, "appConfig");

      // for each profile, store the profile config.
      document
        .querySelectorAll(".profile-selector .custom-select-option")
        .forEach(async (profileChoice, i) => {
          await this.chooseProfile(profileChoice);
          let profileName =
            profileChoice.querySelector("input").nextSibling.textContent;
          await this.getPanelConfig(m, 1, "profileConfig", profileName);
        });
      // get config for each tile / menu item
      m["tiles"] = {};
      for (var index = 0; index < tiles.length; index++) {
        let elem = tiles[index];
        var id = $(elem).attr("data-menu-item-id");
        var name = $(elem).find("a").text();
        m["tiles"][name] = {};
        await this.openTileMenu(elem);
        await sleep(200);
        await this.getTileTagProperty(name, m);
        await this.getTileConfigProperty(name, m);
        await this.getMenuOptionConfigProperty(name, m);
        // now get roles and profiles for tile
        await this.openProfilesRolesViewForActiveMenuItem();
        await this.getProfilesAndRoles(m, name);
      }
      return m;
    })();
  }
}

let configManager = new CampusmConfigManager();
let config = await configManager.config;
