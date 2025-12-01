let w;
let h;
//      GAME STATES
let atMainMenu = true;
let isPaused = false;
let isOver = false;
let frame = 0;


//      OPTIONS 
let inOptions = false;
let displayIX = 1;
let deafModeIX = 0;

//      STATS
let health;

//      CONTROLS
let controlList =[ [81, 87, 69, 82, 85, 73, 79, 80],    //qwe iop
                   [65, 83, 68, 70, 72, 74, 75, 76] ];  //asd jkl
let controlState = 0; //Depending on what number this is, this will control what keys, coming from controlList, are displayed. Solely used to determine which index of controls is used from %controlList%.

//      NOTES
let notes = []; //Array will hold Note classes equal to two times %notesNum%
let notesNum = 2; //This variable controls how many notes are on one side at a time
let noteGap = 75;
let noteTimer = 60;

//      DEADZONE VARIABLES
let dzSize = 70; //Initial deadzone size

//      PROJECTILE VARIABLES

//Projectiles will be a nested array. The arrays inside will be the projectile itself organized by [x, y, velocity, note[index]].

//projectiles[?][0-1] will be position
//projectiles[?][2] will be a randomized float between 2 numbers that mulitply projSpeed to have some randomized speed.
//projectiles[?][3] will be the index of whatever note is being targeted
//projectiles[?][4] will be the direction it goes. positive is right, negative is left. (-1 or 1);
let projectiles = [];
let projectileTint = [ [120, 200, 255], [255, 222, 0], [141, 255, 111], [0, 0, 255], [255, 0, 255], [111, 0, 255] ];

//projTargets will be an array that will hold either hold a true or false value for each initialized note. This'll be used so there arent multiple projectiles targetting the same note at the same time.
let projTargets = [];
let projSize = 35;
let projSpeed = 1;

// - Music Variables - // -----------------------------------------------------------------------------------

  let musicState = 1; // holds music states | 1 = playable , 2 = pause, 3 = stop

  // background music
    let bgMusicPlaying; //checks if Gameplay Background Music is Playing
    let bgMusicGame;  // holds Gameplay Background Music

  // note sounds
    let volMax = 1; // maximum volume of all notes
    let volMin = 0; // minimum volume of all notes
    let delayAmmount = 30; // length of time a note will hold its volume
    let volAmpRate = 0.1;
    let volDecRate = 0.05;

    let noteInstrument = []; // holds instrument sounds

  // volume values for each note
    let n1Vol = 0.7;
    let n2Vol = 0.7;
    let n3Vol = 0.7;
    let n4Vol = 0.7;

  // cooldowns for each note
    let n1Cool;
    let n2Cool;
    let n3Cool;
    let n4Cool;

  // sound fx

  let failLaugh;
  let hurtLaugh;

// - - Music Variables End - // -----------------------------------------------------------------------------------

// - - Visual Asset Variables - // --------------------------------------------------------------------------------

  // Big-Bad related variables

    let bbIdle = [];
    let bbAttackInt = [];
    let bbAttackSus = [];
    let bbAttackOut = [];

    let bbAttackFrame = 0;
    let bbIdleFrame = 0;
    let bbSustaining = false;

    let hpRef;
    let damaged = false;
    let bbAttackTrigger = false;

  // Backdrop Visual Assets

    let hellScape;

    let magma = [];
    let magmaScale;
    let magmaOpacity = 0;
    let dzActive = false;

  // Gameplay Visual Assets

    let hpFrame; // frame for the hp bar

    let noteSprite = [];

    let projType1 = [];
    let projType2 = [];
    let projType3 = [];
    let projType4 = [];

    let projAlert = [];

    let projFrame = 0;

    let progFrames = 0;
    let progPercent = 0;

  // Menu Visual Assets
  
    let mainMenuBG;
    let optionsImg;
    let deafModeImg;
    let displayImg;
    let gameOverImg = [];

  // Fonts

    let font_CM;


// - - Visual Asset Variables End - // --------------------------------------------------------------------------------

