import { addExitButton, blobToBase64, shuffleArray } from "./utils.js";
let globalStream = null;

const AUImages = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Corner-Depressor.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Eyes-Closed.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Puckerer.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Outer-Brow-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Upper-Lid-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Inner-Brow-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Stretcher.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Slit.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Blink.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Jaw-Drop.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Suck.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Squint.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Brow-Lowerer.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lid-Droop.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Tightener.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Upper-Lip-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Cheek-Puffer.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lid-Tightener.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lips-part.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Wink.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Cheek-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Corner-Puller.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lower-Lip-Depressor.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Chin-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Funneler.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Mouth-Stretch.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Dimpler.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Lip-Pressor.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/Nose-Wrinkler.gif",
];

let unusedAUs = [...AUImages]; // Make a copy of the original array

let lastRecordingBlob = null;
let recorder = null;
let nameAU = '';
const au_trial = {
    type: jsPsychHtmlVideoResponse,

    stimulus: function () {
        shuffleArray(unusedAUs);

        const randomAU = unusedAUs.pop();
        
        if (unusedAUs.length === 0) {
            unusedAUs = [...AUImages]; // Reset to the full array
            shuffleArray(unusedAUs); // Shuffle again
        }
        nameAU = randomAU.split('/').pop().split('.')[0];
        const nameAUspace = nameAU.replace(/-/g, ' ')
        console.log(nameAU)
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
        <p>Please record yourself mimicking the expression shown below. Ensure your entire face is visible in the camera.</p>
        <p>Expression to perform:<strong>${nameAUspace}</strong></p>
        <p><img src="${randomAU}" alt="AU"  style="height:100px; display: block; margin: 0 auto; "></p>
        <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
        <div>
            <button id="start-recording" style="margin: 10px; padding: 10px 20px;">
            <i class="fas fa-play"></i> Start Recording</button>

            <button id="stop-recording" style="margin: 10px; padding: 10px 20px; display: none;">
            <i class="fas fa-stop"></i> Stop Recording</button>
        </div>
        <div id="playback-container" style="display: none;">
            <video id="recorded-video" controls "></video><br>
            <button id="rerecord-button" style="margin: 10px; padding: 10px 20px;">
                <i class="fas fa-redo"></i> Re-record
            </button>
        </div>
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
            });

            stopButton.addEventListener('click', () => {
                recorder.stopRecording(function() {
                    let blob = recorder.getBlob();
                    recordedVideo.src = URL.createObjectURL(blob);
                    if (recorder.camera) {
                        recorder.camera.stop();
                    }
                    lastRecordingBlob = blob;
                    recorder.destroy();
                    recorder = null;
                });
                console.log('Recording stopped');

                // Hide the camera preview and Start Recording button
                videoElement.style.display = 'none';
                startButton.style.display = 'none';
                stopButton.style.display = 'none';

                // Show playback container
                playbackContainer.style.display = 'block';
                document.getElementById('finish-trial').disabled = false;
            });

            rerecordButton.addEventListener('click', () => {
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

        // Ensure `lastRecordingBlob` exists in the scope
        if (!lastRecordingBlob) {
            console.log('No video was recorded.');
            return;
        }
            try {
                const base64 = await blobToBase64(lastRecordingBlob);
                // 2) Build a key for S3
                const surveyId = window.surveyId;
                const participantId = window.participantIsd;
                console.log("hereeeeeee", nameAU);
                const videoKey = `videos/${surveyId}/${surveyId}_${nameAU}.webm`;
                const uploadResponse = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        surveyId: surveyId,
                        participantId: participantId,
                        video: base64,
                        contentType: 'video/webm',
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
    }
};

let au_trials = [];
for (let i = 0; i < 30; i++) {
    au_trials.push(au_trial);
}
export { au_trials };

