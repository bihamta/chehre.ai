const unusedEmojis = localStorage.getItem('unusedEmojis');
const emojiCounter = localStorage.getItem('emojiCounter');

// If either key is present, we assume there's an existing session to resume
const hasExistingSession = unusedEmojis || emojiCounter;

// Conditionally define the label
const buttonLabel = hasExistingSession ? 'Resume Experiment' : 'Start Experiment';

// You could also tweak the text:
const instructionsText = hasExistingSession
    ? `<h1>Welcome back to Chehre.ai</h1><br>`
    : `<h1>Welcome to Chehre.ai</h1><br>`;

// Define the jsPsych trial:
const welcome = {
    type: jsPsychHtmlButtonResponse,
    stimulus: instructionsText,
    choices: [ buttonLabel ]
};

export { welcome };
