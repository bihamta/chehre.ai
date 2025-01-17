function addExitButton() {
    // Create the Exit button dynamically
    if (document.getElementById('exit-button')) return; 

    const exitButton = document.createElement("button");
    exitButton.innerHTML = "Exit";
    // exitButton.style.position = "fixed"; // Position the button on the screen
    exitButton.style.right = "10px"; // Place the button 10px from the right side
    exitButton.style.bottom = "10px"; // Place the button 10px from the bottom
    exitButton.style.margin = "10px";
    exitButton.style.width = "80px";
    exitButton.style.padding = "8px 12px"; // Padding for better size
    exitButton.style.fontSize = "14px"; // Text size
    exitButton.style.backgroundColor = "rgb(182, 133, 133)"; // Pink background color
    exitButton.style.color = "white"; // Text color
    exitButton.style.border = "none"; // Remove the border
    exitButton.style.borderRadius = "4px"; // Rounded corners
    exitButton.style.cursor = "pointer"; // Pointer cursor on hover
    exitButton.style.transition = "background-color 0.3s ease";
    exitButton.id = "exit-button";
    document.body.appendChild(exitButton);

    // Add event listener to handle the exit button click
    exitButton.addEventListener("click", function() {
        exitButton.style.display = "none"; // Hide the button after it's clicked
        jsPsych.abortExperiment("You chose to exit the survey. Thank you for your participation. You can close the window.");
    });
    
    // Add hover effect for a darker color
    exitButton.addEventListener("mouseover", function() {
        exitButton.style.backgroundColor = "rgb(111, 82, 82)"; // Darker pink/red color on hover
    });

    exitButton.addEventListener("mouseout", function() {
        exitButton.style.backgroundColor = "rgb(182, 133, 133)"; // Original pink color when not hovered
    });
}
export {addExitButton}