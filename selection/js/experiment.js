
import { passwordLoop }           from './letmein.js';
import { selecting_videos }       from './selecting_videos.js';
import { selecting_one_video }    from './selecting_one_video.js';
import { goodbye }                from './thankyou.js';
import { nextTwoVideos, fetchTwoVideos } from './utils.js';

const fetchVideos = {
    type: jsPsychCallFunction,
    async: true,
    func: (done) => fetchTwoVideos(done)
};

const chooseVideoTrial = {
    timeline: [
        {
        timeline: [ selecting_one_video ],
        conditional_function: () => nextTwoVideos.videos.length === 1
        },
        {
        timeline: [ selecting_videos ],
        conditional_function: () => nextTwoVideos.videos.length > 1
        }
    ]
};

const videoLoop = {
    timeline: [ fetchVideos, chooseVideoTrial ],
    loop_function: () => {
        return (nextTwoVideos.videos || []).length > 0;
    }
};

jsPsych.run([
  passwordLoop,  // stays on password until correct
  videoLoop,     // repeats fetch→trial until empty
  goodbye        // once empty, show thank you
]);
