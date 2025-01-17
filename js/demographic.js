import { addExitButton } from './utils.js';
const countryList = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
    "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", 
    "Czech Republic (Czechia)", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
    "Eswatini (fmr. Swaziland)", "Ethiopia", "Fiji", "Finland", "France", "Gabon", 
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", 
    "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", 
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", 
    "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", 
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", 
    "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
    "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", 
    "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", 
    "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
    "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", 
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", 
    "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", 
    "Prefer not to say"
];


const age = {
    type: jsPsychSurveyMultiChoice,
    // preamble: `<h2 id="instruction">Please answer the following demographic questions.</h2>`,
    questions: [
        {
            prompt: "What is your age group?",
            options: [
                "Under 18", "18-24", "25-29", "30-34", "35-39",
                "40-49", "50-64", "65 and older"
            ],
            required: true
        }
    ],
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    }
};

const gender = {
    type: jsPsychSurveyMultiChoice,
    // preamble: ``,
    questions: [
        {
            prompt: "What is your gender identity?",
            options: ["Woman", "Man", "Other", "Prefer not to say"],
            required: true
        }
    ],
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    }
};

const countryOptions = countryList.map(country => `<option value="${country}">${country}</option>`).join("");

const country = {
    type: jsPsychSurveyMultiChoice,
    // preamble: `<h2 id="instruction">Please answer the demographic questions.</h2>`,
    questions: [
        {
            prompt: "Please indicate whether you were born in Canada.",
            options: ["Yes", "No"],
            required: true
        }
    ],
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    },
    on_finish: function(data) {
        // Store the answer to medi1 (whether formal meditation was practiced)
        data.medi1_response = data.response.Q0;
    }
};

// Create the dropdown trial
const country_of_birth = {
    type: jsPsychSurveyHtmlForm,
    // preamble: '<p>Please select your country of birth:</p>',
    html: `
        <div>
            <p class="jspsych-survey-multi-choice-text">Country of Birth:</p>
            <select id="country" name="country" required >
                <option value="">Select your country</option><br>
                ${countryOptions}
            </select>
            <br><br>            
        </div>
    `,
    button_label: "Submit",
    on_load: function() {
        addExitButton();  // Call the function to add the Exit button
    },
    on_finish: function(data) {
        console.log(data.response); // Logs the selected country
    },
};


export {country, age, gender, country_of_birth };

