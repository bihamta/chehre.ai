var questionnaire = {
    type: jsPsychInstructions,
    pages: [
        'Step 1 of 5' +
        '<br>' +
        'Please complete the  Mindfulness Questionnaires.'
    ],
    show_clickable_nav: true
}
var facialdynamics = {
    type: jsPsychInstructions,
    pages: [
        'Step 3 of 5' +
        '<br>' +
        'We will now record Eye Gaze and Facial Muscle Movements.'
    ],
    show_clickable_nav: true
}
var emoji = {
    type: jsPsychInstructions,
    pages: [
        'Step 2 of 5' +
        '<br>' +
        'Please proceed to perform the Emojis task.' +
        '<br>' +
        'Make sure that your hands are not visible in the camera frame.' +
        '<br>' +
        'Start with a neutral face and then perform the expression shown by the emoji.' +
        '<br>' +
        'Try to maintain a consistent distance from the camera.'
    ],
    show_clickable_nav: true
}
var emoji_reminder = {
    type: jsPsychInstructions,
    pages: [
        'Just a reminder!' +
        '<br>' +
        'Make sure that your hands are not visible in the camera frame.' +
        '<br>' +
        'Start with a neutral face and then perform the expression shown by the emoji.' +
        '<br>' +
        'Try to maintain a consistent distance from the camera.'
    ],
    show_clickable_nav: true
}
var demographic = {
    type: jsPsychInstructions,
    pages: [
        'Step 4 of 5' +
        '<br>' +
        'Please complete the Demographic Questionnaire'
    ],
    show_clickable_nav: true
}
var thank = {
    type: jsPsychInstructions,
    pages: [
        'Step 5 of 5' +
        '<br>' +
        'Please answer one final question.'
    ],
    show_clickable_nav: true
}

export {emoji, questionnaire, demographic, facialdynamics, thank, emoji_reminder}