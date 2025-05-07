// ## Import all the modules 
import { welcome } from './welcome.js';
import { consent } from './consent.js';
import { goodbye, honesty } from './thanks.js';
import { thank } from './landing.js';
import { down } from './down.js';
import { get_next_video }   from './get_next_video.js';
import { compare_two_videos } from './compare_two_videos.js';
import { emoji_single_slider } from './emoji_single_slider.js';
import { label_single_slider } from './label_single_slider.js'
import { emoji_double_slider } from './emoji_double_slider.js';
import { label_double_slider } from './label_double_slider.js';
import { rank_two_emojis } from './rank_two_emojis.js';
import { rank_two_labels } from './rank_two_labels.js';
// ## Build the timeline
// console.log("Call function plugin:", typeof jsPsychHtmlButtonResponse);

const timeline = [];
timeline.push(down);
// timeline.push(rank_two_labels);
// timeline.push(rank_two_emojis);
timeline.push(compare_two_videos);
// timeline.push(label_double_slider);
timeline.push(emoji_double_slider);
// timeline.push(emoji_single_slider);
// timeline.push(get_next_video);
// timeline.push(label_single_slider);
// ## Welcome page
timeline.push(welcome);

// timeline.push(consent);
// ## Consent page
const hasConsented = localStorage.getItem("hasConsented") === "true"; // Check if user has consented
if (!hasConsented) {
    timeline.push(consent);
}

timeline.push(thank);

// ## Honest feedback
timeline.push(honesty);
timeline.push(goodbye);

// ## Start the experiment
jsPsych.run(timeline);
