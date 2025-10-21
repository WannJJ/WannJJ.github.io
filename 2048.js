let gameRound = 0;
score = 0;
// Use cookie to store bestScore. BestScore will not be lost when refreshing page
// Cannot set cookie by Chrome without http server
if (document.cookie == "") {
  bestScore = 0;
} else {
  arr = document.cookie.split("=");
  bestScore = parseInt(arr[1]);
  if(!Number.isInteger(bestScore)) bestScore = 0;
}

side = 4;
board = new Array(4).fill(0).map(() => new Array(4).fill(0));
colors = ['#cdc1b4', '#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f67c5f', '#f65e3b', '#edcf72', '#edcc61', '#edc850', '#edc53f', '#edc22e'];
t = 0.1; //0.1 second, animation-delay time
undoBoard = new Array(4).fill(0).map(() => new Array(4).fill(0));

cell1 = document.getElementsByClassName("cell1")[0];
cell2 = document.getElementsByClassName("cell2")[0];
cell3 = document.getElementsByClassName("cell3")[0];
cell4 = document.getElementsByClassName("cell4")[0];
cell5 = document.getElementsByClassName("cell5")[0];
cell6 = document.getElementsByClassName("cell6")[0];
cell7 = document.getElementsByClassName("cell7")[0];
cell8 = document.getElementsByClassName("cell8")[0];
cell9 = document.getElementsByClassName("cell9")[0];
cell10 = document.getElementsByClassName("cell10")[0];
cell11 = document.getElementsByClassName("cell11")[0];
cell12 = document.getElementsByClassName("cell12")[0];
cell13 = document.getElementsByClassName("cell13")[0];
cell14 = document.getElementsByClassName("cell14")[0];
cell15 = document.getElementsByClassName("cell15")[0];
cell16 = document.getElementsByClassName("cell16")[0];
cellBoard = [
  [cell1, cell2, cell3, cell4],
  [cell5, cell6, cell7, cell8],
  [cell9, cell10, cell11, cell12],
  [cell13, cell14, cell15, cell16],
];
displayScore = document.getElementById("Score-display");
htmlAddedScore = document.getElementById('added-score');
displayBestScore = document.getElementById("Best-display");
/* Add new cell, update score, check if
   game is over */
function draw() {
  displayScore.innerHTML = score;
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      if (board[i][j] == 0) {
        cellBoard[i][j].innerHTML = "";
        cellBoard[i][j].style.zIndex = 0;
      } else {
        cellBoard[i][j].innerHTML = "" + board[i][j];
        cellBoard[i][j].style.zIndex = 10;
      }
      cellBoard[i][j].style.background = getColor(board[i][j]);
      if (board[i][j] >= 8) {
        cellBoard[i][j].style.color = 'white';
      } else {
        cellBoard[i][j].style.color = 'black';
      }

      //adapt font-size
      if (board[i][j] >= 1024) {
        cellBoard[i][j].style.fontSize = '0.8em';
      } else {
        cellBoard[i][j].style.fontSize = '1em';
      }

    }
  }

}

//Add cookies
function writeCookies() {
  // let expires = new Date();
  // expires.setSeconds(expires.getSeconds() + maxAge);


  let cookie = "bestScore=" + bestScore + ";";
  // cookie += "Expires=" + expires.toUTCString() + ";";
  // cookie += "Path=/;";
  document.cookie = cookie;
  // console.log("cookie:" + document.cookie);
}

function readCookies() {
  // var allCookies = documment.cookie;
  arr = document.cookie.split("=");
  console.log("best: " + arr[1]);

}


function updateGame() {
  emptyCells = [];
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      if (board[i][j] == 0) {
        emptyCells.push([i, j]);
      }
    }
  }
  //Select random cell to add new number
  if (emptyCells.length > 0) {
    chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    //New number is either 2 (with chance 75%) or 4 (25%)
    newNumber = (1 + Math.round(Math.random() - 0.25)) * 2;
    board[chosen[0]][chosen[1]] = newNumber;
    cellBoard[chosen[0]][chosen[1]].style.animation = "appear " + (t / 2) + "s linear";
  }



  if (bestScore < score) {
    bestScore = score;
    writeCookies();
  }
  const lastScore = parseInt(displayScore.innerHTML);      
  displayScore.innerHTML = score;            
  if(!(score == 0 || displayScore.innerHTML == 0 || lastScore == undefined || score == lastScore)){
    htmlAddedScore.innerHTML = `+${score - lastScore}`;         
    htmlAddedScore.style.animationName = 'fly-out';
    setTimeout(() => {
      htmlAddedScore.style.animationName = "";
      }, 1000);          
  }           
  
  displayBestScore.innerHTML = bestScore;
  gameRound += 1;


  draw();
  // End game
  if (emptyCells.length <= 1 && !checkGame()) {
    document.getElementById("End").style.display = "block";
  }
}

