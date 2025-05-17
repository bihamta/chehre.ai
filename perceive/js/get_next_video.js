import { fetchNextVideoForLabels, fetchNextVideoForEmojis } from './utils.js';


const get_next_video_for_labels = {
    type : jsPsychCallFunction,
    version: "1.0",
    data: { task: "get_video" },
    async: true,
    func : (done) => fetchNextVideoForLabels(done)
};

const get_next_video_for_emojis = {
    type : jsPsychCallFunction,
    version: "1.0",
    data: { task: "get_video" },
    async: true,
    func : (done) => fetchNextVideoForEmojis(done)
};

console.log("get_next_video.js loaded");
export { get_next_video_for_labels, get_next_video_for_emojis };

