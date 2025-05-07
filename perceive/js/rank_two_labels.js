import { addExitButton } from "./utils.js";

const rank_two_labels = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `

    <div class="fc-container">
        <p class="fc-prompt">Watch the video and choose the <strong>two labels</strong> that best match the expression. (in order of relevance.)</p>

        <div class="fc-video-block">
            <video id="video1" autoplay loop muted>
                <source src="media/sample_videos/woman--d0.mp4" type="video/mp4">
            </video>
        </div>

        
        <div id="label-list" class="label-list"></div>

        <p id="selectionText" style="margin-top: 20px; color: #3e5f4e; font-size: 15px;">Please choose your first option.</p>
        <button id="confirmButton" class="jspsych-btn" style="margin-top: 20px;" disabled>Confirm</button>
    </div>
    `,
    choices: "NO_KEYS",

    on_load: function () {
        addExitButton();

        const labels = [
            "Angry", "Happy", "Confused", "Surprised", "Disgusted", "Sad", "Tired", "Neutral", "Annoyed", "Embarrassed"
        ];

        const labelList = document.getElementById("label-list");
        labelList.innerHTML = labels.map((label, i) => `
            <div class="label-option" data-index="${i}" data-label="${label}">
                ${label}
            </div>
        `).join("");

        setupLabelSelection();

        function setupLabelSelection() {
            let selected = [];
            const labelOptions = document.querySelectorAll(".label-option");
            const confirmButton = document.getElementById("confirmButton");
            const selectionText = document.getElementById("selectionText");

            labelOptions.forEach(option => {
                option.addEventListener("click", () => {
                    const index = option.getAttribute("data-index");
                    const label = option.getAttribute("data-label");

                    if (selected.find(s => s.index === index)) {
                        selected = selected.filter(s => s.index !== index);
                    } else if (selected.length < 2) {
                        selected.push({ index, label });
                    }

                    labelOptions.forEach(opt => {
                        const badge = opt.querySelector(".label-rank");
                        if (badge) badge.remove();
                        opt.classList.remove("selected-rank-1", "selected-rank-2");
                    });

                    selected.forEach((s, i) => {
                        const target = document.querySelector(`.label-option[data-index='${s.index}']`);
                        const badge = document.createElement("div");
                        badge.classList.add("label-rank");
                        badge.textContent = i + 1;
                        target.appendChild(badge);
                        target.classList.add(`selected-rank-${i + 1}`);
                    });

                    if (selected.length === 1) {
                        selectionText.innerText = "Please choose your second option.";
                        // selectionText.style.display = "none";
                        confirmButton.disabled = true;
                    } else if (selected.length === 2) {
                        selectionText.style.display = "block";
                        selectionText.innerHTML = `Rank 1: <strong>${selected[0].label}</strong>, Rank 2: <strong>${selected[1].label}</strong>`;
                        confirmButton.disabled = false;
                    } else {
                        selectionText.innerText = "Please choose your first option.";
                        // selectionText.style.display = "none";
                        confirmButton.disabled = true;
                    }
                });
            });

            confirmButton.addEventListener("click", () => {
                jsPsych.finishTrial({
                    video: "woman--d0.mp4",
                    rank_1: selected[0].label,
                    rank_2: selected[1].label
                });
            });
        }
    },

    on_finish: function (data) {
        const payload = {
            surveyId: window.surveyId,
            participantId: window.participantId,
            video: data.video,
            rank_1: data.rank_1,
            rank_2: data.rank_2
        };

        console.log("Sending label ranking payload =>", payload);

        
        fetch("https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/update-rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId: "test", sonaID: "12345" })
        });


        // fetch("_", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(payload),
        // })
        //     .then(r => r.json())
        //     .then(serverResp => {
        //         console.log("Label ranking submission success:", serverResp);
        //     })
        //     .catch(err => {
        //         console.error("Error submitting label ranking:", err);
        //     });
    }
};

export { rank_two_labels };
