import { passwordLoop } from './letmein.js';
import { selecting_videos } from './selecting_videos.js';
import { goodbye } from './thankyou.js';
import { nextTwoVideos, fetchTwoVideos } from './utils.js';
import { selecting_one_video } from './selecting_one_video.js';

jsPsych.run([passwordLoop]);  // Start with password check

// Then begin the loop
const runNext = async () => {
    await new Promise(resolve => fetchTwoVideos(resolve));
    const vids = nextTwoVideos.videos || [];

    if (vids.length === 0) {
        jsPsych.run([goodbye]);
        return;
    }

    const trial = vids.length === 1 ? selecting_one_video : selecting_videos;

    jsPsych.run([{
        timeline: [trial],
        on_finish: runNext  // After each rating, loop again
    }]);
};

runNext();