function preload() {
  soundFormats('mp3');
//music
  bgMusicGame = loadSound('assets/music/sound_music-base.mp3');
  for (let j = 0; j < 4; j++) {
    noteInstrument[j] = loadSound('assets/music/sound_music-note-' + j + '.mp3')
  }
//visuals

  // Big Bad Sprites
  for(let j = 0; j < 16; j++) {
    bbIdle[j] = loadImage('assets/art/bigBad_sprites/bb_idle/bb_idle-' + j + '.png'); // Big Bad Idling
    bbAttackInt[j] = loadImage('assets/art/bigBad_sprites/bb_attackInt/bb_attackInt-' + j + '.png'); // Big Bad Attack Start
    bbAttackSus[j] = loadImage('assets/art/bigBad_sprites/bb_attackSus/bb_attackSus-' + j + '.png'); // Big Bad Attack Sustain
    bbAttackOut[j] = loadImage('assets/art/bigBad_sprites/bb_attackOut/bb_attackOut-' + j + '.png'); // Big Bad Attack Stop
  }

  // Backdrop sprites
  hellScape = loadImage('assets/art/environmental_sprites/bg_hellscape.png') // hellscape
  for(let j = 0; j<2; j++){
    magma[j] = loadImage('assets/art/environmental_sprites/bg_magma-' + j + '.png') // deadzones
  }

  // Gameplay sprites
  hpFrame = loadImage('assets/art/hp_frame.png') // HP Bar Frame

  for(let j = 0; j< 6; j++){
    noteSprite[j] = loadImage('assets/art/note_sprites/note-' + j + '.png') // sprites for the Notes
  }
    for(let j = 0; j < 16; j++) {
    projType1[j] = loadImage('assets/art/projectile_sprites/note01/note01-' + j + '.png')
    projType2[j] = loadImage('assets/art/projectile_sprites/note02/note02-' + j + '.png')
    projType3[j] = loadImage('assets/art/projectile_sprites/note03/note03-' + j + '.png')
    projType4[j] = loadImage('assets/art/projectile_sprites/note04/note04-' + j + '.png')

    //projectile alert sprites
    projAlert[j] = loadImage('assets/art/alert_sprites/alert-' + j + '.png')

  }
  
// fonts
  font_CM = loadFont('assets/fonts/ChelseaMarket-Regular.ttf');

  // MENU BACKGROUND

    mainMenuBG = loadImage('assets/art/menus/main_menu/menu.png');
    optionsImg = loadImage('assets/art/menus/options/optionsMenu.png');
    deafModeImg = [loadImage('assets/art/menus/options/deaf_mode_off.png'), loadImage('assets/art/menus/options/deaf_mode_on.png')];
    displayImg = [loadImage('assets/art/menus/options/display_off.png'), loadImage('assets/art/menus/options/display_on.png')];
    for (let j = 1; j < 8; j++)
    {
      append(gameOverImg, loadImage('assets/art/menus/game_over/000' + j + '.png'));
    }

}

function setup() {
   
  let canvas = createCanvas(windowWidth*0.81, windowWidth*0.54);
  canvas.parent("holder-canvas");

  textAlign(CENTER);
  imageMode(CENTER);
  angleMode(DEGREES); 

  w = width; // adapts w variable to match canvas width
  h = height; // adapts h variable to match canvas height
  
  health = new Health();

  hpRef = health.hp; // stores initial player health
}

function draw() {

  if (!isPaused) { adjustCanvas(); } // rescales canvas according to host window;
  adjustCanvas(); // rescales canvas according to host window;
  w = width; // adapts w variable to match canvas width
  h = height; // adapts h variable to match canvas height

  if (atMainMenu) // Main Menu -----------------------------
  {
    push();
    gameMainMenu();

    progFrames = 0;
    dzActive = false;
    magmaOpacity = 0;
    musicState = 1;
    pop(); 
  } else if (isOver) // Game Over -----------------------------
  {
    push();
    gameOver();
    pop(); 
    //music stuff
    push();
      musicState = 3;
      musicPlayer();
    pop();
  } else if (isPaused) // Game Paused -----------------------------
  {
    push();  
    gamePaused();
    pop(); 
  } else              // Main Game -----------------------------
  {
    push();
    frame++;

    //background visual
    background(220);
    backdrop();
    bigBad(w*0.5,h*0.45,h*1.2);

    // midground visual + gameplay
    gamePlay();

    image(hpFrame,w*0.5,h*0.93, w*0.5,w*0.5);
    levelProgress();
    //visual stuff -----


    //music stuff -----
    musicState = 1;
    notePlayer();

    pop(); 
    push();
  
  rectMode(CENTER);
  health.display();
  
  pop();
  }
}

