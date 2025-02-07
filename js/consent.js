let repeatConsent = true;
let sonaID = "";
const consentForm = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
        <h2>Consent Form</h2>
        <p><strong>Phase One: Performing Facial Expressions</strong></p>
        <p><strong>Project Title:</strong> Chehre: Understanding the Language of Facial Expressions.</p>
        <p><strong>Principal Investigator:</strong> Dr. Angelica Lim (<a href="mailto:angelica@sfu.ca">angelica@sfu.ca</a>)</p>
        <p><strong>Co-Investigators:</strong> Dr. Hali Kil (<a href="mailto:hali_kil@sfu.ca">hali_kil@sfu.ca</a>)</p>
        <p><strong>Research Personnel:</strong> Bita Azari (<a href="mailto:bazari@sfu.ca">bazari@sfu.ca</a>)</p>
        <p><strong>Purpose of the Study:</strong> Thank you for your interest in our research. This project aims to create an anonymized dataset of facial expressions, deformations, poses, and other facial dynamics to train AI models capable of editing and generating realistic faces. The project will have applications in visual effects (VFX), psychology, and social science research.</p>
        <p>Your participation in this research will involve recording and uploading videos of your face as you perform facial expressions and movements in response to specific instructions or written scenarios. This study will take approximately 30 minutes to complete.</p>
        <p><strong>Benefits and Risks:</strong> No direct benefits or risks are expected for participants engaging in this study.</p>
        <p><strong>Confidentiality:</strong> We are committed to keeping your data secure and confidential throughout the study and dissemination process. The data collected will be securely stored and used only for research purposes. Please see the full details above in the consent form text.</p>
        <p><strong>Your rights:</strong> Your participation is voluntary, and you may withdraw at any time without penalty. Please contact us with any questions or concerns.</p>
    `,
    html: `
        <p><label><input type="checkbox" name="mandatory1"> I have read and understood the consent form and acknowledge that participation in this study requires recording and submitting video of myself performing different facial movements.</label></p>
        <p><label><input type="checkbox" name="mandatory2"> I agree that my responses to this survey may be used in secondary analyses, directly related to the aims of this research project.</label></p>
        <p><label><input type="checkbox" name="mandatory3"> I agree to the use of my videos for anonymized facial mapping, where my facial motions may be transferred onto synthetic or generated faces, ensuring that my identity cannot be recognized.</label></p>
        <p><label><input type="checkbox" name="optional1"> I agree that my de-identified data may be made available for future unspecified research projects unrelated to the specific aims of this study.</label></p>
        <p><label><input type="checkbox" name="optional2"> I agree that my identifiable video recordings may be included in research talks, conference presentations, or public datasets, as described in the consent form.</label></p>
        <div><label>SONA ID: <input type="text" id="sona_id" name="sona_id" placeholder="Enter your ID"></label>
        <button type="button" id="submit" style="margin-top: 15px;">
        <i class="fa-solid fa-check"></i>confirm</button></br>
        <span id="sonaConfirmation"style="font-style: italic; color: green;"></span></div></br>
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
        const mandatory3 = responses.mandatory3 === "on";
        const optional1 = responses.optional1 === "on";
        const optional2 = responses.optional2 === "on";

        if (!mandatory1 || !mandatory2 || !mandatory3) {
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
                    mandatory3,
                    optional1,
                    optional2,
                },
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
            fetch('https://mzqm49npmk.execute-api.us-east-2.amazonaws.com/masterlist/ml', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    surveyId: window.surveyId,
                    sonaId: sonaID
                })
            });
        }
    }
};

const message = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>In order to start the expeirment you need to agree to the mandetory consent clauses.</p>`,
    choices: ["Go back to Consent form", "Exit the Experiment"], // Button labels
    on_finish: function(data) {
      if (data.response === 1) { // 'Exit' button is clicked
        repeatConsent = false; // Stop looping to exit the survey
        const exited = "EXITED";
        const payload = {
            exited: exited,
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