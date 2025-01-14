var timeline = [];

var welcome = {
    type: 'html-keyboard-response',
    stimulus: 'Welcome to Chehre.ai! Press any key to begin.',
};

timeline.push(welcome);

var firstTrial = {
    type: 'html-button-response',
    stimulus: 'Click to continue!',
    choices: ['Continue'],
};

timeline.push(firstTrial);

jsPsych.init({
    timeline: timeline,
    on_finish: function () {
        jsPsych.data.displayData();
    }
});
