const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeBtn.textContent = isDark ? '🌙' : '☀️';
  });
}

const scriptDatabase = {
  sakura: `loadstring(game:HttpGet("https://raw.githubusercontent.com/WAEXETH/RubyHub.luau/refs/heads/main/SakuraStand.lua"))()`,
  rider: `loadstring(game:HttpGet("https://raw.githubusercontent.com/WAEXETH/RubyHub.luau/refs/heads/main/RiderWorld.lua"))()`,
  aut: `loadstring(game:HttpGet("https://raw.githubusercontent.com/WAEXETH/RubyHub.luau/refs/heads/main/AUT.lua"))()`,
  lastrun: `loadstring(game:HttpGet("https://raw.githubusercontent.com/WAEXETH/RubyHub.luau/refs/heads/main/LastRun.lua"))()`,
  teto: `loadstring(game:HttpGet("https://raw.githubusercontent.com/WAEXETH/RubyHub.luau/refs/heads/main/FeedYourTeto.lua"))()`,
  mtc: `loadstring(game:HttpGet("https://raw.githubusercontent.com/WAEXETH/RubyHub.luau/refs/heads/main/MTC.lua"))()`,
  cts: `loadstring(game:HttpGet("https://raw.githubusercontent.com/WAEXETH/RubyHub.luau/refs/heads/main/ESPCTS.lua"))()`
};

const scriptSelect = document.getElementById('scriptSelect');
const scriptCodeText = document.getElementById('scriptCodeText');
const copyScriptBtn = document.getElementById('copyScriptBtn');
const toast = document.getElementById('toast');

function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function updateScriptPreview() {
  const selectedKey = scriptSelect.value;
  if (scriptDatabase[selectedKey]) {
    scriptCodeText.style.opacity = '0';
    setTimeout(() => {
      scriptCodeText.textContent = scriptDatabase[selectedKey];
      scriptCodeText.style.opacity = '1';
    }, 150);
  }
}

if (scriptSelect) {
  scriptSelect.addEventListener('change', updateScriptPreview);
  updateScriptPreview();
}

