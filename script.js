const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
];

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Ayaaa please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
];

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
];

let yesTeasedCount = 0;
let noClickCount = 0;
let runawayEnabled = false;
let musicPlaying = true;

const catGif = document.getElementById('cat-gif');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const music = document.getElementById('bg-music');

// Start muted to bypass autoplay policy
music.muted = true;
music.volume = 0.3;
music.play().then(() => { music.muted = false }).catch(() => {
    document.addEventListener('click', () => { music.muted = false; music.play().catch(()=>{}); }, { once: true });
});

function toggleMusic() {
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        document.getElementById('music-toggle').textContent = '🔇';
    } else {
        music.play();
        musicPlaying = true;
        document.getElementById('music-toggle').textContent = '🔊';
    }
}

function handleYesClick() {
    // Show teasing message first, but always allow Yes to work
    if (yesTeasedCount < yesTeasePokes.length) {
        const msg = yesTeasePokes[yesTeasedCount];
        yesTeasedCount++;
        showTeaseMessage(msg);
    }
    window.location.href = 'yes.html'; // always go to yes page
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function handleNoClick() {
    noClickCount++;

    // Show message based on click count
    const msgIndex = Math.min(noClickCount - 1, noMessages.length - 1);
    noBtn.textContent = noMessages[msgIndex];

    // Grow Yes button but cap for mobile
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    const maxSize = window.innerWidth < 500 ? 36 : 50;
    yesBtn.style.fontSize = `${Math.min(currentSize*1.35, maxSize)}px`;
    const padY = Math.min(18 + noClickCount*5, window.innerWidth < 500 ? 30 : 40);
    const padX = Math.min(45 + noClickCount*10, window.innerWidth < 500 ? 60 : 90);
    yesBtn.style.padding = `${padY}px ${padX}px`;

    // Shrink No button
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(noSize*0.85, 10)}px`;
    }

    // Swap GIF
    const gifIndex = Math.min(noClickCount, gifStages.length-1);
    swapGif(gifStages[gifIndex]);

    // Enable runaway **only after the last message** ("You can't catch me anyway 😜")
    if (noClickCount >= noMessages.length && !runawayEnabled) {
        runawayEnabled = true;
        noBtn.style.position = 'fixed';
        noBtn.style.zIndex = '100';
        noBtn.addEventListener('mouseover', runAway);
        noBtn.addEventListener('touchstart', runAway, { passive: true });
    }
}

function swapGif(src) {
    catGif.style.opacity = '0';
    setTimeout(() => { catGif.src = src; catGif.style.opacity = '1'; }, 200);
}

function runAway() {
    const margin = 20;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;

    const randomX = Math.random() * maxX + margin / 2;
    const randomY = Math.random() * maxY + margin / 2;

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}
