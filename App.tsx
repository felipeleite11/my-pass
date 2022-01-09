import React from 'react'
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { List } from './List'

import GlobalProvider from './contexts/GlobalContext'

export default function App() {
  return (
    <GlobalProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" />

        <List />
      </SafeAreaView>
    </GlobalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
