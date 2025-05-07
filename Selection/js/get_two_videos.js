import { fetchTwoVideos } from "./utils.js";

const get_two_videos = {
    type: jsPsychCallFunction,
    async: true,
    func: (done) => fetchTwoVideos(done)
};

console.log("get_two_videos.js loaded");
export { get_two_videos };