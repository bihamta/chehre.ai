import { addExitButton } from "../utils.js";

const rank_two_emojis = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `

    <div class="fc-container">
        <p class="fc-prompt">Watch the video and choose the <strong>two emojis</strong> that best match the expression. (in order of relevance.)</p>

        <div class="fc-video-block">
            <video id="video1" autoplay loop muted>
                <source src="media/sample_videos/woman--d0.mp4" type="video/mp4">
            </video>
        </div>

        <div id="emoji-grid" class="emoji-grid"></div>

        <p id="selectionText" style="margin-top: 20px; color: #3e5f4e; font-size: 15px; display: none;"></p>
        <button id="confirmButton" class="jspsych-btn" style="display: none; margin-top: 20px;">Confirm</button>
    </div>
    `,
    choices: "NO_KEYS",

    on_load: function () {
        addExitButton();

        fetch("media/emojis/emoji_list.json")
        .then(res => res.json())
        .then(emojiFiles => {

            const shuffled = emojiFiles.sort(() => 0.5 - Math.random());
            const selectedEmojis = shuffled.slice(0, 12);
            const emojiGrid = document.getElementById("emoji-grid");
            emojiGrid.innerHTML = selectedEmojis.map((filename, i) => `
                <button class="emoji-btn" data-index="${i}" data-emoji="${filename}">
                    <img src="media/emojis/${filename}" alt="emoji" class="emoji-img" />
                </button>
            `).join("");

            setupEmojiSelection();
        });

        function setupEmojiSelection() {
            let selected = [];
            const emojiButtons = document.querySelectorAll(".emoji-btn");
            const confirmButton = document.getElementById("confirmButton");
            const selectionText = document.getElementById("selectionText");

            emojiButtons.forEach(button => {
                button.addEventListener("click", () => {
                    const index = button.getAttribute("data-index");
                    const emoji = button.getAttribute("data-emoji");

                    if (selected.find(s => s.index === index)) {
                        selected = selected.filter(s => s.index !== index);
                        button.classList.remove("selected-rank-1", "selected-rank-2");
                    } else if (selected.length < 2) {
                        selected.push({ index, emoji });
                    }

                    emojiButtons.forEach(btn => btn.classList.remove("selected-rank-1", "selected-rank-2"));
                    selected.forEach((s, i) => {
                        document.querySelector(`.emoji-btn[data-index='${s.index}']`).classList.add(`selected-rank-${i + 1}`);
                    });

                    if (selected.length === 2) {
                        selectionText.style.display = "block";
                        selectionText.innerHTML = `
                        Rank 1: <img src="media/emojis/${selected[0].emoji}" alt="rank 1" class="emoji-img" style="vertical-align: middle;" />
                        &nbsp;&nbsp;
                        Rank 2: <img src="media/emojis/${selected[1].emoji}" alt="rank 2" class="emoji-img" style="vertical-align: middle;" />`;
                        confirmButton.style.display = "inline-block";
                    } else {
                        selectionText.style.display = "none";
                        confirmButton.style.display = "none";
                    }
                });
            });

            confirmButton.addEventListener("click", () => {
                jsPsych.finishTrial({
                    video: "woman--d0.mp4",
                    rank_1: selected[0].emoji,
                    rank_2: selected[1].emoji
                });
            });
        }
    },

    on_finish: function (data) {
        const payload = {
            surveyId: window.surveyId,
            participantId: window.participantId,
            video: data.video,
            rank_1: data.rank_1,
            rank_2: data.rank_2
        };

        console.log("Sending emoji ranking payload =>", payload);

        fetch("_", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(r => r.json())
            .then(serverResp => {
                console.log("Emoji ranking submission success:", serverResp);
            })
            .catch(err => {
                console.error("Error submitting emoji ranking:", err);
            });
    }
};

export { rank_two_emojis };
