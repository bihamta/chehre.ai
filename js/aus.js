import { addExitButton, blobToBase64, shuffleArray, getSupportedMimeType } from "./utils.js";
import { AUs, aus_count } from "./mixedAUs.js";
// console.log('Loaded AUs:', aus_count);
// Global variables for the AU code
let lastRecordingBlob = null;
let recorder = null;
let nameAU = '';
let descAU = '';
let recordingStartTime = 0;
let au_counter = 0; // how many have been recorded so far
let auList = [];   // array of AUs still left
let currentAU = null;  // The item we are currently recording

// 1) Attempt to load existing state from localStorage
function loadAUState() {
  console.log('Loading AU state from localStorage...'); 
  const storedAUs = localStorage.getItem('auList');
  const storedCounter = localStorage.getItem('auCounter');

  if (storedAUs) {
    console.log('Found stored AUs:', storedAUs);
    try {
      auList = JSON.parse(storedAUs);
      console.log('Loaded AU list:', auList);
    } catch (e) {
      console.warn('Failed to parse stored AU list. Re-initializing a new one.', e);
      auList = [];
    }
  }
  if (storedCounter) {
    console.log('Found stored AU counter:', storedCounter);
    au_counter = parseInt(storedCounter, 10) || 0;
  }

  // If we've never initialized or everything is empty:
  if (au_counter === 0 && auList.length === 0) {
    console.warn('No AUs found in localStorage. Re-initializing...');
    const participantAUs = AUs();
    auList = [...participantAUs.isolated, ...participantAUs.mixed];
    shuffleArray(auList);
    au_counter = 0;
    saveAUState(); 
  }
}

