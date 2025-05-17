import { addExitButton } from "../utils.js";

const compare_two_videos = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div class="fc-container">
        <p class="fc-prompt">Which video shows <strong>Angry</strong> better?</p>

        <div class="fc-row">
        <div class="fc-video-block">
            <video id="video1" autoplay loop muted>
            <source src="media/sample_videos/woman--d0.mp4" type="video/mp4">
            </video>
            <p class="fc-label">Video 1</p>
        </div>

        <div class="fc-video-block">
            <video id="video2" autoplay loop muted>
            <source src="media/sample_videos/woman--d0.mp4" type="video/mp4">
            </video>
            <p class="fc-label">Video 2</p>
        </div>
        </div>

        <div class="fc-button-group" style="margin-top: 30px;">
        <button id="btn-video1" class="jspsych-btn">Video 1</button>
        <button id="btn-neither" class="jspsych-btn brown-btn">Neither</button>
        <button id="btn-video2" class="jspsych-btn">Video 2</button>
        </div>
        
        <p id="selectionText" style="margin-top: 30px; color: #3e5f4e; display: none; font-size: 15px"></p>
        <button id="confirmButton" class="jspsych-btn" style="display: none; margin-top: 20px;">Confirm</button>
    </div>
    `,
    choices: "NO_KEYS",

    on_load: function () {
        addExitButton();

        let selected = null;

        const selectionText = document.getElementById("selectionText");
        const confirmButton = document.getElementById("confirmButton");

        function handleSelection(choiceText, choiceValue) {
            selected = choiceValue;
            selectionText.innerHTML = `You selected <strong>${choiceText}</strong>.`;
            selectionText.style.display = "block";
            confirmButton.style.display = "inline-block";
        }

        document.getElementById("btn-video1").addEventListener("click", () => {
            handleSelection("Video 1", 0);
        });

        document.getElementById("btn-video2").addEventListener("click", () => {
            handleSelection("Video 2", 1);
        });

        document.getElementById("btn-neither").addEventListener("click", () => {
            handleSelection("Neither", 2);
        });

        confirmButton.addEventListener("click", () => {
            jsPsych.finishTrial({
                selected: selected,
                video1: "woman--d0.mp4",
                video2: "woman--d1.mp4",
                label: "angry"
            });
        });
    },
    on_finish: function (data) {

        const payload = {
            surveyId: window.surveyId,
            participantId: window.participantId,
            video1Id: data.video1,
            video2Id: data.video2,
            label: data.label,
            selected: data.selected
        };

        console.log("Sending forced choice payload =>", payload);

        fetch("_", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(r => r.json())
            .then(serverResp => {
                console.log("Forced choice submission success:", serverResp);
            })
            .catch(err => {
                console.error("Error submitting forced choice:", err);
            });
    },
};

export { compare_two_videos };
