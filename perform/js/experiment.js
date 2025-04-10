import { logError } from "./utils.js";

// ## Global Error Handling
window.onerror = function (msg, url, lineNo, colNo, errorObj) {
    console.log("🔥 triggered");
    logError({
        error: errorObj || msg,
        stack: errorObj?.stack || "",
        message: `Uncaught Error at ${url}:${lineNo}:${colNo}`
    });
    return false;
    };

    window.addEventListener("unhandledrejection", (event) => {
        console.log("🔥 unhandledrejection triggered:", event.reason);
        const reason = event.reason || {};
        logError({
            error: reason,
            stack: reason.stack || "",
            message: "Unhandled promise rejection"
        });
});

// ## Log user Exit or browser closure
window.addEventListener("beforeunload", function (event) {
    logError({
        error: "USER_EXI",
        stack: "",
        message: "Participant closed the tab or left the page"
    });
});

// ## Log user tab switch
document.addEventListener("visibilitychange", function () {
    console.log("🔥 visibilitychange triggered");
    const event = {
        state: document.hidden ? "TAB_HIDDEN" : "TAB_VISIBLE"
    };
    fetch("https://vmq3r1f7xi.execute-api.us-east-2.amazonaws.com/log/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({
                surveyId: window.surveyId,
                participantId: window.participantId,
                tabStates: [ event ]
            })
        }).catch((err) => console.error("Failed to log error:", err));
});

// ## Test error logging
// throw new Error("test error!")

// ## Import all the modules 
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

// ## Build the timeline
const timeline = [];
// timeline.push(down);

// ## Welcome page
timeline.push(welcome);

// ## Consent page
const hasConsented = localStorage.getItem("hasConsented") === "true"; // Check if user has consented
if (!hasConsented) {
    timeline.push(consent);
}

// ## Meditation questionnaire
const hasMedi = localStorage.getItem("hasMedi") === "true"; // Check if user has done meditation questionnaire
if (!hasMedi) {
    timeline.push(questionnaire); // Questionnaire landing page
    timeline.push(medi);
}

// ## Instructions pages
const hasCompletedInstructions = localStorage.getItem("hasCompletedInstructions") === "true"; // Check if user has completed instructions
if (!hasCompletedInstructions) {
    timeline.push(instruction_trial_1);
    timeline.push(instruction_trial_2);
}

// ## Initialize camera
timeline.push(init_camera);

// ## Neutral trial
const neutralUploaded = localStorage.getItem('neutralUploaded'); // Check if neutral video has been uploaded
if (!neutralUploaded) {
    timeline.push(neutral_trial);
}

// ## Emoji trials
const storedEmojis = localStorage.getItem('unusedEmojis'); // Check if any emojis are left
const storedEmojiCounter = localStorage.getItem('emojiCounter'); 
let canDoEmojis = true; // default
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

// ## AU trials
const storedAUs = localStorage.getItem('auList'); // Check if any AUs are left
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

// ## Demographics questionnaire
timeline.push(demographic); // Demographics landing page
timeline.push(demog);

timeline.push(thank);

// ## Honest feedback
timeline.push(honesty);
timeline.push(goodbye);

// ## Start the experiment
jsPsych.run(timeline);
