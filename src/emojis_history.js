import { addExitButton, blobToBase64, shuffleArray, getSupportedMimeType } from '../js/utils.js';
const emojiImages = [
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/anxious-face-with-sweat_1f630.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/beaming-face-with-smiling-eyes_1f601.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/exploding-head_1f92f.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/expressionless-face_1f611.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-blowing-a-kiss_1f618.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-exhaling_1f62e.png"
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-holding-back-tears_1f979.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-screaming-in-fear_1f631.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-diagonal-mouth_1fae4.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-hand-over-mouth_1f92d.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-monocle_1f9d0.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-open-eyes-and-hand-over-mouth_1fae2.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-raised-eyebrow_1f928.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-rolling-eyes_1f644.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-steam-from-nose_1f624.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-symbols-on-mouth_1f92c.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/flushed-face_1f633.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grimacing-face_1f62c.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grinning-face-with-big-eyes_1f603.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grinning-face-with-sweat_1f605.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/hushed-face_1f62f.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/loudly-crying-face_1f62d.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/melting-face_1fae0.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/nauseated-face_1f922.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/partying-face_1f973.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/pensive-face_1f614.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/pleading-face_1f97a.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/relieved-face_1f60c.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/sleeping-face_1f634.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-halo_1f607.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-heart-eyes_1f60d.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-horns_1f608.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-smiling-eyes_1f60a.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-sunglasses_1f60e.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smirking-face_1f60f.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/star-struck_1f929.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/thinking-face_1f914.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/tired-face_1f62b.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/unamused-face_1f612.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/woozy-face_1f974.png"
];
const specialEmojis = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-hand-over-mouth_1f92d.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-open-eyes-and-hand-over-mouth_1fae2.png",
    // "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-peeking-eye_1fae3.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/thinking-face_1f914.png"
];
// Shuffle the emoji array once
// Track the unused emojis
let unusedEmojis = [...emojiImages]; // Make a copy of the original array



let lastRecordingBlob = null;
let recorder = null;
let nameEmoji = '';
let userSubmittedLabel = "";
let recordingStartTime = 0;
const number_of_emojis = 2;
let emoji_counter = 0;

let cameraStream = null;
function shutdownCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        console.log('Camera stream has been shutdown.');
    }
    // Optionally, also clear the recorder.
    recorder = null;
}

