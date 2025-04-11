// ## Import all the modules 
import { welcome } from './welcome.js';
import { consent } from './consent.js';
import { goodbye, honesty } from './thanks.js';
import { thank } from './landing.js';

// ## Build the timeline
const timeline = [];
// timeline.push(down);

// ## Welcome page
timeline.push(welcome);

// ## Consent page
const hasConsented = localStorage.getItem("hasConsented") === "true"; // Check if user has consented
if (!hasConsented) {
    timeline.push(consent);
}

timeline.push(thank);

// ## Honest feedback
timeline.push(honesty);
timeline.push(goodbye);

// ## Start the experiment
jsPsych.run(timeline);
