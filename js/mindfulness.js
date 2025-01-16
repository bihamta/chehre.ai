const medi1 = {
    type: jsPsychSurveyMultiChoice,
    preamble: `
    <p id="instruction">Answer this question about meditation:</p>
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
            options: ["Yes", "No"],
            required: true
        }
    ]
};

const medi2 = {
    type: jsPsychSurveyMultiChoice,
    preamble: `<p id="instruction">Answer the following question about the frequency of your formal meditation practice.</p>`,
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
    ]
};

const medi3 = {
    type: jsPsychSurveyMultiChoice,
    preamble: `<p id="instruction">Answer the following question about the duration of your formal meditation practice.</p>`,
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
    ]
};

const medi4 = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>Answer this question about today's formal meditation practice:</p>`,
    html: `
        <div style="font-size: 16px;">
            <label for="meditation-today" style="font-weight: bold; color: #4CAF50;">5. Did you practice formal meditation today?</label><br><br>
            
            <input type="radio" id="yes" name="meditation-today" value="yes" onclick="document.getElementById('minutes-input').style.display = 'block';" required>
            <label for="yes">Yes (Please indicate how many minutes)</label>
            <br>
            <input type="text" id="minutes-input" name="meditation-minutes" placeholder="E.g., 15 minutes" style="display: none; margin-top: 10px; padding: 5px; width: 200px; border: 1px solid #ccc; border-radius: 5px;">
            <br><br>
            
            <input type="radio" id="no" name="meditation-today" value="no" onclick="document.getElementById('minutes-input').style.display = 'none';">
            <label for="no">No</label>
        </div>
    `,
    button_label: "Submit",
    on_finish: function(data) {
        console.log(data.response); // Logs the response including the minutes if applicable
    }
};


const medi5 = {
    type: jsPsychSurveyLikert,
    preamble: `<p style="font-weight: bold; color: #4CAF50;">6. Please use the descriptions provided to indicate how true the below statements are of you.</p>
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
    randomize_question_order: false // Keeps the question order fixed
};



export { medi1, medi2, medi3, medi4, medi5 };
