import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ToastAndroid } from 'react-native'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Clipboard from 'expo-clipboard'

import { ItemProps, StoredPasswords } from './types'

export const Item = ({ item, reload }: ItemProps) => {
	const [visible, setVisible] = useState(false)
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)

	function handlePress() {
		setVisible(!visible)
	}

	function handleConfirmDelete() {
		setShowConfirmDelete(!showConfirmDelete)
	}

	async function handleDelete(id: number) {
		let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')

		let currentPasswords = (JSON.parse((currentPasswordsString as string)) as StoredPasswords)

		currentPasswords = currentPasswords.filter(p => p.id !== id)

		currentPasswordsString = JSON.stringify(currentPasswords)

		await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)

		ToastAndroid.show('A senha foi removida com segurança.', ToastAndroid.SHORT)

		reload()
	}

	async function handleCopyToClipboard(text: string) {
		Clipboard.setString(text)

		ToastAndroid.show('Copiado para área de transferência.', ToastAndroid.SHORT)
	}

	return (
		<Pressable
			style={{...styles.item, backgroundColor: showConfirmDelete ? '#ef9a9a' : 'transparent'}}
			onPress={handlePress}
			onLongPress={handleConfirmDelete}
		>
			<View style={styles.header}>
				<Text style={styles.title}>{item.title}</Text>

				{showConfirmDelete ? (
					<TouchableOpacity onPress={() => { handleDelete(item.id) }}>
						<Feather name="trash" size={24} />
					</TouchableOpacity>
				) : (
					<Feather name={visible ? 'eye-off' : 'eye'} size={24} />
				)}
			</View>

			{visible && (
				<>
					<View style={styles.dataRow}>
						<Feather name="user" size={24} />

						<View style={styles.hidedDataBox}>
							<Text style={styles.hidedData}>{item.username}</Text>
						</View>

						<TouchableOpacity onPress={() => { handleCopyToClipboard(item.username) }}>
							<Feather name="copy" size={26} style={styles.copyIcon} />
						</TouchableOpacity>
					</View>

					<View style={styles.dataRow}>
						<Feather name="lock" size={24} />

						<View style={styles.hidedDataBox}>
							<Text style={styles.hidedData}>{item.password}</Text>
						</View>

						<TouchableOpacity onPress={() => { handleCopyToClipboard(item.password) }}>
							<Feather name="copy" size={26} style={styles.copyIcon} />
						</TouchableOpacity>
					</View>
				</>
			)}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	item: {
		padding: 14,
		borderBottomWidth: 1
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	title: {
		fontSize: 20
	},
	dataRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	hidedDataBox: {
		marginTop: 4,
		backgroundColor: '#03a9f4',
		padding: 8,
		borderRadius: 6,
		width: '79%',
		marginLeft: 10
	},
	hidedData: {
		fontSize: 20,
		color: '#FFF'
	},
	copyIcon: {
		marginLeft: 10
	}
})
  