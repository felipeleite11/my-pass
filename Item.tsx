import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ToastAndroid, Linking } from 'react-native'
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Clipboard from 'expo-clipboard'

import { ItemProps, StoredPasswords, PasswordTypes } from './types'

import { GlobalContext } from './contexts/GlobalContext'

export const Item = ({ item, reload }: ItemProps) => {
	const { handleToggleVisibility } = useContext(GlobalContext)
	
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)

	function handlePress(id: number) {		
		handleToggleVisibility(id)
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

	function handleOpenLink(link: string) {
		const hasProtocol = /^(http(s)?:\/\/)/g.test(link)
		
		if(!hasProtocol) {
			link = `https://${link}`
		}

		Linking.openURL(link)
	}

	return (
		<Pressable
			style={{...styles.item, backgroundColor: showConfirmDelete ? '#ef9a9a' : 'transparent'}}
			onPress={() => { handlePress(item.id) }}
			onLongPress={handleConfirmDelete}
		>
			<View style={styles.header}>
				<Text style={{
					...styles.title,
					...(item.visible ? styles.visibleTitle : {})
				}}>{item.title}</Text>

				{showConfirmDelete ? (
					<TouchableOpacity onPress={() => { handleDelete(item.id) }}>
						<Feather name="trash" size={24} />
					</TouchableOpacity>
				) : (
					<Feather name={item.visible ? 'eye-off' : 'eye'} size={22} />
				)}
			</View>

			{item.visible && (
				<>
					{!!item.link && (
						<View style={styles.dataRow}>
							<Feather name="link" size={20} />

							<View style={styles.hidedDataBox}>
								<Text style={styles.hidedData}>{item.link}</Text>
							</View>

							<TouchableOpacity onPress={() => { handleOpenLink(item.link) }}>
								<Feather name="external-link" size={26} style={styles.copyIcon} />
							</TouchableOpacity>
						</View>
					)}

					{!!item.port && (
						<View style={styles.dataRow}>
							<FontAwesome name="sign-in" size={22} style={{ paddingRight: 1 }} />

							<View style={styles.hidedDataBox}>
								<Text style={styles.hidedData}>{item.port}</Text>
							</View>

							<TouchableOpacity onPress={() => { handleCopyToClipboard(item.port) }}>
								<Feather name="copy" size={24} style={styles.copyIcon} />
							</TouchableOpacity>
						</View>
					)}

					{!!item.username && (
						<View style={styles.dataRow}>
							<Feather name="user" size={20} />

							<View style={styles.hidedDataBox}>
								<Text style={styles.hidedData}>{item.username}</Text>
							</View>

							<TouchableOpacity onPress={() => { handleCopyToClipboard(item.username) }}>
								<Feather name="copy" size={24} style={styles.copyIcon} />
							</TouchableOpacity>
						</View>
					)} 

					<View style={styles.dataRow}>
						<Feather name="lock" size={20} />

						<View style={styles.hidedDataBox}>
							<Text style={styles.hidedData}>{item.password}</Text>
						</View>

						<TouchableOpacity onPress={() => { handleCopyToClipboard(item.password) }}>
							<Feather name="copy" size={24} style={styles.copyIcon} />
						</TouchableOpacity>
					</View>

					{item['2fa'] !== undefined && (
						<View style={styles.dataRow}>
							<MaterialIcons name="sms" size={24} />

							<View style={{
								...styles.hidedDataBox,
								...styles.hidedDataBoxWithoutBorder
							}}>
								<Text style={styles.hidedData}>
									{`2FA habilitado: ${item['2fa'] ? 'Sim' : 'Não'}`}
								</Text>
							</View>
						</View>
					)}
				</>
			)}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	item: {
		padding: 12,
		borderBottomWidth: 1
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	title: {
		fontSize: 16
	},
	visibleTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	dataRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	hidedDataBox: {
		marginTop: 4,
		backgroundColor: 'transparent',
		borderWidth: 1,
		padding: 8,
		borderRadius: 6,
		width: '79%',
		marginLeft: 10
	},
	hidedDataBoxWithoutBorder: {
		borderWidth: 0
	},
	hidedData: {
		fontSize: 14,
		color: '#424242'
	},
	copyIcon: {
		marginLeft: 10
	}
})
  