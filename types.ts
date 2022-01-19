import React from 'react'

export interface ItemProps {
	item: StoredPassword
}

export interface ContextProps {
	children: React.ReactNode
}

export interface StoredPassword {
	id: number
	type: string
	title: string
	password: string
	username: string
	link: string
	'2fa': boolean
	port: string
	visible: boolean
	selected?: boolean
}

export interface StoredPasswords extends Array<StoredPassword>{}

export interface GlobalContextProps {
	passwords: StoredPasswords
	setPasswords: React.Dispatch<React.SetStateAction<StoredPasswords>>
	passwordInEdition: StoredPassword
	setPasswordInEdition: React.Dispatch<React.SetStateAction<StoredPassword>>

	showAddForm: boolean
	showOptions: boolean
	showConfirmClear: boolean
	fingerprintProtectState: boolean|null
	showFingerprintModal: boolean
	setShowOptions: React.Dispatch<React.SetStateAction<boolean>>

	loadPasswordList(): void
	handleAdd(): void
	handleCloseAddForm(): void
	handleCloseConfirmClearForm(): void
	handleToggleVisibility(id: number): void
	handleConfirmClearPasswords(): void
	handleClearPasswords(): void
	handleToggleFingerprintProtect(): void
	handleFingerprintAuthentication(callback: () => void, login?: boolean): void
	handleClearSearch(): void
	handleEditionClose(): void
	handleDelete(item: StoredPassword): void
	handleDeleteMultiple(): void
	handleUpdate(item: StoredPassword): void
	handleToggleSelectAll(status: boolean): void
	hideAllPasswords(): void
	alertEmptyList(): void
	updateItem(item: StoredPassword): void
	isCheckMode: boolean
	setIsCheckMode: React.Dispatch<React.SetStateAction<boolean>>

	setSearchText: React.Dispatch<React.SetStateAction<string>>
	searchText: string
	searchResult: StoredPasswords|null
}

export interface ModalHeaderProps {
	title: string
	handleClose?(): void
	actionIcon?: string
}

export enum PasswordTypes {
	LOGIN_PASSWORD = 'Login e senha',
	PASSWORD_ONLY = 'Apenas senha',
	SSH = 'SSH',
	FTP = 'FTP',
	SPACER = 'Spacer'
}

export interface ValidationResultProps {
	error?: string
	success: boolean
}

export interface AddFormProps {
	passwordInEdition?: StoredPassword
}