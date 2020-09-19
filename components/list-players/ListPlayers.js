import React from 'react'
import PropTypes from 'prop-types'
import { Alert, View, Text, Platform, TouchableHighlight } from 'react-native'

import PapersContext from '@store/PapersContext.js'

import { getTeamId } from '@store/papersMethods.js'

import Button from '@components/button'
import Avatar from '@components/avatar'
import Sheet from '@components/sheet'
// import { LoadingBadge } from '@components/loading'

import Styles from './ListPlayersStyles'
import * as Theme from '@theme'

const LoadingStatic = () => (
  <View
    style={{
      width: 40,
      height: 40,
      marginRight: 16,
      paddingTop: 8,
      paddingLeft: 8,
    }}
  >
    {/* <LoadingBadge style={{}} /> */}
    <View
      style={{
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: Theme.colors.grayDark,
        transform: [{ rotate: '45deg' }],
      }}
    />
  </View>
)

export default function ListPlayers({ players, enableKickout, isStatusVisible, ...otherProps }) {
  const Papers = React.useContext(PapersContext)
  const [isClicked, setIsClicked] = React.useState(null) // playerId
  const [isKicking, setIsKicking] = React.useState(null) // playerId
  const [isDeleting, setIsDeleting] = React.useState(false) // playerId
  const { profile, profiles, game } = Papers.state
  const profileId = profile.id
  const profileIsAdmin = game.creatorId === profileId
  const playersSorted = React.useMemo(() => players.sort(), [players]) // TODO - sort this by name #F65
  const playersKeys = Object.keys(game.players || {})
  const hasEnoughPlayers = playersKeys.length >= 4
  const hasTeams = !!game.teams

  if (isDeleting) {
    return (
      // Pff... not the best UI
      <View>
        <Text style={[Theme.typography.h3, Theme.u.center, { marginVertical: 72 }]}>
          Deleting game...
        </Text>
      </View>
    )
  }

  return (
    <View style={Styles.list} {...otherProps}>
      {playersSorted.map((playerId, i) => {
        const isLastChild = i === players.length

        // User left the game, we don't have profile access about them anymore
        // TODO/UX - What should we do in this case? @mmbotelho
        if (!game.players[playerId]) {
          const playerName = profiles[playerId]?.name || 'Ex-player' // playerId
          return (
            <View key={playerId} style={[Styles.item, isLastChild && Styles.item_isLast]}>
              <View style={Styles.who}>
                <LoadingStatic />
                <View>
                  <Text style={[Theme.typography.body, { color: Theme.colors.grayMedium }]}>
                    {playerName}
                  </Text>
                  <Text style={[Theme.typography.seconday, { color: Theme.colors.primary }]}>
                    Left
                  </Text>
                </View>
              </View>
            </View>
          )
        }

        const { avatar, name } = profiles[playerId] || {}
        // const { isAfk } = game.players[playerId]
        const wordsSubmitted = game.words && game.words[playerId]
        const canKickOut = enableKickout && playerId !== profileId && (hasTeams || profileIsAdmin)
        const playerStatus =
          playerId === game.creatorId
            ? playerId === profileId
              ? ''
              : game.hasStarted
              ? ''
              : !hasEnoughPlayers
              ? 'creating' // creating game...
              : !game.teams
              ? 'creating' // creating teams...
              : ''
            : ''

        return (
          <TouchableHighlight
            underlayColor={canKickOut ? Theme.colors.grayLight : 'transparent'}
            onPress={() => (canKickOut ? setIsClicked(playerId) : true)}
            key={playerId}
          >
            <View key={playerId} style={[Styles.item, isLastChild && Styles.item_isLast]}>
              <View style={Styles.who}>
                {!isStatusVisible || (isStatusVisible && wordsSubmitted) ? (
                  <Avatar src={avatar} hasMargin alt="" />
                ) : (
                  <LoadingStatic />
                )}
                <View style={Styles.who_text}>
                  <Text style={Theme.typography.body}>
                    {name}
                    {playerId === profileId && <Text> (you)</Text>}
                  </Text>
                  {playerStatus ? (
                    <Text style={[Theme.typography.badge]}>{playerStatus} </Text>
                  ) : null}
                  {/* {isAfk && (
                    // This seems buggy... remove it for now.
                    <Text style={[Theme.typography.small, { color: Theme.colors.primary }]}>
                      Disconnected
                    </Text>
                  )} */}
                </View>
              </View>
              <View style={Styles.ctas}>
                {canKickOut && Platform.OS === 'web' && (
                  <Button
                    variant="light"
                    size="sm"
                    isLoading={isKicking === playerId}
                    onPress={() => handleKickOut(playerId)}
                  >
                    Kick
                  </Button>
                )}
              </View>
            </View>
          </TouchableHighlight>
        )
      })}

      <Sheet
        visible={!!isClicked}
        onClose={() => setIsClicked(null)}
        list={[
          {
            text: isClicked ? `❌ Remove "${profiles[isClicked].name}"` : '',
            onPress: () => {
              handleKickOut(isKicking)
            },
          },
        ]}
      />
    </View>
  )

  async function handleKickOut(playerId) {
    const playerTeamId = game.teams ? getTeamId(playerId, game.teams) : null
    const playerName = profiles[playerId].name
    const goodTeamSize = playerTeamId ? game.teams[playerTeamId].players.length > 2 : true
    const msg = goodTeamSize
      ? `If you remove ${playerName}, they won't be able to join again.`
      : `If you remove ${playerName} the game will end (min 4 players).`

    async function doIt() {
      if (goodTeamSize) {
        setIsKicking(playerId)
        await Papers.removePlayer(playerId)
        setIsKicking(null)
        setIsClicked(null)
      } else {
        setIsDeleting(true)
        await Papers.deleteGame()
      }
    }

    if (!playerTeamId) {
      doIt() // just remove the player. not a big deal.
    } else if (Platform.OS === 'web') {
      if (window.confirm(msg)) {
        doIt()
      }
    } else {
      Alert.alert(
        'Remove Player',
        msg,
        [
          {
            text: 'Remove',
            onPress: doIt,
            style: 'destructive',
          },
          {
            text: 'Cancel',
            onPress: () => true,
            style: 'cancel',
          },
        ],
        { cancelable: false }
      )
    }
  }
}

ListPlayers.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string), // [playerId],
  enableKickout: PropTypes.bool,
  isStatusVisible: PropTypes.bool,
}
