const utils = require('./utils');

// Q: This works fine locally, but not on Heroku. Why?
// I know it's a bad practice, but I don't know DB yet,
// so... one thing at the time.
const games = {};

function getGame(name, playerId) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  // In the future, add auth?
  if (playerId && !game.players[playerId]) {
    throw String('dontBelong');
  }

  return game;
}

function createGame(name, creator) {
  if (games[name]) {
    throw String('exists');
  }

  const game = {
    // id: utils.createUniqueId(`game_${name}`), // TODO - use id instead of name.
    name: utils.stringToSlug(name),
    creatorId: creator.id,
    players: {
      [creator.id]: creator,
    },
    words: {
      // [playerId]: [String] - list of words - the user submitted their words.
    },
    // teams: {
    //   0: {
    //     id: '0', // team index
    //     name: 'Dreamers',
    //     players: [playerdId]
    //   }
    // }
    round: {
      current: undefined, // Number - Round index
      turnWho: undefined, // [Number, Number] - [teamIndex, playerIndex]
      turnCount: 0, // Number - Turn index
      status: undefined, // String - 'getReady' | Date.now() | 'timesup'
      wordsLeft: undefined, // Array - words left to guess.
    },
    score: [
      //  Array by round for each player:
      // { [playerId1]: [wordsGuessed0...], [playerId2]: [wordsGuessed0...] },
      // { [playerId1]: [wordsGuessed1...], [playerId2]: [wordsGuessed2...] }
      // ----
      // ---- ALTERNATIVE: Organized by team and by player?
      // byTeam: [
      //   // [ Object(teamIndex: [words]) ]
      //   // { 0: ['car', 'dog', ...],   1: ['poker', 'travel', ....] },
      //   // { 0: null, 1: null },
      //   // { 0: null, 1: null },
      // ],
      // byPlayer: [
      //   // { [playerId]: [[words...], [words...], [words...]] }
      // ],
    ],
    // example:

    settings: {
      rounds: [
        {
          description: 'Use as many words as you need!',
        },
        {
          description: 'Use only 3 words to describe the paper!',
        },
        {
          description: 'Mimicry time, No talking!',
        },
      ],
      words: 10,
    },
  };

  games[name] = game;

  return games[name];
}

function joinGame(name, playerJoining) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  if (game.hasStarted && !game.players[playerJoining.id]) {
    throw String('alreadyStarted');
  }

  game.players[playerJoining.id] = playerJoining;

  return game;
}

function pausePlayer(playerId, gameId) {
  // Dont need to receive gameId - access clients instead.
  const game = games[gameId];

  if (game && game.players[playerId]) {
    game.players[playerId].isAfk = true;
  }

  return game;
}

function recoverPlayer(name, playerId) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  game.players[playerId].isAfk = false;

  return game;
}

function removePlayer(name, playerId) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  // Everyone left...
  if (Object.keys(game.players).length === 1) {
    return killGame(name);
  }

  const otherPlayers = Object.keys(game.players).reduce((acc, p) => {
    return p === playerId ? acc : { ...acc, [p]: game.players[p] };
  }, {});

  if (!game.hasStarted) {
    // Remove completely the playerId
    game.players = otherPlayers;
  } else {
    // The game must go on...
    // Set the player hasleft
    game.players[playerId].hasLeft = true;

    // TODO - udpdate round turn if needed. same for afk
    // ----- CONTINUE HERE -------
  }

  // Set a new admin in case this was the one leaving.
  if (game.creatorId === playerId) {
    // Set as new admin the oldest player? It works.
    game.creatorId = Object.keys(otherPlayers)[0];
  }

  return game;
}

function killGame(name, creatorId) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  // if (creatorId === game.creator) {
  // Q: how overcome this?
  delete games[name];
  // }

  return null;
}

function setTeams(name, teams) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  game.teams = teams;

  return game;
}

function setWords(name, playerId, words) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  game.words[playerId] = words;

  return game;
}

function setWordsForEveyone(name, playerId, allWords) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  game.words = allWords;

  return game;
}

function _allWordsTogether(words) {
  return Object.keys(words).reduce((acc, pId) => [...acc, ...words[pId]], []);
}

function startGame(name) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  game.hasStarted = true; // for now on a player cannot join
  game.round = {
    current: 0,
    turnWho: [0, 0],
    turnCount: 0,
    status: 'getReady',
    wordsLeft: _allWordsTogether(game.words),
  };

  return game;
}

function _getNextTurn(game) {
  const [teamIndex, playerIndex] = game.round.turnWho;
  const totalTeams = Object.keys(game.teams).length;

  // BUG / TODO - Handle correctly When teams are not even!
  if (teamIndex < totalTeams - 1) {
    const nextTeamIndex = teamIndex + 1;
    const totalTeamPlayers = game.teams[nextTeamIndex].players.length;

    if (playerIndex < totalTeamPlayers) {
      return [nextTeamIndex, playerIndex];
    } else {
      return [nextTeamIndex, playerIndex, 'isOdd'];
    }
  } else {
    const totalTeamPlayers = game.teams[0].players.length;
    const nextPlayer = playerIndex + 1;

    if (nextPlayer < totalTeamPlayers) {
      return [0, nextPlayer];
    } else {
      return [0, 0];
    }
  }

  // if (player < totalPlayers) {
  //   return [team, player + 1];
  // } else {
  //   if (team < totalTeams) {
  //     return [team + 1, 0];
  //   } else {
  //     return [0, 0];
  //   }
  // }
}

function startTurn(name) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  // The client is responsible for the countdown and then
  // it sends 'finish-turn' with score. It saves on IO events for each second.
  game.round.status = Date.now();

  return game;
}

function finishTurn(name, playerId, papersTurn) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  const wordsLeft = [...papersTurn.wordsLeft, ...papersTurn.passed];

  if (wordsLeft.length > 0) {
    game.round = {
      current: game.round.current,
      turnWho: _getNextTurn(game),
      turnCount: game.round.turnCount + 1,
      status: 'getReady',
      wordsLeft,
    };

    if (!game.score[game.round.current]) {
      game.score[game.round.current] = {};
    }
  } else {
    game.round.status = 'finished';
    game.round.wordsLeft = [];
  }

  if (!game.score[game.round.current]) {
    game.score[game.round.current] = {};
  }

  const wordsSoFar = game.score[game.round.current][playerId] || [];
  game.score[game.round.current][playerId] = [...wordsSoFar, papersTurn.guessed];

  return game;
}

function startNextRound(name) {
  const game = games[name];

  if (!game) {
    throw String('notFound');
  }

  // TODO - Do validations - if wordsLeft is 0, if round is last, etc...

  game.round = {
    current: game.round.current + 1,
    turnWho: _getNextTurn(game),
    turnCount: 0,
    status: 'getReady',
    wordsLeft: _allWordsTogether(game.words),
  };

  return game;
}

module.exports = {
  getGame,
  createGame,
  joinGame,

  removePlayer,
  killGame,
  pausePlayer,
  recoverPlayer,

  setTeams,
  setWords,
  setWordsForEveyone,

  startGame,
  startTurn,
  finishTurn,
  startNextRound,
};
