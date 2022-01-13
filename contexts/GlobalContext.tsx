import React, { createContext, useEffect, useState } from 'react'
import { StyleSheet, Modal, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'

import { GlobalContextProps, ContextProps, StoredPasswords, StoredPassword } from '../types'  
import { Ionicons } from '@expo/vector-icons'

export const GlobalContext = createContext<GlobalContextProps>({} as any)

export default function({ children }: ContextProps) {
	const [showAddForm, setShowAddForm] = useState<boolean>(false)
	const [passwordList, setPasswordList] = useState<StoredPasswords>([])
	const [showOptions, setShowOptions] = useState<boolean>(false)
	const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false)
	const [fingerprintProtectState, setFingerprintProtectState] = useState<boolean|null>(null)
	const [showFingerprintModal, setShowFingerprintModal] = useState<boolean>(true)

	async function handleFingerprintAuthentication(callback: () => void, login = false) {
		console.log('Waiting fingerprint authentication...')

		setShowFingerprintModal(true)

		const fingerprintSupported = await LocalAuthentication.hasHardwareAsync()

		const hasAvailableFingerprints = await LocalAuthentication.isEnrolledAsync()

		if(!fingerprintSupported || !hasAvailableFingerprints) {
			setShowFingerprintModal(false)

			callback()

			return
		}

		const authResult = await LocalAuthentication.authenticateAsync({
			promptMessage: login ? 'Login com impressão digital' : 'Confirme sua identidade',
			cancelLabel: 'Cancelar'
		})

		if(authResult.success) {
			console.log('Authentication successful!')

			setShowFingerprintModal(false)

			callback()
		} else {
			ToastAndroid.show('Autenticação cancelada!', ToastAndroid.SHORT)
		}
	}

	async function loadPasswordList() {
		const currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')
	
		if(!currentPasswordsString) {
		  return
		}
	
		const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)
	
		currentPasswords.sort((a, b) => {
			if(a.title < b.title) {
			  	return -1
			}
			if(a.title > b.title) {
			  	return 1
			}
			return 0
		})

		setPasswordList(currentPasswords)
	}

	function handleAdd() {
		setShowAddForm(true)
	}

	function handleCloseAddForm() {
		setShowAddForm(false)
	}

	function handleCloseConfirmClearForm() {
		setShowConfirmClear(false)
	}

	function handleToggleVisibility(id: number) {
		const item = (passwordList.find(p => p.id === id) as StoredPassword)

		item.visible = !item.visible
		
		const currentPasswords = [
			...passwordList.filter(p => p.id !== id),
			item
		]

		currentPasswords.sort((a, b) => {
			if(a.title < b.title) {
			  	return -1
			}
			if(a.title > b.title) {
			  	return 1
			}
			return 0
		})

		setPasswordList(currentPasswords)
	}

	function handleConfirmClearPasswords() {
		setShowConfirmClear(true)
	}

	async function handleClearPasswords() {
		const initialStorageValue = JSON.stringify([])

		await AsyncStorage.setItem('@my_pass_passwords', initialStorageValue)

		ToastAndroid.show('Todas as suas senhas foram excluídas!', ToastAndroid.LONG)

		setShowConfirmClear(false)
		setShowOptions(false)

		loadPasswordList()
	}

	function hideAllPasswords() {
		setPasswordList(passwordList.map(p => ({
			...p,
			visible: false
		})))

		setShowOptions(false)
	}

	async function loadFingerprintProtectState() {
		const finterprintProtect = await AsyncStorage.getItem('@my_pass_enable_fingerprint_protect')

		setFingerprintProtectState(finterprintProtect === 'Y')
	}

	async function handleToggleFingerprintProtect() {
		const finterprintProtect = await AsyncStorage.getItem('@my_pass_enable_fingerprint_protect')

		const fingerprintProtectEnabled = finterprintProtect === 'Y'
		const updatedState = fingerprintProtectEnabled ? 'N' : 'Y'

		await AsyncStorage.setItem('@my_pass_enable_fingerprint_protect', updatedState)

		setFingerprintProtectState(updatedState === 'Y')
	}

	function handleContinueWithoutFingerprint() {
		setShowFingerprintModal(false)
	}

	async function togglePrepareToDelete(item: StoredPassword) {
		console.log(`Setting prepareToDelete state of "${item.title}" to ${!item.preparedToDelete}`)

		const currentPasswords = [
			...passwordList.filter(password => password.id !== item.id),
			{
				...item,
				preparedToDelete: item.preparedToDelete ? !item.preparedToDelete : true
			}
		]

		currentPasswords.sort((a, b) => {
			if(a.title < b.title) {
			  	return -1
			}
			if(a.title > b.title) {
			  	return 1
			}
			return 0
		})

		setPasswordList(currentPasswords)
	}

	useEffect(() => {
		console.log('START ===============================')

		// handleFingerprintAuthentication(() => {}, true)

		loadPasswordList()
		
		loadFingerprintProtectState()
	}, [])

	useEffect(() => {
		if(showAddForm) {
			hideAllPasswords()
		}
	}, [showAddForm])

	return (
		<GlobalContext.Provider 
			value={{
				handleFingerprintAuthentication,
				passwords: passwordList,
				setPasswords: setPasswordList,
				showAddForm,
				showOptions,
				showConfirmClear,
				loadPasswordList,
				handleAdd,
				handleCloseAddForm,
				handleCloseConfirmClearForm,
				handleToggleVisibility,
				handleConfirmClearPasswords,
				handleClearPasswords,
				hideAllPasswords,
				setShowOptions,
				fingerprintProtectState,
				handleToggleFingerprintProtect,
				showFingerprintModal,
				togglePrepareToDelete
			}}
		>
			{children}

			<Modal
				visible={showFingerprintModal}
				animationType="slide"
				onRequestClose={() => { setShowFingerprintModal(false) }}
			>
				<View style={styles.fingerprintContainer}>
					<Text style={styles.fingerprintText}>Acesse com sua impressão digital</Text>

					<Ionicons name="finger-print" size={60} style={styles.fingerprintIcon} color="#FFF" />

					<TouchableOpacity onPress={handleContinueWithoutFingerprint}>
						<Text style={styles.fingerprintContinueButton}>Pular autenticação</Text>
					</TouchableOpacity>
				</View>
			</Modal>

		</GlobalContext.Provider>
	)
}

const styles = StyleSheet.create({
	fingerprintContainer: {
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