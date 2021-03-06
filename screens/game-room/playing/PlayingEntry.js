import React from 'react'
// import { Text } from 'react-native'
import PropTypes from 'prop-types'

import * as Analytics from '@constants/analytics.js'

import { useCountdown, usePrevious } from '@constants/utils'
import PapersContext from '@store/PapersContext.js'

import { headerTheme } from '@navigation/headerStuff.js'

import Page from '@components/page'
import i18n from '@constants/i18n'

import { MyTurnGetReady, MyTurnGo, OthersTurn, RoundScore } from './index'
// import * as Theme from '@theme'
// import Styles from './PlayingStyles.js'

const DESCRIPTIONS = [i18n.round_0_desc, i18n.round_1_desc, i18n.round_2_desc]

export default function PlayingEntry({ navigation }) {
  const Papers = React.useContext(PapersContext)
  const { profile, profiles, game } = Papers.state
  const round = game.round
  const roundIndex = round.current

  const isRoundFinished = round.status === 'finished'
  const hasCountdownStarted = !['getReady', 'finished'].includes(round.status)
  const prevHasCountdownStarted = usePrevious(hasCountdownStarted)
  const initialTimer = game.settings.time_ms[roundIndex]
  const timerReady = 3400 // 400 - threshold for io connection.
  const [countdown, startCountdown] = useCountdown(hasCountdownStarted ? round.status : null, {
    timer: initialTimer + timerReady,
  }) // 3,2,1... go!
  const initialTimerSec = Math.round(initialTimer / 1000)
  const countdownSec = Math.round(countdown / 1000)

  const turnWho = round?.turnWho || {}
  const turnTeam = turnWho.team
  const turnPlayerId = game.teams[turnTeam].players[turnWho[turnTeam]]
  const thisTurnPlayer = profiles[turnPlayerId]
  const turnTeamName = game.teams[turnTeam].name

  const isMyTurn = turnPlayerId === profile.id
  const isCount321go = countdownSec > initialTimerSec
  const startedCounting = prevHasCountdownStarted === false && hasCountdownStarted

  const amIReady = game.players[profile.id].isReady

  React.useEffect(() => {
    Analytics.setCurrentScreen(`game_playing_round_${roundIndex + 1}`)
  }, [roundIndex])

  React.useEffect(() => {
    // use false to avoid undefined on first render
    if (startedCounting) {
      startCountdown(round.status)
    }
  }, [startedCounting, startCountdown, round.status])

  React.useEffect(() => {
    setNavigation()
  }, [isMyTurn, hasCountdownStarted, amIReady, isRoundFinished])

  function setNavigation() {
    // OPTIMIZE - Handle nav options across diff screens in a smarter way.
    navigation.setOptions({
      headerTitle: 'Playing',
      ...headerTheme({ hiddenTitle: true }),
      headerRight:
        isMyTurn && hasCountdownStarted
          ? null
          : function HLB() {
              return <Page.HeaderBtnSettings />
            },
    })
  }

  if (isRoundFinished && amIReady) {
    const nextTurnWho = Papers.getNextTurn()
    const nextRoundIx = round.current + 1
    const turnTeam = nextTurnWho.team
    const turnPlayerId = game.teams[turnTeam].players[nextTurnWho[turnTeam]]
    const turnPlayer = profiles[turnPlayerId]
    const isMeNextTurn = turnPlayerId === profile.id

    // REVIEW / OPTIMIZE later. I don't like this duplication.
    // TODO - <Page> should be inside of each view component,
    // so that it can show errors if needed
    return isMeNextTurn ? (
      <MyTurnGetReady description={DESCRIPTIONS[nextRoundIx]} amIWaiting={true} />
    ) : (
      <OthersTurn
        roundIx={nextRoundIx}
        description={DESCRIPTIONS[nextRoundIx]}
        thisTurnTeamName={turnTeamName}
        thisTurnPlayer={turnPlayer}
        hasCountdownStarted={false}
        countdownSec={initialTimerSec}
        countdown={initialTimer}
        initialTimerSec={initialTimerSec}
        initialTimer={initialTimer}
        amIWaiting={true}
      />
    )
  }

  // BUG - Android (or slow phones?) RoundScore is visible for a few ms
  // before showing OthersTurn
  return isRoundFinished ? (
    <RoundScore navigation={navigation} onUnmount={setNavigation} />
  ) : isMyTurn ? (
    !hasCountdownStarted ? (
      <MyTurnGetReady description={DESCRIPTIONS[roundIndex]} />
    ) : (
      <MyTurnGo
        startedCounting={startedCounting}
        initialTimerSec={initialTimerSec}
        countdown={countdown}
        countdownSec={countdownSec}
        isCount321go={isCount321go}
      />
    )
  ) : (
    <OthersTurn
      description={DESCRIPTIONS[roundIndex]}
      thisTurnTeamName={turnTeamName}
      thisTurnPlayer={thisTurnPlayer}
      hasCountdownStarted={hasCountdownStarted}
      countdownSec={countdownSec}
      countdown={countdown}
      initialTimerSec={initialTimerSec}
      initialTimer={initialTimer}
    />
  )
}

PlayingEntry.propTypes = {
  navigation: PropTypes.object.isRequired, // ReactNavigation
}
