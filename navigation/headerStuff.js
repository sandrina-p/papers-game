import * as Theme from '@theme'

import { statusBarHeight } from '@constants/layout'

export const headerTheme = (opts = {}) => ({
  headerTintColor: Theme.colors.grayMedium,
  headerStatusBarHeight: statusBarHeight,
  headerStyle: {
    // Note: the "border" is actually "headerDivider" prop
  },
  headerTransparent: true, // Do globally to avoid jumps in screens
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: 'Karla-Regular',
    opacity: opts.hiddenTitle ? 0 : 1,
    fontSize: 16,
  },
  headerRight: null,
  headerLeft: null,
})
