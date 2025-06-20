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

// Define tiers
const tier1IDs = ["76123", "75862", "73714", "75574", "74350", "75616", "74074", "74566", "74446", "73810", "75373", "75235"];
const tier2IDs = ["75175", "74800", "74557", "74386", "75514", "74224", "75526", "75223", "74032", "75253", "74437", "12345"];

// Initialize counters
if (!localStorage.getItem("emojiRatingsDone")) localStorage.setItem("emojiRatingsDone", "0");
if (!localStorage.getItem("labelRatingsDone")) localStorage.setItem("labelRatingsDone", "0");

//------- Welcome and Consent -------//
timeline.push(welcome);
const hasConsented = localStorage.getItem("hasConsented");
if (!hasConsented) {
    timeline.push(consent);
}

//------- Set repeat counts and skip flags -------//
timeline.push({
    type: jsPsychCallFunction,
    func: () => {
        const id = window.sonaID || localStorage.getItem("sonaID");
        window.sonaID = id;

        let labelRepeats = 35;
        let emojiRepeats = 35;
        let skipDemog = false;
        let skipMedi = false;

        if (tier1IDs.includes(id)) {
            labelRepeats = 15;
            emojiRepeats = 15;
            skipDemog = true;
            skipMedi = true;
        } else if (tier2IDs.includes(id)) {
            labelRepeats = 25;
            emojiRepeats = 25;
            skipDemog = true;
            skipMedi = true;
        }

        window.N_REPEATS_LABELS = labelRepeats;
        window.N_REPEATS_EMOJI = emojiRepeats;
        window.SKIP_DEMOG = skipDemog;
        window.SKIP_MEDI = skipMedi;

        console.log("SONA ID:", id,
                    "| Label Repeat Count:", labelRepeats,
                    "| Emoji Repeat Count:", emojiRepeats,
                    "| Skip Demographics:", skipDemog,
                    "| Skip Meditation:", skipMedi);
    }
});

//------- Meditation Questionnaire -------//
const hasMedi = localStorage.getItem("hasMedi");
if (!hasMedi && window.SKIP_MEDI) {
    timeline.push(questionnaire_intro);
    timeline.push(medi);
}

//------- Demographic Questions -------//
const hasDemog = localStorage.getItem("hasDemog");
if (!hasDemog && window.SKIP_DEMOG) {
    timeline.push(demographic_intro);
    timeline.push(demog);
}

//------- Label Ratings -------//
let rated_labels = parseInt(localStorage.getItem("labelRatingsDone") || "0");
const N_REPEATS_LABELS = window.N_REPEATS_LABELS || 35;
if (rated_labels < N_REPEATS_LABELS) {
    timeline.push(label_intro);
    for (let i = 0; i < N_REPEATS_LABELS - rated_labels; i++) {
        timeline.push(get_next_video_for_labels);
        timeline.push(dynamic_slider);
    }
}

//------- Emoji Ratings -------//
let rated_emojis = parseInt(localStorage.getItem("emojiRatingsDone") || "0");
const N_REPEATS_EMOJI = window.N_REPEATS_EMOJI || 35;
if (rated_emojis < N_REPEATS_EMOJI) {
    timeline.push(emoji_intro);
    for (let i = 0; i < N_REPEATS_EMOJI - rated_emojis; i++) {
        timeline.push(get_next_video_for_emojis);
        timeline.push(emoji_slider);
    }
}

//------- Final Steps -------//
timeline.push(empathy_intro);
timeline.push(empathy);
timeline.push(final);
timeline.push(honesty);

//------- Enhanced goodbye with time tracking -------//
const enhancedGoodbye = {
    ...goodbye,
    on_load: function () {
        if (goodbye.on_load) goodbye.on_load.call(this);
        const startTime = parseInt(localStorage.getItem("studyStartTime"));
        const totalMinutes = Math.round((Date.now() - startTime) / 60000 * 100) / 100;

        console.log(`Study completed in ${totalMinutes} minutes`);

        fetch("https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/SaveSurveyResponse_phase2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                participantId: window.participantId,
                totalDurationMinutes: totalMinutes
            })
        })
        .then(r => r.json())
        .then(res => console.log("Study time saved successfully:", res))
        .catch(err => console.error("Error saving study time:", err));
    }
};
timeline.push(enhancedGoodbye);

// ## Start the experiment
jsPsych.run(timeline);
