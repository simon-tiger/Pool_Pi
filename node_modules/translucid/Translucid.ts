const express = require('express');
const path = require('path');
import {read} from "./read";

const dir = path.dirname(require.main.filename);

interface Middleware{
    name:string;
    keys:Array<string>;
    run:Function;
}

function containsAny(array:Array<string>, keys:Array<string>):boolean{
    for (let i = 0; i < keys.length; i++) {
        if (array.indexOf(keys[i]) != -1)
            return true;
    }
    return false;
}
class Translucid {
    middleware:Array<Middleware> = [];

    constructor(public app) {}
    use(obj:Middleware):void{
        this.middleware.push(obj);
    }
    public(path:string = ""):void{
        this.app.use(`/${path}`, express.static(`${__dirname}/../../${path}`));
    }
    async bindJSON(path:string):Promise<void>{
        const json = await read(path);
        const object = JSON.parse(json);

        for (let i in object){
            const classes = object[i].classes || [];
            let sendFiles = object[i].sendFiles;
            if (sendFiles != false) sendFiles = true;
            this.bind(i,object[i].file,classes,sendFiles);
        }
    }
    bind(path:string = "/", filepath:string = "", classes:Array<string> = [],sendFiles:boolean=true):void{
        this.app.get(path, async (req, res)=> {
            const readResults = await read(filepath);
            const toRun:Array<Function> = [];

            for (let i of this.middleware){
                if (containsAny(classes, i.keys)) {
                    toRun.push(i.run);
                }
            }

            const decorated:Array<Function> = [];
            const expressArgs = [req, res];

            for (let i = 0; i < toRun.length; i++) {
                decorated.push((prev:any=(!sendFiles)?readResults:`${dir}/${filepath}`):void => {
                    toRun[i](prev, ...expressArgs, decorated[i + 1]);
                });
            }
            decorated.push((prev:any):void => {
                if (!sendFiles)
                    res.send(prev);
                else
                    res.sendFile(prev);
            });

            decorated[0]((!sendFiles)?readResults:`${dir}/${filepath}`);
        });
    }
}
export {Translucid};
