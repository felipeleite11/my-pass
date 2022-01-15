import React, { useContext } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import { GlobalContext } from './contexts/GlobalContext'
import { ModalHeader } from './ModalHeader'

export const Options = () => {
	const {
		passwords,
		handleConfirmClearPasswords,
		alertEmptyList,
		setShowOptions,
		handleToggleFingerprintProtect,
		fingerprintProtectState,
		hideAllPasswords
	} = useContext(GlobalContext)

	return (
		<View style={styles.container}>
			<ModalHeader 
				title="Opções"
				handleClose={() => { setShowOptions(false) }}
			/>

			<TouchableOpacity 
				onPress={passwords.length ? handleConfirmClearPasswords : alertEmptyList}
				style={{
					...styles.optionButton,
					...styles.optionButtonRed
				}}
			>
				<Text style={styles.removeAllButtonText}>Excluir todas as senhas</Text>
			</TouchableOpacity>

			<TouchableOpacity 
				onPress={hideAllPasswords}
				style={{
					...styles.optionButton,
					...styles.optionButtonCyan
				}}
			>
				<Text style={styles.hideAllButtonText}>Esconder todas as senhas</Text>
			</TouchableOpacity>

			<TouchableOpacity 
				onPress={handleToggleFingerprintProtect}
				style={{
					...styles.optionButton,
					...styles.optionButtonYellow
				}}
			>
				<Text style={styles.fingerprintProtectButtonText}>Proteger senhas com digital</Text>

				<Text style={styles.fingerprintProtectButtonTextTip}>
					{fingerprintProtectState !== null ? fingerprintProtectState ? 'Habilitado' : 'Desabilitado' : ''}
				</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: '#201A30',
		flex: 1
	},
	optionButton: {
		padding: 18,
		marginHorizontal: 14,
		marginTop: 40,
		borderRadius: 10,
		alignItems: 'center'
	},
	optionButtonRed: {
		backgroundColor: '#de5454'
	},
	optionButtonCyan: {
		backgroundColor: '#0df5e3'
	},
	optionButtonYellow: {
		backgroundColor: '#f7fa5a'
	},
	removeAllButtonText: {
		fontSize: 16,
		color: '#FFF'
	},
	hideAllButtonText: {
		fontSize: 16
	},
	fingerprintProtectButtonText: {
		fontSize: 16
	},
	fingerprintProtectButtonTextTip: {
		fontSize: 10
	}
})