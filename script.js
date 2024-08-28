console.log('lets wrtite javascript');

let currentSong= new Audio();// global vairable
//let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    //http://127.0.0.1:3000
    let a = await fetch("/songs/");
    let response = await a.text();
    console.log(response);



    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause=false)=>{
    //let audio = new Audio("/songs/" + track);
    console.log(track);
    currentSong.src="/songs/" + track +".mp3";
    

    if(!pause){
        currentSong.play();
        play.src ="pause.svg";
    }
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"

}

async function main() {


    let songs = await getSongs();
    console.log(songs);
    playMusic(songs[0], true);
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        const updatedSong = song.replaceAll("%20"," ");
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="music.svg" alt="">
        <div class="info">
                    <div> ${updatedSong.substr(0,updatedSong.length-4)} </div>

        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div> 
        </li>`;
    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src ="pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

   // previous song
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

   //next song
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


    const cards = document.querySelectorAll(".cards");

    cards.forEach(card=>{
        card.addEventListener("click", () => {
            // playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            console.log(card.getAttribute("source"))
            playMusic(card.getAttribute("source"))
          
    })
})

}

main();

