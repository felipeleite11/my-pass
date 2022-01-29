import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import { List } from './List'

export default function AppContent() {
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#201A30" style="light" />

			<List />
		</SafeAreaView>
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
