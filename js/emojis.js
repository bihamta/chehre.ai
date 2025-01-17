import { addExitButton } from './utils.js';

const emojiImages = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/exploding-head_1f92f.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/shaking-face_1fae8.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/expressionless-face_1f611.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/sleeping-face_1f634.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-blowing-a-kiss_1f618.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/sleepy-face_1f62a.png",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-in-clouds_1f636-200d-1f32b-fe0f.png",
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
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-spiral-eyes_1f635-200d-1f4ab.png",  // Added missing emoji
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-steam-from-nose_1f624.png",       // Added missing emoji
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/emojis/face-with-tongue_1f61b.png"                 // Added missing emoji
];


// Shuffle the emoji array once
// Track the unused emojis
let unusedEmojis = [...emojiImages]; // Make a copy of the original array

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
const emoji_trial = {
    type: jsPsychHtmlVideoResponse,
    stimulus: function () {
        // Shuffle the unused emojis array
        shuffleArray(unusedEmojis);

        // Pick the first emoji from the shuffled unused emojis
        const randomEmoji = unusedEmojis.pop(); // Get and remove the last emoji from the array

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
            <p>Click "Start Recording" to begin, and "Stop Recording" to end.</p>
        `;
    },
    recording_duration: null, // No automatic duration; controlled manually

    // Declare the variable `lastRecordingBlob` at the trial level
    on_load: function () {
        addExitButton();  // Call the function to add the Exit button

        let chunks = []; // Array to hold the current recording's data
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

                //         // Set up MediaRecorder
                //         mediaRecorder = new MediaRecorder(stream);

                //         // Capture video data
                //         mediaRecorder.ondataavailable = function (event) {
                //             chunks.push(event.data); // Save current recording chunks
                //         };

                //         mediaRecorder.onstop = function () {
                //             // Store the last recorded Blob
                //             lastRecordingBlob = new Blob(chunks, { type: 'video/mp4' });
                //             chunks = []; // Reset chunks for the next recording

                //             // Create a preview of the recorded video
                //             const videoURL = URL.createObjectURL(lastRecordingBlob);
                //             const recordedVideo = document.getElementById('recorded-video');
                //             recordedVideo.src = videoURL;

                //             // Show playback container
                //             playbackContainer.style.display = 'block';

                //             // Stop the video stream
                //             if (stream) {
                //                 console.log(stream)
                //                 stream.getTracks().forEach(track => track.stop());
                //                 console.log('Camera stopped.');
                //             }
                //         };
                //     })
                //     .catch(error => {
                //         console.error('Error accessing camera:', error);
                //     });
                    document.getElementById('finish-trial').disabled = true;

            }

            // Initialize the camera on load
            initializeCamera();

            // Add event listeners for start and stop buttons
            startButton.addEventListener('click', () => {
                chunks = []; // Clear previous chunks to ensure only the latest recording is saved
                // mediaRecorder.start();
                recorder.startRecording();
                console.log('Recording started');
                startButton.style.display = 'none'; // Hide start button
                stopButton.style.display = 'inline-block'; // Show stop button
            });

            stopButton.addEventListener('click', () => {
                recorder.stopRecording(function() {
                    let blob = recorder.getBlob();
                    recordedVideo.src = URL.createObjectURL(blob);
                    recorder.camera.stop();
                    recorder.destroy();
                    recorder = null;
                    lastRecordingBlob = blob;
                });
                console.log('Recording stopped');

                // Hide the camera preview and Start Recording button
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    console.log('Camera stopped after stop button click.');
                }
                videoElement.style.display = 'none';
                startButton.style.display = 'none'; // Ensure Start Recording button is hidden
                stopButton.style.display = 'none'; // Hide Stop Recording button

                // Show playback container
                playbackContainer.style.display = 'block';
                document.getElementById('finish-trial').disabled = false;

            });

            // Add event listener for rerecord button
            rerecordButton.addEventListener('click', () => {
                // Reset UI elements to recording state
                playbackContainer.style.display = 'none'; // Hide playback container
                recordedVideo.src = ''; // Clear the previous video
                chunks = []; // Reset recorded chunks
                lastRecordingBlob = null; // Clear the last recorded Blob

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
let emojiTrials = [];
for (let i = 0; i < 30; i++) {
    emojiTrials.push(emoji_trial);
}
export { emojiTrials };

