import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity } from 'react-native'

import PapersContext from '@store/PapersContext.js'

import * as Theme from '@theme'
import Styles from './HomeStyles.js'

import { headerTheme } from '@navigation/headerStuff.js'
import * as avatars from '@components/avatar/Illustrations'

import Avatar from '@components/avatar'
import Button from '@components/button'
import Bubbling from '@components/bubbling'
import Page from '@components/page'

function HeaderMenu({ name, onPress }) /* eslint-disable-line */ {
  return (
    <TouchableOpacity style={{ paddingRight: 24, paddingBottom: 10 }} onPress={onPress}>
      <Text style={Theme.typography.body}>Menu</Text>
    </TouchableOpacity>
  )
}

// function HeaderAvatar({ avatar, onPress }) /* eslint-disable-line */ {
//   return (
//     <TouchableOpacity style={{ paddingRight: 24, paddingBottom: 15 }} onPress={onPress}>
//       <Avatar src={avatar} alt="Settings" />
//     </TouchableOpacity>
//   )
// }

export default function HomeSigned({ navigation }) {
  const Papers = React.useContext(PapersContext)
  const { profile } = Papers.state
  const avatarBg = avatars[profile.avatar]?.bgColor

  React.useEffect(() => {
    navigation.setOptions({
      ...headerTheme({
        hiddenBorder: true,
        hiddenTitle: true,
        bgColor: Theme.colors.purple,
      }),
      // headerLeft: function HBS() {
      //   return profile.name ? <HeaderName name={profile.name} onPress={goSettings} /> : null
      // },
      headerTitle: profile.name ? 'Home' : 'Create Profile',
      headerRight: function HBS() {
        return profile.name ? <HeaderMenu name={profile.name} onPress={goSettings} /> : null
      },
    })
  }, [profile.name, profile.avatar])

  function goSettings() {
    navigation.navigate('settings')
  }

  return (
    <Page bgFill={avatarBg}>
      <Bubbling bgStart={Theme.colors.bg} bgEnd={avatarBg} />
      <Page.Main headerDivider style={[Styles.main_signed]}>
        <Avatar src={profile.avatar} stroke={0} size="xxxl" />
        <Text style={[Theme.typography.h3]}>{profile.name}</Text>
      </Page.Main>
      <Page.CTAs>
        <Button variant="blank" onPress={() => openAccessGameModal('create')}>
          Create Game
        </Button>
        <Button
          // variant="light"
          style={{ marginTop: 16 }}
          onPress={() => openAccessGameModal('join')}
        >
          Join
        </Button>
        <TouchableOpacity
          style={[Styles.CTAtutorial, Theme.u.middle]}
          onPress={() => navigation.navigate('tutorial')}
        >
          <Text style={[Theme.typography.body, Styles.CTAtutorial_text]}>How to play</Text>
        </TouchableOpacity>
      </Page.CTAs>
    </Page>
  )

  function openAccessGameModal(variant) {
    navigation.navigate('access-game', { variant })
  }
}

HomeSigned.propTypes = {
  navigation: PropTypes.object, // reactNavigation
}
