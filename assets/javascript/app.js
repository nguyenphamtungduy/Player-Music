// var image = document.querySelector(".song__img");
// var image = document.querySelector(".cd__img");
// console.log(image);

// fetch("http://localhost:3000/songs")
//     .then(function (response) {
//         return response.json();
//         // JSON.parse -> Javascript type
//     })
//     .then(function (song) {
//         var img = song[1].image;
//         image.setAttribute("src", img);
//         // var htmls = users.map(function (user) {
//         //     return `<li><h2>${user.name}</h2>
//         //     <p>${user.email}</p></li>`;
//         // });

//         // var html = htmls.join("");
//         // console.log(html);

//         // document.querySelector(".list").innerHTML = html;
//         console.log(img);
//     })
//     .catch(function (err) {
//         console.log("Errors!");
//     });

const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);
var isPlaying = false;
var isRandom = false;
var isRepeat = false;
var currentIndex = 0;
var replayBtn = $(".btn-replay");
const randomBtn = $(".btn-random");
const PLAYER_STORAGE_KEY = "DUY";
var config = JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {};
function setConfig(key, value) {
    config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(config));
}

const bodyInner = $(".body__inner");

function render() {
    fetch("http://localhost:3000/songs")
        .then(function (response) {
            return response.json();
        })
        .then(function (songs) {
            const html = songs.map((song, index) => {
                return `
                <article class="song ${
                    index === currentIndex ? "active" : ""
                } " data-index = ${index}>
                    <figure class="song__img-wrap">
                        <img
                            class="song__img"
                            src="${song.image}"
                            alt=""
                        />
                    </figure>
                    <div class="song__info">
                        <h2 class="song__name">${song.name}</h2>
                        <p class="song__author">${song.singer}</p>
                    </div>
                    <div class="song__option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </article>
            `;
            });
            bodyInner.innerHTML = html.join("");
        });
}

function handleEvent() {
    body = $(".body");
    // xu ly phong to thu nho cd
    const cd = $(".media__cd");
    const cdWidth = cd.offsetWidth;
    const oldHeight = body.offsetHeight;
    console.log(oldHeight);
    bodyInner.onscroll = function () {
        // const scrollTop = document.documentElement.scrollTop || window.scrollY;
        const scrollTop = bodyInner.scrollTop || window.scrollY;
        const newCDWidth = cdWidth - scrollTop;
        cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0;
        cd.style.opacity = newCDWidth / cdWidth;
        const newMargin = newCDWidth > 0 ? 402 - scrollTop + "px" : 250 + "px";
        body.style.marginTop = newMargin;
        const newHeight =
            newCDWidth > 0 ? oldHeight + scrollTop + "px" : 350 + "px";
        console.log(newHeight);
        body.style.height = newHeight;
        // body.style.height = newHeight < 317 ? newHeight + "px" : 317 + "px";
    };

    // xu ly cd quay va dung
    const cdAmimate = cd.animate([{ transform: "rotate(360deg)" }], {
        duration: 10000,
        iterations: Infinity,
    });
    cdAmimate.pause();

    //xu ly khi click play
    const btnPlay = $(".btn-play");
    btnPlay.onclick = function () {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };
    // Khi song duoc play
    audio.onplay = function () {
        isPlaying = true;
        btnPlay.classList.add("playing");
        cdAmimate.play();
        console.log(currentIndex);
        setConfig("currentIndex", currentIndex);
    };
    // Khi song duoc pause
    audio.onpause = function () {
        isPlaying = false;
        btnPlay.classList.remove("playing");
        cdAmimate.pause();
    };
    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
        if (audio.duration >= 0) {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            const progress = (currentTime / duration) * 100;
            // console.log(progress);
            $(".range").value = progress;
        }
    };

    // Xu ly khi tua song
    $(".range").onchange = function (e) {
        const seekTime = (e.target.value / 100) * audio.duration;
        // console.log(seekTime);
        audio.currentTime = seekTime;
    };

    // next song
    const nextBtn = $(".btn-next");
    nextBtn.onclick = function () {
        if (isRandom) {
            randomSong();
        } else {
            nextSong();
        }
        setTimeout(function () {
            // console.log(audio);
            audio.play();
        }, 1000);
        render();
        scrollToSong();
    };
    // prev song
    const prevBtn = $(".btn-prev");
    prevBtn.onclick = function () {
        if (isRandom) {
            randomSong();
        } else {
            prevSong();
        }
        setTimeout(function () {
            // console.log(audio);
            audio.play();
        }, 1000);
        render();
        scrollToSong();

        // console.log(audio);
        // console.log(audio.currentTime);
    };

    //Random /xu ly bat tat random song

    randomBtn.onclick = function () {
        // if (!isRandom) {
        //     randomBtn.classList.add("active");
        //     isRandom = true;
        // } else {
        //     randomBtn.classList.remove("active");
        //     isRandom = false;
        // }
        isRandom = !isRandom;
        randomBtn.classList.toggle("active", isRandom);
        setConfig("isRandom", isRandom);
    };

    //xu ly song khi audio ended
    audio.onended = function () {
        if (isRepeat) {
            setTimeout(function () {
                // console.log(audio);
                audio.play();
            }, 1000);
        } else {
            // nextSong();
            nextBtn.click();
        }
    };

    //replay song

    replayBtn.onclick = function () {
        isRepeat = !isRepeat;
        replayBtn.classList.toggle("active", isRepeat);
        setConfig("isRepeat", isRepeat);
    };

    //lang nghe hanh vi click vao playlist
    bodyInner.onclick = function (e) {
        // console.log(e.target.closest(".song")); //.closest(".song") nó đưa ra element nếu click đúng vào nó
        // if (e.target.closest(".song:not(.active)")) {
        //     if (!e.target.closest(".song__option")) {
        //         console.log(e.target);
        //     } else {
        //         console.log("option");
        //     }
        // } else {
        //     if (e.target.closest(".song__option")) {
        //         console.log("option");
        //     }
        // }
        const noteSong = e.target.closest(".song:not(.active)");
        //  xử lý click vào bài hát play hoặc pause
        if (!noteSong) {
            btnPlay.click();
        }
        if (
            e.target.closest(".song:not(.active)") ||
            e.target.closest(".song__option")
        ) {
            // xu ly khi click vao song
            if (noteSong && !e.target.closest(".song__option")) {
                // console.log(noteSong.getAttribute("data-index"));
                currentIndex = Number(noteSong.getAttribute("data-index"));
                loadCurrentSong(currentIndex);
                // console.log(Index);
                setTimeout(function () {
                    // console.log(audio);
                    audio.play();
                }, 1000);
                render();
            }
            if (e.target.closest(".song__option")) {
                audio.pause();
                alert("Lyrics!");
            }
        }
    };
}

