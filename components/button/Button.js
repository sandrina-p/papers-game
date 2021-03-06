import React, { memo } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import PropTypes from 'prop-types'
import { IconSpin } from '@components/icons'

import * as Theme from '@theme'
import * as Styles from './ButtonStyles.js'

function Button({
  variant,
  size,
  place,
  textColor,
  bgColor,
  loadingColor,
  numberOfLines,
  isLoading,
  children,
  style,
  styleTouch,
  disabled,
  ...otherProps
}) {
  const isIcon = variant === 'icon'
  return (
    <TouchableHighlight
      {...otherProps}
      style={[Styles.touch, styleTouch, place === 'float' && Styles.place_float]}
      activeOpacity={0.5}
      underlayColor="transparent"
      {...(isLoading || disabled ? { disabled: true } : {})}
    >
      <View style={[Styles.btnWrapper({ variant, size, place, bgColor, disabled }), style]}>
        {!isLoading ? (
          isIcon ? (
            children
          ) : (
            <Text
              numberOfLines={numberOfLines}
              style={Styles.btnText({ variant, size, color: textColor })}
            >
              {children}
            </Text>
          )
        ) : (
          <IconSpin size={20} color={loadingColor} />
        )}
      </View>
    </TouchableHighlight>
  )
}

Button.defaultProps = {
  variant: 'primary',
  size: 'default',
  place: null,
}

Button.propTypes = {
  variant: PropTypes.oneOf([
    'primary',
    'success',
    'blank',
    'danger',
    'light',
    'ghost',
    'flat',
    'icon',
  ]),
  size: PropTypes.oneOf(['default', 'sm', 'lg']),
  place: PropTypes.oneOf(['edgeKeyboard', 'float']),
  isLoading: PropTypes.bool,
  children: PropTypes.node,
  numberOfLines: PropTypes.number,

  // Let's give full freedom while this is a prototype and DS is not yet fully defined.
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
  styleTouch: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.number]),
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  loadingColor: PropTypes.string,
  disabled: PropTypes.bool,
}

export default memo(Button)
