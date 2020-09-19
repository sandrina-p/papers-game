import React from 'react'
import { Platform, View, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import PropTypes from 'prop-types'

import Button from '@components/button'
import Page from '@components/page'
// import i18n from '@constants/i18n'
import { IconCheck, IconTimes } from '@components/icons'

import * as Theme from '@theme'
import Styles from './PlayingStyles.js'

const isWeb = Platform.OS === 'web'

const TurnScore = ({ papersTurn, type, onTogglePaper, onFinish, isSubmitting, getPaperByKey }) => {
  return (
    <Page>
      <Page.Main>
        <View style={Styles.header}>
          <Text style={[Theme.typography.h2, Theme.u.center, { maxWidth: 300 }]}>
            Your team got <Text>{papersTurn.guessed.length}</Text> papers right!
          </Text>
        </View>

        <ScrollView style={[Theme.u.scrollSideOffset, { marginLeft: -16 }]}>
          {papersTurn.sorted.length ? (
            <View style={Styles.tscore_list}>
              {papersTurn.sorted
                .filter(
                  (paper, index) =>
                    // use indexOf to avoid duplicated keys.
                    paper !== undefined && papersTurn.sorted.indexOf(paper) === index
                )
                .map((paper, i) => {
                  const hasGuessed = papersTurn.guessed.includes(paper)
                  const Icon = hasGuessed ? IconCheck : IconTimes

                  return (
                    <ItemToggle
                      key={`${i}_${paper}`}
                      style={[Styles.tscore_item]}
                      onPress={() => onTogglePaper(paper, !hasGuessed)}
                    >
                      {/* Need extra wrapper for web */}
                      <View style={Styles.tscore_start}>
                        <View
                          style={[
                            Styles.tscore_iconArea,
                            Theme.u.middle,
                            {
                              backgroundColor: hasGuessed ? Theme.colors.grayDark : Theme.colors.bg,
                            },
                          ]}
                        >
                          <Icon
                            size={28}
                            color={hasGuessed ? Theme.colors.bg : Theme.colors.grayDark}
                          />
                        </View>
                        <View
                          style={{ width: 16, height: 1 }} // lazyness level 99
                        />
                        <Text
                          style={[
                            Theme.typography.bold,
                            {
                              color: Theme.colors[hasGuessed ? 'grayDark' : 'grayMedium'],
                              textDecorationLine: hasGuessed ? 'none' : 'line-through',
                            },
                          ]}
                        >
                          {getPaperByKey(paper)}
                        </Text>
                      </View>
                    </ItemToggle>
                  )
                })}
            </View>
          ) : (
            <Text style={[Theme.typography.secondary, Theme.u.center, { marginTop: 40 }]}>
              More luck next time...
            </Text>
          )}
        </ScrollView>
      </Page.Main>
      <Page.CTAs hasOffset>
        <Button size="lg" place="float" onPress={onFinish} isLoading={isSubmitting}>
          End turn
        </Button>
      </Page.CTAs>
    </Page>
  )
}

TurnScore.propTypes = {
  papersTurn: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['timesup', 'nowords']).isRequired,
  onTogglePaper: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  getPaperByKey: PropTypes.func.isRequired,
}

function ItemToggle(props) {
  if (!isWeb) {
    return <Button {...props} />
  }

  return (
    <View style={props.style}>
      {props.children}
      <Button variant="light" size="sm" onPress={props.onPress}>
        Change
      </Button>
    </View>
  )
}

ItemToggle.propTypes = {
  children: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.any,
}

export default TurnScore
