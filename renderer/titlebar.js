const customTitlebar = require('custom-electron-titlebar');
const template = require("../app/shell/menu")
//runs in render
const { Menu } = require("electron").remote;

new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#06c'),
    icon: 'assets/icons/favicon.ico',
    menu: Menu.buildFromTemplate(template)
});