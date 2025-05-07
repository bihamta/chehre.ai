import { fetchNextVideo } from './utils.js';


const get_next_video = {
    type : jsPsychCallFunction,
    version: "1.0",
    data: { task: "get_video" },
    async: true,
    func : (done) => fetchNextVideo(done)
};

console.log("get_next_video.js loaded");
export { get_next_video };

