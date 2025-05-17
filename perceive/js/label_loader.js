const emojiLabels = {};

async function loadEmojiLabels() {
    const response = await fetch("emoji_labels.json");
    Object.assign(emojiLabels, await response.json());
}
console.log("Emoji labels loaded:", emojiLabels);
export { emojiLabels, loadEmojiLabels };