if (copyScriptBtn) {
  copyScriptBtn.addEventListener('click', async () => {
    const selectedKey = scriptSelect.value;
    const codeToCopy = scriptDatabase[selectedKey] || '';
    
    try {
      await navigator.clipboard.writeText(codeToCopy);
      copyScriptBtn.classList.add('copied');
      copyScriptBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Copied!</span>';
      
      showToast();
      
      setTimeout(() => {
        copyScriptBtn.classList.remove('copied');
        copyScriptBtn.innerHTML = '<span class="btn-icon">📋</span><span class="btn-text">Copy Script</span>';
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  });
}

const GITHUB_USER = 'WAEXETH';
const GITHUB_REPO = 'RubyHub.luau';

const mapProjects = [
  { name: 'Sakura Stand', file: 'SakuraStand.lua', status: '🟢' },
  { name: 'Rider World', file: 'RiderWorld.lua', status: '🟢' },
  { name: 'A Universal Time', file: 'AUT.lua', status: '🟡' },
  { name: 'Last Run', file: 'LastRun.lua', status: '🟢' },
  { name: 'FeedYourTeto', file: 'FeedYourTeto.lua', status: '🟢' },
  { name: 'Multicrew Tank Combat', file: 'MTC.lua', status: '🟢' },
  { name: 'Cursed Tank Simulator', file: 'ESPCTS.lua', status: '🟢' }
];

function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? 'mo' : 'mos'} ago`;
  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? 'yr' : 'yrs'} ago`;
}

async function fetchMapUpdates() {
  const mapListContainer = document.getElementById('mapList');
  if (!mapListContainer) return;

  try {
    const promises = mapProjects.map(async (project) => {
      try {
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits?path=${project.file}&page=1&per_page=1`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error();
        const data = await res.json();

        if (data && data.length > 0) {
          const date = new Date(data[0].commit.committer.date);
          return {
            ...project,
            timeAgo: getTimeAgo(date),
            fullDate: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            success: true
          };
        }
      } catch (e) {
        return { ...project, timeAgo: 'Online', fullDate: '', success: false };
      }
      return { ...project, timeAgo: '-', fullDate: '', success: false };
    });

    const results = await Promise.all(promises);
    mapListContainer.innerHTML = '';

    results.forEach(item => {
      const el = document.createElement('div');
      el.className = 'map-item';
      el.innerHTML = `
        <div class="map-info">
          <div class="map-name-row">
            <span class="map-status-icon">${item.status}</span>
            <span class="map-name">${item.name}</span>
          </div>
          <span class="map-file-tag">${item.file}</span>
        </div>
        <div class="map-time-info">
          <span class="map-time-ago">${item.timeAgo}</span>
          ${item.fullDate ? `<span class="map-full-date">${item.fullDate}</span>` : ''}
        </div>
      `;
      mapListContainer.appendChild(el);
    });
  } catch (error) {
    mapListContainer.innerHTML = '<div class="map-loading">Failed to load data</div>';
  }
}
fetchMapUpdates();

async function fetchUserStats() {
  const projectStat = document.getElementById('projectStat');
  if (!projectStat) return;
  projectStat.dataset.target = 7; 
}

const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
const blob1 = document.getElementById('blob1');
const blob2 = document.getElementById('blob2');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;
let hasMoved = false; 

if(cursor && cursorTrail) {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
}

document.addEventListener('mousemove', (e) => {
  if (!hasMoved && cursor && cursorTrail) {
    hasMoved = true;
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '1';
    trailX = e.clientX;
    trailY = e.clientY;
  }

  mouseX = e.clientX;
  mouseY = e.clientY;

  if(cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }

  if(blob1) {
    blob1.style.left = (mouseX - 250) + 'px';
    blob1.style.top  = (mouseY - 250) + 'px';
  }

  if(blob2) {
    blob2.style.left = (mouseX - 200 + 150) + 'px';
    blob2.style.top  = (mouseY - 200 + 100) + 'px';
  }
});

function animateTrail() {
  if (hasMoved && cursorTrail) {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

const profileWrapper = document.getElementById('profileWrapper');

document.addEventListener('mousemove', (e) => {
  if (!profileWrapper) return;
  const rect = profileWrapper.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;

  const dx = (e.clientX - cx) / window.innerWidth;
  const dy = (e.clientY - cy) / window.innerHeight;

  const tiltX = dy * 12;   
  const tiltY = -dx * 12;

  profileWrapper.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

document.addEventListener('mouseleave', () => {
  if (profileWrapper) {
    profileWrapper.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
  }
});


// ==========================================
// --- MUSIC PLAYER (FAVORITE 10 SONGS) ---
// ==========================================

const favoriteSongs = [
  { title: "ex-freundin", artist: "By:luu&Nosgov", src: "images/ex-freundin.mp3" },
  { title: "เพลงที่ชอบ 2", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 3", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 4", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 5", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 6", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 7", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 8", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 9", artist: "Unknown", src: "#" },
  { title: "เพลงที่ชอบ 10", artist: "Unknown", src: "#" }
];

const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const equalizer = document.getElementById('equalizer');
const songTitleUI = document.getElementById('songTitle');
const songArtistUI = document.getElementById('songArtist');

const musicModal = document.getElementById('musicModalOverlay');
const closeMusicModal = document.getElementById('closeMusicModal');
const songListContainer = document.getElementById('songListContainer');

let isPlaying = false;
let currentSongLoaded = false;

if (audio && volumeSlider) {
  audio.volume = volumeSlider.value;
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });
}

function openMusicMenu() {
  musicModal.classList.add('active');
}

function closeMusicMenu() {
  musicModal.classList.remove('active');
}

function toggleMusic() {
  if (!audio) return;
  
  if (!currentSongLoaded) {
    openMusicMenu();
    return;
  }

  if (isPlaying) {
    audio.pause();
    playBtn.textContent = '▶';
    equalizer.classList.remove('playing');
  } else {
    audio.play().catch(() => {});
    playBtn.textContent = '⏸';
    equalizer.classList.add('playing');
  }
  isPlaying = !isPlaying;
}

const musicPlayerContainer = document.getElementById('musicPlayerContainer');
if (musicPlayerContainer) {
  musicPlayerContainer.addEventListener('click', (e) => {
    if (e.target.closest('.music-controls')) return;
    openMusicMenu();
  });
}

if(closeMusicModal) closeMusicModal.addEventListener('click', closeMusicMenu);


if (songListContainer) {
  songListContainer.innerHTML = '';
  favoriteSongs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'song-item';
    item.innerHTML = `
      <div class="song-info-group">
        <span class="song-number">${index + 1}</span>
        <div class="song-meta">
          <span class="song-title-list">${song.title}</span>
          <span class="song-artist-list">${song.artist}</span>
        </div>
      </div>
      <span class="play-indicator">▶</span>
    `;
    
    item.addEventListener('click', () => {
      playSelectedSong(song.src, song.title, song.artist);
      closeMusicMenu();
    });
    
    songListContainer.appendChild(item);
  });
}

function playSelectedSong(src, title, artist) {
  if(!audio) return;
  if(src && src !== "#") {
    audio.src = src;
    songTitleUI.textContent = title;
    songArtistUI.textContent = artist;
    
    audio.play().catch(e => console.log("Play Error:", e));
    isPlaying = true;
    currentSongLoaded = true;
    
    playBtn.textContent = '⏸';
    equalizer.classList.add('playing');
  } else {
    alert("ห้ะ");
  }
}

if (audio) {
  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    equalizer.classList.remove('playing');
    isPlaying = false;
  });
}

function animateCount(el, target, duration = 1600) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

fetchUserStats().then(() => {
  const statNums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCount(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
});

document.querySelectorAll('.tag').forEach(tag => {
  const deg = (Math.random() - 0.5) * 6;
  tag.addEventListener('mouseenter', () => {
    tag.style.transform = `translateY(-2px) rotate(${deg}deg)`;
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.transform = '';
  });
});


const scriptBtn = document.getElementById('scriptBtn');
const modalOverlay = document.getElementById('modalOverlay');
const tutorialModalContent = document.getElementById('tutorialModalContent');
const modalHeader = document.getElementById('modalHeader');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentIndex = document.getElementById('currentIndex');
const totalImages = document.getElementById('totalImages');
const thumbnails = document.getElementById('thumbnails');

const tutorialData = [
  { img: 'images/874050240210951622.jpg', caption: 'Step 1: Download a supported executor (e.g. Potassium).' },
  { img: 'images/874050240210951622.jpg', caption: 'Step 2: Open Roblox and inject your executor.' },
  { img: 'images/874050240210951622.jpg', caption: 'Step 3: Select your desired game from the Script Loader.' },
  { img: 'images/874050240210951622.jpg', caption: 'Step 4: Click "Copy Script" to copy the loadstring.' },
  { img: 'images/874050240210951622.jpg', caption: 'Step 5: Paste the script into your executor and Execute.' },
  { img: 'images/874050240210951622.jpg', caption: 'Step 6: Wait for Ruby Hub UI to fully load in-game.' },
  { img: 'images/874050240210951622.jpg', caption: 'Step 7: Join our Discord if you need any support!' }
];

let currentImageIndex = 0;
const total = tutorialData.length;

if (thumbnails) {
  tutorialData.forEach((item, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumbnail';
    if (index === 0) thumb.classList.add('active');
    
    const imgElement = document.createElement('img');
    imgElement.src = item.img;
    imgElement.alt = `Tutorial Step ${index + 1}`;
    
    thumb.appendChild(imgElement);
    thumb.addEventListener('click', () => {
      currentImageIndex = index;
      updateImage();
    });
    
    thumbnails.appendChild(thumb);
  });
}

function updateImage() {
  if (!modalImage || !modalCaption) return;
  modalImage.src = tutorialData[currentImageIndex].img;
  modalCaption.textContent = tutorialData[currentImageIndex].caption;
  
  if(currentIndex) currentIndex.textContent = currentImageIndex + 1;
  
  document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentImageIndex);
  });
  
  modalImage.style.opacity = '0';
  modalCaption.style.opacity = '0';
  setTimeout(() => {
    modalImage.style.opacity = '1';
    modalCaption.style.opacity = '1';
  }, 50);
}

if (totalImages) totalImages.textContent = total;

function openModal() {
  if(modalOverlay) {
    modalOverlay.classList.add('active');
    tutorialModalContent.style.left = 'auto';
    tutorialModalContent.style.top = 'auto';
    tutorialModalContent.style.transform = 'none';
    
    document.body.style.overflow = 'hidden';
    updateImage();
  }
}

function closeModalFn() {
  if(modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'hidden'; 
  }
}

if (closeModal) closeModal.addEventListener('click', closeModalFn);

if (modalOverlay) {
  modalOverlay.addEventListener('mousedown', (e) => {
    if (e.target === modalOverlay) closeModalFn();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + total) % total;
    updateImage();
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % total;
    updateImage();
  });
}

document.addEventListener('keydown', (e) => {
  if (!modalOverlay || !modalOverlay.classList.contains('active')) return;
  
  if (e.key === 'Escape') {
    closeModalFn();
  } else if (e.key === 'ArrowLeft') {
    currentImageIndex = (currentImageIndex - 1 + total) % total;
    updateImage();
  } else if (e.key === 'ArrowRight') {
    currentImageIndex = (currentImageIndex + 1) % total;
    updateImage();
  }
});


let isDraggingModal = false;
let modalOffsetX, modalOffsetY;

if (modalHeader && tutorialModalContent) {
  modalHeader.addEventListener('mousedown', (e) => {
    if (e.target === closeModal) return;

    isDraggingModal = true;
    tutorialModalContent.classList.add('dragging');
    
    const rect = tutorialModalContent.getBoundingClientRect();
    modalOffsetX = e.clientX - rect.left;
    modalOffsetY = e.clientY - rect.top;
    
    tutorialModalContent.style.position = 'absolute';
    tutorialModalContent.style.left = `${rect.left}px`;
    tutorialModalContent.style.top = `${rect.top}px`;
    tutorialModalContent.style.transform = 'none'; 
    tutorialModalContent.style.margin = '0'; 
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingModal) return;

    let x = e.clientX - modalOffsetX;
    let y = e.clientY - modalOffsetY;

    const modalWidth = tutorialModalContent.offsetWidth;
    const modalHeight = tutorialModalContent.offsetHeight;
    
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + modalWidth > window.innerWidth) x = window.innerWidth - modalWidth;
    if (y + modalHeight > window.innerHeight) y = window.innerHeight - modalHeight;

    tutorialModalContent.style.left = `${x}px`;
    tutorialModalContent.style.top = `${y}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDraggingModal) {
      isDraggingModal = false;
      tutorialModalContent.classList.remove('dragging');
    }
  });
}

let isBtnDragging = false;
let btnOffsetX, btnOffsetY;
let startClientX, startClientY;
let dragThreshold = 4; 

if (scriptBtn) {
  scriptBtn.addEventListener('mousedown', (e) => {
    startClientX = e.clientX;
    startClientY = e.clientY;
    
    const rect = scriptBtn.getBoundingClientRect();
    btnOffsetX = e.clientX - rect.left;
    btnOffsetY = e.clientY - rect.top;
    
    document.addEventListener('mousemove', onBtnMove);
    document.addEventListener('mouseup', onBtnUp);
  });

  scriptBtn.addEventListener('click', (e) => {
    if (isBtnDragging) {
      e.preventDefault();
      return;
    }
    openModal();
  });
}

function onBtnMove(e) {
  const dx = e.clientX - startClientX;
  const dy = e.clientY - startClientY;
  
  if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
    isBtnDragging = true;
    scriptBtn.classList.add('dragging-btn');
    
    let x = e.clientX - btnOffsetX;
    let y = e.clientY - btnOffsetY;
    
    const w = scriptBtn.offsetWidth;
    const h = scriptBtn.offsetHeight;
    
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x + w > window.innerWidth) x = window.innerWidth - w;
    if (y + h > window.innerHeight) y = window.innerHeight - h;

    scriptBtn.style.left = `${x}px`;
    scriptBtn.style.top = `${y}px`;
    scriptBtn.style.right = 'auto'; 
    scriptBtn.style.bottom = 'auto'; 
  }
}

function onBtnUp(e) {
  document.removeEventListener('mousemove', onBtnMove);
  document.removeEventListener('mouseup', onBtnUp);
  
  scriptBtn.classList.remove('dragging-btn');
  
  setTimeout(() => {
    isBtnDragging = false;
  }, 50);
}