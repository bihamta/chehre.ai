// experiment.js
import { logError } from "./utils.js";

// 1) Attach global error capture first:
window.onerror = function (msg, url, lineNo, colNo, errorObj) {
    logError({
        error: errorObj || msg,
        stack: errorObj?.stack || "",
        message: `Uncaught Error at ${url}:${lineNo}:${colNo}`
    });
    return false;
    };

    window.addEventListener("unhandledrejection", (evt) => {
        const reason = evt.reason || {};
        logError({
            error: reason,
            stack: reason.stack || "",
            message: "Unhandled promise rejection"
        });
});

// throw new Error("test error!")

// 1) Import everything
import { welcome } from './welcome.js';
import { consent } from './consent.js';
import { instruction_trial_1, instruction_trial_2 } from './instru.js';
import { thank, emoji, facialdynamics, questionnaire, demographic, emoji_reminder } from './landing.js';
import { demog } from './demographics.js';
import { medi } from './mindfulness.js';
import { init_camera, neutral_trial } from './neutral.js';
import { emojiTrials } from './emojis.js';
import { au_trials } from './aus.js';
import { goodbye, honesty } from './thanks.js';

import {down} from './down.js'

// 2) We start building the timeline
const timeline = [];
timeline.push(down);
// 3) Always push "Welcome" first
timeline.push(welcome);

// // 4) Check if the user *already* consented on a previous session
const hasConsented = localStorage.getItem("hasConsented") === "true";
if (!hasConsented) {
    timeline.push(consent);
}

// // 5) Check if user already completed medi
const hasMedi = localStorage.getItem("hasMedi") === "true";
if (!hasMedi) {
  // If they haven't done medi, push your questionnaire + medi block
    timeline.push(questionnaire);
    timeline.push(medi);
}

// // 6) Add instructions & camera init
const hasCompletedInstructions = localStorage.getItem("hasCompletedInstructions") === "true";
if (!hasCompletedInstructions) {
    timeline.push(instruction_trial_1);
    timeline.push(instruction_trial_2);
}


timeline.push(init_camera);
const neutralUploaded = localStorage.getItem('neutralUploaded');
if (!neutralUploaded) {
    timeline.push(neutral_trial);
}


// 6) Check leftover Emojis
const storedEmojis = localStorage.getItem('unusedEmojis');
const storedEmojiCounter = localStorage.getItem('emojiCounter');
let canDoEmojis = true; // default if no info
if (storedEmojis && storedEmojiCounter) {
    const emojisArray = JSON.parse(storedEmojis);
    const emojiCount = parseInt(storedEmojiCounter, 10) || 0;
    const totalEmojis = 40;
    if (emojiCount >= totalEmojis || emojisArray.length === 0) {
        canDoEmojis = false;
    }   
}
if (canDoEmojis) {
    timeline.push(emoji);
    timeline.push(emojiTrials);
}


// 10) Check leftover AUs
const storedAUs = localStorage.getItem('auList');
const storedAUCounter = localStorage.getItem('auCounter');
let hasAUleft = true; // default
if (storedAUs) {
    try {
        const auArray = JSON.parse(storedAUs); // e.g. a list of AUs left
        const auCount = parseInt(storedAUCounter, 10) || 0;
    // If `auArray` is empty, that means we've done them all
    if (!auArray || auArray.length === 0) {
        hasAUleft = false;
    }
    } catch (err) {
        console.warn("Could not parse stored AUs; defaulting to do them again.", err);
}
}
if (hasAUleft) {
    timeline.push(facialdynamics);
    timeline.push(au_trials);
}

// 12) Finally, add demographics, thanks, etc.
timeline.push(demographic);
timeline.push(demog);
timeline.push(thank);
timeline.push(honesty);
timeline.push(goodbye);

// 13) Run
jsPsych.run(timeline);
