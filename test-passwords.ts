import AsyncStorage from '@react-native-async-storage/async-storage'

import { PasswordTypes, StoredPasswords } from "./types"

export async function storeTestPasswords() {
	let newPasswords = []

	newPasswords.push({
		type: PasswordTypes.FTP,
		id: 110,
		title: 'FTP 1',
		username: 'uer',
		password: '123456',
		link: '12.240.11.55',
		database: '',
		port: '21',
		'2fa': false,
		visible: false,
		selected: false
	})

	newPasswords.push({
		type: PasswordTypes.FTP,
		id: 111,
		title: 'FTP 2',
		username: 'uer',
		password: '123456',
		link: '12.240.11.55',
		database: '',
		port: '21',
		'2fa': false,
		visible: false,
		selected: false
	})

	newPasswords.push({
		type: PasswordTypes.FTP,
		id: 112,
		title: 'FTP 3',
		username: 'uer',
		password: '123456',
		link: '12.240.11.55',
		database: '',
		port: '21',
		'2fa': false,
		visible: false,
		selected: false
	})

	newPasswords.push({
		type: PasswordTypes.FTP,
		id: 113,
		title: 'FTP 4',
		username: 'uer',
		password: '123456',
		link: '12.240.11.55',
		database: '',
		port: '21',
		'2fa': false,
		visible: false,
		selected: false
	})

	newPasswords.push({
		type: PasswordTypes.FTP,
		id: 114,
		title: 'FTP 5',
		username: 'uer',
		password: '123456',
		link: '12.240.11.55',
		database: '',
		port: '21',
		'2fa': false,
		visible: false,
		selected: false
	})

	const currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')

	const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)

	newPasswords = currentPasswords.concat(newPasswords)
	
	await AsyncStorage.setItem('@my_pass_passwords', JSON.stringify(newPasswords))
}

