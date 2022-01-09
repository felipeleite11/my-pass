import { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ToastAndroid } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { ModalHeader } from './ModalHeader'

import { StoredPasswords, AddFormProps} from './types'

export const AddForm = ({ handleCloseAddForm, reload }: AddFormProps) => {
	const [showPassword, setShowPassword] = useState(false)
	const [appTitle, setAppTitle] = useState('')
	const [appUsername, setAppUsername] = useState('')
	const [appPassword, setAppPassword] = useState('')
	const [appLink, setAppLink] = useState('')
	const [app2FA, setApp2FA] = useState(false)

	async function handleAdd() {
		try {
			let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')

			if(!currentPasswordsString) {
				const initialStorageValue = JSON.stringify([])

				await AsyncStorage.setItem('@my_pass_passwords', initialStorageValue)

				currentPasswordsString = initialStorageValue
			}

			const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)

			const lastId = currentPasswords[currentPasswords.length - 1]?.id || 1

			currentPasswords.push({
				id: lastId + 1,
				title: appTitle,
				password: appPassword,
				username: appUsername,
				link: appLink,
				'2fa': app2FA,
				visible: false
			})

			currentPasswordsString = JSON.stringify(currentPasswords)

			await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)

			handleCloseAddForm()

			ToastAndroid.show('Sua senha foi armazenada com segurança.', ToastAndroid.SHORT)

			reload()
		} catch(e) {
			alert((e as Error).message)
		}
	}

	return (
		<View style={styles.addFormContainer}>
			<ModalHeader 
				title="Adicionar senha"
				handleClose={handleCloseAddForm}
			/>

			<TextInput 
				onChangeText={setAppTitle}
				value={appTitle}
				style={styles.inputText}
				placeholder="Nome do serviço (ex.: GMail, Nubank)"
				visible-password={showPassword}
			/>

			<TextInput 
				onChangeText={setAppLink}
				value={appLink}
				style={styles.inputText}
				placeholder="Link de acesso"
			/>

			<TextInput 
				onChangeText={setAppUsername}
				value={appUsername}
				style={styles.inputText}
				placeholder="E-mail ou nome de usuário"
				keyboardType="email-address"
			/>
	
			<View style={styles.passwordContainer}>
				<TextInput 
					onChangeText={setAppPassword}
					value={appPassword}
					style={{
						...styles.inputText,
						...styles.inputTextPassword
					}}
					placeholder="Senha"
					secureTextEntry={!showPassword}
				/>

				<TouchableOpacity onPress={() => { setShowPassword(!showPassword) }}>
					<Feather name={showPassword ? 'eye-off' : 'eye'} size={30} style={styles.togglePasswordVisibilityIcon} />
				</TouchableOpacity>
			</View>

			<View style={styles.check2FAContainer}>
				<Checkbox
					value={app2FA}
					onValueChange={setApp2FA}
					color={app2FA ? '#4630EB' : undefined}
					style={styles.check2faCheckbox}
				/>

				<Text style={styles.check2FAText}>2FA habilitado?</Text>
			</View>

			<TouchableOpacity style={styles.btnSave} onPress={handleAdd}>
				<Feather name="save" size={24} />
				<Text style={styles.btnSaveText}>Salvar senha</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  alignItems: 'center',
	  justifyContent: 'center',
	  borderStyle: 'solid',
	  borderWidth: 1,
	  borderColor: 'red'
	},
	content: {
	  flex: 1,
	  width: '100%',
	  paddingTop: 50
	},
	list: {
	  paddingHorizontal: 20
	},
	fabContainer: {
	  right: 30,
	  bottom: 30,
	  position: 'absolute'
	},
	fab: {
	  backgroundColor: 'gold',
	  width: 60,
	  height: 60,
	  borderRadius: 30,
	  justifyContent: 'center',
	  alignItems: 'center',
	  shadowColor: 'rgba(0, 0, 0, 0.1)',
	  shadowOpacity: 0.8,
	  elevation: 6,
	  shadowRadius: 15 ,
	  shadowOffset : { width: 1, height: 13}
	},
	addFormContainer: {
	  padding: 20
	},
	passwordContainer: {
	  flexDirection: 'row',
	  alignItems: 'center'
	},
	togglePasswordVisibilityIcon: {
	  position: 'relative',
	  left: 10,
	  top: -10
	},
	inputText: {
	  borderWidth: 1,
	  fontSize: 18,
	  padding: 16,
	  marginBottom: 20,
	  borderRadius: 4,
	  width: '100%'
	},
	inputTextPassword: {
	  width: '88%'
	},
	check2FAContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 20
	},
	check2faCheckbox: {
		height: 24,
		width: 24
	},
	check2FAText: {
		fontSize: 16,
		marginLeft: 10
	},
	btnSave: {
	  flexDirection: 'row',
	  backgroundColor: '#4caf50',
	  borderRadius: 4,
	  padding: 16,
	  justifyContent: 'center'
	},
	btnSaveText: {
	  fontSize: 16,
	  marginLeft: 8
	}
  })
  
