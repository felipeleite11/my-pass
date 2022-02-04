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
	database: string
	'2fa': boolean
	port: string
	visible: boolean
	selected?: boolean
}

export interface StoredPasswords extends Array<StoredPassword>{}

export interface GlobalContextProps {
	passwords: StoredPasswords
	passwordInEdition: StoredPassword
	passwordOpenProtectionState: boolean|null
	isCheckMode: boolean
	searchText: string
	searchResult: StoredPasswords|null
	showAddForm: boolean
	showOptions: boolean
	showConfirmClear: boolean
	showAuthenticationModal: boolean
	
	setPasswordInEdition: React.Dispatch<React.SetStateAction<StoredPassword>>
	setPasswords: React.Dispatch<React.SetStateAction<StoredPasswords>>
	setShowOptions: React.Dispatch<React.SetStateAction<boolean>>
	setIsCheckMode: React.Dispatch<React.SetStateAction<boolean>>
	setSearchText: React.Dispatch<React.SetStateAction<string>>

	handleAdd(): void
	handleCloseAddForm(): void
	handleCloseConfirmClearForm(): void
	handleToggleVisibility(id: number): void
	handleConfirmClearPasswords(): void
	handleClearPasswords(): void
	handleToggleProtect(): void
	handleAuthenticatedAction(callback: () => void, login?: boolean): void
	handleClearSearch(): void
	handleEditionClose(): void
	handleDelete(item: StoredPassword): void
	handleDeleteMultiple(): void
	handleUpdate(item: StoredPassword): void
	handleToggleSelectAll(status: boolean): void
	handleToggleCheckMode(): void
	
	loadPasswordList(): void
	hideAllPasswords(): void
	alertEmptyList(): void
	updateItem(item: StoredPassword): void
}

export interface ModalHeaderProps {
	title: string
	handleClose?(): void
	actionIcon?: string
}

export interface PasswordRequiredProps {
	callback() : void
}

export enum PasswordTypes {
	LOGIN_PASSWORD = 'Login e senha',
	PASSWORD_ONLY = 'Apenas senha',
	SSH = 'SSH',
	FTP = 'FTP',
	DATABASE = 'Banco de dados',
	SPACER = 'Spacer'
}

export interface ValidationResultProps {
	error?: string
	success: boolean
}

export interface AddFormProps {
	passwordInEdition?: StoredPassword
}

export interface ThemeProps {
	background: string,
	primary: string,
	text: string,
	text_secondary: string,
	red: string,
	yellow: string
}

export interface AuthenticationMethod {
	name: string
}

export interface AuthenticationModalData {
	open: boolean
	method?: AuthenticationMethod
	callback?(): void
}