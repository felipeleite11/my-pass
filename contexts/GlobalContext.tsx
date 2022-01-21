import React, { createContext, useEffect, useState } from 'react'
import { BackHandler, Modal, ToastAndroid, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'

import { GlobalContextProps, ContextProps, StoredPasswords, StoredPassword, PasswordTypes } from '../types'

import { FingerprintRequired } from '../FingerprintRequired'

const ignoreFingerprint = true

export const GlobalContext = createContext<GlobalContextProps>({} as any)

export default function({ children }: ContextProps) {
	const [passwordList, setPasswordList] = useState<StoredPasswords>([])
	const [passwordInEdition, setPasswordInEdition] = useState<StoredPassword|null>(null)
	
	const [showAddForm, setShowAddForm] = useState<boolean>(false)
	const [showOptions, setShowOptions] = useState<boolean>(false)
	const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false)
	const [showFingerprintModal, setShowFingerprintModal] = useState<boolean>(true)
	
	const [fingerprintProtectState, setFingerprintProtectState] = useState<boolean|null>(null)
	
	const [searchText, setSearchText] = useState<string>('')
	const [searchResult, setSearchResult] = useState<StoredPasswords|null>(null)

	const [isCheckMode, setIsCheckMode] = useState<boolean>(false)

	async function handleFingerprintAuthentication(callback: () => void, login = false) {
		if(ignoreFingerprint) {
			callback()
			return
		}
			
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

			callback()
		} else if(login) {
			BackHandler.exitApp()
		} else {
			ToastAndroid.show('Ação cancelada!', ToastAndroid.SHORT)
		}

		setShowFingerprintModal(false)
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

		// Spacer item
		currentPasswords.push({
			type: PasswordTypes.SPACER,
			id: 0,
			title: '',
			username: '',
			password: '',
			link: '',
			port: '',
			'2fa': false,
			visible: false,
			selected: false
		})

		setPasswordList(currentPasswords)

		setSearchResult(currentPasswords)
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
		await handleFingerprintAuthentication(async () => {
			const initialStorageValue = JSON.stringify([])

			await AsyncStorage.setItem('@my_pass_passwords', initialStorageValue)

			ToastAndroid.show('Todas as suas senhas foram excluídas!', ToastAndroid.LONG)

			setShowConfirmClear(false)
			setShowOptions(false)

			loadPasswordList()
		})
	}

	function hideAllPasswords() {
		console.log('Hidding all passwords')

		const passwordListWithAllHidden = passwordList.map(p => ({
			...p,
			visible: false
		}))

		setPasswordList(passwordListWithAllHidden)

		setSearchResult(passwordListWithAllHidden.filter(password => searchResult.map(item => item.id).includes(password.id)))

		setShowOptions(false)
	}

	function handleToggleCheckMode() {
		setIsCheckMode(!isCheckMode)

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

		if(fingerprintProtectEnabled) {
			await handleFingerprintAuthentication(async () => {
				await AsyncStorage.setItem('@my_pass_enable_fingerprint_protect', updatedState)

				setFingerprintProtectState(updatedState === 'Y')
			})
		} else {
			await AsyncStorage.setItem('@my_pass_enable_fingerprint_protect', updatedState)

			setFingerprintProtectState(updatedState === 'Y')
		}
	}

	function alertEmptyList() {
		alert('Você não possui nenhuma senha cadastrada.')
	}

	function handleSearch(search: string) {
		if(!passwordList.length) {
			return
		}

		console.log(`Handling search with "${search}"`)

		const matchedPasswords = passwordList.filter(password => password.title.toLowerCase().indexOf(search.toLowerCase()) >= 0)

		setSearchResult(matchedPasswords)
	}

	function handleClearSearch() {
		console.log('Clearing search')

		setSearchResult(passwordList)

		loadPasswordList()
	}

	function handleEditionClose() {
		setPasswordInEdition(null)
	}

	async function handleDelete(item: StoredPassword) {
		await handleFingerprintAuthentication(async () => {
			let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')

			let currentPasswords = (JSON.parse((currentPasswordsString as string)) as StoredPasswords)
	
			currentPasswords = currentPasswords.filter(p => p.id !== item.id)
	
			currentPasswordsString = JSON.stringify(currentPasswords)
	
			await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)
	
			ToastAndroid.show('A senha foi removida do dispositivo.', ToastAndroid.SHORT)
	
			handleEditionClose()
			
			loadPasswordList()
		})
	}

	async function handleDeleteMultiple() {
		await handleFingerprintAuthentication(async () => {
			let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')

			let currentPasswords = (JSON.parse((currentPasswordsString as string)) as StoredPasswords)

			const itemsToRemoveIds = passwordList.filter(item => item.selected).map(item => item.id)
	
			currentPasswords = currentPasswords.filter(p => !itemsToRemoveIds.includes(p.id))
	
			currentPasswordsString = JSON.stringify(currentPasswords)
	
			await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)
	
			ToastAndroid.show('As senhas selecionadas foram removidas do sipositivo.', ToastAndroid.SHORT)
	
			loadPasswordList()
		})
	}

	async function handleUpdate(item: StoredPassword) {
		await handleFingerprintAuthentication(async () => {
			await updateItem(item)

			ToastAndroid.show('Sua senha foi atualizada com segurança.', ToastAndroid.SHORT)

			handleEditionClose()
		
			loadPasswordList()
		})
	}

	async function updateItem(item: StoredPassword) {
		let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')
			
		let currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)

		const itemToUpdate = currentPasswords.find(password => password.id === item.id)

		Object.assign(itemToUpdate, item)

		currentPasswords = [
			...currentPasswords.filter(password => password.id !== itemToUpdate.id),
			itemToUpdate
		]

		currentPasswordsString = JSON.stringify(currentPasswords)

		await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)

		loadPasswordList()
	}

	async function disableCheckMode() {
		setIsCheckMode(false)

		let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')
			
		const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)

		const noSelecteds = currentPasswords.map(password => ({
			...password,
			selected: false
		}))
		
		currentPasswordsString = JSON.stringify(noSelecteds)

		await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)
	}

	async function handleToggleSelectAll(status: boolean) {
		console.log(`Change select all state to: ${status}`)

		let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')
			
		const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)

		const noSelecteds = currentPasswords.map(password => ({
			...password,
			selected: status
		}))
		
		currentPasswordsString = JSON.stringify(noSelecteds)

		await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)

		setPasswordList(noSelecteds)

		setSearchResult(noSelecteds)
	}

	useEffect(() => {
		console.log('START ===============================')

		handleFingerprintAuthentication(() => {
			loadPasswordList()
		
			loadFingerprintProtectState()
		}, true)
	}, [])

	useEffect(() => {
		if(showAddForm) {
			hideAllPasswords()
		}
	}, [showAddForm])

	useEffect(() => {
		handleSearch(searchText)
	}, [searchText])

	useEffect(() => {
		const backAction = () => {
			disableCheckMode()

		  	return true
		}
	
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
	
		return () => backHandler.remove()
	}, [])

	useEffect(() => {
		if(isCheckMode) {
			console.log('Enable select mode')
			
			const passwordListWithAllHidden = passwordList.map(p => ({
				...p,
				visible: false
			}))
	
			setPasswordList(passwordListWithAllHidden)
	
			setSearchResult(passwordListWithAllHidden.filter(password => searchResult.map(item => item.id).includes(password.id)))

			loadPasswordList()
		}
	}, [isCheckMode])

	return (
		<GlobalContext.Provider 
			value={{
				passwords: passwordList,
				passwordInEdition,
				
				setPasswords: setPasswordList,
				setPasswordInEdition,
				setSearchText,
				setShowOptions,
				setIsCheckMode,

				showAddForm,
				showOptions,
				showConfirmClear,
				showFingerprintModal,
				
				handleFingerprintAuthentication,
				handleEditionClose,
				handleAdd,
				handleCloseAddForm,
				handleCloseConfirmClearForm,
				handleToggleVisibility,
				handleConfirmClearPasswords,
				handleClearPasswords,
				handleDelete,
				handleDeleteMultiple,
				handleUpdate,
				handleClearSearch,
				handleToggleFingerprintProtect,
				handleToggleCheckMode,
				
				loadPasswordList,
				hideAllPasswords,
				fingerprintProtectState,
				alertEmptyList,
				searchResult,
				searchText,
				isCheckMode,
				updateItem,
				handleToggleSelectAll
			}}
		>
			{children}

			<Modal
				visible={showFingerprintModal}
				animationType="slide"
				onRequestClose={() => { setShowFingerprintModal(false) }}
			>
				<FingerprintRequired />
			</Modal>

		</GlobalContext.Provider>
	)
}
