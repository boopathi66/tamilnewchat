// EMOJI, GIF AND DECORATIVE ASSETS JS

const EMOJI_LIST = ['😀', '😂', '😍', '🔥', '👍', '❤️', '🙏', '🎉', '😎', '🥳', '🙌', '🎈', '💎', '🌞'];

const GIF_LIST = [
    'https://media.giphy.com/media/l0HlCqV35hdEG2GUo/giphy.gif',
    'https://media.giphy.com/media/3o7TKsjRrfIPjeiVyM/giphy.gif',
    'https://media.giphy.com/media/26xb1Rx2XccvLqQo0/giphy.gif'
];

function populateEmojiPicker() {
    const container = document.getElementById('pickerContent');
    if(!container) return;
    
    showEmojiCategory('emojis');
}

function showEmojiCategory(category) {
    const container = document.getElementById('pickerContent');
    container.innerHTML = '';

    if (category === 'emojis') {
        EMOJI_LIST.forEach(emoji => {
            const span = document.createElement('span');
            span.className = 'picker-item';
            span.innerText = emoji;
            span.onclick = () => insertEmoji(emoji);
            container.appendChild(span);
        });
    } else if (category === 'gifs') {
        GIF_LIST.forEach(gifUrl => {
            const img = document.createElement('img');
            img.src = gifUrl;
            img.className = 'picker-gif';
            img.onclick = () => sendImageMessage(gifUrl);
            container.appendChild(img);
        });
    }
}

function insertEmoji(emoji) {
    const input = document.getElementById('chatMessageInput');
    input.value += emoji;
    document.getElementById('emojiPicker').classList.add('hidden');
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    picker.classList.toggle('hidden');
    if(!picker.classList.contains('hidden')) {
        populateEmojiPicker();
    }
}
