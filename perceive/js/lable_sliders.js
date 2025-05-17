
import { addExitButton, videoData_labels } from "./utils.js";
import { emojiLabels }             from "./label_loader.js";

const dynamic_slider = {
    type: jsPsychHtmlButtonResponse,
    choices: [],    // no built-in buttons

    stimulus: function() {
    const code = videoData_labels.video.emoji_code || '';
    // console.log(videoData_labels.emoji_code, videoData_labels.video.emoji_code)
    const emoji_code = code.includes("AU")      ? "AU"
                    : code.includes("neutral") ? "neutral"
                    : code;
    const labels = emojiLabels[emoji_code] || [];

    const sliderHtml = labels.map((label, i) => `
    <div class="slider-block">
        <p class="slider-label"><strong>${label}</strong></p>
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

    const labelOptionsHtml = labels.map((label, i) => `
    <div class="label-option" data-index="${i}" data-label="${label}">
        ${label}
    </div>
    `).join("");
    return `
    <div>
        <video class="responsive-video" autoplay loop muted>
            <source src="${videoData_labels.video.url}" type="video/mp4">
        </video>

        <p class="instruction-text" style="text-align: center;">
            How much does each word below represent the video above?<br>
            <em style="color: green; text-align: center; display: block;">
                (0 - not at all, 3 - very much)
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

        <button id="confirmButton" class="jspsych-btn" style="margin-top:20px;" disabled>
            Confirm & Continue
        </button>
    </div>
`;
},

    on_load: function() {
        addExitButton();
        const selected = [];
        let sliderMoved = false;
        const opts = document.querySelectorAll(".label-option");
        const confirm = document.getElementById("confirmButton");
        const sliders = document.querySelectorAll(".slider-large");

        // listen for slider changes
        sliders.forEach(sl => {
        sl.addEventListener('input', () => {
            if (+sl.value > 0) sliderMoved = true;
            updateConfirmState();
        });
        });

        // label click handlers
        opts.forEach(opt => {
        opt.addEventListener("click", () => {
            const idx = opt.dataset.index;
            const label = opt.dataset.label;
            const exists = selected.find(s => s.idx === idx);
            if (exists) selected.splice(selected.indexOf(exists), 1);
            else if (selected.length < 2) selected.push({ idx, label });

            // clear UI
            opts.forEach(o => {
            o.classList.remove("rank1", "rank2");
            const b = o.querySelector(".label-rank");
            if (b) b.remove();
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
        // enable only if 2 labels selected AND at least one slider moved
        confirm.disabled = !(selected.length === 2 && sliderMoved);
        }

        confirm.addEventListener("click", () => {
        // gather slider values
        const code = videoData_labels.video.emoji_code || '';
        const emoji_code = code.includes("AU")      ? "AU"
                            : code.includes("neutral") ? "neutral"
                            : code;
        const labels = emojiLabels[emoji_code] || [];
        const ratings = {};
        labels.forEach((l, i) => {
            ratings[l] = +document.getElementById(`slider_${i}`).value;

        });

        jsPsych.finishTrial({
            participantId: window.participantId,
            videoId: videoData_labels.video.filename,
            ratings,
            rank1: selected[0]?.label || null,
            rank2: selected[1]?.label || null
        });
        });
    },

    on_finish: function(data) {
        const payload = {
            participantId: window.participantId,
            video_name: data.videoId,
            ratings: data.ratings,
            rank1: data.rank1,
            rank2: data.rank2
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

export { dynamic_slider};
