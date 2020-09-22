const fs = require('fs');
const { dialog } = require("electron").remote;
const { swal } = require("sweetalert");
const template = [
    {
        label: "File",
        submenu: [
        {
            role: "import",
            label: "Apri foto...",
            click: () => actions.import()
        },
        {
            role: "close",
            label: "Chiudi"
        }]
    },
    {
        label: 'Modifica',
        submenu: [
            { role: 'cut', label: "Taglia" },
            { role: 'copy', label: "Copia" },
            { role: 'paste', label: "Incolla" },
            { role: 'pasteandmatchstyle', label: "Incolla e mantieni stile" },
            { role: 'delete', label: "Elimina" },
            { role: 'selectall', label: "Seleziona tutto" }
        ]
    },
    {
        label: 'DevTools',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ],
        enabled: process.env.NODE_ENV === 'development'
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { require('electron').shell.openExternal('https://www.almaviva.it') }
            }
        ]
    }
]
module.exports = template;

const actions = {
    save(obj) {
        dialog.showSaveDialog({}, function (filename) {
            fs.writeFile(filename, JSON.stringify({ a: "a", b: "b" }), 'utf8', function () {
                swal("File salvato")
            });
        })

    },
    import() {
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: "JSON files", extensions: "*.json" }]
        }, function (file) {
            if (file !== undefined) {
                fs.open(file, (survey) => {
                    JSON.parse(survey)
                    swal('File importato correttamente')
                })
            }
        });
    },
    openImage(){
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: "JSON files", extensions: "*.json" }]
        }, function (file) {
            if (file !== undefined) {
                fs.open(file, (survey) => {
                    JSON.parse(survey)
                    swal('File importato correttamente')
                })
            }
        });
    }
}
