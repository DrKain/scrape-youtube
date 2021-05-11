import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * This is used to dump search information to a file. This is not used by default
 */
export class DebugDumper {
    public enabled = false;
    private dir = '';

    constructor() {}

    /**
     * Set the directory to dump debug files into. You can zip this directory and include it
     * in your GitHub issue.
     * @param dir Any existing directory
     */
    public setDirectory(dir: string) {
        if (!existsSync(dir)) {
            throw Error('[Debugger] Dump directory does not exist. Please create it');
        }
        this.dir = dir;
    }

    /**
     * Dump some information to the debug dump directory.
     * @param id ID of the data dump
     * @param key Type of data being dumped
     * @param _data Raw data to write
     */
    public dump(id: string, key: string, _data: any) {
        if (!this.enabled) return;

        if (this.dir === '') {
            throw Error('[Debugger] Directory not set. Use youtube.debugger.setDirectory()');
        }

        let file = null;
        let data = null;

        switch (key) {
            case 'opts':
                file = join(this.dir, id + '-opts.json');
                data = JSON.stringify(_data, null, 2);
                break;
            case 'page':
                file = join(this.dir, id + '-page.html');
                data = _data;
                break;
            case 'vids':
                file = join(this.dir, id + '-vids.json');
                data = JSON.stringify(_data, null, 2);
                break;
        }

        if (file && data) {
            writeFileSync(file, data);
            console.log(`[Debugger] Wrote data to ${file}`);
        } else console.log('[Debugger] Failed to prepare file or data');
    }
}
