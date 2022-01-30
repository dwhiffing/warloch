import md5 from 'js-md5'
import { v4 as uuidv4 } from 'uuid'

const prefix = 'https://www.highscores.ovh/api/highscore'
const HIGHSCORE_APP_ID = '92d4668c-d15a-4e71-920e-f1e6c7293285'
const HIGHSCORE_APP_SECRET = '78d893f6-96aa-43c7-93f6-e3ea673654b0'

if (!localStorage.getItem('warloch-id'))
  localStorage.setItem('warloch-id', uuidv4())

export const postScore = ({ playerName, score }) => {
  const playerId = `${localStorage.getItem('warloch-id')}`
  const checksum = md5.hex(playerId + score + HIGHSCORE_APP_SECRET)
  return fetch(
    `${prefix}?appId=${HIGHSCORE_APP_ID}&playerId=${playerId}&playerName=${playerName}&score=${score}&checksum=${checksum}`,
    { method: 'POST' },
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error))
}

export const getScores = (
  playerId = localStorage.getItem('warloch-id') || '',
) => {
  return fetch(
    `${prefix}?appId=${HIGHSCORE_APP_ID}&playerId=${playerId}&order=DESC`,
  )
    .then((response) => response.json())
    .then((r) => {
      return {
        score: r.currentPlayerScore?.score,
        top: r.topScores
          .reduce((arr, score) => [...arr, [score.playerName, score.score]], [])
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10),
      }
    })
    .catch((error) => console.log('error', error))
}
