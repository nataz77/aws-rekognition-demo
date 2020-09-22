var remote = require('electron').remote;
var fs = remote.require('fs');

remote.dialog.showOpenDialog(remote.getCurrentWindow(),
    {
        filters: [
            { name: 'Images', extensions: ['png'] }
        ]
    },
    function (filepaths, bookmarks) {
        var _img = fs.readFileSync(filepaths[0]).toString('base64');
        var _out = '<img src="data:image/png;base64,' + _img + '" />';
        var _target = document.getElementById('image_container');
        _target.insertAdjacentHTML('beforeend', _out);
        return;
    }
);