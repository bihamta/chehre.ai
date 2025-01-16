const emojiImages = [
    "https://github.com/bihamta/chehre.ai/blob/main/emojis/face-with-tongue_1f61b.png",
    "https://github.com/bihamta/chehre.ai/blob/main/emojis/smiling-face-with-hearts_1f970.png"
];

// Function to randomly select an emoji
function getRandomEmojiImage() {
    const randomIndex = Math.floor(Math.random() * emojiImages.length);
    return emojiImages[randomIndex];
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
const emoji_trial = {
    type: jsPsychHtmlVideoResponse,
    stimulus: function () {
        const randomEmoji = getRandomEmojiImage();
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
                    transform: scaleX(-1); /* Mirror the video preview */
                }
                #recorded-video::-webkit-media-controls-panel {
                    transform: scaleX(1);
                }

            </style>
            <p>Please record yourself performing the expression or action shown by the emoji below. Ensure your entire face is visible in the camera while performing.</p>
            <p>Reference emoji:</p>
            <p><img src="${randomEmoji}" alt="Emoji" style="width:50px; height:50px;"></p>
            <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
            <div>
                <button id="start-recording" style="margin: 10px; padding: 10px 20px;">Start Recording</button>
                <button id="stop-recording" style="margin: 10px; padding: 10px 20px; display: none;">Stop Recording</button>
            </div>
            <div id="playback-container" style="display: none;">
                <video id="recorded-video" controls style="border: 2px solid black; width: 400px; height: 300px;"></video>
                <button id="rerecord-button" style="margin-top: 10px; padding: 10px 20px;">Rerecord</button>
            </div>
            <p>Click "Start Recording" to begin, and "Stop Recording" to end.</p>
        `;
    },
    recording_duration: null, // No automatic duration; controlled manually

    // Declare the variable `lastRecordingBlob` at the trial level
    on_load: function () {
        
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
            const continueButton = document.getElementById('continue-button');

            function initializeCamera() {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
                    .then(userStream => {
                        stream = userStream;
                        videoElement.srcObject = stream;

                        // Set up MediaRecorder
                        mediaRecorder = new MediaRecorder(stream);

                        // Capture video data
                        mediaRecorder.ondataavailable = function (event) {
                            chunks.push(event.data); // Save current recording chunks
                        };

                        mediaRecorder.onstop = function () {
                            // Store the last recorded Blob
                            lastRecordingBlob = new Blob(chunks, { type: 'video/webm' });
                            chunks = []; // Reset chunks for the next recording

                            // Create a preview of the recorded video
                            const videoURL = URL.createObjectURL(lastRecordingBlob);
                            recordedVideo.src = videoURL;

                            // Show playback container
                            playbackContainer.style.display = 'block';

                            // Stop the video stream
                            stream.getTracks().forEach(track => track.stop());
                        };
                    })
                    .catch(error => {
                        console.error('Error accessing camera:', error);
                    });
            }

            // Initialize the camera on load
            initializeCamera();

            // Add event listeners for start and stop buttons
            startButton.addEventListener('click', () => {
                chunks = []; // Clear previous chunks to ensure only the latest recording is saved
                mediaRecorder.start();
                console.log('Recording started');
                startButton.style.display = 'none'; // Hide start button
                stopButton.style.display = 'inline-block'; // Show stop button
            });

            stopButton.addEventListener('click', () => {
                mediaRecorder.stop();
                console.log('Recording stopped');

                // Hide the camera preview and Start Recording button
                videoElement.style.display = 'none';
                startButton.style.display = 'none'; // Ensure Start Recording button is hidden
                stopButton.style.display = 'none'; // Hide Stop Recording button

                // Show playback container
                playbackContainer.style.display = 'block';
            });

            // Add event listener for rerecord button
            rerecordButton.addEventListener('click', () => {
                // Reset UI elements to recording state
                playbackContainer.style.display = 'none'; // Hide playback container
                recordedVideo.src = ''; // Clear the previous video
                chunks = []; // Reset recorded chunks
                lastRecordingBlob = null; // Clear the last recorded Blob

                // Restart the camera preview
                videoElement.style.display = 'block';
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
            } catch (error) {
                console.error('Error uploading video:', error);
            }
        } else {
            console.log('No video was recorded.');
        }
    }
};



export { emoji_trial };

