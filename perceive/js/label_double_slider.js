import { addExitButton } from "./utils.js";

const label_double_slider = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
        <video id="videoPlayer" style="max-width: 90%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" autoplay loop muted>
        <source src="media/sample_videos/woman--d0.mp4" type="video/mp4">
        Your browser does not support the video tag.
        </video>

        <div style="margin-top: 30px; width: 90%; max-width: 600px;">
        <p style="text-align: center; font-size: 18px; color: #3e5f4e;">How much does this video represent <strong>Angry</strong>?</p>
        <input type="range" id="sliderNeutral" name="neutral" min="0" max="4" step="1" value="2" class="styled-slider">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #3e5f4e;">
            <span>Not at all</span>
            <span>Very little</span>
            <span>Moderately</span>
            <span>Quite a bit</span>
            <span>Very much</span>
        </div>

        <p style="text-align: center; font-size: 18px; color: #3e5f4e; margin-top:40px;">How much does this video represent <strong>Neutral</strong>?</p>
        <input type="range" id="sliderAngry" name="angry" min="0" max="4" step="1" value="2" class="styled-slider">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #3e5f4e;">
            <span>Not at all</span>
            <span>Very little</span>
            <span>Moderately</span>
            <span>Quite a bit</span>
            <span>Very much</span>
        </div>
        </div>
    </div>
`,
    choices: ["Submit Rating"],
    button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`,

    // button_html: '<button class="jspsych-btn">%choice%</button>',
    on_load: function () {
        addExitButton();
    },
    on_finish: function (data) {
        const rating = document.getElementById("ratingSlider").value;

        const payload = {
            surveyId: window.surveyId,
            participantId: window.participantId,
            videoId: "your_video_filename_or_id", // to update
            label: "the_emoji_or_label", // to update
            rating: rating,
        };

        console.log("Sending rating payload =>", payload);

        fetch("_", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((r) => r.json())
            .then((serverResp) => {
                console.log("Rating submission success:", serverResp);
            })
            .catch((err) => {
                console.error("Error submitting rating:", err);
            });
    },
};

export { label_double_slider };
