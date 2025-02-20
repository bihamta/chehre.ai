import {
    addExitButton,
    blobToBase64,
    shuffleArray,
    getSupportedMimeType,
    logError
} from "./utils.js";

// -----------------------------------------------------------------
// 1) DECLARE EMOJIS
// -----------------------------------------------------------------
const emojiImages = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/anxious-face-with-sweat_1f630.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/beaming-face-with-smiling-eyes_1f601.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/exploding-head_1f92f.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/expressionless-face_1f611.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-blowing-a-kiss_1f618.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-exhaling_1f62e.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-holding-back-tears_1f979.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-screaming-in-fear_1f631.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-diagonal-mouth_1fae4.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-hand-over-mouth_1f92d.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-monocle_1f9d0.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-open-eyes-and-hand-over-mouth_1fae2.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-raised-eyebrow_1f928.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-rolling-eyes_1f644.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-steam-from-nose_1f624.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-symbols-on-mouth_1f92c.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/flushed-face_1f633.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grimacing-face_1f62c.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grinning-face-with-big-eyes_1f603.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grinning-face-with-sweat_1f605.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/hushed-face_1f62f.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/loudly-crying-face_1f62d.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/melting-face_1fae0.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/nauseated-face_1f922.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/partying-face_1f973.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/pensive-face_1f614.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/pleading-face_1f97a.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/relieved-face_1f60c.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/sleeping-face_1f634.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-halo_1f607.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-heart-eyes_1f60d.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-horns_1f608.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-smiling-eyes_1f60a.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-sunglasses_1f60e.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smirking-face_1f60f.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/star-struck_1f929.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/thinking-face_1f914.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/tired-face_1f62b.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/unamused-face_1f612.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/woozy-face_1f974.png"
];
const specialEmojis = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-hand-over-mouth_1f92d.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-open-eyes-and-hand-over-mouth_1fae2.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/thinking-face_1f914.png"
];

// Maximum total number of emojis we want to record:
const number_of_emojis = 40;

// -----------------------------------------------------------------
// 2) GLOBALS TRACKING PROGRESS
// -----------------------------------------------------------------
let unusedEmojis = [];
let emoji_counter = 0; // How many we have finished so far
let lastRecordingBlob = null;
let recorder = null;
let nameEmoji = "";
let userSubmittedLabel = "";
let recordingStartTime = 0;
let cameraStream = null;
let currentEmoji = null;


// -----------------------------------------------------------------
// 3) LOCALSTORAGE LOADING/SAVING
// -----------------------------------------------------------------
function loadEmojiState() {
    // If we have saved data in localStorage, parse it
    const storedUnused = localStorage.getItem("unusedEmojis");
    const storedCounter = localStorage.getItem("emojiCounter");

    if (storedUnused) {
        try {
            unusedEmojis = JSON.parse(storedUnused);
        } catch (e) {
            console.warn("Could not parse stored unusedEmojis. Resetting array.", e);
            unusedEmojis = [];
        }
    }
    if (storedCounter) {
        emoji_counter = parseInt(storedCounter, 10) || 0;
    }

    // If no data was found, or the array was empty, we do a fresh init:
    if (!unusedEmojis || unusedEmojis.length === 0) {
        unusedEmojis = [...emojiImages]; // copy
        shuffleArray(unusedEmojis);
        emoji_counter = 0;
        saveEmojiState();
    }
}

function saveEmojiState() {
    localStorage.setItem("unusedEmojis", JSON.stringify(unusedEmojis));
    localStorage.setItem("emojiCounter", String(emoji_counter));
}

// -----------------------------------------------------------------
// 4) UTILITY: STOP CAMERA
// -----------------------------------------------------------------
function shutdownCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        cameraStream = null;
        console.log("Camera stream has been shutdown.");
    }
    recorder = null;
}

