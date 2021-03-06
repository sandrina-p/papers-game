import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, ScrollView, View, Text, TextInput } from 'react-native'

import PapersContext from '@store/PapersContext.js'
import * as Theme from '@theme'

import Page from '@components/page'
import AvatarSelector from '@components/avatar/AvatarSelector'

import Item from './Item.js'
import { useSubHeader, propTypesCommon } from './utils'

export default function SettingsAccount({ navigation }) {
  const Papers = React.useContext(PapersContext)
  const [name, setName] = React.useState('')
  const { profile } = Papers.state
  const defaultAvatar = React.useRef(profile.avatar).current
  useSubHeader(navigation, 'Account')

  function handleOnSelectorChange(avatar) {
    Papers.updateProfile({ avatar })
  }

  return (
    <Page>
      <Page.Main headerDivider>
        <ScrollView style={[Theme.u.scrollSideOffset]}>
          <View style={Theme.u.cardEdge}>
            <AvatarSelector
              value={profile.avatar}
              defaultValue={defaultAvatar}
              onChange={handleOnSelectorChange}
            />

            <View style={Theme.u.listDivider} />

            <View style={[Theme.u.flexBetween, Styles.field]}>
              <Text nativeID="inputNameLabel" style={[Styles.alignLeft, Theme.typography.body]}>
                Name
              </Text>
              <TextInput
                style={Styles.input}
                inputAccessoryViewID="name"
                nativeID="inputNameLabel"
                defaultValue={profile.name}
                maxLength={10}
                returnKeyType="done"
                onChangeText={text => setName(text)}
                onBlur={() => name && Papers.updateProfile({ name })}
              />
            </View>
            <Item
              title="Statistics"
              icon="next"
              onPress={() => navigation.navigate('settings-statistics')}
            />
            <View style={Theme.u.listDivider} />
            <Item
              id="del"
              title="Delete account"
              icon="next"
              onPress={() => navigation.navigate('settings-accountDeletion')}
            />
            <View style={Theme.u.listDivider} />
          </View>
        </ScrollView>
      </Page.Main>
    </Page>
  )
}

SettingsAccount.propTypes = propTypesCommon

const Styles = StyleSheet.create({
  input: {
    borderColor: 'transparent',
    borderWidth: 0,
    padding: 20,
    paddingRight: 8,
    marginTop: 4,
    fontSize: Theme.fontSize.base,
    flexGrow: 1,
    textAlign: 'right',
    color: Theme.colors.grayMedium,
    backgroundColor: Theme.colors.bg,
  },
  field: {
    paddingHorizontal: 16,
  },
})