function mousePressed()
{
  if (atMainMenu && inOptions)
  {
    let x = mouseX / w;
    let y = mouseY / h;

    let diffLeftBounds = [1.525 / 2, 0.65 / 2, 1.6475  /2, 0.7775 / 2];
    let diffRightBounds = [1.773 / 2, 0.6475 / 2, 1.862 / 2, 0.7775 / 2];

    let deafOnBounds = [1.513 / 2, 1.05 / 2, 1.683 / 2, 1.1825 / 2];
    let deafOffBounds = [1.683 / 2, 1.1825 / 2, 1.850 / 2, 1.05 / 2];
    let displayOnBounds = [1.512 / 2, 1.5 / 2, 1.680 / 2, 1.6325 / 2];
    let displayOffBounds = [1.680 / 2, 1.6325 / 2, 1.847 / 2, 1.4975 / 2];

    if (x > diffLeftBounds[0] && y > diffLeftBounds[1] && x < diffLeftBounds[2] && y < diffLeftBounds[3]) //Difficulty Slide Left
    {
      notesNum--;
      if (notesNum == 0)
      {
        notesNum = 1;
      }
    }
    if (x > diffRightBounds[0] && y > diffRightBounds[1] && x < diffRightBounds[2] && y < diffRightBounds[3]) //Difficulty Slide Right
    {
      notesNum++;
      if (notesNum == 4)
      {
        notesNum = 3;
      }

    }

    if (x > deafOnBounds[0] && y > deafOnBounds[1] && x < deafOnBounds[2] && y < deafOnBounds[3]) //Deaf Mode Toggle On
    {
      deafModeIX = 1;
    }
    if (x > deafOffBounds[0] && y < deafOffBounds[1] && x < deafOffBounds[2] && y > deafOffBounds[3]) //Deaf Mode Toggle Off
    {
      deafModeIX = 0;

    }

    if (x > displayOnBounds[0] && y > displayOnBounds[1] && x < displayOnBounds[2] && y < displayOnBounds[3]) //Display Toggle On
    {
      displayIX = 1;
    }
    if (x > displayOffBounds[0] && y < displayOffBounds[1] && x < displayOffBounds[2] && y > displayOffBounds[3] ) //Display Toggle Off
    {
      displayIX = 0;
    }
  }
}
function keyPressed() {
  let controls = controlList[controlState];
  let input = key.toLowerCase();
  switch (input)
  {
    case "enter": //If %key% is equal to " ", then run the code below and change %controlState%
      if (controlState == 1)
      {
        controlState--;
      } else
      {
        controlState++;
      }
      break;
    case "escape":
      if (!atMainMenu)
      {
        isPaused = !isPaused;
        musicState = 2;
        musicPlayer();
      } else
      {
        inOptions = !inOptions;
      }
      break;
    case " ":
      if (frameCount < 60) { break; } //Prevents assets not being loaded yet from causing issues
      if (atMainMenu && !inOptions) { gameStart(); } else 
      if (isOver) { atMainMenu = true; }
      break;

  }

  // sound related stuff  ---------------------------------------------------------------------------------------

  if(keyCode === 32){
    if(musicState === 1 && !bgMusicPlaying && !atMainMenu){  //plays music on game start
      musicPlayer();
      bgMusicPlaying = true;
    } else if(isOver){
      musicState = 1;
    }
  }
  if(keyCode === 27 && !isPaused && !atMainMenu){ // plays music on unpause
    musicState = 1;
    musicPlayer();
  }


  if (key == " ") { return false; } //prevents space from scrolling the page
  // end sound related stuff ---------------------------------------------------------------------------------------
}

// Visual Functions --------------------------------------------------------------------------

function backdrop() {

  magmaScale = map(dzSize, 70, 150, h*0.2, h*0.4); // moves Magma sprites according to deadzone size

  push()
  image(hellScape,w*0.5,h*0.5,w*1,h*1); // contains hellscape image backdrop

    push()
      image(magma[0],w*0.5,magmaScale,w*1,h*1);
        tint(255,magmaOpacity);
        image(magma[1],w*0.5,magmaScale,w*1,h*1);
    pop()

    push()
      scale(-1,-1);
      image(magma[0],-w*0.5,-(magmaScale*4),w*1,h*1);
        tint(255,magmaOpacity);
        image(magma[1],-w*0.5,-(magmaScale*4),w*1,h*1);
    pop()

  pop()
}

