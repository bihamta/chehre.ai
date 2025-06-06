// Record study start time
const studyStartTime = Date.now();
localStorage.setItem("studyStartTime", studyStartTime.toString());

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
import { get_next_video_for_labels, get_next_video_for_emojis } from './get_next_video.js';
import { emoji_slider } from './emoji_slider.js';

// ## Build the timeline
const timeline = [];
await loadEmojiLabels();

// timeline.push(down);
if (!localStorage.getItem("emojiRatingsDone")) {
    localStorage.setItem("emojiRatingsDone", "0");
}

if (!localStorage.getItem("labelRatingsDone")) {
    localStorage.setItem("labelRatingsDone", "0");
}

//------- Welcome and Consent -------//
timeline.push(welcome);

const hasConsented = localStorage.getItem("hasConsented");
if (!hasConsented) {
    timeline.push(consent);
}

//------- Meditation Questionnaire -------//
const hasMedi = localStorage.getItem("hasMedi");
if (!hasMedi) {
    timeline.push(questionnaire_intro);
    timeline.push(medi);
}

//------- Demographic questions -------//
const hasDemog = localStorage.getItem("hasDemog");
if (!hasDemog) {
    timeline.push(demographic_intro);
    timeline.push(demog);
}

// //------- Label Ratings -------//
let rated_labels = localStorage.getItem("labelRatingsDone");
console.log("Label ratings completed:", rated_labels);
const N_REPEATS_LABELS = 35;
if (rated_labels !== N_REPEATS_LABELS) {
    timeline.push(label_intro);
}
const N_REPEATS_LABELS_TODO = N_REPEATS_LABELS - rated_labels;
for (let i = 0; i < N_REPEATS_LABELS_TODO; i++) {
    timeline.push(get_next_video_for_labels);
    timeline.push(dynamic_slider);
}

//------- Emoji Ratings -------//
let rated_emojis = localStorage.getItem("emojiRatingsDone");
console.log("Emoji ratings completed:", rated_emojis);
const N_REPEATS_EMOJI = 35;
if (rated_emojis !== N_REPEATS_EMOJI) {
    timeline.push(emoji_intro);
}
let N_REPEATS_EMOJI_TODO = N_REPEATS_EMOJI - rated_emojis;
for (let i = 0; i < N_REPEATS_EMOJI_TODO; i++) {
    timeline.push(get_next_video_for_emojis);
    timeline.push(emoji_slider);
}

//------- Final Steps -------//
timeline.push(empathy_intro);
timeline.push(empathy);
timeline.push(final);
timeline.push(honesty);

// Enhanced goodbye with time tracking
const enhancedGoodbye = {
    ...goodbye,
    on_load: function() {
        // Call original on_load if it exists
        if (goodbye.on_load) {
            goodbye.on_load.call(this);
        }
        
        // Calculate and send study duration
        const startTime = parseInt(localStorage.getItem("studyStartTime"));
        const endTime = Date.now();
        const totalDurationMs = endTime - startTime;
        const totalDurationMinutes = Math.round(totalDurationMs / (1000 * 60) * 100) / 100;
        
        console.log(`Study completed in ${totalDurationMinutes} minutes`);
        
        // Send time data to server
        const timePayload = {
            participantId: window.participantId,
            totalDurationMinutes: totalDurationMinutes
        };
        
        fetch("https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/SaveSurveyResponse_phase2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(timePayload)
        })
        .then(r => r.json())
        .then(serverResp => {
            console.log("Study time saved successfully:", serverResp);
        })
        .catch(err => {
            console.error("Error saving study time:", err);
        });
    }
};

timeline.push(enhancedGoodbye);

// ## Start the experiment
jsPsych.run(timeline);