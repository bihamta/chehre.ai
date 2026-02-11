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
import { demog } from './demographics.js';
import { medi } from './mindfulness.js';
import { get_next_video_for_labels, get_next_video_for_emojis } from './get_next_video.js';
import { emoji_slider } from './emoji_slider.js';
import { down } from './down.js';

// ## Initialize
const timeline = [];
await loadEmojiLabels();

// Define tiers
const tier1IDs = ["11122"];
const tier2IDs = [];

// Initialize counters
if (!localStorage.getItem("emojiRatingsDone")) localStorage.setItem("emojiRatingsDone", "0");
if (!localStorage.getItem("labelRatingsDone")) localStorage.setItem("labelRatingsDone", "0");

// Function to calculate tier settings
function calculateTierSettings(sonaID) {
    let labelRepeats = 60;
    let emojiRepeats = 60;
    let skipDemog = false;
    let skipMedi = true;

    if (tier1IDs.includes(sonaID)) {
        labelRepeats = 0;
        emojiRepeats = 0;
        skipDemog = true;
        skipMedi = true;
    } else if (tier2IDs.includes(sonaID)) {
        labelRepeats = 1;
        emojiRepeats = 40;
        skipDemog = true;
        skipMedi = true;
    }

    // Set global variables
    window.N_REPEATS_LABELS = labelRepeats;
    window.N_REPEATS_EMOJI = emojiRepeats;
    window.SKIP_DEMOG = skipDemog;
    window.SKIP_MEDI = skipMedi;

    console.log("Tier settings calculated for SONA ID:", sonaID,
                "| Label Repeats:", labelRepeats,
                "| Emoji Repeats:", emojiRepeats,
                "| Skip Demographics:", skipDemog,
                "| Skip Meditation:", skipMedi);

    return { labelRepeats, emojiRepeats, skipDemog, skipMedi };
}
// timeline.push(down);
//------- Welcome and Consent -------//
timeline.push(welcome);

const hasConsented = localStorage.getItem("hasConsented");
if (!hasConsented) {
    timeline.push(consent);
}

//------- Calculate tier settings after consent -------//
timeline.push({
    type: jsPsychCallFunction,
    func: () => {
        // Get the current SONA ID (may have been updated during consent)
        const id = window.sonaID || localStorage.getItem("sonaID") || "";
        window.sonaID = id;
        
        // Calculate and set tier settings
        calculateTierSettings(id);
    }
});

//------- Build dynamic timeline -------//
timeline.push({
    type: jsPsychCallFunction,
    func: () => {
        const dynamicTimeline = [];

        //------- Meditation Questionnaire -------//
        const hasMedi = localStorage.getItem("hasMedi");
        if (!hasMedi && !window.SKIP_MEDI) {
            console.log("Adding meditation questionnaire to timeline");
            dynamicTimeline.push(questionnaire_intro);
            dynamicTimeline.push(medi);
        }

        //------- Demographic Questions -------//
        const hasDemog = localStorage.getItem("hasDemog");
        if (!hasDemog && !window.SKIP_DEMOG) {
            console.log("Adding demographics to timeline");
            dynamicTimeline.push(demographic_intro);
            dynamicTimeline.push(demog);
        }

        //------- Label Ratings -------//
        const rated_labels = parseInt(localStorage.getItem("labelRatingsDone") || "0");
        const N_REPEATS_LABELS = window.N_REPEATS_LABELS || 40;
        const remainingLabels = N_REPEATS_LABELS - rated_labels;
        
        if (remainingLabels > 0) {
            console.log(`Adding ${remainingLabels} label rating trials to timeline`);
            dynamicTimeline.push(label_intro);
            for (let i = 0; i < remainingLabels; i++) {
                dynamicTimeline.push(get_next_video_for_labels);
                dynamicTimeline.push(dynamic_slider);
            }
        }

        //------- Emoji Ratings -------//
        const rated_emojis = parseInt(localStorage.getItem("emojiRatingsDone") || "0");
        const N_REPEATS_EMOJI = window.N_REPEATS_EMOJI || 40;
        const remainingEmojis = N_REPEATS_EMOJI - rated_emojis;
        
        if (remainingEmojis > 0) {
            console.log(`Adding ${remainingEmojis} emoji rating trials to timeline`);
            dynamicTimeline.push(emoji_intro);
            for (let i = 0; i < remainingEmojis; i++) {
                dynamicTimeline.push(get_next_video_for_emojis);
                dynamicTimeline.push(emoji_slider);
            }
        }

        //------- Final Steps -------//
        dynamicTimeline.push(empathy_intro);
        dynamicTimeline.push(empathy);
        dynamicTimeline.push(final);
        dynamicTimeline.push(honesty);

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
        dynamicTimeline.push(enhancedGoodbye);

        // Add all dynamic timeline elements to jsPsych
        if (typeof jsPsych.addNodeToEndOfTimeline === 'function') {
            // jsPsych v7+
            jsPsych.addNodeToEndOfTimeline({
                timeline: dynamicTimeline
            });
        } else {
            // jsPsych v6 fallback - add to main timeline
            dynamicTimeline.forEach(node => {
                jsPsych.getTimeline().push(node);
            });
        }

        console.log("Dynamic timeline built and added to jsPsych");
    }
});

// ## Start the experiment
console.log("Starting jsPsych experiment with initial timeline length:", timeline.length);
jsPsych.run(timeline);