function projectileAnimation() { // calculates which frame the "projectile sprite" is supposed to display

  if(frameCount % 2 === 0) {
    projFrame += 1;
  }

  if(projFrame > ((projType1.length)-1)){
    projFrame = 0;
  }
}

function bigBad(bbX,bbY,bbS) {

  // bbX - sets X position of Big Bad sprites
  // bbY - sets Y position of Big Bad sprites
  // bbS - sets Scale of Big Bad sprites

// Checks if player is taking damage
  if((hpRef - health.hp) > 0){
    damaged = true;
  } else {
    damaged = false;
  }
  hpRef = health.hp;

// if they are, trigger attack animation
  if(damaged){
    bbAttackTrigger = true;
  }

  if(bbAttackTrigger){ // check if Attack animation triggered

    // reset Idle Animation Frames
    bbIdleFrame = 0;

    // begin counting Attack animation frames at 30 fps
    if(frameCount % 2 === 0) {
      bbAttackFrame += 1;
    }  

    // if Attack animation triggered, play Attack Animation Intro
    if(bbAttackFrame < 16){

      image(bbAttackInt[bbAttackFrame],bbX,bbY,bbS,bbS); // Attack Animation Intro

    // if Attack Animation Intro played, play Sustained Attack Animation
    } else if(bbAttackFrame >= 16){

      if((bbAttackFrame-16) >= ((bbAttackSus.length)-1)){ // check if Sustained Attack Animation finished
        if(damaged){ // if still taking damage, loop animation
          bbAttackFrame = 16;
        } else {     // if not taking damage, begin Idle Animation
          bbAttackTrigger = false;
        }
      }

      image(bbAttackSus[bbAttackFrame-16],bbX,bbY,bbS,bbS); // Sustained Attack Animation

      bbSustaining = true // remember that Sustained Attack Animation has played

    }
  } else if(!bbAttackTrigger){

    // reset Attack animation frames
    bbAttackFrame = 0;

    // begin counting Idle Animation Frames at 30 fps
    if(frameCount % 2 === 0) {
      bbIdleFrame += 1;
    }  


    if(bbIdleFrame < 16 && bbSustaining){ // if Sustained Attack Animation previously played and Idle Animation has not played, play Attack Animation Outro

      image(bbAttackOut[bbIdleFrame],bbX,bbY,bbS,bbS); // Attack Animation Outro

      if(bbIdleFrame >= ((bbAttackOut.length)-1)){ // check if Attack Animation Outro has finished playing
        bbSustaining = false; // remember that Big Bad isn't sustaining Attack
      }

    }else{

      if(bbIdleFrame >= ((bbIdle.length)-1)){ // if Idle Animation has finished playing, loop Idle Animation
        bbIdleFrame = 0;
      }

      image(bbIdle[bbIdleFrame],bbX,bbY,bbS,bbS); // Idle Animation
    }
  }

}

function levelProgress() {

  progFrames += 1;

  progPercent = int(map(progFrames, 0, 20606, 0, 100));

  push()
  textFont(font_CM);
  textStyle(BOLD);

  textSize(w*0.04);

  fill(160,104,240);
  stroke(30,0,40);
  strokeWeight(5);

  if (displayIX == 1) { text(progPercent + '%',w*0.5,h*0.1); }
  
  pop()
}

// Music Functions --------------------------------------------------------------------------

function notePlayer() { // controls volume of instruments played by notes

// attaches each instrument to the volume of each Note
  noteInstrument[0].setVolume(n1Vol,0.15);
  noteInstrument[1].setVolume(n2Vol,0.15);
  noteInstrument[2].setVolume(n3Vol,0.15);
  noteInstrument[3].setVolume(n4Vol,0.15);

// controlls volume of Q key
  if(keyIsDown(81) === true){
    n1Cool = frameCount;
    n1Vol = lerp(n1Vol,volMax,volAmpRate);
  } else {
    if((frameCount - n1Cool) > delayAmmount){
      if(n1Vol > volMin + 0.05){
        n1Vol = n1Vol - volMax*0.05;
      } else {
        n1Vol = 0;
      }
    }
  }
// controlls volume of W key
  if(keyIsDown(87) === true){
    n2Cool = frameCount;
    n2Vol = lerp(n2Vol,volMax,volAmpRate);
  } else {
    if((frameCount - n2Cool) > delayAmmount){
      if(n2Vol > volMin + 0.05){
        n2Vol = n2Vol - volMax*0.05;
      } else {
        n2Vol = 0;
      }
    }
  }
// controlls volume of O key
  if(keyIsDown(79) === true){
    n3Cool = frameCount;
    n3Vol = lerp(n3Vol,volMax,volAmpRate);
  } else {
    if((frameCount - n3Cool) > delayAmmount){
      if(n3Vol > volMin + 0.05){
        n3Vol = n3Vol - volMax*0.05;
      } else {
        n3Vol = 0;
      }
    }
  }
// controlls volume of P key
  if(keyIsDown(80) === true){
    n4Cool = frameCount;
    n4Vol = lerp(n4Vol,volMax,volAmpRate);
  } else {
    if((frameCount - n4Cool) > delayAmmount){
      if(n4Vol > volMin + 0.05){
        n4Vol = n4Vol - volMax*0.05;
      } else {
        n4Vol = 0;
      }
    }
  }
}

