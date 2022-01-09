import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { GlobalContextProps, ContextProps, StoredPasswords, StoredPassword } from '../types'
import { ToastAndroid } from 'react-native'

export const GlobalContext = createContext<GlobalContextProps>({} as any)

export default function({ children }: ContextProps) {
	const [showAddForm, setShowAddForm] = useState(false)
	const [passwordList, setPasswordList] = useState<StoredPasswords>([])
	const [showOptions, setShowOptions] = useState(false)
	const [showConfirmClear, setShowConfirmClear] = useState(false)

	async function loadPasswordList() {
		const currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')
	
		if(!currentPasswordsString) {
		  return
		}
	
		const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)
	
		currentPasswords.sort((a, b) => {
			if(a.title < b.title) {
			  	return 1
			}
			if(a.title > b.title) {
			  	return -1
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
			  	return 1
			}
			if(a.title > b.title) {
			  	return -1
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

	useEffect(() => {
		loadPasswordList()
	}, [])

	useEffect(() => {
		if(showAddForm) {
			hideAllPasswords()
		}
	}, [showAddForm])

	return (
		<GlobalContext.Provider 
			value={{
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
				setShowOptions
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}