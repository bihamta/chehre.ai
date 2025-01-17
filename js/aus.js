import { addExitButton } from "./utils.js";
let globalStream = null;

const AUImages = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU5.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU7-lid-tightener.gif"
];

// Function to randomly select an AU
function getRandomAUImage() {
    const randomIndex = Math.floor(Math.random() * AUImages.length);
    const randomAU = AUImages[randomIndex];
    return AUImages[randomIndex];
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
        const randomAU = getRandomAUImage(); // Get the image path
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
                console.log('Video uploaded successfully:', responseData);
                // document.getElementById('finish-trial').disabled = false;

            } catch (error) {
                console.error('Error uploading video:', error);
            }
        } else {
            console.log('No video was recorded.');
        }
    }
};


export { au_trial };

