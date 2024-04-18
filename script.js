// Assuming you are using a web browser environment
let songs;
// Fetch the JSON data from the file
// fetch('naats.json')
fetch('http://localhost:8000/items')
.then(response => response.json())
    .then(data => {
        // Convert the JSON data into the array structure
            songs = data.map(song => ({
            songName: song.itemName,
            filePath: song.itemLink,
            coverPath: 'covers/1.jpg',
            songDescription: song.itemDescription
        }));

        // Now, songsArray contains the data in the desired format
        console.log(songs);

        // Continue with the rest of the code that depends on 'songs'
        console.log("Welcome to Spotify");
        // Initialize the Variables
        let songIndex = 0;
        let audioElement = new Audio(songs[songIndex].filePath);
        let masterPlay = document.getElementById('masterPlay');
        let myProgressBar = document.getElementById('myProgressBar');
        // let gif = document.getElementById('gif');
        let masterSongName = document.getElementById('masterSongName');
        let playlistContainer = document.querySelector('.playlist');
        let timeStart = document.querySelector('.timeStart');
        let timeEnd = document.querySelector('.timeEnd');

        // Create and populate song items dynamically
        songs.forEach((song, index) => {
            let songItem = document.createElement('div');
            songItem.classList.add('lists', 'songItem');

            let image = document.createElement('img');
            image.src = song.coverPath;
            image.alt = 'Song Cover';

            let songName = document.createElement('p');
            songName.classList.add('songName');
            songName.innerHTML = `${song.songName} <br> ${song.songDescription} `;

            let playButton = document.createElement('i');
            playButton.classList.add('songItemPlay', 'fa-2x', 'fa', 'fa-play-circle');
            playButton.id = index.toString();

            songItem.appendChild(image);
            songItem.appendChild(songName);
            songItem.appendChild(playButton);

            playlistContainer.appendChild(songItem);

            masterSongName.innerText = songs[songIndex].songName;

            playButton.addEventListener('click', () => {
                makeAllPlays();
                if (audioElement.paused || audioElement.currentTime <= 0) {
                    songIndex = index;
                    playButton.classList.remove('fa-play-circle');
                    playButton.classList.add('fa-pause-circle');
                    masterPlay.classList.remove('fa-play-circle');
                    masterPlay.classList.add('fa-pause-circle');

                    audioElement.src = songs[songIndex].filePath;
                    masterSongName.innerText = songs[songIndex].songName;
                    audioElement.currentTime = 0;
                    audioElement.play();
                    // gif.style.opacity = 1;
                } else {
                    songIndex = index;
                    playButton.classList.remove('fa-pause-circle');
                    playButton.classList.add('fa-play-circle');
                    masterPlay.classList.remove('fa-pause-circle');
                    masterPlay.classList.add('fa-play-circle');

                    audioElement.src = songs[songIndex].filePath;
                    masterSongName.innerText = songs[songIndex].songName;
                    audioElement.currentTime = 0;
                    audioElement.pause();
                    // gif.style.opacity = 0;
                }
            });
        });

        // Handle play/pause click
        masterPlay.addEventListener('click', () => {
            if (audioElement.paused || audioElement.currentTime <= 0) {
                audioElement.play();
                masterPlay.classList.remove('fa-play-circle');
                masterPlay.classList.add('fa-pause-circle');
                // gif.style.opacity = 1;
            } else {
                audioElement.pause();
                masterPlay.classList.remove('fa-pause-circle');
                masterPlay.classList.add('fa-play-circle');
                // gif.style.opacity = 0;
            }
        });

        // Listen to Events
        audioElement.addEventListener('timeupdate', () => {
            const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
            myProgressBar.value = progress;

            // Update timeStart and timeEnd
            let currentTime = audioElement.currentTime;
            let duration = audioElement.duration;

            let currentMinutes = Math.floor(currentTime / 60);
            let currentSeconds = Math.floor(currentTime % 60);
            let formattedCurrentTime = padZero(currentMinutes) + ':' + padZero(currentSeconds);

            let durationMinutes = Math.floor(duration / 60);
            let durationSeconds = Math.floor(duration % 60);
            let formattedDuration = padZero(durationMinutes) + ':' + padZero(durationSeconds);

            timeStart.innerText = formattedCurrentTime;
            timeEnd.innerText = formattedDuration;
        });

        myProgressBar.addEventListener('change', () => {
            audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
        });

        const makeAllPlays = () => {
            Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
                element.classList.remove('fa-pause-circle');
                element.classList.add('fa-play-circle');
            });
        };

        document.getElementById('next').addEventListener('click', () => {
            songIndex = (songIndex + 1) % songs.length;
            audioElement.src = songs[songIndex].filePath;
            masterSongName.innerText = songs[songIndex].songName;
            audioElement.currentTime = 0;
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        });

        document.getElementById('previous').addEventListener('click', () => {
            songIndex = (songIndex - 1 + songs.length) % songs.length;
            audioElement.src = songs[songIndex].filePath;
            masterSongName.innerText = songs[songIndex].songName;
            audioElement.currentTime = 0;
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));

// Function to pad zero for single-digit minutes and seconds
function padZero(number) {
    return (number < 10 ? '0' : '') + number;
}
