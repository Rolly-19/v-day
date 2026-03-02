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

// Autoplay audio
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
        music.muted = false;
        music.play();
        musicPlaying = true;
        document.getElementById('music-toggle').textContent = '🔊';
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length-1)];
        yesTeasedCount++;
        showTeaseMessage(msg);
        return;
    }
    window.location.href = 'yes.html';
}

function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function handleNoClick() {
    noClickCount++;

    const msgIndex = Math.min(noClickCount, noMessages.length-1);
    noBtn.textContent = noMessages[msgIndex];

    // Grow Yes button but cap max size based on screen width
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    let maxSize = 50; // default max for desktop
    if (window.innerWidth < 500) {
        maxSize = 36; // smaller max for mobile
    }
    yesBtn.style.fontSize = `${Math.min(currentSize*1.35, maxSize)}px`;

    const padY = Math.min(18 + noClickCount*5, 30);
    const padX = Math.min(45 + noClickCount*10, 70);
    yesBtn.style.padding = `${padY}px ${padX}px`;

    // Shrink No button slightly
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(noSize*0.85, 10)}px`;
    }

    // Swap GIF
    const gifIndex = Math.min(noClickCount, gifStages.length-1);
    swapGif(gifStages[gifIndex]);

    // Enable runaway after 5 clicks
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway();
        runawayEnabled = true;
    }
}

function swapGif(src) {
    catGif.style.opacity = '0';
    setTimeout(() => { catGif.src = src; catGif.style.opacity = '1'; }, 200);
}

// Make No button always above Yes button
function enableRunaway() {
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '100'; // above Yes
    noBtn.addEventListener('mouseover', runAway);
    noBtn.addEventListener('touchstart', runAway, { passive: true });
}

function runAway() {
    const margin = window.innerWidth < 500 ? 10 : 20; // smaller on mobile
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;

    const randomX = Math.random() * maxX + margin / 2;
    const randomY = Math.random() * maxY + margin / 2;

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}
