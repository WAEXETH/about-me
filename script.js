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

function updateScriptPreview() {
  const selectedKey = scriptSelect.value;
  if (scriptDatabase[selectedKey]) {
    scriptCodeText.textContent = scriptDatabase[selectedKey];
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
        return {
          ...project,
          timeAgo: 'Online',
          fullDate: '',
          success: false
        };
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

const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
const blob1 = document.getElementById('blob1');
const blob2 = document.getElementById('blob2');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;
let hasMoved = false; 

cursor.style.opacity = '0';
cursorTrail.style.opacity = '0';

document.addEventListener('mousemove', (e) => {
  if (!hasMoved) {
    hasMoved = true;
    cursor.style.opacity = '1';
    cursorTrail.style.opacity = '1';
    
    trailX = e.clientX;
    trailY = e.clientY;
  }

  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  blob1.style.left = (mouseX - 250) + 'px';
  blob1.style.top  = (mouseY - 250) + 'px';

  blob2.style.left = (mouseX - 200 + 150) + 'px';
  blob2.style.top  = (mouseY - 200 + 100) + 'px';
});

function animateTrail() {
  if (hasMoved) {
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

const audio    = document.getElementById('bgMusic');
const playBtn  = document.getElementById('playBtn');
const equalizer = document.getElementById('equalizer');
let isPlaying  = false;

function toggleMusic() {
  if (!audio) return;

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

audio.addEventListener('loadedmetadata', () => {
  const src = audio.currentSrc || audio.src;
  if (src) {
    const filename = decodeURIComponent(src.split('/').pop().replace(/\.[^/.]+$/, ''));
    if (filename && !filename.includes('PAP BEAT BAND')) {
      document.getElementById('songTitle').textContent = filename;
    }
  }
});

audio.addEventListener('ended', () => {
  playBtn.textContent = '▶';
  equalizer.classList.remove('playing');
  isPlaying = false;
});

const statNums = document.querySelectorAll('.stat-num');

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
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentIndex = document.getElementById('currentIndex');
const totalImages = document.getElementById('totalImages');
const thumbnails = document.getElementById('thumbnails');

const images = [
  'images/Kagari Mimi.jpg',
  'images/Kagari Mimi.jpg',
  'images/Kagari Mimi.jpg',
  'images/Kagari Mimi.jpg',
  'images/Kagari Mimi.jpg',
  'images/Kagari Mimi.jpg',
  'images/Kagari Mimi.jpg'
];

let currentImageIndex = 0;
const total = images.length;

images.forEach((img, index) => {
  const thumb = document.createElement('div');
  thumb.className = 'thumbnail';
  if (index === 0) thumb.classList.add('active');
  
  const imgElement = document.createElement('img');
  imgElement.src = img;
  imgElement.alt = `Image ${index + 1}`;
  
  thumb.appendChild(imgElement);
  thumb.addEventListener('click', () => {
    currentImageIndex = index;
    updateImage();
  });
  
  thumbnails.appendChild(thumb);
});

function updateImage() {
  modalImage.src = images[currentImageIndex];
  currentIndex.textContent = currentImageIndex + 1;
  
  document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentImageIndex);
  });
  
  modalImage.style.opacity = '0';
  setTimeout(() => {
    modalImage.style.opacity = '1';
  }, 50);
}

modalImage.src = images[0];
totalImages.textContent = total;
currentIndex.textContent = '1';

function openModal() {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateImage();
}

function closeModalFn() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (scriptBtn) scriptBtn.addEventListener('click', openModal);
if (closeModal) closeModal.addEventListener('click', closeModalFn);

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
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