import { addExitButton } from './utils.js';

const emoji_single_slider = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
      <video id="videoPlayer" style="max-width: 90%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" autoplay loop muted>
        <source src="media/sample_videos/woman--d0.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>

      <div style="margin-top: 30px; width: 90%; max-width: 600px;">
        <p style="text-align: center; font-size: 18px; color: #3e5f4e;">How much do you think this video represents this emoji?</p>

        <div style="position: relative; width: 100%;">
          <input type="range" id="ratingSlider" name="rating" min="0" max="4" step="1" value="2" class="styled-slider">
          <div style="display: flex; justify-content: space-between; position: absolute; top: 30px; left: 0; right: 0; font-size: 13px; color: #3e5f4e;">
            <span style="width:20%; text-align: center;">Not at all</span>
            <span style="width:20%; text-align: center;">Very little</span>
            <span style="width:20%; text-align: center;">Moderately</span>
            <span style="width:20%; text-align: center;">Quite a bit</span>
            <span style="width:20%; text-align: center;">Very much</span>
          </div>
        </div>
      </div>
    </div>
  `,
  choices: ['Submit Rating'],
  button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`, 


  // button_html: '<button class="jspsych-btn">%choice%</button>',
  on_load: function() {
    addExitButton();
  },
  on_finish: function(data) {
    const rating = document.getElementById('ratingSlider').value;

    const payload = {
      surveyId: window.surveyId,
      participantId: window.participantId,
      videoId: 'your_video_filename_or_id', // to update
      label: 'the_emoji_or_label',          // to update
      rating: rating,
    };

    console.log("Sending rating payload =>", payload);

    fetch("_", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(serverResp => {
      console.log("Rating submission success:", serverResp);
    })
    .catch(err => {
      console.error("Error submitting rating:", err);
    });
  }
};

export { emoji_single_slider };
