// ## Import all the modules 
import { welcome } from './welcome.js';
import { consent } from './consent.js';
import { goodbye, honesty } from './thanks.js';
import { questionnaire_intro, label_intro, emoji_intro, demographic_intro, empathy_intro, final } from './landing.js';
import { empathy } from './HSP.js';
import { loadEmojiLabels } from './label_loader.js';
import { dynamic_slider } from './lable_sliders.js';
import { down } from './down.js';
import { demog } from './demographics.js';
import { medi } from './mindfulness.js';
import { get_next_video_for_labels, get_next_video_for_emojis }   from './get_next_video.js';
import { emoji_slider } from './emoji_slider.js';
// ## Build the timeline
// console.log("Call function plugin:", typeof jsPsychHtmlButtonResponse);

const timeline = [];
await loadEmojiLabels();

if (!localStorage.getItem("emojiRatingsDone")) {
    localStorage.setItem("emojiRatingsDone", "0");
}

if (!localStorage.getItem("labelRatingsDone")) {
    localStorage.setItem("labelRatingsDone", "0");
}

timeline.push(welcome);

const hasConsented = localStorage.getItem("hasConsented");
if (!hasConsented) { 
    timeline.push(consent);
}

const hasMedi = localStorage.getItem("hasMedi");
if (!hasMedi) {
    timeline.push(questionnaire_intro);
    timeline.push(medi);
}

const hasDemog = localStorage.getItem("hasDemog");
if (!hasDemog) {
    timeline.push(demographic_intro);
    timeline.push(demog);
}

let rated_labels = localStorage.getItem("labelRatingsDone");
console.log("Label ratings completed:", rated_labels);
const N_REPEATS_LABELS = 30;
if (rated_labels !== N_REPEATS_LABELS) {
    timeline.push(label_intro);
}
const N_REPEATS_LABELS_TODO = N_REPEATS_LABELS - rated_labels;
for (let i = 0; i < N_REPEATS_LABELS_TODO; i++) {
    timeline.push(get_next_video_for_labels);
    timeline.push(dynamic_slider);
}

let rated_emojis = localStorage.getItem("emojiRatingsDone");
console.log("Emoji ratings completed:", rated_emojis);
const N_REPEATS_EMOJI = 20;
if (rated_emojis !== N_REPEATS_EMOJI) {
    timeline.push(emoji_intro);
}
let N_REPEATS_EMOJI_TODO = N_REPEATS_EMOJI - rated_emojis;
for (let i = 0; i < N_REPEATS_EMOJI_TODO; i++) {
    timeline.push(get_next_video_for_emojis);
    timeline.push(emoji_slider);
}


;
timeline.push(empathy_intro);
timeline.push(empathy);
timeline.push(final)
timeline.push(honesty);
timeline.push(goodbye);

// ## Start the experiment
jsPsych.run(timeline);
