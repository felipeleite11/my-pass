import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

export const FingerprintRequired = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.fingerprintText}>Acesse com sua impressão digital</Text>

			<Ionicons name="finger-print" size={60} style={styles.fingerprintIcon} color="#FFF" />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		backgroundColor: '#201A30'
	},
	fingerprintText: {
		fontSize: 20,
		color: '#FFF'
	},
	fingerprintIcon: {
		marginVertical: 50
	},
	fingerprintContinueButton: {
		color: '#FFF'
	}
})