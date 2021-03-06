import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'

import { isTamagoshi, window } from '@constants/layout'

import { IllustrationSmile, IllustrationCry } from '@components/icons'
import * as Theme from '@theme'

const illustrationMap = {
  'paper-cry': IllustrationCry,
  'paper-smile': IllustrationSmile,
}
export default function Card({ variant }) {
  const Illustration = illustrationMap[variant]
  return (
    <View style={Styles.slidePlaceholder}>
      <Illustration />
    </View>
  )
}

Card.defaultProps = {
  variant: 'paper',
}

Card.propTypes = {
  variant: PropTypes.oneOf(['paper-cry', 'paper-smile']),
}

const { vw } = window

const slideHeight = isTamagoshi ? 50 * vw : 70 * vw

const Styles = StyleSheet.create({
  slidePlaceholder: {
    height: slideHeight,
    backgroundColor: Theme.colors.bg,
    borderRadius: 12,
    padding: 15 * vw,
  },
})
