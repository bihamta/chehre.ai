import { addExitButton } from './utils.js';

const medi1 = {
    type: jsPsychSurveyMultiChoice,
    data: { questionType: "Medi1" },
    preamble: `
    <p id="instruction">Answer this question about meditation and mindfulness:</p>
    <p style="font-weight: bold; color: green;">Note:</p>
    <p style="font-style: italic; color: darkgray;">
        Formal practice is when you set aside time to engage in meditation. 
        For example, scheduling 15 minutes to sit and focus on your breath. 
        Just taking a moment to notice your breath during the day would be 
        informal practice and thus your answer should be no.
    </p>`,
    questions: [
        {
            prompt: "Have you ever practiced formal meditation?",
            options: ["Yes", "No"],
            required: true
        },
        {
            prompt: "Is your formal meditation yoga?",
            options: ["Yes", "No", "N/A"],
            required: true
        }
    ],
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    },
    on_finish: function(data) {
        // Store the answer to medi1 (whether formal meditation was practiced)
        if (data.response){
            data.medi1_response = data.response.Q0;
            console.log(data.medi1_response)
        }
    }
};

const medi2 = {
    type: jsPsychSurveyMultiChoice,
    data: { questionType: "Medi2" },
    // preamble: `<p id="instruction">Answer the following question about the frequency of your formal meditation practice.</p>`,
    questions: [
        {
            prompt: "How often do you engage in formal meditation?",
            options: [
                "Everyday",
                "About 4-5 times per week",
                "About 2-3 times per week",
                "About once a week",
                "About 2-3 times a month",
                "About once a month",
                "Less than once a month"
            ],
            required: true
        }
    ],
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    }
};

const medi3 = {
    type: jsPsychSurveyMultiChoice,
    data: { questionType: "Medi3" },
    // preamble: `<p id="instruction">Answer the following question about the duration of your formal meditation practice.</p>`,
    questions: [
        {
            prompt: "How long have you been engaging in formal meditation?",
            options: [
                "6 months or less",
                "6 months to 1 year",
                "1 to 2 years",
                "2 to 3 years",
                "3+ years"
            ],
            required: true
        }
    ],
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    }
};

const medi4 = {
    type: jsPsychSurveyHtmlForm,
    data: { questionType: "Medi4" },
    // preamble: `<p>Answer this question about today's formal meditation practice:</p>`,
    html: `
            <p class="jspsych-survey-multi-choice-text survey-multi-choice">Did you practice formal meditation today?</p><br><br>
            <p>    
            <input type="radio" id="yes" name="meditation-today" value="yes" onclick="document.getElementById('minutes-input').style.display = 'block';" required>
            <label for="yes">Yes (Please indicate how many minutes)</label>
            <br>
            <input type="text" id="minutes-input" name="meditation-minutes" placeholder="E.g., 15 minutes" style="display: none; margin-top: 10px; padding: 5px; width: 200px; border: 1px solid #ccc; border-radius: 5px;">
            <br><br>
            
            <input type="radio" id="no" name="meditation-today" value="no" onclick="document.getElementById('minutes-input').style.display = 'none';">
            <label for="no">No</label>
        </p>
    `,
    button_label: "Submit",
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    },
    on_finish: function(data) {
        console.log(data.response); // Logs the response including the minutes if applicable
    }
};


const medi5 = {
    type: jsPsychSurveyLikert,
    data: { questionType: "Medi5" },
    preamble: `<p  <p class="jspsych-survey-multi-choice-text survey-multi-choice"> Please use the descriptions provided to indicate how true the below statements are of you.</p>
            <p style="font-style: italic; color: darkgray;">Select the option which represents your own opinion of what is generally true for you.</p>`,
    questions: [
        {
            prompt: "When I take a shower or a bath, I stay alert to the sensations of water on my body.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I’m good at finding words to describe my feelings.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I don’t pay attention to what I’m doing because I’m daydreaming, worrying, or otherwise distracted.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I believe some of my thoughts are abnormal or bad and I shouldn’t think that way.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "When I have distressing thoughts or images, I 'step back' and am aware of the thought or image without getting taken over by it.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I notice how foods and drinks affect my thoughts, bodily sensations, and emotions.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I have trouble thinking of the right words to express how I feel about things.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I do jobs or tasks automatically without being aware of what I’m doing.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I think some of my emotions are bad or inappropriate and I shouldn’t feel them.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "When I have distressing thoughts or images, I am able just to notice them without reacting.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I pay attention to sensations, such as the wind in my hair or sun on my face.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "Even when I’m feeling terribly upset, I can find a way to put it into words.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I find myself doing things without paying attention.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "I tell myself I shouldn’t be feeling the way I’m feeling.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        },
        {
            prompt: "When I have distressing thoughts or images, I just notice them and let them go.",
            labels: ["Never or very rarely true", "Rarely True", "Sometimes True", "True Often True", "Very often or always true"],
            required: true
        }
    ],
    randomize_question_order: false, // Keeps the question order fixed
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    }
};


