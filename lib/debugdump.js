"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
/**
 * This is used to dump search information to a file. This is not used by default
 */
var DebugDumper = /** @class */ (function () {
    function DebugDumper() {
        this.enabled = false;
        this.dir = '';
    }
    /**
     * Set the directory to dump debug files into. You can zip this directory and include it
     * in your GitHub issue.
     * @param dir Any existing directory
     */
    DebugDumper.prototype.setDirectory = function (dir) {
        if (!fs_1.existsSync(dir)) {
            throw Error('[Debugger] Dump directory does not exist. Please create it');
        }
        this.dir = dir;
    };
    /**
     * Dump some information to the debug dump directory.
     * @param id ID of the data dump
     * @param key Type of data being dumped
     * @param _data Raw data to write
     */
    DebugDumper.prototype.dump = function (id, key, _data) {
        if (!this.enabled)
            return;
        if (this.dir === '') {
            throw Error('[Debugger] Directory not set. Use youtube.debugger.setDirectory()');
        }
        var file = null;
        var data = null;
        switch (key) {
            case 'opts':
                file = path_1.join(this.dir, id + '-opts.json');
                data = JSON.stringify(_data, null, 2);
                break;
            case 'page':
                file = path_1.join(this.dir, id + '-page.html');
                data = _data;
                break;
            case 'vids':
                file = path_1.join(this.dir, id + '-vids.json');
                data = JSON.stringify(_data, null, 2);
                break;
        }
        if (file && data) {
            fs_1.writeFileSync(file, data);
            console.log("[Debugger] Wrote data to " + file);
        }
        else
            console.log('[Debugger] Failed to prepare file or data');
    };
    return DebugDumper;
}());
exports.DebugDumper = DebugDumper;
