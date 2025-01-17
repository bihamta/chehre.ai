import { addExitButton } from './utils.js';

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
let recorder = null
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
        <p>Click "Start Recording" to begin, and "Stop Recording" to end. If your recording doesn't follow the instructions, click "Rerecord."</p>
        <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
        <div>
            <button id="start-recording" style="margin: 10px; padding: 10px 20px;">
            <i class="fas fa-play"></i> Start Recording</button>
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
        addExitButton();  // Call the function to add the Exit button
        let chunks = []; // Array to hold the current recording's data
        let mediaRecorder;
        let stream;

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
                //             stream.getTracks().forEach(track => track.stop());
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
                            recordedVideo.src = URL.createObjectURL(blob);
                            recorder.camera.stop();
                            recorder.destroy();
                            recorder = null;
                            lastRecordingBlob = blob
                        });
                        
                        console.log('Recording stopped automatically after 5 seconds');
                        document.getElementById('finish-trial').disabled = false;

                        // Hide the camera preview and buttons
                        videoElement.style.display = 'none';
                        startButton.style.display = 'none';
                        timerElement.style.display = 'none';
                        recordingStatus.style.display = 'none';

                        // Show playback container
                        playbackContainer.style.display = 'block';
                    }
                }, 1000);
            });

            // Add event listener for rerecord button
            rerecordButton.addEventListener('click', () => {
                document.getElementById('finish-trial').disabled = false;
                // Reset UI elements to recording state
                playbackContainer.style.display = 'none'; // Hide playback container
                recordedVideo.src = ''; // Clear the previous video
                chunks = []; // Reset recorded chunks
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
        const videoUrl = []
        // Ensure `lastRecordingBlob` exists in the scope
        if (lastRecordingBlob) {
            const videoData = await blobToBase64(lastRecordingBlob); // Convert video to base64
            const videoType = lastRecordingBlob.type;  // e.g., 'video/webm', 'video/mp4'

            // Generate a dynamic video file extension based on the MIME type
            const videoExtension = videoType.split('/')[1];

            try {
                // Get the surveyId from the global scope (ensure it's defined earlier)
                const surveyId = window.surveyId;  // Or however you have it set globally
                const trial_name = "neutral"
                const videoKey = `videos/${surveyId}_${trial_name}.${videoExtension}`;

                
                // Step 1: Upload video to S3 (through the Lambda endpoint that handles S3)
                const response = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        video: videoData,  // Video data as base64 string
                        surveyId: surveyId,  // Include surveyId in the request body
                        key: videoKey,  // Pass the custom video name as key
                        contentType: videoType 
                    })
                });
    
                const responseData = await response.json();
                console.log('Video uploaded successfully:', responseData);
    
                // Step 2: Update DynamoDB with the S3 video URL (after the upload is successful)
                if (responseData && responseData.videoUrl) {
                    videoUrl.push(responseData.videoUrl); // Assuming the Lambda response includes the video URL
    
                    const updateResponse = await fetch('https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            surveyId: surveyId,  // Send the surveyId to DynamoDB
                            participantId: participantId,  // Send participantId to DynamoDB
                            videoUrl: videoUrl,  // Send the uploaded video URL to DynamoDB
                            key: videoKey,
                            contentType: videoType
                        })
                    });
    
                    const updateData = await updateResponse.json();
                    console.log('DynamoDB updated with video URL (Trial 1):', updateData);
                }
            } catch (error) {
                console.error('Error uploading video or updating survey:', error);
            }
        } else {
            console.log('No video was recorded.');
        }
    }};
    
//     on_finish: async function () {
//         console.log('Trial finished. Uploading the last recording...');
//         const surveyId = window.surveyId;
//         // Ensure `lastRecordingBlob` exists in the scope
//         if (lastRecordingBlob) {
//             const videoData = await blobToBase64(lastRecordingBlob);
//             try {
//                 const response = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ video: videoData })
//                 });
//                 const responseData = await response.json();
//                 console.log('Video uploaded successfully:', responseData);
//             } catch (error) {
//                 console.error('Error uploading video:', error);
//             }
//         } else {
//             console.log('No video was recorded.');
//         }
        
//     }
// };
export { neutral_trial, init_camera };

