import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
    getDatabase,
    set,
    ref,
    get,
    child,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";



const firebaseConfig = {
    apiKey: "AIzaSyDJuMkrDrPtZkSCoOdk51ZNp0HL_Axt6kE",
    authDomain: "bhavani-58e29.firebaseapp.com",
    databaseURL: "https://bhavani-58e29-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bhavani-58e29",
    storageBucket: "bhavani-58e29.appspot.com",
    messagingSenderId: "512918257819",
    appId: "1:512918257819:web:1fce86b681b3843c9f063e"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbRef = ref(getDatabase());
const db = getDatabase()
let userData = null

onAuthStateChanged(auth, (user) => {
    if (user) {
        userData = user
        console.log(user)
        document.getElementById("signin").style.display = "none"
        document.getElementById("signup").style.display = "none"
        document.getElementById("logout").addEventListener("click", () => {
            console.log("signout")
            auth.signOut().then(() => {
                window.location.reload();
            });
        })
                get(child(dbRef, "users/"  + userData.uid + "/recordings/"))
                .then((snapshot) => { 
                    if (snapshot.exists()) {
                        recordings=snapshot.val();
                        console.log(recordings)
                      } else {
                        console.log("No data available");
                      }
                      let list = document.getElementById("recordingsList");
                      console.log(list);
                      Object.keys(recordings).forEach((item) => {
                        let li = document.createElement("li");
                        li.innerText = item;
                        li.id = item;
                        li.addEventListener("click", () => {
                          playSong(recordings[item]);
                        });
                        list.appendChild(li);
                      });
                })
    } else {
        document.getElementById('logout').style.display = "none";
        document.getElementById('record').style.display = "none";
        document.getElementById('play').style.display = "none";
        document.getElementById('save').style.display = "none";
    }
});

const recordButton = document.querySelector('.record');
const saveButton = document.querySelector('.save');
const playButton = document.querySelector('.play');
const keys = document.querySelectorAll('.key');
const regulars = document.querySelectorAll('.key.white');
const sharps = document.querySelectorAll('.key.black');

 
let recordingStartTime;
let songNotes=[];
let recordings;

const keyMap = [...keys].reduce((map, key) => {
    map[key.dataset.note] = key
    return map
}, {})

keys.forEach((key) => {
    key.addEventListener('click', () => playNote(key));
});
function backgroundColor() {
    document.getElementById('record').style.backgroundColor = ' #008CBA';
};
function originalColor()
{
    document.getElementById('record').style.backgroundColor = 'white';
}

const dbref = ref(db);

// function getData(){
//     get(child(dbRef, "users"))
//     .then((snapshot) => {
//         recordings= snapshot.val().recordings;
//         console.log(recordings);
//         // snapshot.forEach(childsnapshot => {
//         //     recordings.push(childsnapshot.val());
//     })
// }

function playNote(key) {
    if (isRecording()) recordNote(key.dataset.note)
    const noteSound = document.getElementById(key.dataset.note);
    console.log(noteSound);
    noteSound.currentTime = 0;
    noteSound.play();
    key.classList.add('active');
    setTimeout(() => { key.classList.remove('active'); }, 350)
};

if (recordButton) {
    recordButton.addEventListener('click', toggleRecording)
}
if (saveButton) {
    saveButton.addEventListener('click', saveSong)
}
playButton.addEventListener('click', playSong)


const whites = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];
const blacks = ['!', '@', '$', '%', '^', '*', '(', 'Q', 'W', 'E', 'T', 'Y', 'I', 'O', 'P', 'S', 'D', 'G', 'H', 'J', 'L', 'Z', 'C', 'V', 'B'];

document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key;
    const whiteKeyIndex = whites.indexOf(key);
    const blackKeyIndex = blacks.indexOf(key);

    if (whiteKeyIndex > -1) playNote(regulars[whiteKeyIndex]);
    if (blackKeyIndex > -1) playNote(sharps[blackKeyIndex]);
});

function toggleRecording() {
    recordButton.classList.toggle('active')
    if (isRecording()) {
        backgroundColor();
        startRecording()
    } else {
        stopRecording()
        originalColor();
    }
}

function isRecording() {
    return recordButton != null && recordButton.classList.contains('active')
}

function startRecording() {
    recordingStartTime = Date.now()
    songNotes = []
    playButton.classList.remove('show')
    saveButton.classList.remove('show')
}

function stopRecording() {
    playButton.classList.add('show')
    saveButton.classList.add('show')
    
}

function playSong() {
    if (songNotes.length === 0) return
    songNotes.forEach(note => {
        setTimeout(() => {
            playNote(keyMap[note.key])
        }, note.startTime)
    })
}



function recordNote(note) {
    songNotes.push({
        key: note,
        startTime: Date.now() - recordingStartTime
    })
}

function saveSong() {
    console.log("save song is clicked");
     let title=window.prompt("please enter title for your recording");
    console.log(userData);
    if (userData)
    {
     console.log("user data exists and saved song")
     set(child(dbRef, "users/" + userData.uid + "/recordings/" + title), songNotes)
    }
    let listItem = document.createElement("li");
    listItem.innerText = title;
    listItem.id = title;
    listItem.addEventListener("click", () => {
      playSong(recordings[title]);
    });
    document.getElementById("recordingsList").appendChild(listItem);
}

let recordingsList= document.querySelector("recordingsList");


var seconds = 0;
var tens = 0;
var OutputSeconds = document.getElementById("second");
var OutputTens = document.getElementById("tens");
var buttonStart = document.getElementById("btn-start");
var buttonStop = document.getElementById("btn-stop");
var buttonReset = document.getElementById("btn-reset");
var Interval;

buttonStart.addEventListener('click', () => {
    clearInterval(Interval);
    Interval = setInterval(startTimer, 1000);
});

buttonStop.addEventListener('click', () => {
    clearInterval(Interval);
});

buttonReset.addEventListener('click', () => {
    clearInterval(Interval);
    tens = "00";
    seconds = "00";
    OutputSeconds.innerHTML = seconds;
    OutputTens.innerHTML = tens;
});

function startTimer() {
    tens++;
    if (tens <= 9) {
        OutputTens.innerHTML = "0" + tens;
    }

    if (tens > 9) {
        OutputTens.innerHTML = tens;
    }

    if (tens > 59) {
        seconds++;
        OutputSeconds.innerHTML = "0" + seconds;
        tens = 0;
        OutputTens.innerHTML = "0" + 0;
    }

    if (seconds > 9) {
        OutputSeconds.innerHTML = seconds;
    }
}