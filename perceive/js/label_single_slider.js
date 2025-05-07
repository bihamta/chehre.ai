import { addExitButton, videoData } from './utils.js';

const label_single_slider = {
  type: jsPsychHtmlButtonResponse,
  response_ends_trial: false,

  on_start: () => new Promise(resolve => {
    if (videoData.video_url) return resolve();
    const id = setInterval(() => {
      if (videoData.video_url) {
        clearInterval(id);
        resolve();
      }
    }, 50);
  }),
  stimulus: function () {
    console.log("Stimulus rendering:", videoData.video_url);
    return `
    
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
        <video id="videoPlayer" style="max-width: 300px; min-width: 140px; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" autoplay loop muted>
          <source src="${videoData.video_url}" type="video/mp4">
        </video>
  
        <div style="margin-top: 30px; width: 90%; max-width: 600px;">
          <p style="text-align: center; font-size: 18px; color: #3e5f4e;">How much do you think this video represents this label?</p>
          <p id="labelDisplay" style="text-align: center; font-size: 20px; font-weight: bold; color: #222;"></p>
  
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
    `;
  },  
  choices: ['Submit Rating'],
  button_html: (choice) => `<button class="jspsych-btn">${choice}</button>`,

on_load: function () {
    addExitButton();

    const videoEl = document.getElementById('videoPlayer');
    const slider  = document.getElementById('ratingSlider');
    const btn     = document.querySelector('.jspsych-btn');

    /* enable button when video is playable */
    videoEl.oncanplaythrough = () => { btn.disabled = false; };

    /* store rating when button clicked, then finish trial */
    btn.addEventListener('click', () => {
      const rating = slider.value;
      console.log("Video data:", videoData.video_name);  

      if (!rating) {
        console.error("Rating not found!");
        return;
      }
      jsPsych.finishTrial({
        video_name: videoData.video_name,
        rating: rating
      });
    });
  },
  on_finish: data => {
    const payload_rating = {
      video_name: data.video_name,
      participantID: window.participantId,
    };
    console.log("Rating data:", payload_rating);
    fetch("https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/update-rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload_rating)
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

export { label_single_slider };
