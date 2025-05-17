import { addExitButton } from './utils.js';

// -------------------
// 1. Country List
// -------------------
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

// We store the final user ethnicity selections here (global), so we can read them in on_finish
window.collectedEthnicity = null;

const countryOptions = countryList
  .map(country => `<option value="${country}">${country}</option>`)
  .join("");

// -------------------
// 2. Survey HTML
// -------------------
const demog_html = `
<form id="demog-form">
  <!-- Page 1: Age -->
  <div class="page" id="page-1">
    <h2>Demographic Questions</h2>
    <p>What is your age group?</p>
    <div id="demog_q">
      <input type="radio" name="age" value="Under 18" required> Under 18<br>
      <input type="radio" name="age" value="18-21"> 18-21<br>
      <input type="radio" name="age" value="22-25"> 22-25<br>
      <input type="radio" name="age" value="26-29"> 26-29<br>
      <input type="radio" name="age" value="27-29"> 27-29<br>
      <input type="radio" name="age" value="30-33"> 30-33<br>
      <input type="radio" name="age" value="35-39"> 35-39<br>
      <input type="radio" name="age" value="40-49"> 40-49<br>
      <input type="radio" name="age" value="50-64"> 50-64<br>
      <input type="radio" name="age" value="65 and older"> 65 and older
    </div>
  </div>
  
  <!-- Page 2: Gender -->
  <div class="page" id="page-2" style="display:none;">
    <p>What is your gender identity?</p>
    <div id="demog_q">
      <input type="radio" name="gender" value="Woman" required> Woman<br>
      <input type="radio" name="gender" value="Man"> Man<br>
      <input type="radio" name="gender" value="Other"> Other<br>
      <input type="radio" name="gender" value="Prefer not to say"> Prefer not to say
    </div>
  </div>
  
  <!-- Page 3: Born in Canada? -->
  <div class="page" id="page-3" style="display:none;">
    <p>Please indicate whether you were born in Canada.</p>
    <div id="demog_q">
      <input type="radio" name="bornInCanada" value="Yes" required> Yes<br>
      <input type="radio" name="bornInCanada" value="No"> No
    </div>
  </div>
  
  <!-- Page 4: Country of Birth -->
  <div class="page" id="page-4" style="display:none;">
    <p>Country of Birth:</p>
    <select name="countryOfBirth" required>
      <option value="">Select your country</option>
      ${countryOptions}
    </select>
  </div>
  
  <!-- Page 5: Ethnicity -->
  <div class="page" id="page-5" style="display:none;">
    <p>What is the region of origin or cultural identity of your ancestors?</p>
    <div id="demog_q">
      <input type="checkbox" name="ethnicity" value="North Africa"> North Africa<br>
      <input type="checkbox" name="ethnicity" value="Africa"> Africa (not including North African countries)<br>
      <input type="checkbox" name="ethnicity" value="Central America"> Central America<br>
      <input type="checkbox" name="ethnicity" value="South America"> South America<br>
      <input type="checkbox" name="ethnicity" value="Eastern Europe"> Eastern Europe<br>
      <input type="checkbox" name="ethnicity" value="Western Europe"> Western Europe<br>
      <input type="checkbox" name="ethnicity" value="Middle East or West Asia"> Middle East or West Asia<br>
      <input type="checkbox" name="ethnicity" value="East Asia"> East Asia<br>
      <input type="checkbox" name="ethnicity" value="Central Asia"> Central Asia<br>
      <input type="checkbox" name="ethnicity" value="South Asia"> South Asia<br>
      <input type="checkbox" name="ethnicity" value="Southeast Asia"> Southeast Asia<br>
      <input type="checkbox" name="ethnicity" value="Polynesia or Pacific Islands"> Polynesia or Pacific Islands<br>
      <input type="checkbox" name="ethnicity" value="Indigenous groups (in North America)"> Indigenous groups (in North America)<br>
      <input type="checkbox" name="ethnicity" value="Indigenous groups (in Oceania)"> Indigenous groups (in Oceania)<br>
      <input type="checkbox" name="ethnicity" id="ethnicity-other" value="Other"> Other (Please specify)
    </div>
    <div id="ethnicity-other-container" style="display:none; margin-top:10px;">
      <label for="ethnicity-other-text">Please specify:</label>
      <input type="text" id="ethnicity-other-text" placeholder="Enter your ethnicity" />
    </div>
    
    <div id="warning" style="font-style: italic; color: red; margin-top: 5px;"></div>
  </div>
  
  <!-- Page 6: Language at Home -->
  <div class="page" id="page-6" style="display:none;">
    <p>What language(s) do you speak at home? <br><small>(Select all that apply)</small></p>
    <div id="language_q">
      <input type="checkbox" name="languageHome" value="English"> English<br>
      <input type="checkbox" name="languageHome" value="French"> French<br>
      <input type="checkbox" name="languageHome" value="Spanish"> Spanish<br>
      <input type="checkbox" name="languageHome" value="Mandarin"> Mandarin<br>
      <input type="checkbox" name="languageHome" value="Cantonese"> Cantonese<br>
      <input type="checkbox" name="languageHome" value="Arabic"> Arabic<br>
      <input type="checkbox" name="languageHome" value="Farsi (Persian)"> Farsi (Persian)<br>
      <input type="checkbox" name="languageHome" value="Hindi"> Hindi<br>
      <input type="checkbox" name="languageHome" value="Punjabi"> Punjabi<br>
      <input type="checkbox" name="languageHome" value="Tagalog"> Tagalog<br>
      <input type="checkbox" name="languageHome" value="Vietnamese"> Vietnamese<br>
      <input type="checkbox" name="languageHome" value="Korean"> Korean<br>
      <input type="checkbox" name="languageHome" value="Russian"> Russian<br>
      <input type="checkbox" name="languageHome" value="Portuguese"> Portuguese<br>
      <input type="checkbox" name="languageHome" value="Urdu"> Urdu<br>
      <input type="checkbox" name="languageHome" value="German"> German<br>
      <input type="checkbox" name="languageHome" value="Italian"> Italian<br>
      <input type="checkbox" name="languageHome" value="Japanese"> Japanese<br>
      <input type="checkbox" name="languageHome" value="Turkish"> Turkish<br>
      <input type="checkbox" name="languageHome" value="Hebrew"> Hebrew<br>
      <input type="checkbox" name="languageHome" value="Bengali"> Bengali<br>
      <input type="checkbox" name="languageHome" value="Swahili"> Swahili<br>
      <input type="checkbox" name="languageHome" value="Malay / Indonesian"> Malay / Indonesian<br>
      <input type="checkbox" name="languageHome" value="Cree"> Cree<br>
      <input type="checkbox" name="languageHome" value="Ojibwe"> Ojibwe<br>
      <input type="checkbox" name="languageHome" value="Inuktitut"> Inuktitut<br>
      <input type="checkbox" name="languageHome" value="Other" id="language-other"> Other (Please specify)
    </div>
    <div id="language-other-container" style="display:none; margin-top:10px;">
      <label for="language-other-text">Please specify:</label>
      <input type="text" id="language-other-text" placeholder="Enter language(s)">
    </div>
    <div id="language-warning" style="font-style: italic; color: red; margin-top: 5px;"></div>  
  </div>

  <!-- Page 7: Marital Status -->
  <div class="page" id="page-7" style="display:none;">
    <p>What is your current marital status?</p>
    <div id="demog_q">
      <input type="radio" name="marital" value="Married" required> Married<br>
      <input type="radio" name="marital" value="Common law"> Common law<br>
      <input type="radio" name="marital" value="Divorced or Separated"> Divorced or Separated<br>
      <input type="radio" name="marital" value="Widowed"> Widowed<br>
      <input type="radio" name="marital" value="Dating"> Dating<br>
      <input type="radio" name="marital" value="Single"> Single
    </div>
  </div>
  
  <!-- Navigation Buttons -->
  <div id="navigation-buttons">
    <br><br>
    <button type="button" id="back-button" class="jspsych-btn" style="display:none;">Back</button>
    <button type="button" id="next-button" class="jspsych-btn" style="display:inline;">Next</button>
  </div>

  <!-- Hidden plugin button (we trigger it programmatically) -->
  <input type="submit" id="jspsych-survey-html-form-next" value="Continue" style="display:none;">
</form>
`;

