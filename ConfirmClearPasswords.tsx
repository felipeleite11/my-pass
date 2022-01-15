import React, { useContext } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import { GlobalContext } from './contexts/GlobalContext'

import { ModalHeader } from './ModalHeader'

export const ConfirmClearPasswords = () => {
	const { handleCloseConfirmClearForm, handleClearPasswords } = useContext(GlobalContext)

	return (
		<View style={styles.container}>
			<ModalHeader 
				title=""
				handleClose={handleCloseConfirmClearForm}
			/>

			<View style={styles.confirmClearIconContainer}>
				<Feather name="alert-triangle" size={70} color="#999" />
			</View>

			<Text style={styles.confirmClearText}>Deseja realmente excluir TODAS AS SENHAS cadastradas?</Text>

			<View style={styles.confirmClearButtonsContainer}>
				<TouchableOpacity
					onPress={handleCloseConfirmClearForm}
					style={{
						...styles.confirmClearButton,
						...styles.confirmClearButtonNo
					}}
				>
					<Text>NÃO</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handleClearPasswords}
					style={{
						...styles.confirmClearButton,
						...styles.confirmClearButtonYes
					}}
				>
					<Text>SIM</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: '#201A30',
		flex: 1
	},
	confirmClearIconContainer: {
		alignItems: 'center'
	},
	confirmClearText: {
		fontSize: 18,
		marginTop: 14,
		textAlign: 'center',
		color: '#FFF'
	},
	confirmClearButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	confirmClearButton: {
		padding: 18,
		marginHorizontal: 14,
		marginTop: 40,
		borderRadius: 10,
		alignItems: 'center'
	},
	confirmClearButtonYes: {
		backgroundColor: '#0df5e3'
	},
	confirmClearButtonNo: {
		backgroundColor: '#de5454'
	}
})