// -----------------------------------------------------------------
// 5) MAIN TRIAL: RECORDING TRIAL
// -----------------------------------------------------------------
const emoji_trial_init = {
    type: jsPsychHtmlVideoResponse,
    stimulus: function () {
        // If we have used up all emojis, we can end early (safety check)
        if (emoji_counter >= number_of_emojis) {
            return `<p>No more emojis to record! You can proceed.</p>`;
        }

        // Make sure we have an array of emojis left:
        if (unusedEmojis.length === 0) {
            return `<p>No unused emojis left! Please proceed.</p>`;
        }

        // Pick the **last** from the array (or first, up to you)
        currentEmoji = unusedEmojis[unusedEmojis.length - 1];
        const randomEmoji = currentEmoji;
        // Extract a label from the filename
        // e.g. "face-blowing-a-kiss_1f618.png" => nameEmoji = "1f618"
        nameEmoji = randomEmoji.split("_")[1].split(".png")[0];

        const isSpecialEmoji = specialEmojis.includes(randomEmoji);

        return `
        <div style="text-align:center;">
            <h4>Recorded ${emoji_counter} emojis out of ${number_of_emojis}</h4>
        </div>

        <style>
            #camera-preview {
                border: 2px solid black;
                width: 100%;
                height: auto;
                max-width: 400px;
                transform: scaleX(-1); /* Mirror the video preview */
            }
            #recorded-video {
                display: block;
                margin: 0 auto;
                width: 100%;
                max-width: 400px;
            }
        </style>

        <p>Please express the emoji below. Make sure your entire face is visible in the camera while performing.</p>
        <p>Please <span style="font-weight: bold;">start</span> the video with a <span style="color: rgb(215, 60, 99); font-style: italic; font-weight: normal;">neutral face (hold it for about 1 second)</span></p>


        <div style="position: relative; text-align: center;">
        <img src="${randomEmoji}" alt="Emoji"
                style="display:inline-block; margin:0 auto; width:50px; height:50px;">
        ${isSpecialEmoji
                ? `<div style="margin: 10px auto;">
                <img src="https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/nohands.png"
                        alt="Reminder Icon"
                        style="width:auto; height:100px; display:inline-block" />
                </div>`
                : ""
            }
        </div>

        <video id="camera-preview" autoplay playsinline
                style="border:2px solid black;"></video>

        <div>
            <button id="start-recording" style="margin:10px; padding:10px 20px;">
            <i class="fas fa-play"></i> Start Recording
            </button>
            <button id="stop-recording" style="margin:10px; padding:10px 20px; display:none;">
            <i class="fas fa-stop"></i> Stop Recording
            </button>
        </div>

        <div id="playback-container" style="display:none;">
            <video id="recorded-video" controls></video><br><br>
            <button id="rerecord-button" style="margin:10px; padding:10px 20px;">
            <i class="fas fa-redo"></i> Re-record
            </button>
        </div>

        <div id="warning" style="color:red; font-weight:normal; display:none;"></div>
        <p>Click 'Start Recording' to begin and 'Stop Recording' to finish.</p>

        <label for="emotion-label"><p><strong>What does this emoji mean to you?</strong></p></label>
        <input type="text" id="emotion-label" name="emotion-label"
                placeholder="Type here..."
                style="width:300px; margin-top:5px;">
        <button id="submit-emotion-label" style="margin-left:10px;">Submit</button>
        <br><br>
        <div id="display-emotion-label"
            style="font-style:italic; color:green; margin-top:5px;"></div>
        `;
    },
    recording_duration: null,

    on_load: function () {
        addExitButton();
        // Delay a bit for DOM to be ready
        setTimeout(() => {
            const videoElement = document.getElementById("camera-preview");
            const startButton = document.getElementById("start-recording");
            const stopButton = document.getElementById("stop-recording");
            const playbackContainer = document.getElementById("playback-container");
            const recordedVideo = document.getElementById("recorded-video");
            const rerecordButton = document.getElementById("rerecord-button");
            const userEmotionLabel = document.getElementById("emotion-label");
            const displayNameDiv = document.getElementById("display-emotion-label");
            const submitNameButton = document.getElementById("submit-emotion-label");
            const warningDiv = document.getElementById("warning");
            let finishButton = document.getElementById("finish-trial");

            if (!startButton || !stopButton || !finishButton) {
                console.error("Start or stop button not found in the DOM.");
                return; // Exit the function early
            }

            // Camera init
            function initializeCamera() {
                navigator.mediaDevices
                    .getUserMedia({
                        // Lower resolution so less chance to crash
                        video: {
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                            facingMode: 'user',
                            frameRate: { ideal: 25}
                        },
                        audio: true,
                    })
                    .then((stream) => {
                        recorder = RecordRTC(stream, {
                            recorderType: MediaStreamRecorder,
                            type: "video",
                            mimeType: "video/webm;codecs=vp8",
                            // bitsPerSecond: 4500000
                        });
                        videoElement.muted = true;
                        videoElement.volume = 0;
                        videoElement.srcObject = stream;
                        recorder.camera = stream;
                        cameraStream = stream;
                    })
                    .catch((err) => {
                    console.error("Error accessing camera:", err);
                    logError({
                        surveyId: window.surveyId,
                        error: err,
                        stack: err.stack || "",
                        message: "getUserMedia camera error",
                    });
                });
            }

            initializeCamera();
            finishButton.disabled = true;
            userSubmittedLabel = "";
            lastRecordingBlob = null;
            // If you don't have a "finish-trial" button in the DOM yet, check for null

            function checkIfCanEnableFinish() {
                if (!finishButton)
                { 
                    console.warn("No finish button found.");
                    return;
                }
                const hasVideo = lastRecordingBlob !== null;
                const hasLabel = userSubmittedLabel.trim().length > 0;
                console.log("Can enable finish?", hasVideo, hasLabel);
                finishButton.disabled = !(hasVideo && hasLabel);
            }

            // Submit label
            submitNameButton.addEventListener("click", () => {
                userSubmittedLabel = userEmotionLabel.value.trim();
                displayNameDiv.innerText = userSubmittedLabel
                    ? `You entered: ${userEmotionLabel.value}`
                    : "";
                checkIfCanEnableFinish();
            });

            // Start recording
            startButton.addEventListener("click", () => {
                if (!recorder) {
                    console.warn("Recorder not ready yet.");
                    return;
                }
                recorder.startRecording();
                console.log("Recording started.");
                startButton.style.display = "none";
                stopButton.style.display = "inline-block";
                recordingStartTime = performance.now();
            });

            // Stop recording
            stopButton.addEventListener("click", () => {
                const recordingEndTime = performance.now();
                const recordingDurationMs = recordingEndTime - recordingStartTime;
                const recordingDurationSec = recordingDurationMs / 1000;
                console.log("Recording duration:", recordingDurationMs);


                recorder.stopRecording(() => {
                    const blob = recorder.getBlob();
                    const videoSize = blob.size;
                    const videoSizeBits = videoSize * 8;
                    let currentBitrateKbps = 0;

                    console.log("Recorded video size:", videoSize);

                    if (recorder.camera) {
                        recorder.camera.getAudioTracks().forEach((track) => track.stop());
                        recorder.camera.getVideoTracks().forEach((track) => track.stop());
                    }
                    recorder.destroy();
                    recorder = null;

                    const MAX_SIZE = 4.5 * 1024 * 1024; // about 4.5 MB
                    if (recordingDurationMs < 1000) {
                        console.warn("Video shorter than 1 second. Discarding.");
                        lastRecordingBlob = null;
                        warningDiv.style.display = "block";
                        warningDiv.innerHTML = `<b style="color:red;">Video was shorter than 1 second. Please re-record.</b>`;
                        logError({
                            surveyId: window.surveyId,
                            error: "Video too short",
                            message: "Recorded video was too short",
                        });
                    } else if (videoSize > MAX_SIZE) {
                        console.warn("Video is too large. Discarding.");
                        lastRecordingBlob = null;
                        warningDiv.style.display = "block";
                        warningDiv.innerHTML = `<b style="color:red;">Video is too long. Please record a shorter video.</b>`;
                        logError({
                            surveyId: window.surveyId,
                            error: "Video too large",
                            message: "Recorded video was too large",
                        });
                    } else {
                        lastRecordingBlob = blob;
                        recordedVideo.src = URL.createObjectURL(blob);
                        warningDiv.style.display = "none";
                        currentBitrateKbps = (videoSizeBits / recordingDurationSec) / 1000;
                        window.currentBitrateKbps = currentBitrateKbps.toFixed(2);
                    }
                    checkIfCanEnableFinish();
                });

                console.log("Recording stopped.");
                // Hide the camera preview and start button
                videoElement.style.display = "none";
                startButton.style.display = "none";
                stopButton.style.display = "none";

                // Show the playback container
                playbackContainer.style.display = "block";
                
                if (finishButton) finishButton.disabled = false;
            });

            // Re-record
            rerecordButton.addEventListener("click", () => {
                warningDiv.style.display = "none";
                if (finishButton) finishButton.disabled = false;

                // Reset state
                playbackContainer.style.display = "none";
                recordedVideo.src = "";
                lastRecordingBlob = null;
                userSubmittedLabel = "";
                displayNameDiv.innerText = "";

                // Show camera again
                videoElement.style.display = "inline-block";
                startButton.style.display = "inline-block";
                stopButton.style.display = "none";

                initializeCamera();
            });
        }, 1000); // slight delay
    },

    on_finish: function () {
        
        console.log("Trial finished. We have a recording? -> Upload next.");
        if (currentEmoji) {
            // In case you used random index, you’d splice, but if you always
            // pick from the end, you can just pop:
            unusedEmojis.pop();
            // Now increment
            emoji_counter += 1;
            saveEmojiState();
        }
    },
};

