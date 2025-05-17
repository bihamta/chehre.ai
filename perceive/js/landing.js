var questionnaire_intro = {
    type: jsPsychInstructions,
    pages: [
        '<div style="text-align:center;">' +
        '<h3>Step 1 of 6</h3>' +
        '<p text-align: center;>Please complete the  Mindfulness Questionnaires.</p>' +
        '</div>'
    ],
    show_clickable_nav: true
}

const label_intro = {
    type: jsPsychInstructions,
    pages: [
        `<div style="text-align:center;">
            <h3>Step 3 of 6</h3>
            <h2>Facial Expression Labeling Task</h2>
            <p style="font-size: 18px; max-width: 700px; margin: 0 auto; text-align: center;">
            In this task, you will label each video by selecting the facial expression(s) you believe best describe what the person is showing.</p>
        </div>`
    ],
    show_clickable_nav: true,
};

const emoji_intro = {
    type: jsPsychInstructions,
    pages: [
        `<div style="text-align:center;">
            <h3>Step 4 of 6</h3>
            <h2>Emoji Rating Task</h2>
            <p style="font-size: 18px; max-width: 700px; margin: 0 auto; text-align: center;">
            In this task, you will watch a series of short videos and rate how well a specific emoji matches the facial expression shown.</p>
        </div>`
    ],
    show_clickable_nav: true,
};

var demographic_intro = {
    type: jsPsychInstructions,
    pages: [
        '<div style="text-align:center;">' +
        '<h3>Step 2 of 6</h3>' +
        '<p text-align: center;>Please complete the Demographic Questionnaire.</p>' +
        '</div>'
    ],
    show_clickable_nav: true
}
const empathy_intro = {
    type: jsPsychInstructions,
    pages: [
        `<div style="text-align:center;">
            <h3>Step 5 of 6</h3>
            <h2>Empathy Questionnaire</h2>
            <p style="font-size: 18px; max-width: 700px; margin: 0 auto; text-align: center;">
            In the following section, you will be asked to reflect on how often certain statements apply to you.</p>
        </div>`
    ],
    show_clickable_nav: true
};
var final = {
    type: jsPsychInstructions,
    pages: [
        '<div style="text-align:center;">' +
        '<h3>Step 6 of 6</h3>' +
        '<p>Please answer one final question.</p>' +
        '</div>'
    ],
    show_clickable_nav: true
}

export {questionnaire_intro, label_intro, emoji_intro, demographic_intro, empathy_intro, final};