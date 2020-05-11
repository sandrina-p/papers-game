import React from 'react'
import { View } from 'react-native'
import Button from '@components/button'
import SettingsModal from './SettingsModal'

export default function SettingsToggle(props) {
  const [isOpen, setOpen] = React.useState(false)

  return (
    <View {...props}>
      <SettingsModal isOpen={isOpen} onClose={() => setOpen(false)} />
      <Button variant="icon" accessibilityLabel="Settings Menu" onPress={() => setOpen(true)}>
        ⚙️
      </Button>
    </View>
  )
}
