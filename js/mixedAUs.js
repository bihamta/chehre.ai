
const action_units_gifs = [
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU00_mouth-right.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU0_mouth-left.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU4_Frown.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU5_Upper-Lid-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU7_Lid-Tightener.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU9_Nose-Wrinkler.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU10_Upper-Lip-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU12_Lip-Corner-Puller.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU13_Cheek-Puffer.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU14_Dimpler.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU15_Lip-Corner-Depressor.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU16_Lower-Lip-Depressor.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU17_Chin-Raiser.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU18_Lip-Puckerer.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU1_Inner-Brow-Raiser_sad.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU20_Lip-Stretcher.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU22_Lip-Funneler.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU23_Lip-Tightener.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU24_Lip-Pressor.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU25_Lips-part.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU26_Jaw-Drop.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU27_Mouth-Stretch.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU28_Lip-Suck.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU2_Outer-Brow-Raiser_one_side.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU2_Outer-Brow-Raiser_shocked.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU41_Lid-Droop.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU43_Eyes-Closed.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU45_Blink.gif",
    "https://raw.githubusercontent.com/bihamta/chehre.ai/main/aus/AU46_Wink.gif"
];

const action_units_names = new Map([
    ["AU00", action_units_gifs[0]],
    ["AU0", action_units_gifs[1]],
    ["AU4", action_units_gifs[2]],
    ["AU5", action_units_gifs[3]],
    ["AU7", action_units_gifs[4]],
    ["AU9", action_units_gifs[5]],
    ["AU10", action_units_gifs[6]],
    ["AU12", action_units_gifs[7]],
    ["AU13", action_units_gifs[8]],
    ["AU14", action_units_gifs[9]],
    ["AU15", action_units_gifs[10]],
    ["AU16", action_units_gifs[11]],
    ["AU17", action_units_gifs[12]],
    ["AU18", action_units_gifs[13]],
    ["AU1", action_units_gifs[14]],
    ["AU20", action_units_gifs[15]],
    ["AU22", action_units_gifs[16]],
    ["AU23", action_units_gifs[17]],
    ["AU24", action_units_gifs[18]],
    ["AU25", action_units_gifs[19]],
    ["AU26", action_units_gifs[20]],
    ["AU27", action_units_gifs[21]],
    ["AU28", action_units_gifs[22]],
    ["AU2a", action_units_gifs[23]],
    ["AU2b", action_units_gifs[24]],
    ["AU41", action_units_gifs[25]],
    ["AU43", action_units_gifs[26]],
    ["AU45", action_units_gifs[27]],
    ["AU46", action_units_gifs[28]]
]);


const action_units_desc = new Map([
    ["AU00", "Move your mouth completely to the right"],
    ["AU0", "Move your mouth completely to the left"],
    ["AU2a", "Raise the outer edges of your eyebrows"],
    ["AU2b", "Raise the outer edge of one of your eyebrows"],
    ["AU4", "Bring your eyebrows down and together to frown"],
    ["AU5", "Raise your upper eyelids as if surprised"],
    ["AU7", "Squeeze your eyelids tightly together"],
    ["AU9", "Scrunch your nose as if smelling something bad"],
    ["AU10", "Lift your upper lip"],
    ["AU12", "Pull the corners of your mouth up into a smile"],
    ["AU13", "Puff out your cheeks with as if doing a fake smile"],
    ["AU14", "Tighten the corners of your mouth to create dimples"],
    ["AU15", "Pull the corners of your mouth downward as if sad"],
    ["AU16", "Push your lower lip downward"],
    ["AU17", "Raise your chin and push the lower lip upward"],
    ["AU18", "Pucker your lips as if about to whistle or kiss"],
    ["AU1", "Raise the inner parts of your eyebrows"],
    ["AU20", "Stretch your lips sideways without opening your mouth"],
    ["AU22", "Push your lips forward and tighten them into a funnel shape"],
    ["AU23", "Press your lips together"],
    ["AU24", "Firmly press your lips together as if holding something in your mouth"],
    ["AU25", "Slightly open your lips"],
    ["AU26", "Drop your jaw slightly to open your mouth"],
    ["AU27", "Stretch your mouth open as wide as possible"],
    ["AU28", "Suck your lips inward, covering your teeth"],
    ["AU41", "Lower your upper eyelids slightly as if feeling sleepy"],
    ["AU43", "Close your eyes completely"],
    ["AU45", "Blink once quickly"],
    ["AU46", "Wink"]
]);

