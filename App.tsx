import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { List } from './List'

import GlobalProvider from './contexts/GlobalContext'

export default function App() {
	return (
		<GlobalProvider>
			<SafeAreaView style={styles.container}>
				<StatusBar backgroundColor="#201A30" style="light" />

				<List />
			</SafeAreaView>
		</GlobalProvider>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#201A30'
	}
})