function musicPlayer() { // plays|pauses|stops music based on game state

  if(musicState === 1){ // allows gameplay music to play
    bgMusicGame.play();
    for (let j = 0; j < 4; j++) {
      noteInstrument[j].play();
    }
  } else if(musicState === 2){  //pauses gameplay music
    bgMusicPlaying = false;
    bgMusicGame.pause();
    for (let j = 0; j < 4; j++) {
      noteInstrument[j].pause();
    }
  } else if(musicState === 3){  //stops gameplay music
    bgMusicPlaying = false;
    bgMusicGame.stop();
    for (let j = 0; j < 4; j++) {
      noteInstrument[j].stop();
    }
  }
}

// Game Mechanics Functions --------------------------------------------------------------------------

function gamePlay()
{
  //Called in draw
  
  //line(width/2 - noteGap, 0, width/2 - noteGap, height);
  //line(width/2 + noteGap, 0, width/2 + noteGap, height);
  
  moveNotes();

  projectileAnimation(); // calculates which frame the "projectile sprite" is supposed to display
  
  //drawDeadZone();
  
  noteTimer--;
  if (noteTimer == 0)
  {
    projectileCreate();
    noteTimer = int(random(0, 240)); //half a second to five seconds
  }
  projectileMove();
  
  drawNotes();
}

function gamePaused()
{
  //Called in draw
  push();

  textSize(100 * scaleToCanvas(true));
  text("PAUSED", w/2, 100 * scaleToCanvas(true));
  
  pop();
}

function gameOver()
{
  //Called in draw
  frame++;
  translate(w/2, h/2);
  scale(0.5);
  scale(scaleToCanvas());
  image(hellScape, 0, 0);
  image(gameOverImg[int(frame / 16) % gameOverImg.length], 0, 0);
  
}

function gameMainMenu()
{ 
  //Called in draw
  push();
  translate(w/2, h/2);
  scale(0.5);
  scale(scaleToCanvas());
  image(mainMenuBG, 0, 0);
  
  if (inOptions)
  {
    image(optionsImg, 0, 0);
    image(deafModeImg[deafModeIX], 0, 0);
    image(displayImg[displayIX], 0, 0);

    let txt;
    switch (notesNum)
    {
      case 1:
        txt = "EASY";
        break;
      case 2:
        txt = "MED.";
        break;
      case 3:
        txt = "HARD";
        break;
    }
    pop();
    push()
    scale(scaleToCanvas());
    textSize(15); fill('#000');
    text(txt, 507, 148);
    pop();
  } else
  {
    pop();
  }
  let canvasScale = scaleToCanvas(true);
  textSize(20 * canvasScale); fill('#fff');
  text("START GAME", w/4, h - (30 * canvasScale));
  text("OPTIONS", w/2, h - (30 * canvasScale));
  textSize(14 * canvasScale);
  text("[SPACE]", w/4, h - (15 * canvasScale));
  text("[ESC]", w/2, h - (15 * canvasScale) );
}

