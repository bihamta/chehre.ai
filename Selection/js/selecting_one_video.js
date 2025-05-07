import { addExitButton, nextTwoVideos, fetchTwoVideos } from "./utils.js";

const selecting_one_video = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: false,

    stimulus: function () {
    const video = nextTwoVideos.videos[0];
    console.log("Rendering videos:", video.video_url, video.emoji_code);
    if (video.emoji_code.includes("AU")) {
        emoji_code = "AU";
    }
    else {
        emoji_code = video.emoji_code;
    }
    return `
        <div class="fc-container">
            <img src="media/emojis/${video.emoji_code}.png" alt="emoji" class="emoji-img" style="width: 50px; height: 50px; margin-bottom: 20px;" />
            <div class="fc-container">
    
            <div class="fc-video-block">
                <video id="video1" autoplay loop muted>
                    <source src="${emoji_code}" type="video/mp4">
                </video>
            </div>
            <div class="fc-button-group" style="margin-top: 30px;">
                <button id="btn-yes" class="jspsych-btn">Yes</button>
                <button id="btn-no" class="jspsych-btn brown-btn">No</button>
            </div>
            <p id="selectionText" style="margin-top: 30px; color: #3e5f4e; font-size: 15px">---</p>
            <button id="confirmButton" class="jspsych-btn" style="margin-top: 20px;">Confirm</button>
        </div>
        `;
    },
    choices: "NO_KEYS",

    on_load: function () {
        addExitButton();

        let selected = null;
        const selectionText = document.getElementById("selectionText");
        const confirmButton = document.getElementById("confirmButton");
        confirmButton.disabled = true;

        function handleSelection(label, value) {
            selected = value;
            selectionText.innerHTML = `You selected <strong>${label}</strong>.`;
            selectionText.style.display = "block";
            confirmButton.style.display = "inline-block";
        }

        document.getElementById("btn-yes").addEventListener("click", () => {
            handleSelection("Yes", "Yes");
            confirmButton.disabled = false;
        });
        document.getElementById("btn-no").addEventListener("click", () => {
            handleSelection("No", "No");
            confirmButton.disabled = false;
        });

        
        confirmButton.addEventListener("click", () => {
        const video = nextTwoVideos.videos[0];
        jsPsych.finishTrial({
            selected: selected,
            video: video.video_name,
            emoji_code: video.emoji_code
        });
        });
    },

    on_finish: function (data) {
        const { video, emoji_code, selected } = data;

        const payload = {
        video_name: video,
        emoji_code: emoji_code,
        rater: window.rater,
        decision: selected,
        };
            console.log("Submitting rating =>", payload);
            fetch("https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/video-selection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                })
                .then(res => res.json())
                .then(resp => console.log("Rating success:", resp))
                .catch(err => console.error("Rating error:", err));
        });
        }
    };
    

export { selecting_one_video };
