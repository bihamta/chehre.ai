
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
        conditional_function: () => {
            const one = nextTwoVideos.videos.length === 1;
            if (one) console.log("One video selected");
            return one;        // ← return the boolean!
        }
        },
        {
        timeline: [ selecting_videos ],
        conditional_function: () => {
            const two = nextTwoVideos.videos.length > 1;
            if (two) console.log("Two videos selected");
            return two;       // ← return the boolean!
        }
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
