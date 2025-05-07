import { passwordLoop } from './letmein.js';
import { selecting_videos } from './selecting_videos.js';
import { goodbye } from './thankyou.js';
import { nextTwoVideos, fetchTwoVideos } from './utils.js';
import { selecting_one_video } from './selecting_one_video.js';

const timeline = [];
timeline.push(passwordLoop);
(async () => {
        await new Promise(resolve => fetchTwoVideos(resolve));
        console.log(nextTwoVideos.videos);

        if (!nextTwoVideos.videos || nextTwoVideos.videos.length === 0) {
            console.log("No videos available");
            timeline.push(goodbye);
        } else if (nextTwoVideos.videos.length === 1) {
            console.log("Only one video available");
            timeline.push(selecting_one_video);
        } else {
            console.log("Two videos available");
            timeline.push(selecting_videos);
        }

        // timeline.push(passwordLoop);
        jsPsych.run(timeline);
    })();

