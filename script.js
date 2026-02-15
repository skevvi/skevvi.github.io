// ===============================
// Overlay startowy z fade-out + start muzyki 0.02
// ===============================
document.body.classList.add("overlay-active");
const overlay = document.getElementById("overlay");

overlay.addEventListener("click", () => {
  overlay.classList.add("fade-out");                  // fade overlay
  document.body.classList.remove("overlay-active");   // usuń blur

  setTimeout(() => {
    overlay.style.display = "none";
  }, 600);

  // Włącz muzykę po kliknięciu i ustaw głośność 0.02
  audio.volume = 0.02;
  volumeSlider.value = 0.02;
  const value = 0.02 * 100;
  volumeSlider.style.background = `linear-gradient(to right, white ${value}%, rgba(255,255,255,0.2) ${value}%)`;

  if (!isPlaying) {
    playTrack();
  }
});

// ===============================
// 3D karta za kursorem
// ===============================
const profileCard = document.getElementById("profile-card");
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  profileCard.style.transform = `translate(${x}px, ${y}px)`;
});

// ===============================
// Typing subtitle
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const typingText = document.getElementById("typing-text");
  const subtitleText = "music producer :)";
  let i = 0, isDeleting = false;

  function typeSubtitle() {
    typingText.textContent = subtitleText.substring(0, i) + "|";
    if (!isDeleting) {
      if (i < subtitleText.length) { i++; setTimeout(typeSubtitle, 100); }
      else { isDeleting = true; setTimeout(typeSubtitle, 1500); }
    } else {
      if (i > 0) { i--; setTimeout(typeSubtitle, 50); }
      else { isDeleting = false; setTimeout(typeSubtitle, 500); }
    }
  }
  typeSubtitle();
});

// ===============================
// Title typing
// ===============================
const titleText = "@skevvi";
let titleIndex = 0, titleDeleting = false;
document.title = "";

function animateTitle() {
  document.title = titleText.substring(0, titleIndex);
  if (!titleDeleting) {
    if (titleIndex < titleText.length) { titleIndex++; setTimeout(animateTitle, 100); }
    else { titleDeleting = true; setTimeout(animateTitle, 1500); }
  } else {
    if (titleIndex > 0) { titleIndex--; setTimeout(animateTitle, 50); }
    else { titleDeleting = false; setTimeout(animateTitle, 600); }
  }
}
animateTitle();

// ===============================
// Discord Lanyard
// ===============================
function fetchLanyard() {
  fetch("https://api.lanyard.rest/v1/users/1402940517209079849")
    .then(res => res.json())
    .then(data => {
      const user = data.data.discord_user;
      const status = data.data.discord_status;
      const activity = data.data.activities?.[0];
      const spotify = data.data.spotify;

      document.getElementById("lanyard-avatar").src =
        `https://cdn.discordapp.com/avatars/1402940517209079849/${user.avatar}.png?size=128`;
      document.getElementById("lanyard-global-name").textContent = user.global_name || user.username;
      document.getElementById("username-text").innerHTML = `<span class="at-gray">@</span>${user.username}`;
      document.getElementById("lanyard-username").setAttribute("data-username", user.username);
      document.getElementById("lanyard-status").textContent = `Status: ${status}`;
      document.getElementById("lanyard-activity").textContent = `Activity: ${activity?.name || "None"}`;
      document.getElementById("spotify-status").textContent =
        spotify ? `Spotify: ${spotify.song} by ${spotify.artist}` : "Spotify: Not playing";
    })
    .catch(err => console.error("Lanyard error", err));
}
fetchLanyard();
setInterval(fetchLanyard, 15000);

// ===============================
// Copy username
// ===============================
const userText = document.getElementById("lanyard-username");
const tooltip = document.getElementById("copy-tooltip");
userText.addEventListener("click", () => {
  const username = userText.getAttribute("data-username");
  navigator.clipboard.writeText(username).then(() => {
    tooltip.textContent = "copied!";
    setTimeout(() => { tooltip.textContent = "click to copy"; }, 1500);
  });
});

// ===============================
// Copy crypto
// ===============================
document.querySelectorAll(".icon.crypto").forEach(icon => {
  const tooltip = icon.querySelector(".tooltip");
  icon.addEventListener("click", async () => {
    const address = icon.getAttribute("data-crypto");
    try {
      await navigator.clipboard.writeText(address);
      tooltip.textContent = "copied!";
      tooltip.style.opacity = "1";
      setTimeout(() => { tooltip.textContent = "click to copy"; tooltip.style.opacity = "0"; }, 1500);
    } catch (e) { console.error("Copy failed", e); }
  });
  icon.addEventListener("mouseenter", () => { tooltip.style.opacity = "1"; });
  icon.addEventListener("mouseleave", () => { tooltip.style.opacity = "0"; });
});

