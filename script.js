const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
const blob1 = document.getElementById('blob1');
const blob2 = document.getElementById('blob2');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
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
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
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
    audio.play().catch(() => {
    
    });
    playBtn.textContent = '⏸';
    equalizer.classList.add('playing');
  }
  isPlaying = !isPlaying;
}


audio.addEventListener('loadedmetadata', () => {
  
  const src = audio.currentSrc || audio.src;
  if (src) {
    const filename = src.split('/').pop().replace(/\.[^/.]+$/, '');
    if (filename && filename !== 'images/PAP BEAT BAND -  Official Music Video.mp3') {
      document.getElementById('songTitle').textContent = decodeURIComponent(filename);
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




const links = {
  fbLink:    'https://www.facebook.com/waexethuou11',
  dcLink:    'https://discord.gg/KqT59MXB7B',
  steamLink: 'https://s.team/p/jtdp-tccn/rnhhqdpd',
};

Object.entries(links).forEach(([id, url]) => {
  const el = document.getElementById(id);
  if (el) el.href = url;
});