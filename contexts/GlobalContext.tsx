import React, { createContext, useEffect, useState } from 'react'
import { BackHandler, Modal, ToastAndroid } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'

import { GlobalContextProps, ContextProps, StoredPasswords, StoredPassword, PasswordTypes, AuthenticationModalData, AuthenticationMethod } from '../types'

import { FingerprintRequired } from '../FingerprintRequired'
import { PasswordRequired } from '../PasswordRequired'

import { storeTestPasswords } from '../test-passwords'

const ignoreInitialAuthentication = false

export const GlobalContext = createContext<GlobalContextProps>({} as any)

export default function({ children }: ContextProps) {
	const [passwordList, setPasswordList] = useState<StoredPasswords>([])
	const [passwordInEdition, setPasswordInEdition] = useState<StoredPassword|null>(null)
	
	const [showAddForm, setShowAddForm] = useState<boolean>(false)
	const [showOptions, setShowOptions] = useState<boolean>(false)
	const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false)
	const [showAuthenticationModal, setShowAuthenticationModal] = useState<boolean>(!ignoreInitialAuthentication)
	
	const [passwordOpenProtectionState, setPasswordOpenProtectionState] = useState<boolean|null>(null)
	
	const [searchText, setSearchText] = useState<string>('')
	const [searchResult, setSearchResult] = useState<StoredPasswords|null>(null)

	const [isCheckMode, setIsCheckMode] = useState<boolean>(false)

	const [authenticationMethod, setAuthenticationMethod] = useState<AuthenticationMethod|null>(null)
	const [authenticationModalData, setAuthenticationModalData] = useState<AuthenticationModalData|null>(null)
	
	async function handleAuthenticatedAction(callback: () => void, login = false) {
		if(!ignoreInitialAuthentication) {
			setAuthenticationModalData({
				open: true,
				method: authenticationMethod,
				callback: () => {
					setAuthenticationModalData({
						open: false
					})

					callback()
				}
			})
		}

		if(authenticationMethod.name === 'fingerprint') {
			handleFingerprintAuthentication(callback, login)
		} else {
			handlePasswordAuthentication(login)
		}
	}

	async function handleFingerprintAuthentication(callback: () => void, login = false) {
		if(ignoreInitialAuthentication && login) {
			callback()
			return
		}
			
		const fingerprintSupported = await LocalAuthentication.hasHardwareAsync()

		const hasAvailableFingerprints = await LocalAuthentication.isEnrolledAsync()

		if(!fingerprintSupported || !hasAvailableFingerprints) {
			console.log('Fingerprint authentication is not supported...')

			return
		}

		setShowAuthenticationModal(true)

		console.log('Waiting fingerprint authentication...')

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

		setShowAuthenticationModal(false)
	}

	async function handlePasswordAuthentication(login = false) {
		setShowAuthenticationModal(true)

		console.log('Waiting password authentication...')

		if(login) {
			BackHandler.exitApp()
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

		// Spacer item
		currentPasswords.push({
			type: PasswordTypes.SPACER,
			id: 0,
			title: '',
			username: '',
			password: '',
			link: '',
			database: '',
			port: '',
			'2fa': false,
			visible: false,
			selected: false
		})

		setPasswordList(currentPasswords)

		setSearchResult(currentPasswords)
	}

	async function loadAuthenticationMethod() {
		const authMethodString = await AsyncStorage.getItem('@my_pass_auth_method')
	
		if(!authMethodString) {
			const defaultAuthMethod: AuthenticationMethod = {
				name: 'password'
			}

			await AsyncStorage.setItem('@my_pass_auth_method', JSON.stringify(defaultAuthMethod))
		}
	
		const authMethod = (JSON.parse(authMethodString) as AuthenticationMethod)

		console.log(`${authMethod.name.toUpperCase()} is the default authentication method`)

		setAuthenticationMethod(authMethod)
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
		await handleAuthenticatedAction(async () => {
			const initialStorageValue = JSON.stringify([])

			await AsyncStorage.setItem('@my_pass_passwords', initialStorageValue)

			ToastAndroid.show('Todas as suas senhas foram excluídas!', ToastAndroid.LONG)

			setShowConfirmClear(false)
			setShowOptions(false)

			loadPasswordList()
		})
	}

	async function hideAllPasswords() {
		console.log('Hidding all passwords')

		let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')
			
		const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)

		const noVisibles = currentPasswords.map(password => ({
			...password,
			visible: false
		}))
		
		currentPasswordsString = JSON.stringify(noVisibles)

		await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)

		setPasswordList(noVisibles)

		setSearchResult(noVisibles.filter(password => searchResult.map(item => item.id).includes(password.id)))

		setShowOptions(false)
	}

	function handleToggleCheckMode() {
		setIsCheckMode(!isCheckMode)

		setShowOptions(false)
	}

	async function loadPasswordOpenProtectionState() {
		const finterprintProtect = await AsyncStorage.getItem('@my_pass_enable_protect')

		setPasswordOpenProtectionState(finterprintProtect === 'Y')
	}

	async function handleToggleProtect() {
		const protect = await AsyncStorage.getItem('@my_pass_enable_protect')

		const protectEnabled = protect === 'Y'
		const updatedState = protectEnabled ? 'N' : 'Y'

		if(protectEnabled) {
			await handleAuthenticatedAction(async () => {
				await AsyncStorage.setItem('@my_pass_enable_protect', updatedState)

				setPasswordOpenProtectionState(updatedState === 'Y')
			})
		} else {
			await AsyncStorage.setItem('@my_pass_enable_protect', updatedState)

			setPasswordOpenProtectionState(updatedState === 'Y')
		}
	}

	function alertEmptyList() {
		alert('Você não possui nenhuma senha cadastrada.')
	}

	function handleSearch(search: string) {
		if(!passwordList.length) {
			return
		}

		if(search) {
			console.log(`Handling search with "${search}"`)
		}

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

		currentPasswords.sort((a, b) => {
			if(a.title < b.title) {
			  	return -1
			}
			if(a.title > b.title) {
			  	return 1
			}
			return 0
		})

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
		if(!authenticationMethod) {
			return
		}

		// storeTestPasswords()

		handleAuthenticatedAction(() => {
			loadPasswordList()
		
			loadPasswordOpenProtectionState()

			setShowAuthenticationModal(false)
		}, true)
	}, [authenticationMethod])

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

	useEffect(() => {
		console.log('START ===============================')

		loadAuthenticationMethod()
	}, [])

	if(!authenticationMethod) {
		return <></>
	}

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
				showAuthenticationModal,
				
				handleAuthenticatedAction,
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
				handleToggleProtect,
				handleToggleCheckMode,
				handleToggleSelectAll,
				
				loadPasswordList,
				hideAllPasswords,
				passwordOpenProtectionState,
				alertEmptyList,
				searchResult,
				searchText,
				isCheckMode,
				updateItem
			}}
		>
			{children}

			{authenticationModalData && (
				<Modal
					visible={authenticationModalData.open}
					animationType="slide"
					onRequestClose={() => { setAuthenticationModalData(null) }}
				>
					{authenticationModalData.method?.name === 'fingerprint' ? (
						<FingerprintRequired />
					) : (
						<PasswordRequired callback={authenticationModalData.callback} />
					)}
				</Modal>
			)}

		</GlobalContext.Provider>
	)
}
