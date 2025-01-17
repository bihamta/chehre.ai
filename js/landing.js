var questionnaire = {
    type: jsPsychInstructions,
    pages: [
        'Step 1 of 4' +
        '<br>' +
        'Please complete the Demographic and Mindfulness Questionnaires.'
    ],
    show_clickable_nav: true
}
var facialdynamics = {
    type: jsPsychInstructions,
    pages: [
        'Step 2 of 4' +
        '<br>' +
        'We will now record Eye Gaze and Facial Muscle Movements.'
    ],
    show_clickable_nav: true
}
var emoji = {
    type: jsPsychInstructions,
    pages: [
        'Step 3 of 4' +
        '<br>' +
        'Please proceed to perform the Emojis task.'
    ],
    show_clickable_nav: true
}
var scenarios = {
    type: jsPsychInstructions,
    pages: [
        'Step 4 of 5' +
        '<br>' +
        'Perform Emojis'
    ],
    show_clickable_nav: true
}
var thank = {
    type: jsPsychInstructions,
    pages: [
        'Step 4 of 4' +
        '<br>' +
        'Please answer one final question.'
    ],
    show_clickable_nav: true
}

export {emoji, questionnaire, facialdynamics, thank}