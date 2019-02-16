"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const http = require('http');
const Translucid_1 = require("./Translucid.js");
function QuickServer(port) {
    const app = express();
    const server = http.Server(app);
    const translucid = new Translucid_1.Translucid(app);
    return {
        express, app, http, server, translucid,
        connect: new Promise((resolve, reject) => {
            server.listen(port, () => {
                resolve("Connected");
            });
        })
    };
}
exports.QuickServer = QuickServer;
