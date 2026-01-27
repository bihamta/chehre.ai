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
            <style>
                .slider-untouched {
                    opacity: 0.5;
                    filter: grayscale(0.3);
                }
                
                .slider-touched {
                    opacity: 1;
                    filter: none;
                    font-weight: bold;
                }
                
                .choice-display {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    font-size: 0.9em;
                    color: #3e5f4e;
                    min-height: 25px;
                }
            </style>
            
            <div>
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
                Move the slider to rate: 0 (no match) to 3 (perfect match)
            </p>

            <div class="slider-container slider-untouched" id="slider-container">
                <input type="range" id="match_slider" class="styled-slider slider-large" min="0" max="3" step="1" value="0" />

                <div class="slider-block">
                    <div class="tick-labels">
                    ${[0, 1, 2, 3].map(n => `<span>${n}</span>`).join("")}
                    </div>
                </div>
            </div>
            
            <div class="choice-display" id="choice-display"></div>
            
            <button id="matchConfirm" class="jspsych-btn" disabled>
                Continue
            </button>
        `;
    },

    on_load: () => {
        addExitButton();
        const s = document.getElementById("match_slider");
        const b = document.getElementById("matchConfirm");
        const container = document.getElementById("slider-container");
        const choiceDisplay = document.getElementById("choice-display");

        // Track if user has interacted with slider
        let hasInteracted = false;

        const markAsInteracted = () => {
            if (!hasInteracted && parseInt(s.value) <= 3) {
                hasInteracted = true;
                container.classList.remove("slider-untouched");
                container.classList.add("slider-touched");
                s.max = "3";
                b.disabled = false;
                choiceDisplay.textContent = `Your choice is: ${parseInt(s.value)}`;
            }
        };
        
        // Input change (already present)
        s.addEventListener("input", () => {
            markAsInteracted();
            choiceDisplay.textContent = `Your choice is: ${parseInt(s.value)}`;
        });
        
        // One-click or touch interactions
        ["focus", "mousedown", "touchstart"].forEach(evt => {
            s.addEventListener(evt, () => {
                markAsInteracted();
                if (!choiceDisplay.textContent.includes("Your choice is:")) {
                    choiceDisplay.textContent = `Your choice is: ${parseInt(s.value)}`;
                }
            });
        });
        // Ensure slider is always at 0-3 range        

        b.addEventListener("click", () => {
            const finalValue = Math.min(3, parseInt(s.value)); // Ensure valid rating 0-3
            jsPsych.finishTrial({
                videoId:     videoData_emojis.video.filename,
                matchRating: finalValue
            });
        });
    },

    on_finish: data => {
        console.log("Emoji Slider Data:", data);
    
        // Only send and count rating if user actually submitted a valid rating
        if (typeof data.matchRating === "number") {
            const payload = {
                video_name:  data.videoId,
                participantId: window.participantId,
                matchRating: data.matchRating
            };
            console.log("Submitting match:", payload);
    
            fetch("https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/UpdateVideosForLabelEmojis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(console.error);
    
            let count = parseInt(localStorage.getItem("emojiRatingsDone") || "0", 10);
            localStorage.setItem("emojiRatingsDone", (count + 1).toString());
        } else {
            console.log("No valid rating submitted — not incrementing emojiRatingsDone.");
        }
    }    
};

export { emoji_slider };