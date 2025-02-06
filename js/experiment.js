// experiment.js

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

// 2) We start building the timeline
const timeline = [];

// 3) Always push "Welcome" first
timeline.push(welcome);

// 4) Check if the user *already* consented on a previous session
const hasConsented = localStorage.getItem("hasConsented") === "true";
if (!hasConsented) {
    timeline.push(consent);
}

// 5) Check if user already completed medi
const hasMedi = localStorage.getItem("hasMedi") === "true";
if (!hasMedi) {
  // If they haven't done medi, push your questionnaire + medi block
    timeline.push(questionnaire);
    timeline.push(medi);
}

// 6) Add instructions & camera init
const hasCompletedInstructions = localStorage.getItem("hasCompletedInstructions") === "true";
if (!hasCompletedInstructions) {
    timeline.push(instruction_trial_1);
}
timeline.push(instruction_trial_2);
timeline.push(init_camera);

// 6) Check leftover Emojis
const storedEmojis = localStorage.getItem('unusedEmojis');
const storedEmojiCounter = localStorage.getItem('emojiCounter');
let canDoEmojis = true; // default if no info
if (storedEmojis && storedEmojiCounter) {
    const emojisArray = JSON.parse(storedEmojis);
    const emojiCount = parseInt(storedEmojiCounter, 10) || 0;
    const totalEmojis = 2; // or your chosen total
  // If we have already recorded them all OR no emojis left
    if (emojiCount >= totalEmojis || emojisArray.length === 0) {
        canDoEmojis = false;
    }   
}
if (canDoEmojis) {
    timeline.push(emoji);
    timeline.push(emojiTrials);
}

// 9) Next the rest: facialdynamics, neutral

const neutralUploaded = localStorage.getItem('neutralUploaded');

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
    if (!neutralUploaded) {
        timeline.push(neutral_trial);
    }
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
