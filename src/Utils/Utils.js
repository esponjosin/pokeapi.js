const { writeFileSync, lstatSync, readFileSync, readdirSync } = require('fs'),
    { resolve } = require('path');

class Utils {

    upperFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    formatName(str) {
        return str.split(' ').join('')
        .split('-').join('')
        .split('_').join('')
        .toLowerCase()
    }

    createCache(name, id, cacheDir, buffer) {

        let self = this;
        
        let mPath = resolve(cacheDir, `./${self.formatName(name)}.${id}.cache`)
            
        try {
            writeFileSync(mPath, buffer)
            return true
        } catch(e) {
            return false
        }

    }

    findCache(name, dir) {

        let self = this;

        let files = readdirSync(dir)
        .filter(x => self.isFile(resolve(dir, `./${x}`)))

        return files.some(file => isNaN(name) ? file.startsWith(self.formatName(name)) 
        : file.split('.')[1].length == String(name).length && file.split('.')[1] == name)

    }

    getCache(name, dir) {

        let self = this;

        let files = readdirSync(dir)
        .filter(x => self.isFile(resolve(dir, `./${x}`)))

        let file = files[files.findIndex(file => isNaN(name) ? file.startsWith(self.formatName(name)) : 
            file.split('.')[1].length == String(name).length && file.split('.')[1] == name)]

        dir = resolve(dir, `./${file}`)

        return JSON.parse(readFileSync(dir, 'utf-8'))

    }

    checkDir(path) {
        return lstatSync(path).isDirectory()
    }

    isFile(path) {
        return lstatSync(path).isFile()
    }

    wait(ms) {
        return new Promise((resolve, reject) => setTimeout(resolve, ms))
    }

}

module.exports = Utils;