// function defineProperties(index) {
//     fetch("http://localhost:3000/songs")
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (songs) {
//             const currentSong = songs[index];
//             // console.log(currentSong);
//             return currentSong;
//         });
// }

function loadCurrentSong(currentIndex) {
    const heading = $(".media-song__name");
    // console.log(heading);
    const cd = $(".cd");
    const audio = $("#audio");
    fetch("http://localhost:3000/songs")
        .then(function (response) {
            return response.json();
        })
        .then(function (song) {
            heading.textContent = song[currentIndex].name;
            cd.style.backgroundImage = `url(${song[currentIndex].image})`;
            audio.src = song[currentIndex].path;
            // console.log(audio);
        });
}

function nextSong() {
    fetch("http://localhost:3000/songs")
        .then(function (response) {
            return response.json();
        })
        .then(function (song) {
            ++currentIndex;
            if (currentIndex > song.length - 1) {
                currentIndex = 0;
            }
            loadCurrentSong(currentIndex);
            // console.log(Index);
            // console.log(song[Index]);
        });
}

function prevSong() {
    fetch("http://localhost:3000/songs")
        .then(function (response) {
            return response.json();
        })
        .then(function (song) {
            --currentIndex;
            if (currentIndex < 0) {
                currentIndex = song.length - 1;
            }
            loadCurrentSong(currentIndex);
            // console.log(Index);
            // console.log(song[Index]);
        });
}

function randomSong() {
    fetch("http://localhost:3000/songs")
        .then(function (response) {
            return response.json();
        })
        .then(function (song) {
            do {
                newIndex = Math.floor(Math.random() * song.length);
            } while (newIndex == currentIndex);
            currentIndex = newIndex;
            loadCurrentSong(currentIndex);
            // console.log(Index);
            // console.log(song[Index]);
        });
}

function scrollToSong() {
    setTimeout(function () {
        $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, 1000);
}

// const replayBtn = $();

function loadConfig() {
    isRandom = config.isRandom;
    isRepeat = config.isRepeat;
    currentIndex = config.currentIndex;
    loadCurrentSong(currentIndex);
    replayBtn.classList.toggle("active", isRepeat);
    randomBtn.classList.toggle("active", isRandom);
}

function start() {
    loadConfig();
    render();
    handleEvent();
}

start();