const emoji_trial_init = {
    type: jsPsychHtmlVideoResponse,
    stimulus: function () {
        // Shuffle the unused emojis array
        shuffleArray(unusedEmojis);
        

        // Pick the first emoji from the shuffled unused emojis
        const randomEmoji = unusedEmojis.pop(); // Get and remove the last emoji from the array
        nameEmoji = randomEmoji.split("_")[1].split('.png')[0]
        let emojisLeft = unusedEmojis.length;
        // If there are no emojis left, reset the unusedEmojis array
        if (unusedEmojis.length === 0) {
            unusedEmojis = [...emojiImages]; // Reset to the full array
            shuffleArray(unusedEmojis); // Shuffle again
        }
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
            <p>Please record yourself performing the expression depicted by the emoji below. Make sure your entire face is visible in the camera while performing.</p>
            <p>Please <span style="font-weight: bold;">start</span> the video with a <span style="color: rgb(215, 60, 99); font-style: italic; font-weight: normal;">neutral face (hold it for about 1 second)</span></p>

            <div style="position: relative; text-align: center;">
                <img src="${randomEmoji}" alt="Emoji"
                    style="display:inline-block; margin: 0 auto; width: 50px; height: 50px;">
                    
                ${
                isSpecialEmoji
                    ? `
                    <div style="margin: 10px auto;">
                        <img src="https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/nohands.png",
                        nohands.png"
                            alt="Reminder Icon"
                            style="width: auto; height: 100px; display:inline-block" />
                    </div>
                    `
                    : ""
                }
            </div>


            <video id="camera-preview" autoplay playsinline style="border: 2px solid black; "></video>
            <div>
                <button id="start-recording" style="margin: 10px; padding: 10px 20px;">
                <i class="fas fa-play"></i> Start Recording</button>
                
                <button id="stop-recording" style="margin: 10px; padding: 10px 20px; display: none;">
                <i class="fas fa-stop"></i> Stop Recording</button>
            </div>
            <div id="playback-container" style="display: none;">
                <video id="recorded-video" controls></video><br>
                <br>
                <button id="rerecord-button" style="margin: 10px; padding: 10px 20px;">
                <i class="fas fa-redo"></i> Re-record
                </button>
            </div>
            <div id="warning" style="color: red; font-weight: normal; display: none;"></div>
            <p>Click 'Start Recording' to begin and 'Stop Recording' to finish.</p>
            <label for="emotion-label">
            <p style="font-weight: bold;">What does this emoji mean to you?</p>
            </label><br>
            <input type="text" id="emotion-label" name="emotion-label"
            placeholder="Type here..."
            style="width: 300px; margin-top: 5px;">
            <button id="submit-emotion-label" style="margin-left: 10px;">Submit</button>
            <br><br>  

            <div id="display-emotion-label"
            style="font-style: italic; color: green; margin-top: 5px;">
            </div>
            `;
    },
    recording_duration: null,

    
    on_load: function () {
        addExitButton();
        // document.addEventListener('DOMContentLoaded', function () {
            setTimeout(() => {
            const videoElement = document.getElementById('camera-preview');
            const startButton = document.getElementById('start-recording');
            const stopButton = document.getElementById('stop-recording');
            const playbackContainer = document.getElementById('playback-container');
            const recordedVideo = document.getElementById('recorded-video');
            const rerecordButton = document.getElementById('rerecord-button');
            const finishButton = document.getElementById('finish-trial');
            const userEmotionLabel = document.getElementById('emotion-label');
            const displayNameDiv   = document.getElementById('display-emotion-label');
            const submitNameButton = document.getElementById('submit-emotion-label');
            const warningDiv = document.getElementById('warning');




            function initializeCamera() {

                
                navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                }).then(function(stream) {
                    recorder = RecordRTC(stream, {
                        recorderType: MediaStreamRecorder,
                        type: 'video',
                        mimeType: 'video/webm;codecs=vp8'
                    });
                    videoElement.muted = true;
                    videoElement.volume = 0;
                    videoElement.srcObject = stream;
                    recorder.camera = stream;
                })
                .catch((err) => console.error('Error accessing camera:', err));
                if (finishButton) 
                    finishButton.disabled = true;  

            }
            // Initialize the camera on load
            initializeCamera();
            userSubmittedLabel = ""

            function checkIfCanEnableFinish() {
                const hasVideo = (lastRecordingBlob !== null);
                const hasName  = (userSubmittedLabel.trim().length > 0);
                if (finishButton) {
                finishButton.disabled = !(hasVideo && hasName);
                console.log('Finish button enabled:', finishButton.disabled);
                }
            }

            submitNameButton.addEventListener('click', () => {
                userSubmittedLabel = userEmotionLabel.value.trim();
                displayNameDiv.innerText = userSubmittedLabel.length
                ? `You entered: ${userEmotionLabel.value}`
                : '';
                checkIfCanEnableFinish();
            });

            // Add event listeners for start and stop buttons
            startButton.addEventListener('click', () => {
                recorder.startRecording();
                console.log('Recording started');
                startButton.style.display = 'none';
                stopButton.style.display = 'inline-block';
                try {
                recordingStartTime = performance.now();
                }
                catch (error) {
                    console.error('Error recording start time:', error);
                }
                
            });

            stopButton.addEventListener('click', () => {
                const recordingEndTime = performance.now();
                const recordingDurationMs = recordingEndTime - recordingStartTime;
                console.log('Recording duration:', recordingDurationMs);

                recorder.stopRecording(function() {
                    let blob = recorder.getBlob();
                    let videoSize = blob.size

                    if (recorder.camera) {
                        recorder.camera.getAudioTracks().forEach(track => track.stop());
                        recorder.camera.getVideoTracks().forEach(track => track.stop());
                    }
                    recorder.destroy();
                    recorder = null;
                    const MAX_SIZE = 4.5 * 1024 * 1024; // 10MB = 10,485,760 bytes

                    if (recordingDurationMs < 1000) {
                        console.warn('Video was shorter than 1 second. Discarding recording.');
                        lastRecordingBlob = null;
                        warningDiv.style.display = 'block';
                        warningDiv.innerHTML = `<b style="color: red;">Video was shorter than 1 second. Please re-record the video.</b>`;
                    } else if (videoSize > MAX_SIZE) {
                        console.warn('Video is too long, please reocrd a shorter video');
                        lastRecordingBlob = null;
                        warningDiv.style.display = 'block';
                        warningDiv.innerHTML = `<b style="color: red;">Video is too long, please reocrd a shorter video.</b>`;

                    } else {
                        lastRecordingBlob = blob;
                        recordedVideo.src = URL.createObjectURL(blob);
                    }
                    
                    console.log(bytesToSize(blob.size))
                    checkIfCanEnableFinish();
                    
                });
                console.log('Recording stopped');

                // Hide the camera preview and Start Recording button
                videoElement.style.display = 'none';
                startButton.style.display = 'none';
                stopButton.style.display = 'none'; 

                // Show playback container
                playbackContainer.style.display = 'block';
                finishButton.disabled = false;
                

            });

            // Add event listener for rerecord button
            rerecordButton.addEventListener('click', () => {
                warningDiv.style.display = 'none';
                finishButton.disabled = false;
                // Reset UI elements to recording state
                playbackContainer.style.display = 'none'; // Hide playback container
                recordedVideo.src = ''; // Clear the previous video

                lastRecordingBlob = null; // Clear the last recorded Blob
                // userSubmittedLabel = ""


                // Restart the camera preview
                videoElement.style.display = 'inline-block';
                startButton.style.display = 'inline-block'; // Show Start Recording button
                stopButton.style.display = 'none'; // Ensure Stop Recording button is hidden

                // Reinitialize camera and MediaRecorder
                initializeCamera();
            });

        }, 2000); // Add a slight delay to ensure the DOM is rendered
        
    // };
        // }
        // if (document.readyState === 'loading') {
        //     document.addEventListener('DOMContentLoaded', initializeTrialElements);
        //     setTimeout(initializeTrialElements, 500);
        //     console.log('DOM content loaded');
        // } else {
        //     // initializeTrialElements();
        //     setTimeout(initializeTrialElements, 500);
        //     console.log('DOM content already loaded');
        // }
    },
    on_finish: async function () {
        console.log('Trial finished. Uploading the last recording...');
        emoji_counter += 1;
        
        }
};

const uploading_trial = {
    type: jsPsychHtmlButtonResponse,  // or 'html-button-response'
    stimulus:  `<div style="text-align: center;">
    <p style="font-size: 20px; color:rgb(21, 92, 125); font-weight: bold; text-align: center;">Uploading the last video...<br><br> Please wait</p>
    <img src="https://i.gifer.com/ZKZx.gif" alt="Loading..." style="width: 50px; height: 50px; margin-top: 10px;">
    </div>`,
    choices: [], // No keys or buttons to skip
    on_load: async function () {
        if (!lastRecordingBlob) {
            console.log('No video was recorded.');
            return;
        }
        try {
            console.log('recording blob size:', lastRecordingBlob.size);
            const emotionLabels = {};
            emotionLabels[nameEmoji] = userSubmittedLabel
            const base64 = await blobToBase64(lastRecordingBlob);
            // 2) Build a key for S3
            const surveyId = window.surveyId;
            const participantId = window.participantId;
            const mimeType = getSupportedMimeType() || 'video/webm';
            // console.log(mimeType)

            let extension = 'webm';
            if (mimeType.includes('mp4')) {
                extension = 'mp4';
            }
            // console.log(extension)
            const videoKey = `videos/${surveyId}/${surveyId}_${nameEmoji}.${extension}`;
            const uploadResponse = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    surveyId: surveyId,
                    participantId: participantId,
                    video: base64,
                    contentType: mimeType,
                    key: videoKey
                })
            });
            const uploadData = await uploadResponse.json();
                // 4) Update DynamoDB with the S3 video URL (after the upload is successful)
            if (uploadData && uploadData.videoUrl) {
                const newEmojiVideoURLs = uploadData.videoUrl; // Assuming the Lambda response includes the video URL
                // console.log(newEmojiVideoURLs)
                const videoPath = newEmojiVideoURLs.split('videos/').pop();
                const result = `videos/${videoPath}`;
                
                const updateResponse = await fetch('https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        surveyId: surveyId,
                        participantId: participantId,
                        newEmojiVideoURLs: result,
                        emotionLabels: emotionLabels,
                    })
                });

                const updateData = await updateResponse.json();
                console.log('DynamoDB updated with emoji video URL:', nameEmoji, updateData);
            }
        } catch (error) {
            console.error('Error uploading video or updating survey:', error);
        }
        jsPsych.finishTrial();
    }
};
const emojiTrials = [];
for (let i = 0; i < number_of_emojis; i++) {
    emojiTrials.push(emoji_trial_init);
    emojiTrials.push(uploading_trial);
}
export { emojiTrials };

