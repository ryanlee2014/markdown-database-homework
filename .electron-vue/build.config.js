const path = require('path')
const rebuild = require('electron-rebuild');
/**
 * `electron-packager` options
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-packager.html
 */
module.exports = {
    arch: 'x64',
    asar: true,
    dir: path.join(__dirname, '../'),
    icon: path.join(__dirname, '../build/icons/icon'),
    ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web))|\.gitkeep/,
    out: path.join(__dirname, '../build'),
    overwrite: true,
    platform: process.env.BUILD_TARGET || 'all',
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
        rebuild.rebuild({buildPath, electronVersion, arch})
            .then(() => callback())
            .catch((error) => callback(error));
    }],
}
