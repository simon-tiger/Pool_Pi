"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const path = require('path');
const read_1 = require("./read");
const dir = path.dirname(require.main.filename);
function containsAny(array, keys) {
    for (let i = 0; i < keys.length; i++) {
        if (array.indexOf(keys[i]) != -1)
            return true;
    }
    return false;
}
class Translucid {
    constructor(app) {
        this.app = app;
        this.middleware = [];
    }
    use(obj) {
        this.middleware.push(obj);
    }
    public(path = "") {
        this.app.use(`/${path}`, express.static(`${__dirname}/../../${path}`));
    }
    async bindJSON(path) {
        const json = await read_1.read(path);
        const object = JSON.parse(json);
        for (let i in object) {
            const classes = object[i].classes || [];
            let sendFiles = object[i].sendFiles;
            if (sendFiles != false)
                sendFiles = true;
            this.bind(i, object[i].file, classes, sendFiles);
        }
    }
    bind(path = "/", filepath = "", classes = [], sendFiles = true) {
        this.app.get(path, async (req, res) => {
            const readResults = await read_1.read(filepath);
            const toRun = [];
            for (let i of this.middleware) {
                if (containsAny(classes, i.keys)) {
                    toRun.push(i.run);
                }
            }
            const decorated = [];
            const expressArgs = [req, res];
            for (let i = 0; i < toRun.length; i++) {
                decorated.push((prev = (!sendFiles) ? readResults : `${dir}/${filepath}`) => {
                    toRun[i](prev, ...expressArgs, decorated[i + 1]);
                });
            }
            decorated.push((prev) => {
                if (!sendFiles)
                    res.send(prev);
                else
                    res.sendFile(prev);
            });
            decorated[0]((!sendFiles) ? readResults : `${dir}/${filepath}`);
        });
    }
}
exports.Translucid = Translucid;
