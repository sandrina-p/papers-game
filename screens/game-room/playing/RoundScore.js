import React, { Fragment } from 'react'
import { ScrollView, View, Text } from 'react-native'
import PropTypes from 'prop-types'

import PapersContext from '@store/PapersContext.js'

import Button from '@components/button'
import Page from '@components/page'
import { getTeamId, useScores } from '@store/papersMethods'

import { headerTheme } from '@navigation/headerStuff.js'
// import EmojiRain from './EmojiRain'
import GameScore from '@components/game-score'

import * as Theme from '@theme'
import Styles from './PlayingStyles.js'
import i18n from '@constants/i18n'

const DESCRIPTIONS = [i18n.round_0_desc, i18n.round_1_desc, i18n.round_2_desc] // REVIEW this

const RoundScore = ({ navigation }) => {
  const Papers = React.useContext(PapersContext)
  const { profile, game } = Papers.state
  const round = game.round
  const roundIx = round.current
  const isFinalRound = roundIx === game.settings.roundsCount - 1
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isOnRoundIntro, setIsOnRoundIntro] = React.useState(false)

  const { isMyTeamWinner, isTie, scoreByRound, getPlayersSorted } = React.useMemo(
    () => useScores(game.score, game.teams, profile.id),
    []
  )

  function getMyTotalScore() {
    if (!isFinalRound) return null

    const myTeamId = getTeamId(profile.id, game.teams)
    const playersSorted = getPlayersSorted(myTeamId, roundIx, true)
    return playersSorted.find(p => p.id === profile.id)?.score || 0
  }

  const myTotalScore = getMyTotalScore()

  React.useEffect(() => {
    Papers.sendTracker('game_finishRound', {
      arrayOfScores: scoreByRound[roundIx].arrayOfScores,
      isMyTeamWinner,
      myTotalScore,
    })
  }, [])

  function handleStartRoundClick() {
    setIsOnRoundIntro(true)
    navigation.setOptions({
      ...headerTheme({ dark: true, hiddenBorder: true, hiddenTitle: true }),
    })
  }

  async function handleReadyClick() {
    if (isSubmitting === true) {
      return
    }
    setIsSubmitting(true)

    try {
      await Papers.markMeAsReadyForNextRound()
    } catch (error) {
      // TODO errorMsg
    }
  }

  if (isOnRoundIntro) {
    return (
      <Page bgFill={Theme.colors.purple}>
        <Page.Main>
          <View
            style={[
              Styles.header,
              {
                marginBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flexGrow: 1,
              },
            ]}
          >
            <Text style={[Theme.typography.h1, { color: Theme.colors.bg }]}>
              Round {roundIx + 1 + 1}
            </Text>
            <Text
              style={[
                Theme.typography.body,
                Theme.u.center,
                { width: 225, color: Theme.colors.bg, marginTop: 24 },
              ]}
            >
              {DESCRIPTIONS[roundIx + 1]}
            </Text>
          </View>
        </Page.Main>
        <Page.CTAs>
          <Button place="float" isLoading={isSubmitting} onPress={handleReadyClick}>
            {`I'm ready!`}
          </Button>
        </Page.CTAs>
      </Page>
    )
  }

  return (
    <Page>
      {/* {!isTie && isFinalRound && <EmojiRain type={isMyTeamWinner ? 'winner' : 'loser'} />} */}
      <Page.Main>
        <View style={[{ marginHorizontal: 0, marginTop: 24, marginBottom: 16 }]}>
          {isFinalRound ? (
            <Fragment>
              <Text style={[Theme.typography.h3, Theme.u.center]}>
                {isTie ? 'Stalemate' : isMyTeamWinner ? 'Your team won!' : 'Your team lost'}
              </Text>
              <Text style={[Theme.typography.body, Theme.u.center]}>
                {isTie
                  ? "It's a tie"
                  : isMyTeamWinner
                  ? '😎 They never stood a chance 😎'
                  : '💩 Yikes 💩'}
              </Text>
            </Fragment>
          ) : (
            <Fragment>
              <Text style={[Theme.typography.h3, Theme.u.center]}>
                {isTie
                  ? "It's a tie!"
                  : isMyTeamWinner
                  ? 'Your team won this round!'
                  : 'Your team lost this round...'}
              </Text>
            </Fragment>
          )}
        </View>
        <ScrollView
          style={[Theme.u.scrollSideOffset]}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <GameScore BOAT={isFinalRound} />
        </ScrollView>
      </Page.Main>
      <Page.CTAs>
        {isFinalRound ? (
          <Button
            place="float"
            bgColor={Theme.colors.purple}
            onPress={() => {
              navigation.navigate('gate', { goal: 'leave' })
              Papers.leaveGame()
            }}
          >
            Go to homepage
          </Button>
        ) : (
          <Button
            place="float"
            bgColor={Theme.colors.purple}
            isLoading={isSubmitting}
            onPress={handleStartRoundClick}
          >
            {`Start round ${roundIx + 1 + 1}!`}
          </Button>
        )}
      </Page.CTAs>
    </Page>
  )
}

RoundScore.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default RoundScore
