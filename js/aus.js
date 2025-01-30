import { addExitButton, blobToBase64, shuffleArray, getSupportedMimeType } from "./utils.js";
import { AUs } from "./mixedAUs.js";

let lastRecordingBlob = null;
let recorder = null;
let nameAU = '';
let descAU = '';
let recordingStartTime = 0;

const participantAUs = AUs();
let auList = [...participantAUs.isolated, ...participantAUs.mixed];
shuffleArray(auList); // Shuffle the final AU list
console.log("AU List", auList)

const au_trial_init = {
    type: jsPsychHtmlVideoResponse,

    stimulus: function () {
        if (auList.length === 0) {
            console.warn("All AUs have been used. Regenerating...");
            const newAUs = AUs();
            auList = [...newAUs.isolated, ...newAUs.mixed];
            shuffleArray(auList);
        }

        const randomAU = auList.pop();
        nameAU = randomAU.au || `${randomAU.au1}-${randomAU.au2}`;
        descAU = randomAU.description 
            ? `</br><span style="color: rgb(21, 92, 125);">${randomAU.description}</span>` 
            : `<span style="color: rgb(215, 60, 99); font-style: italic; font-weight: normal;">[Please perform both together]</span></br>
            <span style="color: rgb(21, 92, 125);">${randomAU.description1}</span> 
            <span style="font-style: italic; font-weight: normal;">and</span> 
            <span style="color: rgb(21, 125, 54);">${randomAU.description2}</span> </br>`;

        console.log(descAU);
        const gifHtml = randomAU.gif
            ? `<img src="${randomAU.gif}" alt="AU" style="height:100px; display: block; margin: 0 auto;">`
            : `
                <img src="${randomAU.gif1}" alt="AU1" style="height:100px; display: block; margin: 0 auto;">
                <img src="${randomAU.gif2}" alt="AU2" style="height:100px; display: block; margin: 0 auto;">
            `;
        console.log(nameAU);
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
        <p><strong>Instruction:</strong></p>
        <p>Please record yourself mimicking the facial movement shown below. Ensure your entire face is visible in the camera and you start the video with a <span style="color: rgb(215, 60, 99); font-style: italic; font-weight: normal;">neutral face</span> while <span style="color: rgb(215, 60, 99); font-style: italic; font-weight: normal;">looking at the camera</span>.</p>
        <p> <strong>${descAU}</strong></p>
        <p>${gifHtml}</p>
        <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
        <div>
            <button id="start-recording" style="margin: 10px; padding: 10px 20px;">
            <i class="fas fa-play"></i> Start Recording</button>

            <button id="stop-recording" style="margin: 10px; padding: 10px 20px; display: none;">
            <i class="fas fa-stop"></i> Stop Recording</button>
        </div>
        <div id="playback-container" style="display: none;">
            <video id="recorded-video" controls></video><br>
            <button id="rerecord-button" style="margin: 10px; padding: 10px 20px;">
                <i class="fas fa-redo"></i> Re-record
            </button>
        </div>
        <div id="warning" style="color: red; font-weight: normal; display: none;">Your recorded video is shorter than 1 second. Please record again.</div>
        <p>Click "Start Recording" to begin, and "Stop Recording" to end.</p>`;
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
            document.getElementById('finish-trial').disabled = true;

            }

            initializeCamera();

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
                console.log('Recording duration:', recordingDurationMs);
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
                        console.log('Recording saved:', lastRecordingBlob);
                    }
                    recorder.destroy();
                    recorder = null;
                    if (lastRecordingBlob) {
                        console.log('Recording duration:', recordingDurationMs);
                        document.getElementById('finish-trial').disabled = false;
                    }
                });
                console.log('Recording stopped');

                // Hide the camera preview and Start Recording button
                videoElement.style.display = 'none';
                startButton.style.display = 'none';
                stopButton.style.display = 'none';

                // Show playback container
                playbackContainer.style.display = 'block';
                recorder.camera.stop();
            });

            rerecordButton.addEventListener('click', () => {
                warningDiv.style.display = 'none';
                document.getElementById('finish-trial').disabled = false;

                playbackContainer.style.display = 'none';
                recordedVideo.src = '';

                lastRecordingBlob = null;

                videoElement.style.display = 'inline-block';
                startButton.style.display = 'inline-block';
                stopButton.style.display = 'none';

                initializeCamera(); // Restart camera for rerecording
            });
        }, 500);
    },
    on_finish: async function () {
        console.log('Trial finished. Uploading the last recording...');
    }
};

const uploading_trial = {
    type: jsPsychHtmlButtonResponse,  // or 'html-button-response'
    stimulus:  `<div style="text-align: center;">
    <p style="font-size: 20px; color:rgb(21, 92, 125); font-weight: bold; text-align: center;">Uploading the video...<br><br> Please wait</p>
    <img src="https://i.gifer.com/ZKZx.gif" alt="Loading..." style="width: 50px; height: 50px; margin-top: 10px;">
    </div>`,
    choices: [], // No keys or buttons to skip
    on_load: async function () {
        // Ensure `lastRecordingBlob` exists in the scope
        if (!lastRecordingBlob) {
            console.log('No video was recorded.');
            return;
        }
            try {
                const base64 = await blobToBase64(lastRecordingBlob);
                // 2) Build a key for S3
                const surveyId = window.surveyId;
                const participantId = window.participantId;
                const mimeType = getSupportedMimeType() || 'video/webm';

                let extension = 'webm';
                if (mimeType.includes('mp4')) {
                    extension = 'mp4';
                }
                const videoKey = `videos/${surveyId}/${surveyId}_${nameAU}.${extension}`;
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
                const newAUVideoURLs = uploadData.videoUrl; // Assuming the Lambda response includes the video URL
                console.log(newAUVideoURLs)
                const videoPath = newAUVideoURLs.split('videos/').pop();
                const result = `videos/${videoPath}`;

                const updateResponse = await fetch('https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        surveyId: surveyId,
                        participantId: participantId,
                        newAUVideoURLs: result
                    })
                });

                const updateData = await updateResponse.json();
                console.log('DynamoDB updated with AU video URL:', nameAU, updateData);
            }
        } catch (error) {
            console.error('Error uploading video or updating survey:', error);
        }
        jsPsych.finishTrial();
    }
};

let au_trials = [];
for (let i = 0; i < 20; i++) {
    au_trials.push(au_trial_init);
    au_trials.push(uploading_trial);
}
export { au_trials };

