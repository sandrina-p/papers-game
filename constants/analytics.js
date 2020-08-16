import * as Device from 'expo-device'
import * as Analytics from 'expo-firebase-analytics'

// TODO add support to android.
// TODO!! ask for permission in settings.
// TODO review "Automatically collected events"

export async function logEvent(...args) {
  console.log('📡 logEvent', ...args)
  if (!__DEV__) {
    await Analytics.logEvent(...args)
  }
}

export async function setCurrentScreen(...args) {
  console.log('📡 setCurrentScreen', ...args)
  if (!__DEV__) {
    await Analytics.setCurrentScreen(...args)
  }
}

export async function setUserId(id) {
  console.log('📡 setUserId', id, {
    os: `${Device.osName} || ${Device.osVersion}`,
  })
  if (!__DEV__) {
    await Analytics.setUserId(id)
  }
}
