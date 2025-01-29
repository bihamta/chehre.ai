import { addExitButton, blobToBase64, shuffleArray, getSupportedMimeType } from './utils.js';

const emojiImages = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/exploding-head_1f92f.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/shaking-face_1fae8.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/expressionless-face_1f611.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/sleeping-face_1f634.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-blowing-a-kiss_1f618.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/sleepy-face_1f62a.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-in-clouds_1f636.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-halo_1f607.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-screaming-in-fear_1f631.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-heart-eyes_1f60d.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-monocle_1f9d0.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-hearts_1f970.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-rolling-eyes_1f644.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smiling-face-with-tear_1f972.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/smirking-face_1f60f.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/squinting-face-with-tongue_1f61d.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/star-struck_1f929.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-without-mouth_1f636.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/thinking-face_1f914.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grimacing-face_1f62c.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/unamused-face_1f612.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/grinning-squinting-face_1f606.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/woozy-face_1f974.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/kissing-face-with-closed-eyes_1f61a.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/yawning-face_1f971.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/money-mouth-face_1f911.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/zany-face_1f92a.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/nauseated-face_1f922.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/zipper-mouth-face_1f910.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/partying-face_1f973.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-spiral-eyes_1f635-200d-1f4ab.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-steam-from-nose_1f624.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-tongue_1f61b.png"
];


// Shuffle the emoji array once
// Track the unused emojis
let unusedEmojis = [...emojiImages]; // Make a copy of the original array



let lastRecordingBlob = null;
let recorder = null;
let nameEmoji = '';
let userSubmittedLabel = "";
let recordingStartTime = 0;

const emoji_trial = {
    type: jsPsychHtmlVideoResponse,
    stimulus: function () {
        // Shuffle the unused emojis array
        shuffleArray(unusedEmojis);

        // Pick the first emoji from the shuffled unused emojis
        const randomEmoji = unusedEmojis.pop(); // Get and remove the last emoji from the array
        nameEmoji = randomEmoji.split("_")[1].split('.png')[0]
        // If there are no emojis left, reset the unusedEmojis array
        if (unusedEmojis.length === 0) {
            unusedEmojis = [...emojiImages]; // Reset to the full array
            shuffleArray(unusedEmojis); // Shuffle again
        }
        return `
            <style>
                #camera-preview {
                    border: 2px solid black;
                    width: 400px;
                    height: 300px;
                    transform: scaleX(-1); /* Mirror the video preview */
                }

                #recorded-video {
                    border: 2px solid black;
                    width: 400px;
                    height: 300px;
                }
            </style>
            <p>Please record yourself performing the expression or action shown by the emoji below. Ensure your entire face is visible in the camera while performing.</p>
            <p>Reference emoji:</p>
            <p><img src="${randomEmoji}" alt="Emoji" style="display: block; margin: 0 auto; width:50px; height:50px;"></p>
            <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
            <div>
                <button id="start-recording" style="margin: 10px; padding: 10px 20px;">
                <i class="fas fa-play"></i> Start Recording</button>
                
                <button id="stop-recording" style="margin: 10px; padding: 10px 20px; display: none;">
                <i class="fas fa-stop"></i> Stop Recording</button>
            </div>
            <div id="playback-container" style="display: none;">
                <video id="recorded-video" controls "></video><br>
                <br>
                <button id="rerecord-button" style="margin: 10px; padding: 10px 20px;">
                <i class="fas fa-redo"></i> Re-record
                </button>
            </div>
            <div id="warning" style="color: red; font-weight: normal; display: none;">The video you recorded is less than 1 second. Please re-record the video.</div>
            <p>Click "Start Recording" to begin, and "Stop Recording" to end.</p>
            <label for="emotion-label">
            <p style="font-weight: bold;">What would you call the expression that you just performed? 
            <span style="color: rgb(21, 92, 125); font-weight: normal;">
                Use your own words you can explain with a word or a sentence.
                </span>
            </p>
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
                finishButton.disabled = !(hasVideo && hasName);
                console.log('Finish button enabled:', finishButton.disabled);
            }

            submitNameButton.addEventListener('click', () => {
                userSubmittedLabel = userEmotionLabel.value.trim();
                displayNameDiv.innerText = userSubmittedLabel.length
                ? `Your response: ${userEmotionLabel.value}`
                : '';
                checkIfCanEnableFinish();
            });

            // Add event listeners for start and stop buttons
            startButton.addEventListener('click', () => {
                recorder.startRecording();
                console.log('Recording started');
                startButton.style.display = 'none';
                stopButton.style.display = 'inline-block';
                recordingStartTime = performance.now();

            });

            stopButton.addEventListener('click', () => {
                const recordingEndTime = performance.now();
                const recordingDurationMs = recordingEndTime - recordingStartTime;
                recorder.stopRecording(function() {
                    let blob = recorder.getBlob();
                    recordedVideo.src = URL.createObjectURL(blob);
                    if (recorder.camera) {
                        recorder.camera.stop();
                    }
                    if (recordingDurationMs < 1000) {
                        console.warn('Video was shorter than 1 second. Discarding recording.');
                        lastRecordingBlob = null;
                        warningDiv.style.display = 'block';
                    } else {
                        lastRecordingBlob = blob;
                    }
                    recorder.destroy();
                    recorder = null;
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
                recorder.camera.stop();
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

        }, 500); // Add a slight delay to ensure the DOM is rendered
    },
    on_finish: async function () {
        console.log('Trial finished. Uploading the last recording...');
        if (!lastRecordingBlob) {
            console.log('No video was recorded.');
            return;
        }
        try {
            const emotionLabels = {};
            emotionLabels[nameEmoji] = userSubmittedLabel
            const base64 = await blobToBase64(lastRecordingBlob);
            // 2) Build a key for S3
            const surveyId = window.surveyId;
            const participantId = window.participantIsd;
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
        }
};

let emojiTrials = [];
for (let i = 0; i < 30; i++) {
    emojiTrials.push(emoji_trial);
}
export { emojiTrials };

