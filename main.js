let musics = [
  {
    name: "Let You Down",
    cover:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/perception-album-cover.png",
    source:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/NF%20-%20Let%20You%20Down.mp3",
    album: "./imgs/album1.jpg",
    color: "#25323b",
  },
  {
    name: "rockstar",
    cover:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/rockstar-album-cover.jpg",
    source:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/Post%20Malone%20-%20rockstar%20ft.%2021%20Savage%20(1).mp3",
    album: "./imgs/album2.jpg",
    color: "#c3af50",
  },
  {
    name: "Silence",
    cover:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/silence-album-cover.jpg",
    source:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/Marshmello%20-%20Silence%20ft.%20Khalid.mp3",
    album: "./imgs/album3.jpg",
    color: "#c1c1c1",
  },
  {
    name: "I Fall Apart",
    cover:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/stoney-cover-album.jpg",
    source:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/Post%20Malone%20-%20I%20Fall%20Apart.mp3",
    album: "./imgs/album4.jpg",
    color: "#cd4829",
  },
  {
    name: "Fireproof",
    cover:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/fireproof-album-cover.jpeg",
    source:
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/308622/VAX%20-%20Fireproof%20Feat%20Teddy%20Sky.mp3",
    album: "./imgs/album5.jpg",
    color: "#5d0126",
  },
];

const num = "0123456789";

let index = 0;
let playState = false;

const sidenav = document.querySelector(".sidenav ul");
const poster = document.querySelector(".music-poster");
const album = document.querySelector(".music-album");
const musicName = document.querySelector(".music-name");
const duration = document.querySelector(".duration");
const time = document.querySelector(".time");
const played = document.querySelector(".played");
const seekbar = document.querySelector(".seekbar");
const playPause = document.querySelector(".play-pause");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const main = document.querySelector("main");
const card = document.querySelector(".card");

sidenav.addEventListener("click", (e) => {
  if (e.target.classList.contains("sidenav-item")) {
    const li = document.querySelectorAll(".sidenav-item");
    li.forEach((el, i) => {
      el.classList.remove("active");
      if (li[i] === e.target) {
        el.classList.add("active");
        index = i;
        playState = true;
        updatePlayer();
      }
    });
  }
});

musics.forEach((el, i) => {
  const li = document.createElement("li");
  li.innerHTML = el.name;
  li.classList.add("sidenav-item");
  if (i === index) {
    li.classList.add("active");
  }
  sidenav.appendChild(li);
});

const convertInMin = (time) => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min >= 10 ? min : "0" + min}:${sec >= 10 ? sec : "0" + sec}`;
};

const music = new Audio(musics[index].source);

const setCurrentTime = (currentTime, duration) => {
  const currentTimeInMin = convertInMin(currentTime);
  time.innerText = currentTimeInMin;
  played.style.width = `${(currentTime / duration) * 100}%`;
};

const updatePlayPauseState = () => {
  if (playState) {
    playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
    music.play();
    album.setAttribute("style", "animation: rotate 10s infinite linear");
  } else {
    playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    music.pause();
    album.setAttribute("style", "animation: none");
  }
};

const updatePlayer = (isPlayPause) => {
  if (!isPlayPause) {
    music.src = musics[index].source;
    poster.src = musics[index].cover;
    album.src = musics[index].album;
    musicName.innerText = musics[index].name;
    main.style.backgroundColor = musics[index].color;
    // card.style.backgroundColor = musics[index].color;
  }
  music.addEventListener("loadeddata", () => {
    let musicDuration = convertInMin(music.duration);
    updatePlayPauseState();
    duration.innerText = musicDuration;
    console.log(music.currentTime);
    music.addEventListener("timeupdate", () => {
      if (music.ended) {
        next.click();
      }
      setCurrentTime(music.currentTime, music.duration);
    });
  });
  const li = document.querySelectorAll(".sidenav-item");
  li.forEach((el) => {
    el.classList.remove("active");
  });
  li[index].classList.add("active");
  updatePlayPauseState();
};

document.addEventListener("DOMContentLoaded", () => {
  updatePlayer();
});

window.addEventListener("keydown", (key) => {
  if (key.key === " ") {
    if (!music.paused) {
      playState = false;
    } else {
      playState = true;
    }
    updatePlayPauseState();
    updatePlayer(true);
  } else if (num.includes(key.key)) {
    const percent = parseInt(key.key) * 10;
    music.currentTime = (music.duration * percent) / 100;
    setCurrentTime(music.currentTime, music.duration);
  }
});

playPause.addEventListener("click", () => {
  if (music.paused) {
    playState = true;
  } else {
    playState = false;
  }
  updatePlayer(true);
  updatePlayPauseState();
});

prev.addEventListener("click", () => {
  if (index > 0) {
    index--;
  } else {
    index = musics.length - 1;
  }
  updatePlayer();
  updatePlayPauseState();
});

next.addEventListener("click", () => {
  if (index < musics.length - 1) {
    index++;
  } else {
    index = 0;
  }
  updatePlayer();
  updatePlayPauseState();
});

seekbar.addEventListener("click", (e) => {
  const x = e.clientX - seekbar.getBoundingClientRect().left;
  const percent = (x / seekbar.clientWidth) * 100;
  played.style.width = `${percent}%`;
  music.currentTime = (music.duration * percent) / 100;
  setCurrentTime(music.currentTime, music.duration);
});