// -------------------
// 3. The Trial
// -------------------
const demog = {
  type: jsPsychSurveyHtmlForm,
  html: demog_html,

  on_load: function() {
    // Hide the plugin's default button using a <style> injection
    const style = document.createElement("style");
    style.id = "hide-continue-button";
    style.innerHTML = `
      #jspsych-survey-html-form-next {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // If you want an exit button
    addExitButton();

    let currentPage = 1;
    const pageHistory = [];
    const warning = document.getElementById('warning');
    warning.innerText = "";

    // Hide all pages except the first
    const pages = document.querySelectorAll('.page');
    pages.forEach(pg => pg.style.display = 'none');
    document.getElementById('page-1').style.display = 'block';

    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');

    // Show/Hide the "Other" text field
    const otherCheckbox = document.getElementById("ethnicity-other");
    const otherTextContainer = document.getElementById("ethnicity-other-container");
    const otherTextInput = document.getElementById("ethnicity-other-text");

    otherCheckbox.addEventListener("change", function() {
      if (this.checked) {
        otherTextContainer.style.display = "block";
      } else {
        otherTextContainer.style.display = "none";
        otherTextInput.value = "";
      }
    });

    const languageOtherCheckbox = document.getElementById("language-other");
    const languageOtherContainer = document.getElementById("language-other-container");
    const languageOtherInput = document.getElementById("language-other-text");

    languageOtherCheckbox.addEventListener("change", function() {
      if (this.checked) {
        languageOtherContainer.style.display = "block";
      } else {
        languageOtherContainer.style.display = "none";
        languageOtherInput.value = "";
      }
    });

    // Back Button Handler
    backButton.addEventListener('click', function() {
      if (pageHistory.length > 0) {
        const prevPage = pageHistory.pop();
        document.getElementById(`page-${currentPage}`).style.display = 'none';
        document.getElementById(`page-${prevPage}`).style.display = 'block';
        currentPage = prevPage;

        if (pageHistory.length === 0) {
          backButton.style.display = 'none';
        }
        nextButton.textContent = 'Next';
      }
    });

    // Next Button Handler
    nextButton.addEventListener('click', function() {
      const currentDiv = document.getElementById(`page-${currentPage}`);
      const inputs = currentDiv.querySelectorAll('select, input[type="radio"]');

      // Basic built-in validation for radio/select
      let valid = true;
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          valid = false;
          input.reportValidity();
        }
      });
      if (!valid) return;

      // If we're on page 5, do custom ethnicity checks
      if (currentPage === 5) {
        // 1) Ensure at least one box is checked
        const ethnicityCheckboxes = document.querySelectorAll('input[name="ethnicity"]');
        const anyChecked = Array.from(ethnicityCheckboxes).some(chk => chk.checked);
        if (!anyChecked) {
          warning.innerText = "Please select at least one of the above options.";
          return;
        } else {
          warning.innerText = "";
        }

        // 2) If "Other" is checked, ensure text is not empty
        if (otherCheckbox.checked) {
          if (!otherTextInput.value.trim()) {
            warning.innerText = "Please specify your ethnicity in the text box.";
            return;
          }
        }

        // 3) If checks pass, gather ethnicity **right now** and store in global
        const selectedEthnicities = [];
        ethnicityCheckboxes.forEach(chk => {
          if (chk.checked) {
            selectedEthnicities.push(chk.value);
          }
        });
        // If "Other" is typed, append it to the array
        if (otherCheckbox.checked && otherTextInput.value.trim()) {
          selectedEthnicities.push(otherTextInput.value.trim());
        }

        // Save to global so that we can access in on_finish
        window.collectedEthnicity = selectedEthnicities;

      }

      if (currentPage === 6) {
        const checkboxes = document.querySelectorAll('input[name="languageHome"]');
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        const warn = document.getElementById("language-warning");
      
        if (!anyChecked) {
          warn.innerText = "Please select at least one language.";
          return;
        }
        if (languageOtherCheckbox.checked && !languageOtherInput.value.trim()) {
          warn.innerText = "Please specify your language.";
          return;
        }
        warn.innerText = "";
      
        // collect selections
        const langs = [];
        checkboxes.forEach(cb => {
          if (cb.checked && cb.value !== "Other") langs.push(cb.value);
        });
        if (languageOtherCheckbox.checked) {
          langs.push(languageOtherInput.value.trim());
        }
        window.collectedLanguage = langs;
      }
      

      // Determine next page
      let nextPage;
      if (currentPage === 3) {
        // If "Yes" => skip page 4
        const bornVal = document.querySelector('input[name="bornInCanada"]:checked');
        if (bornVal && bornVal.value === "Yes") {
          const countryField = document.querySelector('select[name="countryOfBirth"]');
          if (countryField) countryField.removeAttribute('required');
          nextPage = 5;
        } else {
          nextPage = 4;
        }
      } else {
        nextPage = currentPage + 1;
      }

      if (nextPage > 7) {
        // Final => programmatically click hidden submit
        document.getElementById("jspsych-survey-html-form-next").click();
        return;
      } else {
        pageHistory.push(currentPage);
        document.getElementById(`page-${currentPage}`).style.display = 'none';
        document.getElementById(`page-${nextPage}`).style.display = 'block';
        currentPage = nextPage;

        if (pageHistory.length > 0) {
          backButton.style.display = 'inline';
        }
        nextButton.textContent = (currentPage === 7) ? 'Submit' : 'Next';
      }
    });
  },

  on_finish: function(data) {
    console.log("Demographics data (plugin):", data.response);

    // Try to parse the plugin's data
    let responses = data.response;
    console.log("Parsed Demographics data:", responses);
    // If user was born in Canada, there's no "countryOfBirth" field from the plugin, so default "Canada"
    if (!responses.countryOfBirth) {
      responses.countryOfBirth = "Canada";
    }

    // Merge the ethnicity array we collected on Page 5
    responses.ethnicity = window.collectedEthnicity || null;
    responses.languageHome = window.collectedLanguage || null;

    console.log("age", responses.age);
    // We'll also store just the "Other" text if you want it separately
    let ethnicityOtherVal = null;
    if (window.collectedEthnicity && window.collectedEthnicity.length) {
      // If user typed custom text, it will be the last array element if "Other" was typed
      // This is optional logic, but you can do:
      const typedOther = document.getElementById("ethnicity-other-text")?.value?.trim();
      if (typedOther) ethnicityOtherVal = typedOther;
    }

    
    // Build final payload
    const payload = {
      participantId: window.participantId,
      participantId: window.participantId,
      ageGroup: responses.age,
      gender: responses.gender,
      bornInCanada: responses.bornInCanada,
      countryOfBirth: responses.countryOfBirth,
      ethnicity: responses.ethnicity,
      languageHome: responses.languageHome,
      maritalStatus: responses.marital
    };
    console.log("Sending payload =>", payload);

    // Send it to your server
    fetch("https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/SaveSurveyResponse_phase2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(serverResp => {
      console.log("Demographics partial update success:", serverResp);
    })
    .catch(err => {
      console.error("Error updating demog data:", err);
    });
    localStorage.setItem("hasDemog", "true");
    // Remove the style that hides the continue button
    const styleElement = document.getElementById("hide-continue-button");
    if (styleElement) styleElement.remove();
  }
};

export { demog };
