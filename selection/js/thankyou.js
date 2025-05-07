const goodbye = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
        <h2>Thank You!</h2>
    `,
    html: `
        <div class="fc-container">
            <p id="thanks">All videos were rated.</p>
        </div>
    `,
    button_label: "Finish",
    on_finish: function(data) {
        jsPsych.abortExperiment("You may close this window now.");
    }
};

export {goodbye}