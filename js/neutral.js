var init_camera = {
    type: jsPsychInitializeCamera
};

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get base64 data only
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
let lastRecordingBlob = null;
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
            transform: scaleX(-1); /* Mirror the video preview */
        }
        #recorded-video::-webkit-media-controls-panel {
            transform: scaleX(-1);
        }
        </style>
        <p><strong>Instruction:</strong></p>
        <p>Please record yourself with a neutral expression. Keep your head still and avoid making any facial expressions. Slowly look around (left, right, up, and down) for 5 seconds.</p>
        <p>Ensure your entire face is visible in the camera during the recording.</p>
        <p>Click "Start Recording" to begin, and "Stop Recording" to end. If your recording doesn't follow the instructions, click "Rerecord."</p>
        <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
        <div>
            <button id="start-recording" style="margin: 10px; padding: 10px 20px;">Start Recording</button>
            <button id="stop-recording" style="margin: 10px; padding: 10px 20px; display: none;">Stop Recording</button>
            <span id="timer" style="font-size: 20px; margin-left: 20px; display: none;">5</span>
        </div>
        <div id="playback-container" style="display: none;">
            <p>Playback your video to ensure it matches the instructions.</p>
            <video id="recorded-video" controls style="border: 2px solid black; width: 400px; height: 300px;"></video>
            <button id="rerecord-button" style="margin-top: 10px; padding: 10px 20px;">Rerecord</button>
        </div>`;
    },
    recording_duration: null, // No automatic duration; controlled manually

    on_load: function () {
        let chunks = []; // Array to hold the current recording's data
        let mediaRecorder;
        let stream;

        setTimeout(() => {
            const videoElement = document.getElementById('camera-preview');
            const startButton = document.getElementById('start-recording');
            const stopButton = document.getElementById('stop-recording');
            const timerElement = document.getElementById('timer');
            const playbackContainer = document.getElementById('playback-container');
            const recordedVideo = document.getElementById('recorded-video');
            const rerecordButton = document.getElementById('rerecord-button');

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
                            lastRecordingBlob = new Blob(chunks, { type: 'video/mp4' });
                            
                            chunks = []; // Reset chunks for the next recording

                            // Create a preview of the recorded video
                            const videoURL = URL.createObjectURL(lastRecordingBlob);
                            const recordedVideo = document.getElementById('recorded-video');
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
                timerElement.style.display = 'inline-block'; // Show timer

                let countdown = 5;
                timerElement.textContent = countdown;

                const countdownInterval = setInterval(() => {
                    countdown -= 1;
                    timerElement.textContent = countdown;

                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        mediaRecorder.stop();
                        console.log('Recording stopped automatically after 5 seconds');

                        // Hide the camera preview and buttons
                        videoElement.style.display = 'none';
                        startButton.style.display = 'none';
                        stopButton.style.display = 'none';
                        timerElement.style.display = 'none';

                        // Show playback container
                        playbackContainer.style.display = 'block';
                    }
                }, 1000);
            });

            stopButton.addEventListener('click', () => {
                
                mediaRecorder.stop();
                console.log('Recording stopped manually');
                

                // Hide the camera preview and buttons
                videoElement.style.display = 'none';
                startButton.style.display = 'none';
                stopButton.style.display = 'none';
                timerElement.style.display = 'none';

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
export { neutral_trial, init_camera };

