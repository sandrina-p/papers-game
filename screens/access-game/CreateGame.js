import React from 'react'
import PropTypes from 'prop-types'

import { View, Text, TextInput } from 'react-native'

import PapersContext from '@store/PapersContext.js'
import Page from '@components/page'
import { LoadingBadge } from '@components/loading'
import { headerTheme } from '@navigation/headerStuff.js'
import { slugString } from '@constants/utils.js'

import * as Theme from '@theme'
import Styles from './AccessGameStyles.js'

const i18n = {
  headerTitle: 'New game',
  title: 'Give this party a name',
  description: 'Your friends will use this to join.',
}

const nameMaxSize = 16

export default function CreateGame({ navigation }) {
  const Papers = React.useContext(PapersContext)
  const [isCreating, setCreating] = React.useState(false)
  const [state, setState] = React.useState({
    gameName: '',
    isInvalid: false,
    errorMsg: null,
    isUnexError: false,
  })
  const hasValidName = !state.isInvalid && state.gameName && state.gameName.length >= 3

  React.useEffect(() => {
    navigation.setOptions({
      ...headerTheme(),
      headerTitle: i18n.headerTitle,
      headerLeft: function HLB() {
        return (
          <Page.HeaderBtn side="left" onPress={goHome}>
            Cancel
          </Page.HeaderBtn>
        )
      },
    })
  }, [])

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: hasValidName
        ? function HB() {
            return (
              <Page.HeaderBtn
                side="right"
                icon="next"
                textPrimary
                isLoading={isCreating}
                onPress={submit}
              >
                Next
              </Page.HeaderBtn>
            )
          }
        : null,
    })
  }, [hasValidName, state.gameName, isCreating])

  function handleInputChange(gameName) {
    const isInvalid = slugString(gameName) !== gameName.toLowerCase()

    setState(state => ({
      ...state,
      gameName,
      isInvalid,
    }))
  }

  function submit() {
    if (isCreating) {
      return
    }

    setCreating(true)
    setState(state => ({ ...state, errorMsg: null }))

    Papers.accessGame('create', state.gameName, (res, errorMsg, opts = {}) => {
      if (errorMsg) {
        setCreating(false)
        setState(state => ({
          ...state,
          errorMsg,
          isUnexError: opts.isUnexError,
        }))
      } else {
        // AccessGame.js will detect the new gameId from PapersContext and do the redirect.
      }
    })
  }

  function goHome() {
    navigation.navigate('home')
  }

  return (
    <Page bannerMsg={state.isUnexError && state.errorMsg}>
      <Page.Main headerDivider>
        <View>
          {isCreating ? (
            <LoadingBadge variant="page">Creating game</LoadingBadge>
          ) : (
            <>
              <Text style={[Styles.title, Theme.typography.h3]}>{i18n.title}</Text>

              <TextInput
                style={[Theme.typography.h2, Styles.input]}
                inputAccessoryViewID="name"
                autoFocus
                autoCorrect={false}
                nativeID="inputNameLabel"
                defaultValue={state.gameName}
                placeholder="Choose a name..."
                placeholderTextColor={Theme.colors.grayLight}
                maxLength={nameMaxSize}
                onChangeText={handleInputChange}
              />
              {state.isInvalid && (
                <Text style={[Theme.typography.small, Styles.hintMsg, Styles.errorMsg]}>
                  You can only use letters and numbers.
                </Text>
              )}
              {state.errorMsg && !state.isUnexError && (
                <Text style={[Theme.typography.small, Styles.hintMsg, Styles.errorMsg]}>
                  {state.errorMsg}
                </Text>
              )}
              <View style={Styles.tip}>
                <Text nativeID="inputNameLabel" style={[Theme.typography.small]}>
                  {i18n.description}
                </Text>
                <Text
                  nativeID="inputNameLabel"
                  style={[
                    Theme.typography.small,
                    state.gameName.length === nameMaxSize && {
                      color: Theme.colors.danger,
                    },
                  ]}
                >
                  {state.gameName.length} / {nameMaxSize}
                </Text>
              </View>
            </>
          )}
        </View>
      </Page.Main>
    </Page>
  )
}

CreateGame.propTypes = {
  navigation: PropTypes.object.isRequired, // ReactNavigation
}
