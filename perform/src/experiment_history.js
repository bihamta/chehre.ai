// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        console.log('Experiment finished.');
        jsPsych.data.displayData(); // Display data for testing
    }
});
var timeline = [];

const instruction_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p>Press the button below to start the video recording experiment.</p>',
    choices: ['Start Experiment'] // Button label
};
timeline.push(instruction_trial)

var init_camera = {
    type: jsPsychInitializeCamera
}
timeline.push(init_camera)
const mirror_camera = {
    type: jsPsychMirrorCamera,
}
timeline.push(mirror_camera)


var video_trial = {
    type: jsPsychHtmlVideoResponse,
    stimulus: `
    <p style="font-size:48px; color:red;"> <-- </p>
    <div>
        <video id="camera-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px; transform: scaleX(-1);"></video>
    </div>
    </div>
    <p>Turn your head in the direction of the arrow</p>`,
    recording_duration: 3500,
    show_done_button: true,
    allow_playback: true,
    on_load: function() {
        setTimeout(() => {
            const videoElement = document.getElementById('camera-preview');
            if (videoElement) {
                navigator.mediaDevices.getUserMedia({ video: {
                    facingMode: 'user' // Ensures the front camera is used
                } })
                    .then(stream => {
                        videoElement.srcObject = stream;
    
                        const mediaRecorder = new MediaRecorder(stream);
                        const chunks = [];
    
                        mediaRecorder.ondataavailable = function(event) {
                            chunks.push(event.data);
                        };
    
                        mediaRecorder.onstop = function() {
                            const blob = new Blob(chunks, { type: 'video/webm' });
                            const reader = new FileReader();
                            reader.onloadend = async function() {
                                const videoData = reader.result.split(',')[1];
    
                                try {
                                    const response = await fetch('https://h73lvahtyk.execute-api.us-east-2.amazonaws.com/test/upload', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ video: videoData })
                                    });
                                    const result = await response.json();
                                    console.log('Video uploaded successfully:', result.key);
                                } catch (error) {
                                    console.error('Error uploading video:', error);
                                }
                            };
                            reader.readAsDataURL(blob);
                        };
    
                        mediaRecorder.start();
    
                        setTimeout(() => {
                            mediaRecorder.stop();
                            const tracks = stream.getTracks();
                            tracks.forEach(track => track.stop());
                        }, 3500);
                    })
                    .catch(error => {
                        console.error('Error accessing camera:', error);
                    });
            } else {
                console.error('Camera preview element not found!');
            }
        }, 500); // Add a slight delay to ensure the element is rendered
    },
    
    on_finish: function() {
        console.log('Recording trial finished.');
    }
};

// timeline.push(video_trial)
// Camera preview trial
const camera_preview_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <p>Your live camera feed is shown below:</p>
    <div>
        <video id="preview-preview" autoplay playsinline style="border: 2px solid black; width: 400px; height: 300px;"></video>
    </div>
    <p>Press any key to end the preview.</p>`,
    on_start: function() {
        // Ensure the video element is accessed correctly after rendering
        setTimeout(() => {
            const videoElement = document.getElementById('preview-preview');
            if (videoElement) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        videoElement.srcObject = stream;
                    })
                    .catch(error => {
                        console.error('Error accessing camera:', error);
                    });
            } else {
                console.error('Camera preview element not found!');
            }
        }, 100); // Delay to ensure DOM rendering
    },
    on_finish: function() {
        // Stop the camera feed
        const videoElement = document.getElementById('camera-preview');
        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop()); // Stop all tracks
        }
    }
};
// timeline.push(camera_preview_trial);
timeline.push(video_trial);
// Define a simple instruction trial

// Start the experiment
jsPsych.run(timeline);
