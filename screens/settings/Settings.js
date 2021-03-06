import React from 'react'
import { ScrollView, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import PropTypes from 'prop-types'

import * as Analytics from '@constants/analytics.js'

import PapersContext from '@store/PapersContext.js'
import * as Theme from '@theme'

import { headerTheme } from '@navigation/headerStuff.js'
import Page from '@components/page'
import ListTeams from '@components/list-teams'

import SettingsProfile from './SettingsProfile.js'
import SettingsGame from './SettingsGame.js'
import SettingsProfileAvatar from './SettingsProfileAvatar.js'
// import Account from './Account.js'
import AccountDeletion from './AccountDeletion.js'
import Experimental from './Experimental.js'
import Feedback from './Feedback.js'
import Privacy from './Privacy.js'
import Purchases from './Purchases.js'
import Statistics from './Statistics.js'
import SettingSoundAnimations from './SettingsSoundAnimations.js'

import { propTypesCommon, useSubHeader } from './utils'

const Stack = createStackNavigator()

export default function Settings(props) {
  const Papers = React.useContext(PapersContext)
  const { game } = Papers.state

  React.useEffect(() => {
    Analytics.setCurrentScreen('settings')
  }, [])

  return (
    <Stack.Navigator headerMode="none">
      {game ? (
        <>
          <Stack.Screen name="settings-game" component={SettingsGame} />
          <Stack.Screen name="settings-players" component={SettingsPlayers} />
        </>
      ) : null}
      <Stack.Screen name="settings-profile" component={SettingsProfile} />
      <Stack.Screen name="settings-profile-avatar" component={SettingsProfileAvatar} />
      {/* <Stack.Screen name="settings-account" component={Account} /> */}
      <Stack.Screen name="settings-accountDeletion" component={AccountDeletion} />
      <Stack.Screen name="settings-privacy" component={Privacy} />
      <Stack.Screen name="settings-purchases" component={Purchases} />
      <Stack.Screen name="settings-experimental" component={Experimental} />

      <Stack.Screen name="settings-statistics" component={Statistics} />
      <Stack.Screen name="settings-feedback" component={Feedback} />
      <Stack.Screen name="settings-sound" component={SettingSoundAnimations} />
      <Stack.Screen name="settings-credits" component={SettingsCredits} />
    </Stack.Navigator>
  )
}

Settings.propTypes = {
  navigation: PropTypes.object.isRequired, // react-navigation
}

// ======

function SettingsCredits({ navigation }) {
  useSubHeader(navigation, 'Acknowledgements')

  return (
    <Page>
      <Page.Main headerDivider style={{ paddingTop: 24 }}>
        <ScrollView>
          <Text style={Theme.typography.body}>TODO!!: Acknowledgments on the way...</Text>
        </ScrollView>
      </Page.Main>
    </Page>
  )
}
SettingsCredits.propTypes = propTypesCommon

// ======

function SettingsPlayers({ navigation }) {
  useSubHeader(navigation, 'Players')

  return (
    <Page>
      <Page.Main style={{ paddingTop: 16 }}>
        <ScrollView>
          <ListTeams enableKickout />
        </ScrollView>
      </Page.Main>
    </Page>
  )
}

SettingsPlayers.propTypes = propTypesCommon
