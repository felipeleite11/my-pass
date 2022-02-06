import React, { useContext } from 'react'
import { Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

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
		isCheckMode,
		authenticationMethod,
		handleToggleAuthenticationMethod
	} = useContext(GlobalContext)

	return (
		<ScrollView style={styles.container}>
			<ModalHeader 
				title="Opções"
				handleClose={() => { setShowOptions(false) }}
			/>

			<TouchableOpacity 
				onPress={handleToggleProtect}
				style={{
					...styles.optionButtonWithTip,
					...styles.optionButtonCyan
				}}
			>
				<Text style={styles.buttonText}>Exigir autenticação para ver as senhas</Text>

				<Text style={styles.buttonTextTip}>
					{passwordOpenProtectionState ? 'Habilitado' : 'Desabilitado'}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity 
				onPress={handleToggleAuthenticationMethod}
				style={{
					...styles.optionButtonWithTip,
					...styles.optionButtonCyan
				}}
			>
				<Text style={styles.buttonText}>Mudar método de autenticação</Text>

				<Text style={styles.buttonTextTip}>
					{`Atual: ${authenticationMethod.name === 'password' ? 'Senha' : 'Biometria'}`}
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
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		paddingBottom: 50,
		backgroundColor: '#201A30',
		flex: 1
	},
	optionButton: {
		padding: 18,
		marginTop: 20,
		borderRadius: 10,
		justifyContent: 'center',
		flexDirection: 'row'
	},
	optionButtonWithTip: {
		padding: 18,
		marginTop: 20,
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
	buttonContentIcon: {
		marginRight: 6
	},
	buttonText: {
		fontSize: 16,
		color: '#424242',
		width: '100%',
		textAlign: 'center'
	},
	buttonTextTip: {
		fontSize: 10
	}
})