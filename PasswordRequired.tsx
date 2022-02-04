import { useRef, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TextInput, ToastAndroid } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { PasswordRequiredProps } from './types'

export const PasswordRequired = ({ callback }: PasswordRequiredProps) => {
	const firstDigitRef = useRef<TextInput>()
	const secondDigitRef = useRef<TextInput>()
	const thirdDigitRef = useRef<TextInput>()
	const fourthDigitRef = useRef<TextInput>()

	const inputDigits = [firstDigitRef, secondDigitRef, thirdDigitRef, fourthDigitRef]

	const [digits, setDigits] = useState('')
	const [loginPassword, setLoginPassword] = useState('')

	async function loadLoginPassword() {
		const loginPasswordString = await AsyncStorage.getItem('@my_pass_login_password')

		if(loginPasswordString) {
			console.log(`Correct login password: ${loginPasswordString}`)
		}

		setLoginPassword(loginPasswordString)
	}

	function clearPassword() {
		setDigits('')
	}

	function checkPassword() {
		console.log(`Inputed password: ${digits}`)

		if(loginPassword === digits) {
			callback()
		} else {
			ToastAndroid.show('Senha incorreta. Tente novamente.', ToastAndroid.SHORT)

			clearPassword()

			firstDigitRef.current.focus()
		}
	}

	useEffect(() => {
		if(loginPassword && digits.length === 4) {
			checkPassword()
		}
	}, [digits, loginPassword])

	useEffect(() => {
		firstDigitRef.current.focus()

		loadLoginPassword()
	}, [])

	return (
		<View style={styles.container}>
			<Text style={styles.fingerprintText}>Acesse com sua senha</Text>

			<MaterialCommunityIcons name="form-textbox-password" size={60} color="#FFF" style={styles.icon} />

			<View style={styles.digitsContainer}>
				<TextInput 
					style={styles.textbox} 
					keyboardType="numeric" 
					secureTextEntry
					ref={firstDigitRef}
					value={digits?.[0] || ''}
					onFocus={() => {
						inputDigits[digits.length].current.focus()
					}}
					onChangeText={text => {
						if(text) {
							secondDigitRef.current.focus()

							setDigits(old => `${old}${text}`)
						}
					}}
				/>

				<TextInput 
					style={styles.textbox} 
					keyboardType="numeric" 
					secureTextEntry
					ref={secondDigitRef}
					value={digits?.[1] || ''}
					onChangeText={text => {
						if(text) {
							thirdDigitRef.current.focus()

							setDigits(old => `${old}${text}`)
						} else {
							firstDigitRef.current.focus()
						}
					}}
					onFocus={() => {
						inputDigits[digits.length].current.focus()
					}}
					onKeyPress={e => {
						if(e.nativeEvent.key === 'Backspace') {
							setDigits('')

							firstDigitRef.current.focus()
						}
					}}
				/>

				<TextInput 
					style={styles.textbox} 
					keyboardType="numeric" 
					secureTextEntry
					ref={thirdDigitRef}
					value={digits?.[2] || ''}
					onChangeText={text => {
						if(text) {
							fourthDigitRef.current.focus()

							setDigits(old => `${old}${text}`)
						} else {
							secondDigitRef.current.focus()
						}
					}}
					onFocus={() => {
						inputDigits[digits.length].current.focus()
					}}
					onKeyPress={e => {
						if(e.nativeEvent.key === 'Backspace') {
							setDigits(old => old[0])

							secondDigitRef.current.focus()
						}
					}}
				/>

				<TextInput 
					style={styles.textbox} 
					keyboardType="numeric" 
					secureTextEntry
					value={digits?.[3] || ''}
					ref={fourthDigitRef}
					onChangeText={text => {
						if(text) {
							setDigits(old => `${old}${text}`)
						}
					}}
					onFocus={() => {
						inputDigits[digits.length].current.focus()
					}}
					onKeyPress={e => {
						if(e.nativeEvent.key === 'Backspace') {
							setDigits(old => old.substring(0, 2))

							thirdDigitRef.current.focus()
						}
					}}
				/>
			</View>
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
	icon: {
		marginVertical: 50
	},
	fingerprintContinueButton: {
		color: '#FFF'
	},
	digitsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '80%',
	},
	textbox: {
		borderWidth: 1,
		borderRadius: 10,
		paddingVertical: 14,
		paddingHorizontal: 18,
		textAlign: 'center',
		borderColor: '#FFF',
		fontSize: 40,
		color: '#FFF'
	}
})