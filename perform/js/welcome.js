const unusedEmojis = localStorage.getItem('unusedEmojis');
const emojiCounter = localStorage.getItem('emojiCounter');

// If either key is present, we assume there's an existing session to resume
const hasExistingSession = unusedEmojis || emojiCounter;

// Conditionally define the label
const buttonLabel = hasExistingSession ? 'Resume Experiment' : 'Start Experiment';

// You could also tweak the text:
const instructionsText = hasExistingSession
    ? `<h2>Chehre.ai</h2><br>
    <p id=thanks>You can click <strong>"Resume Experiment"</strong> to continue where you left off.</p>
    <p id=thanks>If you encounter any issues, please refresh the page or contact support (bazari@sfu.ca).</p>`
    : `<h1>Welcome to Chehre.ai</h1><br><br>
    <p id=thanks>If you accidentally leave the experiment, your progress will be saved automatically and you can continue again.</p>
    `;

// Define the jsPsych trial:
const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: instructionsText,
    choices: [ buttonLabel ]
};

export { welcome };
