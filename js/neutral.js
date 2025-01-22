import { addExitButton, blobToBase64 } from './utils.js';

var init_camera = {
    type: jsPsychInitializeCamera
};

function bytesToMegabytes(bytes) {
    return bytes / (1024 * 1024);
}


let lastRecordingBlob = null;
let recorder = null;
const neutral_trial = {
    type: jsPsychHtmlVideoResponse,
    stimulus: function () {
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
        <p>Please record yourself with a neutral expression. Keep your head still and avoid making any facial expressions. Slowly look around (left, right, up, and down) for 5 seconds.</p>
        <p>Ensure your entire face is visible in the camera during the recording.</p>
        <p>Click "Start Recording" to begin. Recording will automatically stop after 5 seconds. If you are not happy with the recording, click "Re-record."</p>
        <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
        <div>
            <button id="start-recording" style="margin: 10px; padding: 10px 20px;">
            <i class="fas fa-play"></i> Start Recording
            </button>
            <div id="recording_status" style="display: none;">Recording Now...</div>
            <span id="timer" style="font-size: 20px; display: none;">5</span>
        </div>
        <div id="playback-container" style="display: none;">
            <p>Playback your video to ensure it matches the instructions.</p>
            <video id="recorded-video" controls></video><br>
            <button id="rerecord-button" style="margin: 10px; padding: 10px 20px;">
            <i class="fas fa-redo"></i> Re-record
        </button>
        </div>
        `;
    },
    recording_duration: null,


    on_load: function () {
        addExitButton();

        setTimeout(() => {
            const videoElement = document.getElementById('camera-preview');
            const startButton = document.getElementById('start-recording');
            const recordingStatus = document.getElementById('recording_status');
            const timerElement = document.getElementById('timer');
            const playbackContainer = document.getElementById('playback-container');
            const recordedVideo = document.getElementById('recorded-video');
            const rerecordButton = document.getElementById('rerecord-button');

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

            // Initialize the camera on load
            initializeCamera();

            // Add event listeners for start and stop buttons
            startButton.addEventListener('click', () => {
                recorder.startRecording();
                console.log('Recording started');
                startButton.style.display = 'none'; // Hide start button
                recordingStatus.style.display = 'inline-block'; // Show timer
                timerElement.style.display = 'inline-block'; // Show timer

                let countdown = 5;
                timerElement.textContent = countdown;

                const countdownInterval = setInterval(() => {
                    countdown -= 1;
                    timerElement.textContent = countdown;

                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        recorder.stopRecording(function() {
                            let blob = recorder.getBlob();

                            const sizeInBytes = blob.size;
                            const sizeInMegabytes = bytesToMegabytes(sizeInBytes);
                            
                            // TODO size check

                            recordedVideo.src = URL.createObjectURL(blob);
                            if (recorder.camera) {
                                recorder.camera.stop();
                            }
                            lastRecordingBlob = blob;
                            recorder.destroy();
                            recorder = null;
                            
                        });
                        
                        console.log('Recording stopped after 5 seconds');
                        document.getElementById('finish-trial').disabled = false;

                        // Hide the camera preview and buttons
                        videoElement.style.display = 'none';
                        startButton.style.display = 'none';
                        timerElement.style.display = 'none';
                        recordingStatus.style.display = 'none';

                        // Show playback container
                        playbackContainer.style.display = 'block';
                    }
                }, 500);
            });

            // Add event listener for rerecord button
            rerecordButton.addEventListener('click', () => {
                document.getElementById('finish-trial').disabled = false;
                // Reset UI elements to recording state
                playbackContainer.style.display = 'none'; // Hide playback container
                recordedVideo.src = ''; // Clear the previous video
                
                lastRecordingBlob = null; // Clear the last recorded Blob

                // Restart the camera preview
                videoElement.style.display = 'block';
                startButton.style.display = 'inline-block'; // Show Start Recording button
                // stopButton.style.display = 'none'; // Ensure Stop Recording button is hidden

                // Reinitialize camera and MediaRecorder
                initializeCamera();
            });

        }, 500); // Add a slight delay to ensure the DOM is rendered
    },
    on_finish: async function () {
        console.log('Trial finished. Uploading the last recording...');
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
            const trialName = "neutral";
            const videoKey = `videos/${surveyId}/${surveyId}_${trialName}.webm`;
            
            // 3) Upload video to S3 (through the Lambda endpoint that handles S3)
            const uploadResponse = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    surveyId: surveyId,
                    participantId: participantId,
                    video: base64,    // base64 string
                    contentType: 'video/webm',
                    key: videoKey
                })
            });
            const uploadData = await uploadResponse.json();
                // 4) Update DynamoDB with the S3 video URL (after the upload is successful)
            if (uploadData && uploadData.videoUrl) {
                const videoURLNeutral = uploadData.videoUrl; // Assuming the Lambda response includes the video URL
                const videoPath = videoURLNeutral.split('videos/').pop();
                const result = `videos/${videoPath}`;

                const updateResponse = await fetch('https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        surveyId: surveyId,
                        participantId: participantId, // optional
                        videoURLNeutral: result
                    })
                });

                const updateData = await updateResponse.json();
                console.log('DynamoDB updated with neutral video URL:', updateData);
            }
        } catch (error) {
            console.error('Error uploading video or updating survey:', error);
        }
    }
};

export { neutral_trial, init_camera };
