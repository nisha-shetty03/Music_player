const tracks = [
  { title: "Golden Hour",   artist: "Lumen",     src: "audio/golden-hour.wav" },
  { title: "Night Drive",   artist: "Lumen",     src: "audio/night-drive.wav" },
  { title: "Static Bloom",  artist: "Aria Vale",  src: "audio/static-bloom.wav" },
  { title: "Paper Weather", artist: "Aria Vale",  src: "audio/paper-weather.wav" },
];

const audio       = document.getElementById('audio');
const disc        = document.getElementById('disc');
const tonearm     = document.getElementById('tonearm');
const playBtn     = document.getElementById('playBtn');
const playIcon    = document.getElementById('playIcon');
const pauseIcon   = document.getElementById('pauseIcon');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const progress    = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl  = document.getElementById('duration');
const volume      = document.getElementById('volume');
const autoplay    = document.getElementById('autoplay');
const trackTitle  = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const playlistEl  = document.getElementById('playlist');
const statusText  = document.getElementById('statusText');
const liveDot     = document.getElementById('liveDot');

let currentIndex = 0;
let isSeeking = false;

function formatTime(sec){
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderPlaylist(){
  playlistEl.innerHTML = '';
  tracks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'track-row' + (i === currentIndex ? ' active' : '');
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `Play ${t.title} by ${t.artist}`);
    li.innerHTML = `
      <span class="track-index">
        <span class="track-index-num">${i + 1}</span>
        <span class="eq"><span></span><span></span><span></span></span>
      </span>
      <span class="track-meta">
        <div class="t-title">${t.title}</div>
        <div class="t-artist">${t.artist}</div>
      </span>
      <span class="track-dur" data-dur-for="${i}">--:--</span>
    `;
    li.addEventListener('click', () => loadTrack(i, true));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadTrack(i, true); }
    });
    playlistEl.appendChild(li);
  });
}

function loadTrack(index, autoplayNow){
  currentIndex = (index + tracks.length) % tracks.length;
  const t = tracks[currentIndex];
  audio.src = t.src;
  trackTitle.textContent = t.title;
  trackArtist.textContent = t.artist;
  progress.value = 0;
  updateProgressFill(0);
  currentTimeEl.textContent = "0:00";
  renderPlaylist();
  if (autoplayNow) {
    audio.play().catch(() => {});
  }
}

function updateProgressFill(pct){
  progress.style.background =
    `linear-gradient(to right, var(--gold) ${pct}%, var(--surface-line) ${pct}%)`;
}

function setPlayingUI(playing){
  disc.classList.toggle('spinning', playing);
  tonearm.classList.toggle('playing', playing);
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
  playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  statusText.textContent = playing ? 'Playing' : 'Paused';
  liveDot.classList.toggle('live', playing);
}

playBtn.addEventListener('click', () => {
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
});

prevBtn.addEventListener('click', () => loadTrack(currentIndex - 1, true));
nextBtn.addEventListener('click', () => loadTrack(currentIndex + 1, true));

audio.addEventListener('play',  () => setPlayingUI(true));
audio.addEventListener('pause', () => setPlayingUI(false));

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
  const durSpan = document.querySelector(`[data-dur-for="${currentIndex}"]`);
  if (durSpan) durSpan.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (isSeeking) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progress.value = pct;
  updateProgressFill(pct);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
  if (autoplay.checked) {
    loadTrack(currentIndex + 1, true);
  } else {
    setPlayingUI(false);
  }
});

progress.addEventListener('input', () => {
  isSeeking = true;
  updateProgressFill(progress.value);
});
progress.addEventListener('change', () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
  isSeeking = false;
});

volume.addEventListener('input', () => { audio.volume = volume.value; });
audio.volume = volume.value;

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.getAttribute('role') !== 'button') {
    e.preventDefault();
    playBtn.click();
  }
});

// Preload durations for the whole playlist without playing them
tracks.forEach((t, i) => {
  const probe = new Audio();
  probe.preload = 'metadata';
  probe.src = t.src;
  probe.addEventListener('loadedmetadata', () => {
    const durSpan = document.querySelector(`[data-dur-for="${i}"]`);
    if (durSpan) durSpan.textContent = formatTime(probe.duration);
  });
});

renderPlaylist();
loadTrack(0, false);