const action_units_mixed = [
    ["AU0", "AU5"],   // Move mouth left while raising upper eyelids (surprised look)
    ["AU0", "AU26"],  // Move mouth left while dropping jaw (shocked or surprised look)
    ["AU0", "AU27"],  // Move mouth left while stretching mouth open (shocked or scared look)
    ["AU0", "AU45"],  // Move mouth left while blinking (surprised or playful look)

    ["AU00", "AU5"],  // Move mouth right while raising upper eyelids (surprised look)
    ["AU00", "AU26"], // Move mouth right while dropping jaw (shocked or surprised look)
    ["AU00", "AU27"], // Move mouth right while stretching mouth open (shocked or scared look)
    ["AU00", "AU45"], // Move mouth right while blinking (surprised or playful look)

    ["AU1", "AU5"],   // Raise inner eyebrows while raising upper eyelids (extreme surprise)
    ["AU1", "AU9"],   // Raise inner eyebrows while scrunching nose (disgust and surprise mix)
    ["AU1", "AU27"],  // Raise inner eyebrows while stretching mouth open (shocked or scared look)

    ["AU2a", "AU43"],  // Raise outer eyebrows while closing eyes (worried look)

    ["AU4", "AU7"],   // Frown while squeezing eyes shut (pain or discomfort)
    ["AU4", "AU15"],  // Frown while pulling mouth corners downward (sad expression)
    ["AU4", "AU17"],  // Frown while raising chin (disgusted or contempt expression)

    ["AU5", "AU20"],  // Raise upper eyelids while stretching lips sideways (nervous surprise)
    ["AU5", "AU26"],  // Raise upper eyelids while dropping jaw (shocked expression)

    ["AU7", "AU1"],   // Squeeze eyelids while raising inner eyebrows (worried or in pain)
    ["AU7", "AU10"],  // Tighten eyelids while lifting upper lip (aggressive or disgusted look)
    ["AU7", "AU18"],   // Squeeze eyelids while puckering lips (disgusted or playful look)"]
    ["AU7", "AU23"],  // Squeeze eyelids tightly while pressing lips together
    ["AU7", "AU27"],  // Tighten eyelids while stretching mouth open (intense expression)
    ["AU7", "AU45"],  // Squeeze eyelids while blinking (strong blink)

    ["AU9", "AU43"],  // Close eyes while scrunching nose (reacting to something strong)

    ["AU10", "AU25"], // Raise upper lip while slightly opening mouth (snarl or disgust)

    ["AU12", "AU13"], // Smile while puffing out cheeks (fake smile)
    ["AU12", "AU26"], // Smile while dropping jaw (excited happy expression)
    ["AU12", "AU28"], // Smile while sucking lips inward (playful or embarrassed smile)

    ["AU14", "AU4"],  // Dimple while frowning (smirk with frustration)

    ["AU15", "AU43"], // Pull corners of mouth down while closing eyes (crying expression)

    ["AU17", "AU12"], // Raise chin while smiling (confident expression)
    ["AU17", "AU15"], // Raise chin while pulling mouth corners down (serious or determined look)
    ["AU17", "AU18"], // Raise chin while puckering lips (strong pout)
    ["AU17", "AU23"], // Tighten lips while raising chin (determined expression)

    ["AU16", "AU4"],  // Push lower lip down while frowning (disgusted or sad look)

    ["AU18", "AU9"],  // Pucker lips while scrunching nose (playful face)

    ["AU22", "AU18"], // Funnel lips while puckering (strong pucker or exaggerated kiss face)
    ["AU22", "AU27"], // Funnel lips while stretching mouth wide open (vocalization or extreme surprise)

    ["AU23", "AU2a"],  // Tighten lips while raising outer eyebrows (focused or concerned look)

    ["AU24", "AU13"], // Press lips together while puffing out cheeks (holding back a smile)
    ["AU24", "AU12"], // Press lips together while smiling (hiding a smile)

    ["AU25", "AU1"],  // Slightly open lips while raising inner eyebrows (surprised or playful look)

    ["AU26", "AU12"], // Drop jaw while smiling (excited expression)
    ["AU26", "AU22"], // Drop jaw while funneling lips (singing or exaggerated expression)

    ["AU28", "AU13"], // Suck lips inward while puffing out cheeks
    ["AU28", "AU24"], // Firmly press lips together while sucking them inward (hiding lips)

    ["AU41", "AU2a"],  // Droop eyelids while raising outer eyebrows (tired but surprised look)
    ["AU41", "AU17"], // Droop eyelids while raising chin (contemplative or smug expression)
    ["AU41", "AU26"], // Droop eyelids while dropping jaw (exhausted expression)

    ["AU43", "AU15"], // Close eyes while pulling mouth corners downward (sad, crying expression)

    ["AU45", "AU20"], // Blink while stretching lips sideways (awkward or nervous look)
    ["AU45", "AU27"], // Blink while open mouth (surprised or playful look)

    ["AU46", "AU12"], // Wink while smiling playfully
    ["AU46", "AU26"]  // Wink while dropping jaw (playful teasing expression)
];


