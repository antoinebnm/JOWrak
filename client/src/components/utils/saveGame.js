import fetchData from "./fetchData";

/**
 * Save game data in mongoDB cluster
 * @param {object} gameInfo Format: {type, score, playedByUser, playedAtDate}
 * @async
 */
var saveGame = async function (gameInfo) {
  try {
    const body = {
      gameDetails: {
        _type: gameInfo.type,
        _score: gameInfo.score,
        _playedBy: gameInfo.playedBy,
        _playedAt: gameInfo.playedAt,
      },
    };
    await fetchData("/api/games", body, "POST", undefined);
  } catch (err) {
    console.error(err);
  }
};

export default saveGame;
