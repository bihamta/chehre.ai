// Welcome
import {welcome} from './welcome.js';
import {consent} from './consent.js'
import { instruction_trial_1, instruction_trial_2 } from './instru.js';
import { thank, emoji, facialdynamics, questionnaire, demographic, emoji_reminder } from './landing.js';
// Questionnaire
import {demog } from './demographic.js';
import {medi} from './mindfulness.js';

// Video Recordings 1
import {init_camera, neutral_trial } from './neutral.js';
import {emojiTrials} from './emojis.js';
import {au_trials} from './aus.js';

// Video Recordings 2 - Scenario Prompts
// import

// End
import { goodbye, honesty } from './thanks.js';


console.log(window.surveyId)
// jsPsych.getProgress()

const timeline = [];

// Add trials to the timeline
timeline.push(welcome);
timeline.push(consent);
timeline.push(questionnaire);
// timeline.push(medi)
// timeline.push(instruction_trial_1);
// timeline.push(instruction_trial_2);
timeline.push(init_camera)
timeline.push(emoji)
timeline.push(emojiTrials)
timeline.push(facialdynamics)
timeline.push(neutral_trial)
timeline.push(au_trials);
timeline.push(demographic)
timeline.push(demog)
timeline.push(thank)
timeline.push(honesty, goodbye)


// Run the experiment
jsPsych.run(timeline);