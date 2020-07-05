// @ts-ignore
const fs = require("fs");
import youtube from "scrape-youtube";
const argv = require("yargs").argv;
const { mkdir, rmdir, rm, touch, read, write } = require("./functions");

/**
 * Usage
 * yarn ts-node examples/search-and-create.ts --search='js'
 */
console.log("🚀🚀🚀🚀🚀🚀 argv._[0]");
console.log(argv);
console.log(argv.search);
console.log("----------------------------------------------------");
console.log();
const file = `./examples/${argv.search}.txt`;
touch(file);
// Quick search for a single video. Good for discord bots.
// Returns `null` if no video is found.
youtube
  .search(argv.search)
  .then((videos) => {
    console.log("🚀🚀🚀🚀🚀🚀 videos.length");
    console.log(videos.length);
    console.log("----------------------------------------------------");
    console.log();
    /**
     * DONE create file with search term like js.txt
     * DONE  take searchTerm from terminal like  `npm run test -search searchTerm` using argv package
     * TODO
     * TODO
     * TODO
     */
    // console.log(playlists[0]);
    var vids = "";
    videos.forEach((video) => {
      console.log(video.link);
      //   vids += video.link;
      vids = vids + "\n" + video.link;
    });
    //   const file = "./result.txt";
    console.log("🚀🚀🚀🚀🚀🚀 vids");
    console.log(vids);
    console.log("----------------------------------------------------");
    console.log();
    write(file, vids);
  })
  .catch(console.error);
// or async:
// const video = await youtube.searchOne('Short Change Hero');
