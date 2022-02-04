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
		handleToggleProtect,
		passwordOpenProtectionState,
		hideAllPasswords,
		handleToggleCheckMode,
		isCheckMode
	} = useContext(GlobalContext)

	return (
		<View style={styles.container}>
			<ModalHeader 
				title="Opções"
				handleClose={() => { setShowOptions(false) }}
			/>

			<TouchableOpacity 
				onPress={handleToggleProtect}
				style={{
					...styles.optionButton,
					...styles.optionButtonCyan
				}}
			>
				<Text style={styles.buttonText}>Proteger senhas com digital</Text>

				<Text style={styles.fingerprintProtectButtonTextTip}>
					{passwordOpenProtectionState ? 'Habilitado' : 'Desabilitado'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity 
				onPress={hideAllPasswords}
				style={{
					...styles.optionButton,
					...styles.optionButtonCyan
				}}
			>
				<Text style={styles.buttonText}>Esconder todas as senhas</Text>
			</TouchableOpacity>

			<TouchableOpacity 
				onPress={handleToggleCheckMode}
				style={{
					...styles.optionButton,
					...styles.optionButtonCyan
				}}
			>
				<Text style={styles.buttonText}>
					{`${isCheckMode ? 'Desativar' : 'Ativar'} modo seleção`}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity 
				onPress={passwords.length ? handleConfirmClearPasswords : alertEmptyList}
				style={{
					...styles.optionButton,
					...styles.optionButtonRed
				}}
			>
				<Text style={styles.removeAllButtonText}>Excluir todas as senhas</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		backgroundColor: '#201A30',
		flex: 1
	},
	optionButton: {
		padding: 18,
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
	buttonText: {
		fontSize: 16,
		color: '#424242'
	},
	fingerprintProtectButtonTextTip: {
		fontSize: 10
	}
})