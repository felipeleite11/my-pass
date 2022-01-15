import { useContext, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ToastAndroid, ScrollView, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Picker } from '@react-native-picker/picker'

import { ModalHeader } from './ModalHeader'

import { StoredPasswords } from './types'

import { PasswordTypes } from './types'

import { GlobalContext } from './contexts/GlobalContext'

export const AddForm = () => {
	const {
		handleCloseAddForm,
		loadPasswordList
	} = useContext(GlobalContext)

	const [appType, setAppType] = useState(PasswordTypes.LOGIN_PASSWORD)
	const [appTitle, setAppTitle] = useState('')
	const [appUsername, setAppUsername] = useState('')
	const [appPassword, setAppPassword] = useState('')
	const [appLink, setAppLink] = useState('')
	const [appPort, setAppPort] = useState('')
	const [app2FA, setApp2FA] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

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
				type: appType,
				title: appTitle,
				password: appPassword,
				username: appUsername,
				link: appLink,
				'2fa': app2FA,
				port: appPort,
				visible: false,
				preparedToDelete: false
			})

			currentPasswordsString = JSON.stringify(currentPasswords)

			await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)

			handleCloseAddForm()

			ToastAndroid.show('Sua senha foi armazenada com segurança.', ToastAndroid.SHORT)

			loadPasswordList()
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

			<ScrollView 
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.pickerContainer}>
					<Picker
						selectedValue={appType}
						onValueChange={setAppType}
						style={styles.inputPicker}
						mode="dropdown"
						dropdownIconColor="#FFF"
						itemStyle={{ backgroundColor: 'red' }}
					>
						{Object.values(PasswordTypes).map(type => (
							<Picker.Item key={type} label={type} value={type} style={styles.inputPickerItem} />
						))}
					</Picker>
				</View>

				<TextInput 
					onChangeText={setAppTitle}
					value={appTitle}
					style={styles.inputText}
					placeholder="Nome do serviço (ex.: GMail, Nubank)"
					visible-password={showPassword}
					placeholderTextColor="#808080"
				/>

				{appType !== PasswordTypes.PASSWORD_ONLY && (
					<View style={styles.appLinkContainer}>
						<TextInput 
							onChangeText={setAppLink}
							value={appLink}
							style={{
								...styles.inputText,
								...styles.inputTextLink
							}}
							placeholder={appType === PasswordTypes.LOGIN_PASSWORD ? 'Link de acesso' : 'Host (IP ou domínio)'}
							autoCapitalize="none"
							placeholderTextColor="#808080"
						/>

						<Image 
							source={{
								uri: `https://s2.googleusercontent.com/s2/favicons?domain_url=https://${appLink}`
							}} 
							style={styles.appLogoImage}
						/>
					</View>
				)}

				{(appType === PasswordTypes.SSH || appType === PasswordTypes.FTP) && (
					<TextInput 
						onChangeText={setAppPort}
						value={appPort}
						style={styles.inputText}
						placeholder="Porta"
						keyboardType="numeric"
						placeholderTextColor="#808080"
					/>
				)}

				{appType !== PasswordTypes.PASSWORD_ONLY && (
					<TextInput 
						onChangeText={setAppUsername}
						value={appUsername}
						style={styles.inputText}
						placeholder={appType === PasswordTypes.LOGIN_PASSWORD ? 'Login' : 'Usuário'}
						keyboardType="email-address"
						autoCapitalize="none"
						placeholderTextColor="#808080"
					/>
				)}
		
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
						placeholderTextColor="#808080"
					/>

					<TouchableOpacity onPress={() => { setShowPassword(!showPassword) }}>
						<Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color="#FFF" style={styles.togglePasswordVisibilityIcon} />
					</TouchableOpacity>
				</View>

				{appType === PasswordTypes.LOGIN_PASSWORD && (
					<View style={styles.check2FAContainer}>
						<Checkbox
							value={app2FA}
							onValueChange={setApp2FA}
							color={app2FA ? '#38304C' : undefined}
							style={styles.check2faCheckbox}
						/>

						<Text style={styles.check2FAText}>2FA habilitado?</Text>
					</View>
				)}

				<TouchableOpacity style={styles.btnSave} onPress={handleAdd}>
					<Feather name="save" size={24} />
					<Text style={styles.btnSaveText}>Salvar senha</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	addFormContainer: {
	  padding: 20,
	  backgroundColor: '#201A30',
	  flex: 1
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
	pickerContainer: {
		borderWidth: 1,
		borderRadius: 4,
		marginBottom: 20,
		paddingHorizontal: 8,
		borderColor: '#FFF'
	},
	inputPicker: {
		padding: 30,
		color: '#fff'
	},
	inputPickerItem: {
		fontSize: 18
	},
	inputText: {
	  borderWidth: 1,
	  borderColor: '#FFF',
	  fontSize: 18,
	  padding: 16,
	  marginBottom: 20,
	  borderRadius: 4,
	  width: '100%',
	  color: '#FFF'
	},
	inputTextLink: {
		paddingRight: 56
	},
	inputTextPassword: {
	  width: '88%'
	},
	appLinkContainer: {
		flexDirection: 'row'
	}, 
	appLogoImage: {
		width: 26,
		height: 26,
		position: 'relative',
		left: -40,
		top: 18,
		borderRadius: 2
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
		marginLeft: 10,
		color: '#FFF'
	},
	btnSave: {
	  flexDirection: 'row',
	  backgroundColor: '#0df5e3',
	  borderRadius: 30,
	  padding: 16,
	  justifyContent: 'center',
	  marginBottom: 50
	},
	btnSaveText: {
	  fontSize: 16,
	  marginLeft: 8
	}
  })
  
