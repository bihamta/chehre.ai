// emoji_match_slider.js
import { addExitButton, videoData_emojis } from "./utils.js";

const emoji_slider = {

    type: jsPsychHtmlButtonResponse,
    choices: [],

    stimulus: () => {
    // derive the clean code
    const code = videoData_emojis.video.emoji_code || "";
    const emoji_code = code.includes("AU")      ? "AU"
                        : code.includes("neutral") ? "neutral"
                        : code;
    const imgPath = `media/emojis/${emoji_code}.png`;

    return `
        <div>
        <!-- === show the video just like dynamic_slider === -->
        <video class="responsive-video" autoplay loop muted>
            <source src="${videoData_emojis.video.url}" type="video/mp4">
        </video>
        </div>

        <div style="text-align:center; margin-bottom:24px;">
        <img src="${imgPath}"
                alt="${emoji_code}"
                style="max-width:60px; border-radius:8px;" />
        </div>

        <p class="instruction-text">
        How much does the video represent the emoji above?
        </p>
        <p style="font-size: 0.9em; color: green; margin-top: -10px;">
        Slide to rate from 0 (not at all) to 3 (very much)
        </p>

        <div class="slider-block">
        <input
            type="range"
            id="match_slider"
            min="-1" max="3" step="1" value=""
            class="styled-slider slider-large"
        />
        <div class="tick-labels">
            ${[0,1,2,3].map(n => `<span>${n}</span>`).join("")}
        </div>
        </div>

        <button id="matchConfirm" class="jspsych-btn" disabled>
        Continue
        </button>
    `;
    },

    on_load: () => {
    addExitButton();
    const s = document.getElementById("match_slider");
    const b = document.getElementById("matchConfirm");

    s.addEventListener("input", () => {
        // enable as soon as they've moved the slider
        if (+s.value >= 0) b.disabled = false;
    });

    b.addEventListener("click", () => {
        jsPsych.finishTrial({
        videoId:     videoData_emojis.video.filename,
        matchRating: +s.value
        });
    });
    },

    on_finish: data => {
        console.log("Emoji Slider Data:", data);
        const payload = {
            video_name:  data.videoId,
            participantId: window.participantId,
            matchRating: data.matchRating
        };
        console.log("Submitting match:", payload);
        fetch("https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/UpdateVideosForLabelEmojis", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload)
        }).catch(console.error);

        let count = parseInt(localStorage.getItem("emojiRatingsDone") || "0", 10);
        localStorage.setItem("emojiRatingsDone", (count + 1).toString());
    }
};

export { emoji_slider };