function left() {
  change = false;
  backedup = false;
  for (let i = 0; i < side; i++) {
    idx_last = -1;
    last_number = -1;
    for (let j = 0; j < side; j++) {
      if (board[i][j] == last_number) {
        if (!backedup) {
          backup();
          backedup = true;
        }
        //move cell j to idx_last and merge
        board[i][j] = 0;
        last_number *= 2;
        board[i][idx_last] = last_number;
        score += last_number;
        //cellBoard[i][j].style.animation = "moveRight" + (idx_last + 1) + " " + t + "s linear forwards";
        cellBoard[i][j].style.animation = `moveRight${idx_last + 1} ${t}s linear forwards`;
        
        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);

        last_number = -1;
        change = true;
      } else if (board[i][j] != 0 && board[i][idx_last + 1] == 0) {
        if (!backedup) {
          backup()
          backedup = true;
        }

        //move cell j to idx_last+1
        board[i][idx_last + 1] = board[i][j];
        last_number = board[i][j];

        //cellBoard[i][j].style.animation = "moveRight" + (idx_last + 2) + " " + t + "s linear forwards";
        cellBoard[i][j].style.animation = `moveRight${idx_last + 2} ${t}s linear forwards`;

        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);
        

        idx_last = idx_last + 1;
        board[i][j] = 0;
        change = true;
      }
      if (board[i][j] != 0) {
        idx_last = j;
        last_number = board[i][j];
      }
    }

  }
  if (change) {
    setTimeout(() => {
      updateGame();
    }, t * 1000);
  }
}

function right() {
  change = false;
  backedup = false;

  for (let i = 0; i < side; i++) {
    idx_last = side;
    last_number = -1;
    for (let j = side - 1; j >= 0; j--) {
      if (board[i][j] == last_number) {
        if (!backedup) {
          backup()
          backedup = true;
        }

        board[i][j] = 0;
        last_number *= 2;
        board[i][idx_last] = last_number;
        score += last_number;

        cellBoard[i][j].style.animation = `moveRight${idx_last + 1} ${t}s linear forwards`;
        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);

        last_number = -1;
        change = true;
      } else if (board[i][j] != 0 && board[i][idx_last - 1] == 0) {
        if (!backedup) {
          backup()
          backedup = true;
        }

        board[i][idx_last - 1] = board[i][j];
        last_number = board[i][j];

        cellBoard[i][j].style.animation = `moveRight${idx_last} ${t}s linear forwards`;
        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);

        idx_last = idx_last - 1;
        board[i][j] = 0;
        change = true;
      }
      if (board[i][j] != 0) {
        idx_last = j;
        last_number = board[i][j];
      }
    }

  }
  if (change) {
    setTimeout(() => {
      updateGame();
    }, t * 1000);
  }
}

function down() {
  change = false;
  backedup = false;

  for (let j = 0; j < side; j++) {
    idx_last = side;
    last_number = -1;
    for (let i = side - 1; i >= 0; i--) {
      if (board[i][j] == last_number) {
        if (!backedup) {
          backup()
          backedup = true;
        }

        board[i][j] = 0;
        last_number *= 2;
        board[idx_last][j] = last_number;
        score += last_number;

        cellBoard[i][j].style.animation = `moveDown${idx_last + 1} ${t}s linear forwards`;
        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);

        last_number = -1;
        change = true;
      } else if (board[i][j] != 0 && board[idx_last - 1][j] == 0) {
        if (!backedup) {
          backup()
          backedup = true;
        }

        board[idx_last - 1][j] = board[i][j];
        last_number = board[i][j];

        cellBoard[i][j].style.animation = `moveDown${idx_last} ${t}s linear forwards`;
        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);

        idx_last = idx_last - 1;
        board[i][j] = 0;
        change = true;
      }
      if (board[i][j] != 0) {
        idx_last = i;
        last_number = board[i][j];
      }
    }

  }
  if (change) {
    setTimeout(() => {
      updateGame();
    }, t * 1000);
  }
}

