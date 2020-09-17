import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import PropTypes from 'prop-types'

import * as Theme from '@theme'

export default function Avatar({ src, alt, hasMargin, size, ...otherProps }) {
  const Tag = src ? Image : View

  return (
    <Tag
      {...(src
        ? {
            source: { uri: src },
            accessibilityLabel: '',
          }
        : {})}
      style={[
        Styles.avatar,
        src && { resizeMode: 'cover' },
        hasMargin && Styles.margin,
        Styles[`size_${size}`],
      ]}
      {...otherProps}
    />
  )
}

Avatar.defaultProps = {
  size: 'md',
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  hasMargin: PropTypes.bool,
  size: PropTypes.string,
}

const Styles = StyleSheet.create({
  avatar: {
    backgroundColor: Theme.colors.primaryLight,
    borderColor: Theme.colors.grayDark,
    borderWidth: 2,
  },
  margin: {
    marginRight: 16,
  },
  size_md: {
    width: 40,
    height: 40,
  },
  size_lg: {
    width: 56,
    height: 56,
  },
})
