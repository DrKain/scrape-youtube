/**
 * This is used to dump search information to a file. This is not used by default
 */
export declare class DebugDumper {
    enabled: boolean;
    private dir;
    constructor();
    /**
     * Set the directory to dump debug files into. You can zip this directory and include it
     * in your GitHub issue.
     * @param dir Any existing directory
     */
    setDirectory(dir: string): void;
    /**
     * Dump some information to the debug dump directory.
     * @param id ID of the data dump
     * @param key Type of data being dumped
     * @param _data Raw data to write
     */
    dump(id: string, key: string, _data: any): void;
}