// -----------------------------------------------------------------
// 6) UPLOADING TRIAL
// -----------------------------------------------------------------
const uploading_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <div style="text-align:center;">
        <p style="font-size:20px;color:rgb(21,92,125);font-weight:bold;">
        Uploading the last video...<br><br>Please wait
        </p>
        <img src="https://i.gifer.com/ZKZx.gif" alt="Loading..."
            style="width:50px;height:50px;margin-top:10px;">
    </div>`,
    choices: [],
    on_load: async function () {
        if (!lastRecordingBlob) {
            console.log("No video was recorded.");
            return;
        }
        try {
            console.log("recording blob size:", lastRecordingBlob.size);
            const currentBitrateKbps = window.currentBitrateKbps || 0;
            const bitrates = [currentBitrateKbps];

            const emotionLabels = {};
            emotionLabels[nameEmoji] = userSubmittedLabel;

            const base64 = await blobToBase64(lastRecordingBlob);
            const surveyId = window.surveyId;
            const participantId = window.participantId;
            const mimeType = getSupportedMimeType() || "video/webm";

            let extension = "webm";
            if (mimeType.includes("mp4")) {
                extension = "mp4";
            }
            const videoKey = `videos/${surveyId}/${surveyId}_${nameEmoji}.${extension}`;

            // 1) Upload to S3
            const uploadResponse = await fetch(
                "https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        surveyId: surveyId,
                        participantId: participantId,
                        video: base64,
                        contentType: mimeType,
                        key: videoKey,
                    }),
                }
            );
            const uploadData = await uploadResponse.json();

            // 2) Update DynamoDB with the video URL
            if (uploadData && uploadData.videoUrl) {
                const newEmojiVideoURLs = uploadData.videoUrl;
                const videoPath = newEmojiVideoURLs.split("videos/").pop();
                const result = `videos/${videoPath}`;

                const updateResponse = await fetch(
                    "https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            surveyId,
                            participantId,
                            newEmojiVideoURLs: result,
                            emotionLabels,
                            bitrates
                        }),
                    }
                );
                const updateData = await updateResponse.json();
                console.log(
                    "DynamoDB updated with emoji video URL:",
                    nameEmoji,
                    updateData
                );
            }
        } catch (error) {
            console.error("Error uploading video or updating survey:", error);
            logError({
                surveyId: window.surveyId,
                error: error,
                stack: error.stack || "",
                message: "Emoji uploading trial: S3 or Dynamo update error",
            });
        }
        jsPsych.finishTrial();
    },
};

// -----------------------------------------------------------------
// 7) CONSTRUCT TIMELINE
// -----------------------------------------------------------------
loadEmojiState(); // Attempt to load from localStorage first

// We'll build a timeline that includes the correct number of
// pairs of [recording_trial, uploading_trial] for the REMAINING emojis.
const leftover = number_of_emojis - emoji_counter;
const emojiTrials = [];
for (let i = 0; i < leftover; i++) {
    
    
    emojiTrials.push(emoji_trial_init);
    emojiTrials.push(uploading_trial);
}

// Export or return the array
export { emojiTrials };
