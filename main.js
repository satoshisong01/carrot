const field = document.querySelector('.game_field');
const fieldRect = field.getBoundingClientRect(); // 사이즈 불러오기
const gamebtn = document.querySelector('.game_button');
const gametimer = document.querySelector('.game_timer');
const gamescore = document.querySelector('.game_score');
const popUp = document.querySelector('.pop-up');
const popupText = document.querySelector('.pop-up_message');
const popupRefresh = document.querySelector('.pop-up_replay');

const casound = new Audio('./carrot/sound/carrot_pull.mp3');
const alertsound = new Audio('./carrot/sound/alert.wav');
const bgsound = new Audio('./carrot/sound/bg.mp3');
const bugsound = new Audio('./carrot/sound/bug_pull.mp3');
const winsound = new Audio('./carrot/sound/game_win.mp3');

let start = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFiledclick);

gamebtn.addEventListener('click', () =>{
    if(start){
        stopgame();
    }else{
        startgame();
    }
})

popupRefresh.addEventListener('click', () =>{
    startgame();
    hidePopUp();
})

function stopgame(){
    start = false;
    stopgametimer();
    hidestartbtn();
    showpopuptext('Replay?');
    playSound(alertsound);
    stopSound(bgsound);
}

function startgame(){
    start = true;
    initGame();
    showstopbtn();
    showtimerandscore();
    startgametimer();
    playSound(bgsound);
}

function finishGame(win){
    start = false;
    hidestartbtn();
    if(win){
        playSound(winsound);
    }else{
        playSound(bugsound);
    }
    stopgametimer();
    stopSound(bgsound);
    showpopuptext(win? '이겨보렷옹' : '발려버렷어');
}

function showtimerandscore(){
    gametimer.style.visibility = 'visible';
    gamescore.style.visibility = 'visible';
    gamebtn.style.visibility = 'visible';
}

function showstopbtn(){
    const icon = gamebtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
}

function hidePopUp(){
    popUp.classList.add('pop-up-hide');
}

function hidestartbtn(){
    gamebtn.style.visibility = 'hidden';
}

function updateTimertext(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gametimer.innerHTML = `${minutes}:${seconds}`;
}

function startgametimer(){
    let remaintime = gametime_sec;
    updateTimertext(remaintime);
    timer = setInterval(() =>{
        if(remaintime <= 0) {
            clearInterval(timer);
            finishGame(imagecount === score);
            return;
        }
        updateTimertext(--remaintime);
    }, 1000)
}

function stopgametimer(){
    clearInterval(timer);
}

const carrotsize = 80;
const imagecount = 10;
const gametime_sec = 10;

function showpopuptext(text){
    popupText.innerHTML = text;
    popUp.classList.remove('pop-up-hide')
}

function initGame(){
    score = 0; 
    field.innerHTML= "";
    gamescore.innerHTML = imagecount;
    //벌레 당근 이미지 추가
    console.log(fieldRect);
    addItem('carrot', imagecount, 'carrot/img/carrot.png');
    addItem('bug', imagecount, 'carrot/img/bug.png');
}

function onFiledclick(event){
    if(!start){
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')){
        //찾았다 당근
        target.remove();
        score++;
        playSound(casound);
        updateScore();
        if(score === imagecount){
            finishGame(true);
        }
    }else if(target.matches('.bug')){
        //벌레 눌럿다리
        finishGame(false);
    }
}

function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound){
    sound.pause();
}

function updateScore(){
    gamescore.innerHTML = imagecount - score;
}

function addItem(className, count, imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - carrotsize;
    const y2 = fieldRect.height - carrotsize;

    for (let i = 0 ; i < count; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';

        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }

}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
}