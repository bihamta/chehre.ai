// Check if participant has previously consented
const hasConsented = localStorage.getItem('hasConsented') === 'true';

// If consent was given before, treat it as an existing session
const hasExistingSession = hasConsented;

// Define button label
const buttonLabel = hasExistingSession ? 'Resume Experiment' : 'Start Experiment';

// Define instructions text
const instructionsText = hasExistingSession
    ? `<h2>Welcome back to Chehre.ai!</h2><br>
        <p id="thanks">Thank you again for participating in our study. You can click <strong>"Resume Experiment"</strong> to continue from where you left off.</p>
        <p id="thanks">If you encounter any issues, please refresh the page or contact us at <a href="mailto:bazari@sfu.ca">bazari@sfu.ca</a>.</p>
        <p id="thanks"><em>Note: Your progress is saved unless you clicked the "Exit" button during the study.</em></p>`
    : `<h1>Thank you for participating in Chehre.ai!</h1><br><br>
        <p id="thanks">We appreciate your time and contribution. If you leave the experiment by accident, your progress will be saved automatically and you can return to continue later.</p>
        <p id="thanks"><em>Note: Your progress is saved unless you clicked the "Exit" button during the study.</em></p>`;

// Define the jsPsych trial
const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: instructionsText,
    choices: [buttonLabel]
};

export { welcome };