// Conditionally add medi2, medi3, and medi4, or skip to medi5
const medi = {
timeline: [
    medi1,
    {
    timeline: [medi2, medi3, medi4], 
    conditional_function: function() {
        // Only show medi2, medi3, and medi4 if the answer to medi1 was "Yes"
        const medi1_response = jsPsych.data.get().last(1).select('medi1_response').values[0];
        console.log(medi1_response)
        return medi1_response === "Yes";  // Check if the answer was "Yes"
        }
    },
    medi5
],
    on_timeline_finish: function() {
        // 1) Collect data from these 5 trials
        const timelineData = jsPsych.data.getLastTimelineData().values();

        let formalMeditation = null; // "Yes" or "No"
        let yoga = null; // "Yes" / "No" / "N/A"
        let meditationFrequency = null; // e.g. "About once a week"
        let meditationDuration = null; // e.g. "6 months or less"
        let meditationToday = null; // "yes" or "no"
        let meditationTodayMins = null; // e.g. "15 minutes"
        let mindfulnessResponses = null; // we could store all medi5 answers as an array

        timelineData.forEach((trial) => {
            if (!trial.response) return;

            switch (trial.questionType) {
                case "Medi1":
                    // trial.response.Q0 => "Yes" or "No" (Have you ever practiced?)
                    // trial.response.Q1 => "Yes", "No", or "N/A" (Yoga?)
                    formalMeditation = trial.response.Q0;
                    yoga = trial.response.Q1;
                    break;

                case "Medi2":
                    // trial.response.Q0 => "Everyday" etc.
                    meditationFrequency = trial.response.Q0;
                    break;

                case "Medi3":
                    // trial.response.Q0 => "6 months or less", ...
                    meditationDuration = trial.response.Q0;
                    break;

                case "Medi4":
                    // "survey-html-form" returns something like:
                    // trial.response["meditation-today"] => "yes" or "no"
                    // trial.response["meditation-minutes"] => "15" (if "yes" was selected)
                    meditationToday = trial.response["meditation-today"];
                    if (meditationToday === "yes") {
                        meditationTodayMins = trial.response["meditation-minutes"] || "";
                    }
                    break;

                case "Medi5":
                    // This is the big Likert. 
                    // You could store as an array of the numeric indices. 
                    // For example:
                    // trial.response.Q0 => "0" to "4" as strings
                    // trial.response.Q1 => "0" to "4" ...
                    // etc.
                    mindfulnessResponses = trial.response;
                    console.log(mindfulnessResponses)
                    break;
            }
        });

        // 2) Build partial-update payload 
        // (Pick any column names you want in Dynamo)
        const payload = {
            surveyId: window.surveyId,
            participantId: window.participantId,
            formalMeditation,     // e.g. "Yes" or "No"
            yoga,                 // e.g. "Yes"/"No"/"N/A"
            meditationFrequency,  // e.g. "Everyday"/"Once a week" ...
            meditationDuration,   // e.g. "6 months or less"
            meditationToday,      // "yes" or "no"
            meditationTodayMins,  // e.g. "15 minutes"
            // For the 15-likert:
            mindfulnessResponses  // An object with Q0..Q14 => "0"-"4"
        };

        console.log("Medi timeline payload:", payload);

        // 3) POST once to your “survey” Lambda for partial update
        fetch("https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Meditation partial update success:", data);
            })
            .catch(err => {
                console.error("Error updating meditation data:", err);
            });
    }
};

export { medi };
