export interface StoredPassword {
	id: number
	title: string
	password: string
	username: string
}

export interface ItemProps {
	item: StoredPassword
	reload(): void
}

export interface StoredPasswords extends Array<StoredPassword>{}

export interface AddFormProps {
	handleCloseAddForm(): void
	reload(): void
}