// 2) Save current state to localStorage
function saveAUState() {
  console.log('Saving state -> au_counter =', au_counter);
  localStorage.setItem('auList', JSON.stringify(auList));
  localStorage.setItem('auCounter', String(au_counter));
  console.log('Saved AU list:', auList);
}

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`;
}

// Load from localStorage or init fresh
loadAUState();

// We'll figure out how many are left
let number_of_aus = auList.length;

// 3) TRIAL: Recording
const au_trial_init = {
  type: jsPsychHtmlVideoResponse,

  stimulus: function () {
    // If we have no AUs left, just skip or show "done"
    if (auList.length === 0) {
      console.warn("No more AUs to record.");
      return `<p>All AUs have been recorded. No more tasks remain.</p>`;
    }

    // We'll NOT pop the array yet—just peek the last item
    currentAU = auList[auList.length - 1];

    // Prepare the display from currentAU
    nameAU = currentAU.au || `${currentAU.au1}-${currentAU.au2}`;
    descAU = currentAU.description
      ? `</br><span style="color: rgb(21, 92, 125);">${currentAU.description}</span>`
      : `
        <span style="color: rgb(215,60,99); font-style: italic;">[Please perform both together]</span><br>
        <span style="color: rgb(21,92,125);">${currentAU.description1}</span>
        <span style="font-style: italic;">and</span>
        <span style="color: rgb(21,125,54);">${currentAU.description2}</span><br>
      `;

    const gifHtml = currentAU.gif
      ? `<img src="${currentAU.gif}" alt="AU" style="height:100px; display:block; margin:0 auto;">`
      : `
          <img src="${currentAU.gif1}" alt="AU1" style="height:100px; display:block; margin:0 auto;">
          <img src="${currentAU.gif2}" alt="AU2" style="height:100px; display:block; margin:0 auto;">
        `;

    number_of_aus = auList.length;  // current length

    return `
      <div style="text-align:center;">
          <h4>Recorded ${au_counter} out of total ${aus_count}</h4>
      </div>
      <style>
        #camera-preview {
          border: 2px solid black;
          width: 100%;
          max-width: 400px;
          height: auto;
          transform: scaleX(-1);
        }
        #recorded-video {
          border: 2px solid black;
          margin: 0 auto;
          width: 100%;
          max-width: 400px;
        }
      </style>
      <p>
        Please record yourself mimicking the facial movement below. 
        Ensure your entire face is visible in the camera and 
        <strong>start</strong> the video with a 
        <span style="color:rgb(215,60,99); font-style: italic;">
          neutral expression for about 1 second
        </span>.
      </p>
      <p><strong>${descAU}</strong></p>
      <p>${gifHtml}</p>

      <video id="camera-preview" autoplay playsinline style="border:2px solid black;"></video>
      <div>
        <button id="start-recording" style="margin:10px; padding:10px 20px;">
          <i class="fas fa-play"></i> Start Recording
        </button>
        <button id="stop-recording" style="margin:10px; padding:10px 20px; display:none;">
          <i class="fas fa-stop"></i> Stop Recording
        </button>
      </div>
      <div id="playback-container" style="display:none;">
        <video id="recorded-video" controls></video><br>
        <button id="rerecord-button" style="margin:10px; padding:10px 20px;">
          <i class="fas fa-redo"></i> Re-record
        </button>
      </div>
      <div id="warning" style="color:red; font-weight: normal; display:none;"></div>
      <p>Click "Start Recording" to begin, and "Stop Recording" to end.</p>
    `;
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
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user', frameRate: { ideal: 25 } },
          audio: true
        }).then(stream => {
          recorder = RecordRTC(stream, {
            recorderType: MediaStreamRecorder,
            type: 'video',
            mimeType: 'video/webm;codecs=vp8'
          });
          videoElement.muted = true;
          videoElement.volume = 0;
          videoElement.srcObject = stream;
          recorder.camera = stream;
        })
        .catch(err => console.error('Error accessing camera:', err));

        const finishBtn = document.getElementById('finish-trial');
        if (finishBtn) finishBtn.disabled = true;
      }

      initializeCamera();

      startButton.addEventListener('click', () => {
        recorder.startRecording();
        console.log('Recording started');
        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        try {
          recordingStartTime = performance.now();
        } catch (error) {
          console.error('Error recording start time:', error);
        }
      });

      stopButton.addEventListener('click', () => {
        const recordingEndTime = performance.now();
        const recordingDurationMs = recordingEndTime - recordingStartTime;
        console.log('Recording duration:', recordingDurationMs);

        recorder.stopRecording(() => {
          const blob = recorder.getBlob();
          const videoSize = blob.size;

          // Stop camera
          if (recorder.camera) {
            recorder.camera.getAudioTracks().forEach(track => track.stop());
            recorder.camera.getVideoTracks().forEach(track => track.stop());
          }
          recorder.destroy();
          recorder = null;

          const MAX_SIZE = 4.5 * 1024 * 1024;
          if (recordingDurationMs < 1000) {
            console.warn('Video was shorter than 1 second. Discarding recording.');
            lastRecordingBlob = null;
            warningDiv.style.display = 'block';
            warningDiv.innerHTML = `<b style="color:red;">Video was shorter than 1 second. Please re-record.</b>`;
          } else if (videoSize > MAX_SIZE) {
            console.warn('Video is too large. Discarding.');
            lastRecordingBlob = null;
            warningDiv.style.display = 'block';
            warningDiv.innerHTML = `<b style="color:red;">Video is too long. Please re-record a shorter video.</b>`;
          } else {
            lastRecordingBlob = blob;
            recordedVideo.src = URL.createObjectURL(blob);
            warningDiv.style.display = 'none';
          }

          if (lastRecordingBlob) {
            console.log('Recorded video size:', bytesToSize(blob.size));
            const finishBtn = document.getElementById('finish-trial');
            if (finishBtn) finishBtn.disabled = false;
          }
        });

        console.log('Recording stopped');
        // Hide camera & start
        videoElement.style.display = 'none';
        startButton.style.display = 'none';
        stopButton.style.display = 'none';
        // Show playback
        playbackContainer.style.display = 'block';
      });

      rerecordButton.addEventListener('click', () => {
        warningDiv.style.display = 'none';
        const finishBtn = document.getElementById('finish-trial');
        if (finishBtn) finishBtn.disabled = false;

        playbackContainer.style.display = 'none';
        recordedVideo.src = '';
        lastRecordingBlob = null;

        videoElement.style.display = 'inline-block';
        startButton.style.display = 'inline-block';
        stopButton.style.display = 'none';

        initializeCamera();
      });
    }, 1000);
  },

  on_finish: async function () {
    console.log('Recording trial finished. Next step: uploading...');
    // We do NOT pop or increment here.
    // That happens after uploading is confirmed in the next trial.
  }
};

// 4) TRIAL: Uploading
const uploading_trial = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="text-align:center;">
      <p style="font-size:20px; color:rgb(21,92,125); font-weight:bold;">
        Uploading the video...<br><br>Please wait
      </p>
      <img src="https://i.gifer.com/ZKZx.gif" alt="Loading..."
           style="width:50px; height:50px; margin-top:10px;">
    </div>`,
  choices: [],
  on_load: async function () {
    if (!lastRecordingBlob) {
      console.log('No video was recorded.');
      return;
    }
    try {
      // 1) Encode and upload
      const base64 = await blobToBase64(lastRecordingBlob);
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
          surveyId,
          participantId,
          video: base64,
          contentType: mimeType,
          key: videoKey
        })
      });

      const uploadData = await uploadResponse.json();
      // 2) Update Dynamo
      if (uploadData && uploadData.videoUrl) {
        const newAUVideoURLs = uploadData.videoUrl;
        const videoPath = newAUVideoURLs.split('videos/').pop();
        const result = `videos/${videoPath}`;

        const updateResponse = await fetch('https://p6r7d2zcl5.execute-api.us-east-2.amazonaws.com/survey/survey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            surveyId,
            participantId,
            newAUVideoURLs: result
          })
        });
        const updateData = await updateResponse.json();
        console.log('DynamoDB updated with AU video URL:', nameAU, updateData);
      }
    } catch (err) {
      console.error('Error uploading or updating survey:', err);
    }

    // 3) Now that everything is done, we pop from the array
    if (auList.length > 0) {
      auList.pop();   // remove the last item we recorded
      au_counter += 1;
      saveAUState();
    }

    jsPsych.finishTrial();
  }
};

// Make sure we have the final load in case of changes
loadAUState();

// 5) Build the timeline
const number_to_do = auList.length;
console.log('Number of AUs to record:', number_to_do);

// For each item in auList, we'll do [record, upload]
let au_trials = [];
for (let i = 0; i < number_to_do; i++) {
  au_trials.push(au_trial_init);
  au_trials.push(uploading_trial);
}

export { au_trials };
