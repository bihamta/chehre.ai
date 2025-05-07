const validPasswords = ["Zoe-202505", "Avneet-202505", "Bita-202505"];
let granted = false;
let researcherName = "";

const passwordTrial = {
    type: jsPsychSurveyText,
    questions: [
        {
        prompt: "Please enter the researcher password to begin:",
        name: "password",
        input_type: "password"
        }
    ],
    button_label: "Submit",
    on_finish: function(data) {
        const response = data.response;
        const pw = response.password?.trim();
        data.correct = validPasswords.includes(response.password.trim());
        granted = data.correct;

        if (granted && pw.includes("-")) {
            researcherName = pw.split("-")[0];
            window.rater = researcherName;
        } else if (granted) {
            researcherName = "Researcher";
        }
    }
};

const invalidPassword = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p style='color:red;'>Incorrect password. Please try again.</p>",
    choices: ['Retry']
};

const successScreen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
        return `<p style='color:green;'>Access granted. Welcome, ${researcherName}.</p>`;
    },
    choices: ['Continue']
};

const passwordLoop = {
    timeline: [
        passwordTrial,
        {
            timeline: [invalidPassword],
            conditional_function: function() {
                return !granted;
            }
        },
        {
            timeline: [successScreen],
            conditional_function: function() {
                return granted;
            }
        }
    ],
    loop_function: function() {
        return !granted;
    }
};


export { passwordLoop}