import React from 'react'

export interface ItemProps {
	item: StoredPassword
	reload(): void
}

export interface ListProps {
	items: StoredPasswords
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
}

export interface StoredPasswords extends Array<StoredPassword>{}

export interface GlobalContextProps {
	passwords: StoredPasswords
	setPasswords: React.Dispatch<React.SetStateAction<StoredPasswords>>
	showAddForm: boolean
	showOptions: boolean
	showConfirmClear: boolean
	loadPasswordList(): void
	handleAdd(): void
	handleCloseAddForm(): void
	handleCloseConfirmClearForm(): void
	handleToggleVisibility(id: number): void
	handleConfirmClearPasswords(): void
	handleClearPasswords(): void
	hideAllPasswords(): void,
	setShowOptions: React.Dispatch<React.SetStateAction<boolean>>
	fingerprintProtectState: boolean|null
	handleToggleFingerprintProtect(): void
	handleFingerprintAuthentication(): void
	showFingerprintModal: boolean
	// theme: string
}

export interface AddFormProps {
	handleCloseAddForm(): void
	reload(): void
}

export interface ModalHeaderProps {
	title: string
	handleClose(): void
}

export enum PasswordTypes {
	LOGIN_PASSWORD = 'Login e senha',
	PASSWORD_ONLY = 'Apenas senha',
	SSH = 'SSH',
	FTP = 'FTP'
}