// ===============================
// MUSIC PLAYER
// ===============================
const tracks = [
  { title: "190bpm amaj",
 artist: "@skevvi",
 src: "assets/music/plonacy beat od gotowania 190bpm amaj.mp3",
 cover: "assets/music/covers/1.png" },

  { title: "140bpm cmin",
 artist: "@skevvi, @cxsket, @1vurk",
 src: "assets/music/osamason type beat 140bpm cmin @skevvi @cxsket @1vurk.mp3",
 cover: "assets/music/covers/1.png" },

  { title: "175 bpm dmin",
 artist: "@skevvi",
 src: "assets/music/444jet x janu4ryss type beat 175 bpm dmin @skevvi.mp3",
 cover: "assets/music/covers/1.png" },

  { title: "178bpm emaj +231cents", artist: "@skevvi",
 src: "assets/music/heavenly emotional jerk 178bpm emaj +231cents @skevvi.mp3",
 cover: "assets/music/covers/1.png" },

  { title: "120bpm cmin",
 artist: "@skevvi",
 src: "assets/music/free for profit experimental x skevvi type beat cursed (prod. @skevvi).mp3",
 cover: "assets/music/covers/1.png" },

  { title: "102bpm c#min",
 artist: "@skevvi, @dominicb",
 src: "assets/music/emotional jerk.mp3",
 cover: "assets/music/covers/1.png" }

];

let currentTrackIndex = 0, isPlaying = false;
const audio = new Audio();
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const muteBtn = document.getElementById("mute-btn");
const progressBar = document.querySelector(".progress-bar");
const progressFill = document.getElementById("progress");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const musicCover = document.getElementById("music-cover");
const volumeSlider = document.getElementById("volume-slider");
const currentTimeDisplay = document.getElementById("current-time");
const totalDurationDisplay = document.getElementById("total-duration");

// ===============================
// Load track
// ===============================
function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  musicCover.src = track.cover;
  audio.load();
}

function playTrack() { audio.play(); isPlaying = true; playBtn.src = "assets/icons/music-player/pause.png"; }
function pauseTrack() { audio.pause(); isPlaying = false; playBtn.src = "assets/icons/music-player/play.png"; }

// ===============================
// Controls
// ===============================
playBtn.addEventListener("click", () => { isPlaying ? pauseTrack() : playTrack(); });
prevBtn.addEventListener("click", () => { currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; loadTrack(currentTrackIndex); playTrack(); });
nextBtn.addEventListener("click", () => { currentTrackIndex = (currentTrackIndex + 1) % tracks.length; loadTrack(currentTrackIndex); playTrack(); });
muteBtn.addEventListener("click", () => { audio.muted = !audio.muted; muteBtn.src = audio.muted ? "assets/icons/music-player/volume-mute.png" : "assets/icons/music-player/volume.png"; });

// ===============================
// Volume
// ===============================
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  const value = volumeSlider.value * 100;
  volumeSlider.style.background = `linear-gradient(to right, white ${value}%, rgba(255,255,255,0.2) ${value}%)`;
});

// ===============================
// Time format & Progress
// ===============================
function formatTime(seconds) { const m = Math.floor(seconds / 60); const s = Math.floor(seconds % 60); return `${m}:${s < 10 ? "0" + s : s}`; }
audio.addEventListener("loadedmetadata", () => { totalDurationDisplay.textContent = formatTime(audio.duration); });

let isSeeking = false;
function seek(e) {
  const rect = progressBar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, x / rect.width));
  const newTime = percent * audio.duration;
  if (!isNaN(newTime)) { audio.currentTime = newTime; progressFill.style.width = (percent * 100) + "%"; currentTimeDisplay.textContent = formatTime(newTime); }
}
progressBar.addEventListener("click", seek);
progressBar.addEventListener("mousedown", (e) => { isSeeking = true; seek(e); });
document.addEventListener("mousemove", (e) => { if (isSeeking) seek(e); });
document.addEventListener("mouseup", () => { isSeeking = false; });
audio.addEventListener("timeupdate", () => {
  if (!isSeeking && audio.duration) { const percent = (audio.currentTime / audio.duration) * 100; progressFill.style.width = percent + "%"; currentTimeDisplay.textContent = formatTime(audio.currentTime); }
});
audio.addEventListener("ended", () => { nextBtn.click(); });

// ===============================
// Init
// ===============================
loadTrack(currentTrackIndex);

