import { addExitButton, videoData_labels } from "./utils.js";
import { emojiLabels }             from "./label_loader.js";

const dynamic_slider = {
    type: jsPsychHtmlButtonResponse,
    choices: [],    // no built-in buttons

    stimulus: function() {
        const code = videoData_labels.video.emoji_code || '';
        const emoji_code = code.includes("AU")      ? "AU"
                        : code.includes("neutral") ? "neutral"
                        : code;
        const labels = emojiLabels[emoji_code] || [];

        const sliderHtml = labels.map((label, i) => `
        <div class="slider-block slider-container slider-untouched" id="slider-container-${i}">
            <p class="slider-label"><strong>${label}</strong> <span class="choice-display" id="choice-display-${i}"></span></p>
            <input
            type="range" id="slider_${i}" name="${label}"
            min="0" max="3" step="1" value="0"
            class="styled-slider slider-large"
            >
            <div class="tick-labels">
            ${[0,1,2,3].map(n => `<span>${n}</span>`).join('')}  
            </div>
        </div>
        `).join("");

        const labelOptionsHtml = [...labels, 'None'].map((label, i) => `
        <div class="label-option" data-index="${i}" data-label="${label}">
            ${label}
        </div>
        `).join("");
        
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
                font-size: 0.7em;
                color: #3e5f4e;
                min-height: 25px;
            }
        </style>
        
        <div>
            <video class="responsive-video" autoplay loop muted>
                <source src="${videoData_labels.video.url}" type="video/mp4">
            </video>

            <p class="instruction-text" style="text-align: center;">
                How much does each word below represent the video above?<br>
                <em style="color: green; text-align: center; display: block;">
                    (0 - not at all, 3 - very much)
                </em>
                <em style="color: #d9534f; text-align: center; display: block; font-size: 0.9em; margin-top: 8px;">
                    Note: You must interact with all sliders to proceed to the next step
                </em>
            </p>

            <div>${sliderHtml}</div>

            <p class="instruction-text" style="margin-top:24px; text-align: center;">
                Now choose two labels that best match the expression
                <em style="color: green; text-align: center; display: block;"> 
                (Rank #1 and #2)
                </em>
            </p>

            <div id="label-list" class="label-list">${labelOptionsHtml}</div>

            <div class="jittery-flag" style="margin-top:24px; text-align:center;">
                <input type="checkbox" id="jitteryFlag" name="jitteryFlag">
                <label for="jitteryFlag">
                    Flag this video as jittery or glitchy, if it seems unstable.
                </label>
            </div>

            <button id="confirmButton" class="jspsych-btn" style="margin-top:20px;" disabled>
                Confirm & Continue
            </button>
        </div>
    `;
    },

    on_load: function() {
        addExitButton();
        const selected = [];
        const interactedSliders = new Set();
        const opts = document.querySelectorAll(".label-option");
        const confirm = document.getElementById("confirmButton");
        const sliders = document.querySelectorAll(".slider-large");

        // Enhanced slider interaction tracking
        sliders.forEach((sl, index) => {
            const container = document.getElementById(`slider-container-${index}`);
            const choiceDisplay = document.getElementById(`choice-display-${index}`);
            
            // Function to mark slider as interacted
            const markAsInteracted = () => {
                if (!interactedSliders.has(sl.id)) {
                    interactedSliders.add(sl.id);
                    container.classList.remove("slider-untouched");
                    container.classList.add("slider-touched");
                    updateConfirmState();
                }
            };
            
            // Handle value changes
            sl.addEventListener('input', () => {
                const currentValue = parseInt(sl.value);
                markAsInteracted();
                choiceDisplay.textContent = ` (Your choice is: ${currentValue})`;
            });
            
            // Track interaction through focus and mouse/touch events
            sl.addEventListener('focus', () => {
                markAsInteracted();
                // Show current value when first focused
                if (!choiceDisplay.textContent.includes('Your choice is:')) {
                    const currentValue = parseInt(sl.value);
                    choiceDisplay.textContent = ` (Your choice is: ${currentValue})`;
                }
            });
            sl.addEventListener('mousedown', () => {
                markAsInteracted();
                // Show current value when first clicked
                if (!choiceDisplay.textContent.includes('Your choice is:')) {
                    const currentValue = parseInt(sl.value);
                    choiceDisplay.textContent = ` (Your choice is: ${currentValue})`;
                }
            });
            sl.addEventListener('touchstart', () => {
                markAsInteracted();
                // Show current value when first touched
                if (!choiceDisplay.textContent.includes('Your choice is:')) {
                    const currentValue = parseInt(sl.value);
                    choiceDisplay.textContent = ` (Your choice is: ${currentValue})`;
                }
            });
        });

        // Label click handlers with None logic
        opts.forEach(opt => {
            opt.addEventListener("click", () => {
                const idx = opt.dataset.index;
                const label = opt.dataset.label;
                const exists = selected.find(s => s.idx === idx);
                const noneLabel = label === 'None';

                if (exists) {
                    selected.splice(selected.indexOf(exists), 1);
                } else if (selected.length < 2) {
                    // prevent selecting a real label after None is first
                    if (!(selected.length === 1 && selected[0].label === 'None' && !noneLabel)) {
                        selected.push({ idx, label });
                    }
                }

                // clear UI
                opts.forEach(o => {
                    o.classList.remove("rank1", "rank2", "disabled-option");
                    const b = o.querySelector(".label-rank");
                    if (b) b.remove();
                    const isNone = selected[0]?.label === 'None';
                    if (isNone && o.dataset.label !== 'None') {
                        o.classList.add("disabled-option");
                    }
                });

                // draw badges
                selected.forEach((s, i) => {
                    const o = document.querySelector(`.label-option[data-index="${s.idx}"]`);
                    const badge = document.createElement("span");
                    badge.className = "label-rank";
                    badge.textContent = i + 1;
                    o.appendChild(badge);
                    o.classList.add(i === 0 ? "rank1" : "rank2");
                });

                updateConfirmState();
            });
        });

        function updateConfirmState() {
            const allInteracted = interactedSliders.size === sliders.length;
            // allow single None or two selections
            const labelsOK = (selected.length === 2) || (selected.length === 1 && selected[0].label === 'None');
            confirm.disabled = !(labelsOK && allInteracted);
        }

        confirm.addEventListener("click", () => {
            // gather slider values
            const code = videoData_labels.video.emoji_code || '';
            const emoji_code = code.includes("AU")      ? "AU"
                                : code.includes("neutral") ? "neutral"
                                : code;
            const baseLabels = emojiLabels[emoji_code] || [];
            const ratings = {};
            
            // Get ratings for all labels
            baseLabels.forEach((label, i) => {
                const sliderElement = document.getElementById(`slider_${i}`);
                if (sliderElement) {
                    ratings[label] = +sliderElement.value;
                }
            });

            const jittery = document.getElementById('jitteryFlag').checked;

            jsPsych.finishTrial({
                participantId: window.participantId,
                videoId: videoData_labels.video.filename,
                assigned_slot: videoData_labels.assigned_slot,
                ratings,
                rank1: selected[0]?.label || null,
                rank2: selected[1]?.label || null,
                jitteryFlag: jittery
            });
        });
    },

    on_finish: function(data) {
        const payload = {
            participantId: window.participantId,
            video_name: data.videoId,
            assigned_slot: data.assigned_slot,
            ratings: data.ratings,
            rank1: data.rank1,
            rank2: data.rank1 === 'None' && data.rank2 === null ? 'None' : data.rank2,
            jitteryFlag: data.jitteryFlag
        };
        
        console.log("Submitting:", payload);
        
        fetch("https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/UpdateVideosForLabelAnnotation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(console.error);
    
        // update local storage 
        let count = parseInt(localStorage.getItem("labelRatingsDone") || "0", 10);
        localStorage.setItem("labelRatingsDone", (count + 1).toString());
    }
};

export { dynamic_slider };