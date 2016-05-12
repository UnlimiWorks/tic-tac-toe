let playerToken, computerToken
let boardState = Array(9).fill(null)

const winStates = [
  ['0', '1', '2'],
  ['3', '4', '5'],
  ['6', '7', '8'],
  ['0', '3', '6'],
  ['1', '4', '7'],
  ['2', '5', '8'],
  ['0', '4', '8'],
  ['2', '4', '6']]

$(document).ready(() => {
  $('#restart').hide()
  $('#modal').modal({
    'show': true,
    'backdrop': 'static',
    'keyboard': false
  })
})

$('#restart').click(() => {
  $('#modal').modal({
    'show': true,
    'backdrop': 'static',
    'keyboard': false
  })

  boardState = Array(9).fill(null)
  $('#outcome').text('')
  $('#restart').hide()
  $('.cell').text('')
  $('.cell').click(onCellClick)
})

$('.signs').click(event => {
  playerToken = event.currentTarget.innerText
  computerToken = event.currentTarget.nextElementSibling
  ? event.currentTarget.nextElementSibling.innerText
  : event.currentTarget.previousElementSibling.innerText
})

$('.cell').click(onCellClick)

function onCellClick (event) {
  if (event.target.innerText === '') {
    $(event.target).text(playerToken)
    boardState[event.target.id] = event.target.innerText
    $('#outcome').text('Your opponent\'s turn')
    if (hasWon(playerToken, boardState, winStates)) {
      $('#outcome').text('You won !').fadeOut().fadeIn()
      $('.cell').off('click')
      $('#restart').show()
    } else if (boardState.every(element => element !== null)) {
      $('#outcome').text('It was a tie. Good job !').fadeOut().fadeIn()
      $('.cell').off('click')
      $('#restart').show()
    } else {
      computerTurn(playerToken, computerToken, boardState, winStates)
      $('#outcome').text('Your turn')
      if (hasWon(computerToken, boardState, winStates)) {
        $('#outcome').text('You lost ~ Better luck next time.').fadeOut().fadeIn()
        $('.cell').off('click')
        $('#restart').show()
      }
    }
  }
}

function computerTurn (playerToken, computerToken, board, winStates) {
  // Winning
  let winning = canEnd(computerToken, board, winStates)
  if (winning) {
    return play(computerToken, board, winning)
  }

  // Block losing
  let losing = canEnd(playerToken, board, winStates)
  if (losing) {
    return play(computerToken, board, losing)
  }

  // Fork option available
  let forking = canFork(computerToken, board, 4)
  if (forking !== false) {
    return fill(computerToken, board, forking)
  }

  // Opponent is forking
  let opponentForking = canFork(playerToken, board, 4)
  if (opponentForking) {
    return fill(computerToken, board, opponentForking)
  }
  // Center available
  if (board[4] === null) {
    return fill(computerToken, board, 4)
  }

  // Fill opposing corner
  let playerCorner = findIndex(playerToken, board, [0, 2, 6, 8])
  if (playerCorner !== false && board[8 - playerCorner] === null) {
    return fill(computerToken, board, 8 - playerCorner)
  }

  // Fill empty corner
  let cornerEmpty = findIndex(null, board, [0, 2, 6, 8])
  if (cornerEmpty !== false) {
    return fill(computerToken, board, cornerEmpty)
  }

  // Fill empty cell
  return fill(computerToken, board, findIndex(null, board, [1, 3, 5, 7]))
}

function hasWon (token, board, winStates) {
  return winStates.some(array => array.every(element => board[element] === token))
}

// Returns either the winning streak if the token holder can win, or false
function canEnd (token, board, winStates) {
  return winStates.reduce((accumulator, streak) => {
    if (streak.reduce((accumulator, element) => board[element] === token ? accumulator + 1 : accumulator, 0) === 2 &&
    streak.some(element => board[element] === null)) {
      return streak
    }
    return accumulator
  }, false)
}

function findIndex (item, board, indexes) {
  for (let i = 0; i < indexes.length; i++) {
    if (board[indexes[i]] === item) {
      return indexes[i]
    }
  }
  return false
}

function play (token, board, winStreak) {
  winStreak.forEach(element => {
    if (board[element] === null) {
      fill(token, board, element)
    }
  })
}

function fill (token, board, target) {
  board[target] = token
  $(`#${target}`).text(token)
}

function canFork (token, board, winStates) {
  if ([0, 2, 4, 6, 8].reduce((accumulator, element) => board[element] === token ? accumulator + 1 : accumulator, 0) >= 2) {
    return findIndex(null, board, [7, 5, 3, 1])
  }
  return false
}