function gameStart()
{
  //Called in projectileMove
  atMainMenu = false;
  isPaused = false;
  isOver = false;
  inOptions = false;

  difficultDmgMod = map(notesNum, 1, 3, 1, 1.5);
  projSpeed = map(notesNum, 1, 3, 2, 1);

  health.hp = 100;
  health.prevHp = 100;
  
  notes = [];
  projTargets = [];
  projectiles = [];
  
  //Set of for loops makes new instances of the Note class, which is stored inside of the notes variable
  for (let i = 0; i < notesNum; i++)
  {
    let x = map(i, 
                0, notesNum - 1, 
                noteGap, w / 2 - (noteGap * 2));
    if (notesNum == 1 ) { x = w / 4 - w / 16; } //Fix for when notesNum is 1.
    append(notes, new Note(x / w));
    append(projTargets, 0);
  }
  
  for (let i = notesNum - 1; i > -1; i--)
  {
    let x = map(i, 
                0, notesNum - 1, 
                noteGap, w / 2 - (noteGap * 2));
    if (notesNum == 1 ) { x = w / 4 - w / 16; } //Fix for when notesNum is 1.

    append(notes, new Note((w - x) / w));
    append(projTargets, 0);
  }
}

function drawNotes()
{
  //Called in gamePlay();
  for (let i = 0; i < notes.length; i++)
  {
    //Uses the display method of the notes Class to draw the note at the n-th position. The argument provides that method to display the actual key that controls said noteqw
    let keyDisplay = getKeyAtIndex(i)
    
    notes[i].display(i);
  }
  
}

function drawDeadZone()
{
  //Called in gamePlay
  push();
  noStroke(); fill("#aa000055")
  rect(0, 0, width, dzSize);
  rect(0, height, width, -dzSize);
  
  pop();
}

function moveNotes()
{
  //Called in gamePlay
  let controls = controlList[controlState];
  
  for (let i = 0; i < notes.length; i++)
  {
    //If the user is holding down the key that represents the keyCode inside index %controlState% of %controlList% at position n-th position, send the n-th note object up. IF the user is not, send it down.
    
    //%controlState% is changed inside of keyPressed();
    //%controlList% stores the keyCodes instead of the keys itself is because of keyIsDown(). You can't easily use this function, or anything similar, with JUST the keys
    

    let keyDisplay = getKeyAtIndex(i);
    
    if (keyIsDown(keyDisplay))
    {
      notes[i].move(1); //moving up
    } else
    {
      notes[i].move(-1); //moving down
    }
    
    if (notes[i].y * h < dzSize * scaleToCanvas(true) || notes[i].y * h > h - dzSize * scaleToCanvas(true))
    {
      health.hurt(0.75 * difficultDmgMod);
      dzActive = true; // this and the following three lines of code switch the magma sprites if the player enters a deadzone
      magmaOpacity = lerp(magmaOpacity,255,0.05) 
    } else {
      dzActive = false;
      magmaOpacity = lerp(magmaOpacity,0,0.05)
    }
  }
}

function projectileCreate()
{
  canvasScale = scaleToCanvas(true);
  //Called in gamePlay();
  returnCheck = 0;
  for (let i = 0; i < projTargets.length; i++)
  { 
    returnCheck += projTargets[i];
  } //If theres projectiles on every note, then the function does not run any further.
  if (returnCheck == projTargets.length) { return; }
  
  let startPos = [-0.04, (1 + 0.04)];
  let dir =      [1, -1];
  
  let index = int(random(0, 2));
  let x = startPos[index];
  let y = random(0.25, 0.75);
  let randomSpeed = random(0.8, 1.2);
  let projectileIX = -1;
  let spriteIX = int(random(1,5));

  while (projectileIX == -1)
  { //While projectileIndex does not have a proper value to it, keep on iterating until it gets an actual note on the canvas to target
    i = int(random(0, projTargets.length));
    if (projTargets[i] == 0)
    {
      projectileIX = i;
      projTargets[i] = 1;
    }
  }
  
  print(y + " " + projectileIX);
  append(projectiles, [x, y, randomSpeed, projectileIX, dir[index], spriteIX, 90 * difficultDmgMod]);
}

