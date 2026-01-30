function addExitButton() {
    // Create the Exit button dynamically
    if (document.getElementById('exit-button')) return; 

    const exitButton = document.createElement("button");
    exitButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Exit';
    // exitButton.style.position = "fixed"; // Position the button on the screen
    exitButton.style.right = "10px"; // Place the button 10px from the right side
    exitButton.style.bottom = "10px"; // Place the button 10px from the bottom
    exitButton.style.margin = "10px";
    exitButton.style.width = "80px";
    exitButton.style.padding = "8px 12px"; // Padding for better size
    exitButton.style.fontSize = "14px"; // Text size
    exitButton.style.backgroundColor = "rgb(182, 133, 133)"; // Pink background color
    exitButton.style.color = "white"; // Text color
    exitButton.style.border = "none"; // Remove the border
    exitButton.style.borderRadius = "4px"; // Rounded corners
    exitButton.style.cursor = "pointer"; // Pointer cursor on hover
    exitButton.style.transition = "background-color 0.3s ease";
    exitButton.id = "exit-button";
    document.body.appendChild(exitButton);

    // Add event listener to handle the exit button click
    exitButton.addEventListener("click", function() {
        const exited = "EXITED";
        exitButton.style.display = "none"; // Hide the button after it's clicked
    
        const startTime = parseInt(localStorage.getItem("studyStartTime"));
        const endTime = Date.now();
        const totalDurationMs = endTime - startTime;
        const totalDurationMinutes = Math.round(totalDurationMs / (1000 * 60) * 100) / 100;
    
        const payload = {
            exited,
            participantId: window.participantId,
            totalDurationMinutes
        };
    
        fetch("https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/SaveSurveyResponse_phase2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Exit data submitted successfully:", data);
            })
            .catch(error => {
                console.error("Error submitting exit data:", error);
            });
    
        jsPsych.abortExperiment("You chose to exit the survey. Thank you for your participation. You can close the window.");
    });
    
    
    // Add hover effect for a darker color
    exitButton.addEventListener("mouseover", function() {
        exitButton.style.backgroundColor = "rgb(111, 82, 82)"; // Darker pink/red color on hover
    });

    exitButton.addEventListener("mouseout", function() {
        exitButton.style.backgroundColor = "rgb(182, 133, 133)"; // Original pink color when not hovered
    });
}

// Function to create a Back Button  
function addBackButton() {
    if (document.getElementById("back-button")) return;
    
    const backButton = document.createElement("button");
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    backButton.style.position = "absolute";
    backButton.style.left = "10px";
    backButton.style.bottom = "50px";
    backButton.style.width = "80px";
    backButton.style.padding = "8px 12px"; // Padding for better size
    backButton.style.fontSize = "14px"; // Text size
    backButton.style.cursor = "pointer";

    backButton.addEventListener("click", function () {
        console.log('Back button clicked');
        console.log(jsPsych.getProgress().current_trial_global);
        if (jsPsych.getProgress().current_trial_global > 0) {
            jsPsych.abortCurrentTimeline();
        }
    });

    document.body.appendChild(backButton);
}

async function uploadSurveyData(surveyData) {
    try {
        const response = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyData)
        });
        const responseData = await response.json();
        console.log('Survey data uploaded successfully:', responseData);
    } catch (error) {
        console.error('Error uploading survey data:', error);
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        // Create a new FileReader
        let reader = new FileReader();
        //data:video/mp4;base64,AAAAHGZ0eX
        // Once reading is finished, handle the result
        reader.onloadend = function() {
            const dataUrl = reader.result;   // e.g. "data:video/webm;base64,AAAA..."
            const base64Marker = "base64,";

            // Locate the base64 marker to split the string dynamically
            const base64Index = dataUrl.indexOf(base64Marker);

            if (base64Index !== -1) {
                const base64Part = dataUrl.substring(base64Index + base64Marker.length); // Extract base64 data
                resolve(base64Part);
            } else {
                reject(new Error("Invalid data URL: No base64 marker found."));
            }
        };

        // If there's an error reading, reject the promise
        reader.onerror = function(error) {
            reject(error);
        };

        // **This line must be present** to actually read the Blob into base64
        reader.readAsDataURL(blob);
    });
}
// Function to shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Check which format is supported by the browser
function getSupportedMimeType() {
    const possibleTypes = [
        'video/mp4;codecs="avc1.42E01F, mp4a.40.2"', // Safari often supports this
        'video/mp4', // Another fallback for Safari
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm' // Fallback for Chrome/Firefox
        ];
    for (const mimeType of possibleTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
            return mimeType;
        }
    }
    return null;
    }

function logError({
    surveyId = "",
    error = "",
    stack = "",
    message = "",
    timestamp = new Date().toISOString(),
        }) {
            if (!surveyId) {
            // If you store these in localStorage or global variables, grab them here
            surveyId = window.surveyId || "unknown_survey";
        }
        // Generate a unique logId (e.g. surveyId + current time)
        const logId = surveyId + "_" + Date.now();
        console.error("Logging error:",surveyId);
        // Construct the payload
        const payload = {
            logId,
            surveyId,
            error: String(error),
            stack: String(stack),
            message,
            timestamp
        };
        // Send to your logger Lambda
        fetch("https://vmq3r1f7xi.execute-api.us-east-2.amazonaws.com/log/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).catch((err) => console.error("Failed to log error:", err));
    }
const videoData_labels = {};

function fetchNextVideoForLabels(done) {
    return fetch(`https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/ChooseVideosforLabelAnnotation?pid=${window.participantId}`)
    .then(r => {
        if (!r.ok) throw new Error('No more videos');
        return r.json();
    })
    .then(json => {
        Object.assign(videoData_labels, json);
        console.log('Fetched videoData:', videoData_labels);
        done();  
    })
    .catch(err => {
        console.error('Error fetching next video:', err);
        jsPsych.endCurrentTimeline();
        done();
    });
}

const videoData_emojis = {};

function fetchNextVideoForEmojis(done) {
    // Use nullish coalescing (??) instead of || to allow 0 as a valid value 
    return fetch(`https://k6y3d3jhhe.execute-api.us-east-2.amazonaws.com/prod/ChooseVideosforEmojiAnnotation?pid=${window.participantId}`)
    .then(r => {
        if (!r.ok) throw new Error('No more videos');
        return r.json();
    })
    .then(json => {
        Object.assign(videoData_emojis, json);
        console.log('Fetched videoData:', videoData_emojis);
        done();  
    })
    .catch(err => {
        console.error('Error fetching next video:', err);
        jsPsych.endCurrentTimeline();
        done();
    });
}


export {addExitButton, addBackButton, uploadSurveyData, blobToBase64, shuffleArray, getSupportedMimeType, logError, videoData_labels, videoData_emojis, fetchNextVideoForLabels, fetchNextVideoForEmojis};