function getRandomAUs(action_units_names, action_units_mixed, isolatedCount = 5, mixedCount = 15) {
    // Convert Map to array of keys (AU codes)
    let isolatedAUs = Array.from(action_units_names.keys());
    let mixedAUs = [...action_units_mixed];

    // Shuffle function (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    // Shuffle isolated and mixed AUs
    shuffleArray(isolatedAUs);
    shuffleArray(mixedAUs);

    // Select first N isolated AUs
    let selectedIsolated = isolatedAUs.slice(0, isolatedCount);

    // Select mixed AUs while ensuring diversity
    let selectedMixed = [];
    let usedAUs = new Set(selectedIsolated); // Store already used AUs
    
    for (let i = 0; i < mixedAUs.length && selectedMixed.length < mixedCount; i++) {
        let au1 = mixedAUs[i][0];
        let au2 = mixedAUs[i][1];

        // Only add if both AUs haven't been used yet
        if (!usedAUs.has(au1) && !usedAUs.has(au2)) {
            selectedMixed.push([au1, au2]);
            usedAUs.add(au1);
            usedAUs.add(au2);
        }
    }
    while (selectedMixed.length < mixedCount) {
        let randomIndex = Math.floor(Math.random() * mixedAUs.length);
        let [au1, au2] = mixedAUs[randomIndex];
    
        // Ensure we don’t pick a pair that is already in selectedMixed
        let alreadyChosen = selectedMixed.some(pair => 
            (pair[0] === au1 && pair[1] === au2) || (pair[0] === au2 && pair[1] === au1)
        );
    
        if (!alreadyChosen) {
            selectedMixed.push([au1, au2]); // Add the random pair
        }
    }

    return {
        isolated: selectedIsolated.map(au => ({
            au,
            gif: action_units_names.get(au),
            description: action_units_desc.get(au)
        })),
        mixed: selectedMixed.map(([au1, au2]) => ({
            au1,
            au2,
            gif1: action_units_names.get(au1),
            gif2: action_units_names.get(au2),
            description1: action_units_desc.get(au1),
            description2: action_units_desc.get(au2)
        }))
    };
}

function AUs(){
    return getRandomAUs(action_units_names, action_units_mixed, 5, 5);
}
export { AUs };
