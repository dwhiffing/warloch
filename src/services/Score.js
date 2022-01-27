import md5 from 'js-md5'
import { v4 as uuidv4 } from 'uuid'

const prefix = 'https://www.highscores.ovh/api/highscore'
const HIGHSCORE_APP_ID = '2433fe8f-c875-44da-b0da-64e2ae4a16c3'
const HIGHSCORE_APP_SECRET = '0986b41f-9dcf-4192-8e06-f77e0ba2c7e5'

if (!localStorage.getItem('ggj22-id'))
  localStorage.setItem('ggj22-id', uuidv4())

export const postScore = ({ playerName, score }) => {
  const playerId = `${playerName}-${localStorage.getItem('ggj22-id')}`
  const checksum = md5.hex(playerId + score + HIGHSCORE_APP_SECRET)
  return fetch(
    `${prefix}?appId=${HIGHSCORE_APP_ID}&playerId=${playerId}&playerName=${playerName}&score=${score}&checksum=${checksum}`,
    { method: 'POST' },
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error))
}

export const getScores = (playerId = '') => {
  return fetch(
    `${prefix}?appId=${HIGHSCORE_APP_ID}&playerId=${playerId}&order=DESC`,
  )
    .then((response) => response.json())
    .then((r) =>
      r.topScores
        .reduce((arr, score) => [...arr, [score.playerName, score.score]], [])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    )
    .catch((error) => console.log('error', error))
}