function up() {
  change = false;
  backedup = false;

  for (let j = 0; j < side; j++) {
    idx_last = -1;
    last_number = -1;
    for (let i = 0; i < side; i++) {
      if (board[i][j] == last_number) {
        if (!backedup) {
          backup();
          backedup = true;
        }
        board[i][j] = 0;
        last_number *= 2;
        board[idx_last][j] = last_number;
        score+= last_number;
        cellBoard[i][j].style.animation = `moveDown${idx_last + 1} ${t}s linear forwards`;
        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);

        last_number = -1;
        change = true;
      } else if (board[i][j] != 0 && board[idx_last + 1][j] == 0) {
        if (!backedup) {
          backup()
          backedup = true;
        }

        board[idx_last + 1][j] = board[i][j];
        last_number = board[i][j];

      
        cellBoard[i][j].style.animation = `moveDown${idx_last + 2} ${t}s linear forwards`;
        setTimeout(() => {
          cellBoard[i][j].style.animation = "";
        }, t * 1000);

        idx_last = idx_last + 1;
        board[i][j] = 0;
        change = true;
      }
      if (board[i][j] != 0) {
        idx_last = i;
        last_number = board[i][j];
      }
    }

  }
  if (change) {
    setTimeout(() => {
      updateGame();
    }, t * 1000);
  }

}

function getColor(number) {
  cell_level = Math.log2(number);
  switch (cell_level) {
    case -Infinity:
      return colors[0];
      break;
    case 1:
    case 2:
    case 3:
      return colors[cell_level];
      break;
    case 4:
    case 5:
    case 6:
      return colors[cell_level];
      break;
    case 7:
    case 8:
    case 9:
      return colors[cell_level];
      break;
    case 10:
      return colors[cell_level];
      break;
    default:
      return colors[11];
  }
}

function backup() {
  undoScore = score;
  for (i = 0; i < side; i++) {
    for (j = 0; j < side; j++) {
      undoBoard[i][j] = board[i][j];
    }
  }



}

function undoGame() {
  if(gameRound <= 1) return;
  for (i = 0; i < side; i++) {
    for (j = 0; j < side; j++) {
      board[i][j] = undoBoard[i][j];
    }
  }
  score = undoScore;
  gameRound -=1;
  document.getElementById("End").style.display = "none";
  draw();

}

function checkGame() {
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      if (board[i][j] == 0) {
        return
        true;
      }
      if (i + 1 < side && board[i][j] == board[i + 1][j] || j + 1 < side && board[i][j] == board[i][j + 1]) {
        return true;
      }
    }
  }
  return false;
}

function startGame() {
  score = 0;
  gameRound = 0;
  board = new Array(4).fill(0).map(() => new Array(4).fill(0));
  undoBoard = new Array(4).fill(0).map(() => new Array(4).fill(0));
  undoScore = 0;
  document.getElementById("End").style.display = "none";
  updateGame();


}



document.addEventListener("DOMContentLoaded", () => {
  startGame();

});
window.addEventListener('keydown', (e) => {
  //Disable arrow keys scrolling in browser
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
  switch (e.keyCode) {
    case 37:
    case 65:
      left();
      break;
    case 38:
    case 87:
      up();
      break;
    case 39:
    case 68:
      right();
      break;
    case 40:
    case 83:
      down();
      break;
      //'U' for undo
    case 85:
      undoGame()
  }

});

//Touch events handling
//TODO: prevent refreshing document while swiping down
var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches || evtevt.originalEvent.touches;
};

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;

};

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }
  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff >= 50) { //swipe left
      left();
    } else if (xDiff <= -50) {
      right();
    }
  } else {
    if (yDiff >= 50) { //swipe up
      up();
    } else if (yDiff <= -50) {
      down();
    }
  }
};
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false); //Mouse handling for non touch devices var mousedown=false;
var xMDown = null;
var yMDown = null;
window.addEventListener("mousedown", function(e) {
  mousedown = true;
  xMDown = e.pageX;
  yMDown = e.pageY;
});
window.addEventListener("mouseup", function(e) {
  if (!xMDown || !yMDown) {
    return;
  }
  var
    xMUp = e.pageX;
  var yMUp = e.pageY;
  var xDiff = xMDown - xMUp;
  var yDiff = yMDown - yMUp;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff >= 50) { //swipe left
      left();
    } else if (xDiff <= -50) {
      right();
    }
  } else {
    if (yDiff >= 50) { //swipe up
      up();
    } else if (yDiff <= -50) {
      down();
    }
  }
  mousedown = false;
});