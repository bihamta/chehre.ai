import { addExitButton, nextTwoVideos, fetchTwoVideos } from "./utils.js";

const selecting_videos = {
    type: jsPsychHtmlKeyboardResponse,
    response_ends_trial: false,

    on_start: () => new Promise(resolve => {
        if (nextTwoVideos.videos?.length) {
            return resolve();
        }
        fetchTwoVideos(resolve);
    }),

    stimulus: function () {
    const [v1, v2] = nextTwoVideos.videos;
    console.log("Rendering videos:", v1.video_url, v2.video_url, v2.emoji_code);
    return `
        <div class="fc-container">
            <img src="media/emojis/${v2.emoji_code}.png" alt="emoji" class="emoji-img" style="width: 50px; height: 50px; margin-bottom: 20px;" />
            <div class="fc-row">
                <div class="fc-video-block">
                    <video id="video-player1" class="video_compare" autoplay loop muted>
                        <source src="${v1.video_url}" type="video/mp4">
                    </video>
                    <p class="fc-label">Video 1</p>
                </div>

                <div class="fc-video-block">
                    <video id="video-player2" class="video_compare" autoplay loop muted>
                        <source src="${v2.video_url}" type="video/mp4">
                    </video>
                    <p class="fc-label">Video 2</p>
                </div>
            </div>
            <div class="fc-button-group" style="margin-top: 30px;">
                <button id="btn-video1" class="jspsych-btn">Video 1</button>
                <button id="btn-neither" class="jspsych-btn brown-btn">Neither</button>
                <button id="btn-video2" class="jspsych-btn">Video 2</button>
            </div>
            <div class="fc-button-group" style="margin-top: 10px;">
                <button id="btn-both" class="jspsych-btn brown-btn" style="width: 80px;">Both</button>
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

        document.getElementById("btn-video1").addEventListener("click", () => {
            handleSelection("Video 1", "One");
            confirmButton.disabled = false;
        });
        document.getElementById("btn-video2").addEventListener("click", () => {
            handleSelection("Video 2", "Two");
            confirmButton.disabled = false;
        });
        document.getElementById("btn-neither").addEventListener("click", () => {
            handleSelection("Neither", "None");
            confirmButton.disabled = false;
        });
        document.getElementById("btn-both").addEventListener("click", () => {
            handleSelection("Both", "Both");
            confirmButton.disabled = false;
        });
        
        confirmButton.addEventListener("click", () => {
        const [v1, v2] = nextTwoVideos.videos;
        jsPsych.finishTrial({
            selected: selected,
            video1: v1.video_name,
            video2: v2.video_name,
            emoji_code: v1.emoji_code
        });
        });
    },

    on_finish: function (data) {
        const { video1, video2, emoji_code, selected } = data;

        // Map decisions per video
        const decisionMap = {};
        if (selected === "One") {
            decisionMap[video1] = "Yes";
            decisionMap[video2] = "No";
        } else if (selected === "Two") {
            decisionMap[video1] = "No";
            decisionMap[video2] = "Yes";
        } else if (selected === "None") {
            decisionMap[video1] = "No";
            decisionMap[video2] = "No";
        } else if (selected === "Both") {
            decisionMap[video1] = "Yes";
            decisionMap[video2] = "Yes";
        }

        // Send each update to backend
        Object.entries(decisionMap).forEach(([video_name, decision]) => {
            const payload = {
            video_name,
            emoji_code,
            rater: "vit",
            decision
            };
            console.log("Submitting rating =>", payload);
            // fetch("https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/video-selection", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(payload),
            //     })
            //     .then(res => res.json())
            //     .then(resp => console.log("Rating success:", resp))
            //     .catch(err => console.error("Rating error:", err));
        });
        }
    };
    

export { selecting_videos };
