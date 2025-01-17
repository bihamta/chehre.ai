// Welcome
import {welcome} from './welcome.js';
import {consent} from './consent.js'

import { thank, emoji, facialdynamics, questionnaire } from './landing.js';
// Questionnaire
import {country, age, gender, country_of_birth } from './demographic.js';
import {medi} from './mindfulness.js';

// Video Recordings 1
import {init_camera, neutral_trial } from './neutral.js';
import {emoji_trial} from './emojis.js';
import {au_trial} from './aus.js';

// Video Recordings 2 - Scenario Prompts
// import

// End
import { goodbye, honesty } from './thanks.js';



jsPsych.getProgress()

const timeline = [];

// Add trials to the timeline
timeline.push(welcome);
timeline.push(questionnaire);
timeline.push(consent);
timeline.push(age);
timeline.push(gender);
timeline.push(country);
timeline.push(country_of_birth);
timeline.push(medi)
timeline.push(facialdynamics)
timeline.push(init_camera)
timeline.push(neutral_trial)
timeline.push(au_trial);
timeline.push(emoji)
for (let i = 0; i < 2; i++) {
    timeline.push(emoji_trial)
}
timeline.push(thank)
timeline.push(honesty, goodbye)


// Run the experiment
jsPsych.run(timeline);