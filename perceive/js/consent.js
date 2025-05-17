let repeatConsent = true;
let sonaID = "";
const consentForm = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
        <h2>Consent Form</h2>
        <p><strong>Phase Two: Perceive – Validating Facial Expressions</strong></p>
        <p><strong>Project Title:</strong> Chehre: Understanding the Language of Facial Expressions.</p>
        <p><a href="media/consent.pdf" download class="jspsych-btn" style="margin-top:10px; display:inline-block;">📄 Download Full Consent Form</a></p>
        <p><strong>Principal Investigator:</strong> Dr. Angelica Lim (<a href="mailto:angelica@sfu.ca">angelica@sfu.ca</a>)</p>
        <p><strong>Co-Investigators:</strong> Dr. Hali Kil (<a href="mailto:hali_kil@sfu.ca">hali_kil@sfu.ca</a>)</p>
        <p><strong>Research Personnel:</strong> Bita Azari (<a href="mailto:bazari@sfu.ca">bazari@sfu.ca</a>)</p>
        <p><strong>Purpose of the Study:</strong> This project aims to create an anonymized dataset of facial expressions, poses, and other dynamics to train AI models. In this phase – <em>Perceive</em> – you will help validate a few sample expressions from this dataset.</p>
        <p><strong>Your Participation:</strong> You will be asked to review short facial expression samples and answer a few questions. The study takes about 30 minutes. You must understand English and should not have conditions that hinder accurate facial expression interpretation.</p>
        <p><strong>Benefits and Risks:</strong> No direct risks or benefits are expected for participants in this study.</p>
        <p><strong>Confidentiality:</strong> No identifying information will be collected. Data will be stored securely and only used for research purposes.</p>
        <p><strong>Your Rights:</strong> Participation is voluntary and you may withdraw at any time without penalty. If you withdraw before completing the study, SONA credit cannot be granted.</p>
        `,
    html: `
        <p><label><input type="checkbox" name="mandatory1"> I have read and understood this consent form and agree to participate in this study.</label></p>
        <p><label><input type="checkbox" name="mandatory2"> I agree that my responses to this survey can be used in other secondary analyses and projects unrelated to the research aims presented in this consent form. </label></p>

        <div><label>SONA ID: <input type="text" id="sona_id" name="sona_id" placeholder="Enter your ID"></label>
        <button type="button" id="submit" style="margin-top: 15px;">
        <i class="fa-solid fa-check"></i>confirm</button><br>
        <span id="sonaConfirmation" style="font-style: italic; color: green;"></span></div><br>
        `,
    button_label: "Proceed to Experiment",

    on_load: function() {
       // Disable button initially
        setTimeout(() => {
        const nextButton = document.querySelector("#jspsych-survey-html-form-next");
        const submit = document.getElementById('submit');
        const sonaConfirmation = document.getElementById('sonaConfirmation');
        const sonaid = document.getElementById('sona_id');

        nextButton.disabled = true;
        let sona = "";
        
        function validateForm() {
            sonaID = sonaid.value.trim();
            console.log(sonaID);

            const regex = /^\d{5}$/;
            
            if (regex.test(sonaID)) {
                // If valid, show the entered SONA ID and enable the button.
                sonaConfirmation.innerText = `You entered: ${sonaID}`;
                sonaConfirmation.style.display = "block";
                nextButton.disabled = false;
            } else {
                // If not valid, display an error message and disable the button.
                sonaConfirmation.innerText = "SONA ID must be exactly 5 digits.";
                sonaConfirmation.style.display = "block";
                nextButton.disabled = true;
            }
        }
        submit.addEventListener('click', () => {
            validateForm();
        });
        // Add event listeners for live validation
        // document.getElementById("sona_id").addEventListener("submit", validateForm);
        }, 1000);
    },
    on_finish: function(data) {
        console.log(data.response);

        const responses = data.response;
        const mandatory1 = responses.mandatory1 === "on";
        const mandatory2 = responses.mandatory2 === "on";

        if (!mandatory1 || !mandatory2) {
            repeatConsent = true; // Repeat the form if any mandatory field is not checked
        } else {
            repeatConsent = false; // Allow proceeding if all mandatory fields are checked
        }
        if (!repeatConsent) {

            localStorage.setItem("hasConsented", "true");

            const payload = {
                consent: {
                    mandatory1,
                    mandatory2,
                },
                participantId: window.participantId,  // Assuming you have a participantId stored somewhere
                surveyId: window.surveyId , // Assuming you have a surveyId stored somewhere
                userAgent: navigator.userAgent || "Unknown UA",
            };

            fetch('https://mzqm49npmk.execute-api.us-east-2.amazonaws.com/masterlist/MasterListPhase2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: window.participantId,
                    sonaId: sonaID
                })
            });
        }
    }
};

const message = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>In order to start the expeirment you need to agree to consent clauses.</p>`,
    choices: ["Go back to Consent form", "Exit the Experiment"], // Button labels
    on_finish: function(data) {
      if (data.response === 1) { // 'Exit' button is clicked
        repeatConsent = false; // Stop looping to exit the survey
        jsPsych.abortExperiment("You chose to exit the survey. Thank you for your participation.");
      } else if (data.response === 0) { // 'Retry' button is clicked
        repeatConsent = true; // Continue to retry the trial
        }
    }
};

const consent = {
    timeline: [
        consentForm, // Always show consent form first
        {
            timeline: [message], // Then, show message and repeat consent if necessary
            conditional_function: function() {
                return repeatConsent; // Only run if repeatConsent is true
            }
        }
    ],
    loop_function: function() {
        return repeatConsent; // Continue loop until consent is valid or the user exits
    }
};


export { consent }