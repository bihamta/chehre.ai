const images = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/angle.PNG",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/tooclose.PNG",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/hand.PNG",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/tongue.PNG",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/instruction/correct.PNG"
]

var instruction_trial = {
    type: jsPsychInstructions,
    pages: [
        `<div style="text-align: center;">
            <h2>important Instructions</h2>
            <p>
            While recording the video, please keep the following mistakes in mind 
            and try to avoid them. After the experiment is completed, your data will 
            be reviewed. If any of these mistakes are detected, you may be asked to 
            redo the experiment.
            </p>
            <p>Please start the expeiment in a quite place where you are alone and 
            are able to perform different facial expressions</p>
            <p>We prefer if you use your mobile phone for recording these videos.</p>
            <p>in any case please position your mobile/laptop in eye level and while 
            recording please look at the camera and start from a neutral face </p>
            <img src=${images[0]}
            alt="Instruction Image" 
            style="max-width: 50%; height: auto; margin-top: 15px;">
            <p>Try to maintain a consistent distance from the camera.</p>
            <p>Do not stand too close or too far from the camera.</p>
            <img src=${images[1]}
            alt="Instruction Image" 
            style="max-width: 50%; height: auto; margin-top: 15px;">
            <p>Make sure that your hands are not visible in the camera frame.</p>
            <img src=${images[2]}
            alt="Instruction Image" 
            style="max-width: 50%; height: auto; margin-top: 15px;">
            <p>Make sure that you do not use your tongue to eexpress any emotion.</p>
            <img src=${images[3]}
            alt="Instruction Image" 
            style="max-width: 50%; height: auto; margin-top: 15px;">
            <br><br>
            <img src=${images[4]}
            alt="Instruction Image" 
            style="max-width: 50%; height: auto; margin-top: 15px;">
        </div>`
    ],
    show_clickable_nav: true
};

export { instruction_trial };