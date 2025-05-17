const empathy = {
    type: jsPsychSurveyLikert,
    preamble: "<h3>Please indicate how true each statement is for you.</h3>",
    questions: [
        {
        prompt: "I can easily recognize what others are feeling.",
        name: "recognize_feelings",
        labels: [
            "Never or Very Rarely True",
            "Rarely True",
            "Sometimes True",
            "Often True",
            "Very Often or Always True"
        ],
        required: true
        },
        {
        prompt: "I am good at anticipating how someone may feel about a situation.",
        name: "anticipate_feelings",
        labels: [
            "Never or Very Rarely True",
            "Rarely True",
            "Sometimes True",
            "Often True",
            "Very Often or Always True"
        ],
        required: true
        },
        {
        prompt: "Other people often tell me I am good at understanding what they are feeling or thinking.",
        name: "others_tell_me",
        labels: [
            "Never or Very Rarely True",
            "Rarely True",
            "Sometimes True",
            "Often True",
            "Very Often or Always True"
        ],
        required: true
        }
    ],
    on_finish: function(data) {
        const response = data.response;
        const payload = {
        participantId: window.participantId,
        empathyResponses: response
        };

        console.log("Sending empathy responses =>", payload);

        fetch("https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/SaveSurveyResponse_phase2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(serverResp => {
        console.log("Empathy responses update success:", serverResp);
        })
        .catch(err => {
        console.error("Error sending empathy responses:", err);
        });
    }
};

export { empathy };
