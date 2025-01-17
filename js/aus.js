import { addExitButton } from "./utils.js";
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

// Shuffle the emoji array once
// Track the unused emojis
let unusedAUs = [...AUImages]; // Make a copy of the original array

// Function to shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get base64 data only
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
let lastRecordingBlob = null;
let recorder = null;
const au_trial = {
    type: jsPsychHtmlVideoResponse,

    stimulus: function () {
        shuffleArray(unusedAUs);

        // Pick the first emoji from the shuffled unused emojis
        const randomAU = unusedAUs.pop(); // Get and remove the last emoji from the array

        // If there are no emojis left, reset the unusedEmojis array
        if (unusedAUs.length === 0) {
            unusedAUs = [...AUImages]; // Reset to the full array
            shuffleArray(unusedAUs); // Shuffle again
        }
        const auName = randomAU.split('/').pop().split('.')[0].replace(/-/g, ' ');
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
        <p>Expression to perform:<strong>${auName}</strong></p>
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
        addExitButton();  // Call the function to add the Exit button
        let chunks = [];
        let mediaRecorder;
        let stream;

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
                        type: 'video'
                    });
                    videoElement.muted = true;
                    videoElement.volume = 0;
                    videoElement.srcObject = stream;
                    recorder.camera = stream;
                });
                // navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
                //     .then(userStream => {
                //         stream = userStream;
                //         videoElement.srcObject = stream;

                //         mediaRecorder = new MediaRecorder(stream);
                //         mediaRecorder.ondataavailable = function (event) {
                //             chunks.push(event.data);
                //         };

                // mediaRecorder.onstop = function () {
                // lastRecordingBlob = new Blob(chunks, { type: 'video/mp4' });
                // chunks = [];
                // const videoURL = URL.createObjectURL(lastRecordingBlob);
                // const recordedVideo = document.getElementById('recorded-video');
            

                // playbackContainer.style.display = 'block';

                // Stop the camera feed after recording finishes
                // if (stream) {
                //     console.log(stream)
                //     stream.getTracks().forEach(track => track.stop());
                //     console.log('Camera stopped.');
                // }
                // };
            // })
            // .catch(error => {
            //     console.error('Error accessing camera:', error);
            // });
            document.getElementById('finish-trial').disabled = true;

            }

            initializeCamera();

            startButton.addEventListener('click', () => {
                chunks = [];
                // mediaRecorder.start();
                recorder.startRecording();
                console.log('Recording started');
                startButton.style.display = 'none';
                stopButton.style.display = 'inline-block';
            });

            stopButton.addEventListener('click', () => {
                document.getElementById('finish-trial').disabled = false;

                recorder.stopRecording(function() {
                    let blob = recorder.getBlob();
                    recordedVideo.src = URL.createObjectURL(blob);
                    recorder.camera.stop();
                    recorder.destroy();
                    recorder = null;
                    lastRecordingBlob = blob;
                });
                
                console.log('Recording stopped');

                // Stop camera immediately when user stops recording
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    console.log('Camera stopped after stop button click.');
                }

                videoElement.style.display = 'none';
                startButton.style.display = 'none';
                stopButton.style.display = 'none';

                playbackContainer.style.display = 'block';
            });

            rerecordButton.addEventListener('click', () => {
                document.getElementById('finish-trial').disabled = false;

                playbackContainer.style.display = 'none';
                recordedVideo.src = '';
                chunks = [];
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
        if (lastRecordingBlob) {
            const videoData = await blobToBase64(lastRecordingBlob);
            try {
                const response = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ video: videoData })
                });
                const responseData = await response.json();
                // console.log('Video uploaded successfully:', responseData);
                // document.getElementById('finish-trial').disabled = false;

            } catch (error) {
                console.error('Error uploading video:', error);
            }
        } else {
            console.log('No video was recorded.');
        }
    }
};

let au_trials = [];
for (let i = 0; i < 30; i++) {
    au_trials.push(au_trial);
}
export { au_trials };

