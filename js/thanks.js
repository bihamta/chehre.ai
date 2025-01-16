const honesty = {
    type: jsPsychSurveyHtmlForm,
    preamble: `
        <p>Please provide an honest rating (1-5) of the quality of data provided, with a brief explanation of your rating.</p>
        <p>Your honest answer helps us to evaluate the source of variability in data, and/or exclude responses, with no impact on you as the respondent.</p>
    `,
    html: `
        <div>
            <label for="rating">Please rate the quality of your data (1-5):</label><br>
            <input type="radio" id="rating1" name="rating" value="1" required> 1
            <input type="radio" id="rating2" name="rating" value="2" required> 2
            <input type="radio" id="rating3" name="rating" value="3" required> 3
            <input type="radio" id="rating4" name="rating" value="4" required> 4
            <input type="radio" id="rating5" name="rating" value="5" required> 5
        </div>
        <br>
        <div>
            <label for="explanation">Please provide a brief explanation for your answer:</label><br>
            <textarea id="explanation" name="explanation" rows="5" cols="40" required></textarea>
        </div>
    `,
    button_label: "Submit",
    on_finish: function(data) {
        console.log(data.response); // Logs both responses for analysis
    }
};

export { honesty }
