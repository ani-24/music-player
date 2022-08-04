let musics = [
  {
    name: "Mekanın Sahibi",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3",
  },
  {
    name: "Everybody Knows",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3",
  },
  {
    name: "Extreme Ways",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/3.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/3.mp3",
  },
  {
    name: "Butterflies",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/4.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/4.mp3",
  },
  {
    name: "The Final Victory",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/5.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/5.mp3",
  },
  {
    name: "Genius ft. Sia, Diplo, Labrinth",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/6.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/6.mp3",
  },
  {
    name: "The Comeback Kid",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/7.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/7.mp3",
  },
  {
    name: "Overdose",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/8.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/8.mp3",
  },
  {
    name: "Rag'n'Bone Man",
    cover:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/9.jpg",
    source:
      "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/9.mp3",
  },
];

const num = "0123456789";

let index = 0;
let playState = false;

const sidenav = document.querySelector(".sidenav ul");
const poster = document.querySelector(".music-poster");
const musicName = document.querySelector(".music-name");
const duration = document.querySelector(".duration");
const time = document.querySelector(".time");
const played = document.querySelector(".played");
const seekbar = document.querySelector(".seekbar");
const playPause = document.querySelector(".play-pause");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

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
  if (!playState) {
    playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
  } else {
    playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
};

const updatePlayer = () => {
  music.src = musics[index].source;
  poster.src = musics[index].cover;
  musicName.innerText = musics[index].name;
  setCurrentTime(0, 10);
  music.addEventListener("loadeddata", () => {
    let musicDuration = convertInMin(music.duration);
    if (playState) {
      music.play();
    } else {
      music.pause();
    }
    duration.innerText = musicDuration;
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
      music.pause();
      playState = false;
    } else {
      music.play();
      playState = true;
    }
    updatePlayPauseState();
  } else if (num.includes(key.key)) {
    const percent = parseInt(key.key) * 10;
    music.currentTime = (music.duration * percent) / 100;
    setCurrentTime(music.currentTime, music.duration);
  }
});

playPause.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    playState = true;
  } else {
    music.pause();
    playState = false;
  }
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