function projectileMove()
{
  //Called in gamePlay()

  let canvasScale = scaleToCanvas(true);

  for (let i = 0; i < projectiles.length; i++)
  {
                        //randSpeed * direction * baseSpeed * canvasScale
    let totalSpeed = projectiles[i][4] * (projectiles[i][2] / 600) * projSpeed; //total speed of projectile
    let noteIndex = projectiles[i][3]; 
    
    let spriteList = [];
    let spriteFrameRate = 4;
    
    let distance = dist(projectiles[i][0] * w, projectiles[i][1] * h, notes[noteIndex].x * w, notes[noteIndex].y * h); //distance between targetted note and projectile
    
    let opacity = 255;

    if (projectiles[i][6] > 0)
    {
      if (noteIndex >= notesNum)
      {
        noteIndex = noteSprite.length - notesNum - (notesNum - noteIndex);
      }

      push();
      translate((projectiles[i][0] + 0.08 * projectiles[i][4]) * w, projectiles[i][1] * h);
      scale(0.075);
      

      if (deafModeIX == 1)
      {
        tint(255, 255, 255, opacity);
      } else
      {
        tint(projectileTint[noteIndex][0], projectileTint[noteIndex][1], projectileTint[noteIndex][2], opacity);
        
      }
      noSmooth();
      scale(scaleToCanvas());
      if (frame % 20 > 8)
      {
        image(projAlert[int(frame / 4) % projAlert.length], 0, 0);

      }
      pop();

      projectiles[i][6]--;

    } else
    {
      projectiles[i][0] += totalSpeed; //projectile x getting added by speed
      
      if (projectiles[i][4] == -1) //Whenever a projectiles passes it's note, it slowly disappears
      { //proj going right
        if (projectiles[i][0] * w < notes[noteIndex].x * w)
        {
          opacity = 255 - (notes[noteIndex].x * w - projectiles[i][0] * w) * 5;
        }
      } else
      { //going left
        if (projectiles[i][0] * w > notes[noteIndex].x * w)
        {
          opacity = 255 - (projectiles[i][0] * w - notes[noteIndex].x * w) * 5;
        }
      }
      if (opacity < 30)
      { //kills the projectile when it gets too far from the targetted note.
        projectileDelete(i, false);
        i--;
        break; 
      }
      push();
    
      switch (projectiles[i][5])
      {
        case 1:
          spriteList = projType1;
          break;
        case 2:
          spriteList = projType2;
          break;
        case 3:
          spriteList = projType3;
          break;
        case 4:
          spriteList = projType4;
          break;
      }

      if (noteIndex >= notesNum)
      {
        noteIndex = noteSprite.length - notesNum - (notesNum - noteIndex);
      }

      translate(projectiles[i][0] * w, projectiles[i][1] * h + (3 * sin(frameCount * 3) * canvasScale));
      scale(0.075);
      
      if (deafModeIX == 1)
      {
        tint(255, 255, 255, opacity);

      } else
      {
        tint(projectileTint[noteIndex][0], projectileTint[noteIndex][1], projectileTint[noteIndex][2], opacity);

      }
      scale(scaleToCanvas());
      noSmooth();
      image(spriteList[int(frameCount / 4) % spriteList.length], 0, 0);
      pop();
      
      if (distance < 40 * canvasScale)
      {
        projectileDelete(i, true);
        i--;
        break;
      }
      if (projectiles[i][0] * w < (-30 * canvasScale) || projectiles[i][0] * w  > w + (30 * canvasScale))
      {
        projectileDelete(i, false);
        print("projectile out of bounds deleted");
        i--;
        break;
      }
    }
  }
}

function projectileDelete(i, wasHit)
{ //i is the index number of what projectile is being deleted 
  //wasHit is a boolean representing if the player actually his the projectile or not
  
  //Called in projectileMove
  projTargets[projectiles[i][3]] = 0;
  projectiles.splice(i, 1); 
  
  if (wasHit)
  {
    health.heal(15 * 1 / difficultDmgMod);
  } else
  {
    health.hurt(25 * difficultDmgMod);
  }
}


function changeDifficulty(n)
{
  //Called nowhere yet.
  notesNum = n;
  
}

function scaleToCanvas(isInteger)
{ 
//Returns an array to be used in the scale() function to scale the game to the canvas size properly 
//if isInteger is true, it returns a single number that is the average of the two scales. || CAUTION: THIS ONLY WORKS IF THE ASPECT RATIO OF THE CANVAS IS 3:2 ||
  if (isInteger)
  {
    return (w / 600 + h / 400) / 2
  }
  return [w / 600, h / 400];
}

function getKeyAtIndex(i, isKey)
{ //returns the key at the i-th note
  let cIndx = i;
  if (i > notes.length / 2 - 1) 
  { 
    cLIndx = controlList[0].length;
    cIndx = cLIndx - (notes.length / 2 - i + notesNum);
  }
  
  if (isKey)
  {

    return keyCodeToKey(controlList[controlState][cIndx]);
  }
  return controlList[controlState][cIndx];
  
}

function adjustCanvas() { // dynamically adjusts canvas size based on window size
  resizeCanvas(windowWidth*0.81, windowWidth*0.54);
}
