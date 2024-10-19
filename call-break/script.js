const game_setup = document.getElementById('new-game-setup');
const game_init = document.getElementById('game-init');
const game_form = document.getElementById('game-form');
const game_disp = document.getElementById('game-disp');
const game_main = document.getElementById('game');
const call_btn = document.getElementById('call-btn');
const scored_btn = document.getElementById('scored-btn');
const clear_btn = document.getElementById('clear-btn');

let game_state = JSON.parse(localStorage.getItem('game_state')) || {
  players: [],
  called: [],
  scored: [],
  score: [],
  eoh: 0,
  game_start: false,
  round_ongoing: false
};

if (game_state.game_start) {
  game();
}

let game_init_data;

// EvenListeners

game_form.addEventListener('submit', (event) => {
  event.preventDefault();
  game_init_data = new FormData(event.target);
  
  game();
});

call_btn.addEventListener('click', () => {
  game_state.round_ongoing = true;
  const temp_data = [];

  for(i = 1; i < 5 ; i++) {
    temp_data.push(parseInt(document.getElementById('cp'+i).value));
  }

  console.log(temp_data);
  game_state.called.push(temp_data);
  game_state.scored.push([0, 0, 0, 0]);
  game_state.score.push([0, 0, 0, 0]);
  
  toggleRound();
  saveGame(game_state);
  game_disp.innerHTML = displayTable(...Object.values(game_state));
});

scored_btn.addEventListener('click', () => {
  game_state.round_ongoing = false;

  for(i = 1; i < 5 ; i++) {
    game_state.scored[game_state.scored.length - 1][i-1] = parseInt(document.getElementById('sp'+i).value);
  }

  console.log(game_state);
  
  toggleRound();
  game_state.score[game_state.score.length-1] = scoring();
  saveGame(game_state);
  game_disp.innerHTML = displayTable(...Object.values(game_state));
});

clear_btn.addEventListener('click', () => {
  localStorage.clear();
  game_state = {
    players: [],
    called: [],
    scored: [],
    score: [],
    eoh: 0,
    game_start: false,
    round_ongoing: false
  };
  location.reload();
});

// Functions 

function game() {
  if (!game_state.game_start) {
    game_state.game_start = true;
    for (i = 1 ; i < 5 ; i++ ) {
      game_state.players.push(game_init_data.get('player'+i));
    }

    game_state.eoh = game_init_data.get('eoh');
  }
  
  initToggle(game_state.game_start);
  toggleRound();

  saveGame(game_state);

  game_disp.innerHTML = displayTable(...Object.values(game_state));
}

function displayTable(players, called, scored, score) {
  let plrs = '';
  let scores = '';
  let tot_score = [0, 0, 0, 0];
  let tot = '';
  
  for ( i = 0 ; i < 4 ; i++ ) {
    plrs += '<th>'+players[i]+'</th>';
  }
  
  for ( i = 0 ; i < called.length ; i++ ) {
    let temp = '';
    
    for ( j = 0 ; j < 4 ; j ++ ) {
      temp += '<td>'+called[i][j]+'|'+scored[i][j]+'<p style="color: red">'+score[i][j]+'</p>'+'</td>';
      tot_score[j] += score[i][j];
    }
    
    scores += '<tr>'+temp+'</tr>';
  }
  
  for ( i = 0 ; i < 4 ; i++ ) {
    tot += '<th>'+tot_score[i]+'</th>';
  }

  return '<table><tr>'+plrs+'</tr>'+scores+'<tr>'+tot+'</tr></table>';
}

function scoring() {
  let score = [];
  let rnd = game_state.scored.length - 1;
  let eoh = game_state.eoh;

  for( i = 0 ; i < 4 ; i++ ) {
    let called = game_state.called[rnd][i];
    let scored = game_state.scored[rnd][i];
    
    score.push( scored < called ? -called : scored === called ? called : scored - called > eoh ? -called : (called + Math.round((scored - called)/10)) )
  }

  return score;
}

function initToggle(game_status) {
  game_init.style.display = game_status ? 'none' : 'block';
  game_main.style.display = game_status ? 'flex' : 'none';
}

function toggleRound() {
  call_btn.disabled = game_state.round_ongoing;
  scored_btn.disabled = !game_state.round_ongoing;
  for(i = 1; i < 5 ; i++) {
    document.getElementById('cp'+i).value = '';
    document.getElementById('cp'+i).disabled = game_state.round_ongoing;
  }
  for(i = 1; i < 5 ; i++) {
    document.getElementById('sp'+i).value = '';
    document.getElementById('sp'+i).disabled = !game_state.round_ongoing;
  }
}

function saveGame(game_state) {
  localStorage.setItem('game_state', JSON.stringify(game_state));
}
