import React from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'

import * as Theme from '@theme'
import Styles from '../PlayingStyles.js'

const podiumMap = {
  0: '1st place',
  1: '2nd place',
  3: '3rd place', // REVIEW - Maximum 3 teams
}

const CardScore = ({ index, teamName, scoreTotal, scoreRound, bestPlayer }) => (
  <View style={Styles.fscore_item} key={index}>
    <View style={Styles.fscore_info}>
      <Text
        style={[
          Styles.fscore_tag,
          {
            backgroundColor: index === 0 ? Theme.colors.primary : Theme.colors.grayDark,
            marginBottom: 8,
          },
        ]}
      >
        {podiumMap[index]}
      </Text>
      <Text style={Theme.typography.h3}>{teamName}</Text>
      <Text style={Theme.typography.small}>
        {bestPlayer.name} was the best player! ({bestPlayer.score})
      </Text>
    </View>
    <View style={Styles.fscore_score}>
      <Text style={Theme.typography.small}>Papers</Text>
      <Text style={Theme.typography.h1}>{scoreTotal}</Text>
      <Text style={Theme.typography.small}>+{scoreRound} this round</Text>
    </View>
  </View>
)

CardScore.propTypes = {
  index: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  scoreTotal: PropTypes.number.isRequired,
  scoreRound: PropTypes.number.isRequired,
  bestPlayer: PropTypes.shape({
    name: PropTypes.string,
    score: PropTypes.number,
  }).isRequired,
}

export default CardScore
