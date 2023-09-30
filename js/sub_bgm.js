//sub는 경로 달라서 bgm 연결용으로 따로 js추가

// |￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣|
//     BGM Playlist 
// |＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿|
//    \ (•◡•) /
$(document).ready(function () {
     const audio = document.getElementById('bgm-audio');
     const playPauseButton = document.getElementById('play-pause-button');
     const currentTrack = document.getElementById('current-track');
     const remainingTime = document.getElementById('remaining-time');
     const progressBar = document.getElementById('progress-bar');
     const volumeSlider = document.getElementById('volume-slider');
     const tracks = ['Fireplace', 'Rain', 'Keyboard Typing']; // 확장자를 제외한 파일 이름만 저장
     let currentTrackIndex = 0;

     function updateTrackInfo() {
          // .n초 후에 곡명을 업데이트 (남은시간 NaN뜨는거 때문에 느리게 바꿈)
          setTimeout(() => {
               currentTrack.textContent = '' + tracks[currentTrackIndex];
          }, 180);
     }

     function playNextTrack() {
          currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
          updateTrackInfo(); // 곡명을 먼저 업데이트
          audio.src = '/bgm/' + tracks[currentTrackIndex] + '.mp3'; // 확장자 추가
          audio.load(); // 새로운 오디오 파일 로드
          audio.play();
     }

     function updateRemainingTime() {
          if (!isNaN(audio.duration)) { // duration이 NaN이 아닌 경우에만 실행
               const duration = audio.duration;
               const currentTime = audio.currentTime;
               const remaining = duration - currentTime;
               const minutes = Math.floor(remaining / 60);
               const seconds = Math.floor(remaining % 60);
               remainingTime.textContent = '' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

               // 업데이트 프로그래스 바
               progressBar.value = (currentTime / duration) * 100;

          }
     }

     function updateVolume() {
          audio.volume = volumeSlider.value / 100;
     }

     audio.addEventListener('ended', playNextTrack);
     audio.addEventListener('timeupdate', updateRemainingTime);

     // 오디오 파일이 로드되었을 때 트랙 정보 업데이트
     audio.addEventListener('canplay', function () {
          updateTrackInfo();
     });

     $('#play-pause-button').click(function () {
          if (audio.paused) {
               audio.play();
               playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
          } else {
               audio.pause();
               playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
          }
     });

     $('#prev-button').click(function () {
          currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
          updateTrackInfo(); // 곡명을 먼저 업데이트
          audio.src = '/bgm/' + tracks[currentTrackIndex] + '.mp3'; // 확장자 추가
          audio.load(); // 새로운 오디오 파일 로드
          audio.play();
     });

     $('#next-button').click(playNextTrack);

     // 프로그래스 바 클릭 이벤트 처리
     progressBar.addEventListener('click', function (e) {
          const progressBarRect = progressBar.getBoundingClientRect();
          const clickX = e.clientX - progressBarRect.left;
          const progressBarWidth = progressBarRect.width;
          const seekTime = (clickX / progressBarWidth) * audio.duration;
          audio.currentTime = seekTime;
     });

     // 볼륨 슬라이더 이벤트 처리
     // volumeSlider.addEventListener('input', updateVolume);
});
