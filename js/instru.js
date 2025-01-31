const images = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/angle.jpg",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/far.jpg",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/close.jpg",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/hand.jpg",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/visible.jpg",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/correct.jpg"
]

let repeatConsent = true;
const instruction_trial_1q = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
    <div style="text-align: center;">
        <h2>Important Instructions</h2>
        <p>
        Please follow these instructions while recording the video. After the experiment, your data will be reviewed. If any of the following guidelines are not met, you may be asked to redo the experiment.
        </p>
    </div>`,
    html: `
        <p>Please start the experiment in a quiet place where you are alone and comfortable performing different facial expressions.</p>
        <p><label><input type="checkbox" name="alone"> I confirm that I am in a quiet place and comfortable making different facial expressions.</label></p>
        
        <p>We prefer that you use your mobile phone for recording the video.</p>
        <p>Please select the device you are using:</p>
        <p>
            <label><input type="radio" name="device" value="phone"> I am using my phone.</label><br>
            <label><input type="radio" name="device" value="laptop"> I am using my laptop.</label>
        </p>
        
        <p>Regardless of the device you are using, please position it at eye level. While recording, look directly at the camera and start with a neutral facial expression.</p>
        <p><label><input type="checkbox" name="position"> My device is positioned at eye level.</label></p>
    `,
    button_label: "Next",
    on_finish: function(data) {
        console.log(data.response);

        const responses = data.response;
        const alone = responses.alone === "on";
        const position = responses.position === "on";
        const device = responses.device; // "phone" or "laptop"

        // Ensure all necessary conditions are met
        if (!alone || !device || !position) {
            repeatConsent = true; // Repeat the form if any mandatory field is not selected
        } else {
            repeatConsent = false; // Allow proceeding if all conditions are met
        }

        if (!repeatConsent) {
            const payload = {
                consent: { device },
                participantId: window.participantId,  // Assuming you have a participantId stored somewhere
                surveyId: window.surveyId  // Assuming you have a surveyId stored somewhere
            };

            fetch("https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Consent Data Submitted Successfully:", data);
                })
                .catch(error => {
                    console.error("Error submitting consent data:", error);
                });
        }
    }
};

const message = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>To start the experiment, you must meet the requirements.</p>`,
    choices: ["Go back to instruction form", "Exit the Experiment"], // Button labels
    on_finish: function(data) {
        if (data.response === 1) { // 'Exit' button is clicked
            repeatConsent = false; // Stop looping to exit the survey
            jsPsych.abortExperiment("You chose to exit the survey. Thank you for your participation.");
        } else if (data.response === 0) { // 'Retry' button is clicked
            repeatConsent = true; // Continue to retry the trial
        }
    }
};

const instruction_trial_1 = {
    timeline: [
        instruction_trial_1q, // Always show the instruction form first
        {
            timeline: [message], // Show message and repeat consent if necessary
            conditional_function: function() {
                return repeatConsent; // Only show if consent needs to be repeated
            }
        }
    ],
    loop_function: function() {
        return repeatConsent; // Continue loop until consent is valid or the user exits
    }
};

const instruction_trial_2 = {
    type: jsPsychInstructions,
    pages: [
        `<div style="text-align: center;">
            <h2 style="color: rgb(21, 92, 125);">Camera Positioning</h2>
            <img src="${images[0]}" alt="Angle Instruction" style="max-width: 50%; height: auto; margin-top: 15px;">
            <p id="thanks">Ensure your face is visible and the camera is positioned at <span style="color: rgb(215, 60, 99); font-weight: bold;">eye level</span>.</p>
        </div>`,
        `<div style="text-align: center;">
            <h2 style="color: rgb(21, 92, 125);">Distance from Camera</h2>
            <img src="${images[1]}" alt="Too Far" style="max-width: 50%; height: auto; margin-top: 15px;">
            <p id="thanks">Do <span style="color: rgb(215, 60, 99); font-weight: bold;">not</span> stand too far from the camera.</p>
            <img src="${images[2]}" alt="Too Close" style="max-width: 50%; height: auto; margin-top: 15px;">
            <p id="thanks">Do <span style="color: rgb(215, 60, 99); font-weight: bold;">not</span> stand too close either.</p>
        </div>`,
        `<div style="text-align: center;">
            <h2 style="color: rgb(21, 92, 125);">Hands Visibility</h2>
            <img src="${images[3]}" alt="Hands in Frame" style="max-width: 50%; height: auto; margin-top: 15px;">
            <p id="thanks">Ensure your hands are <span style="color: rgb(215, 60, 99); font-weight: bold;">not visible</span> in the frame.</p>
        </div>`,
        `<div style="text-align: center;">
            <h2 style="color: rgb(21, 92, 125);">Final Check</h2>
            <img src="${images[4]}" alt="Face Visibility" style="max-width: 50%; height: auto; margin-top: 15px;">
            <p id="thanks">Make sure your entire face is visible.</p>
            <img src="${images[5]}" alt="Correct Position" style="max-width: 50%; height: auto; margin-top: 15px;">
            <p id="thanks"><span style="color: rgb(215, 60, 99); font-weight: bold;">This is the correct camera setup.</span></p>
        </div>`
    ],
    show_clickable_nav: true
};

export { instruction_trial_1, instruction_trial_2 };






