import React, { useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ToastAndroid, Linking, Image } from 'react-native'
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Clipboard from 'expo-clipboard'

import { ItemProps, StoredPasswords, StoredPassword } from './types'

import { GlobalContext } from './contexts/GlobalContext'

export const Item = ({ item }: ItemProps) => {
	const {
		handleToggleVisibility,
		fingerprintProtectState,
		handleFingerprintAuthentication,
		togglePrepareToDelete,
		loadPasswordList
	} = useContext(GlobalContext)
	
	async function handleOpenItem(item: StoredPassword) {
		if(fingerprintProtectState && !item.visible) {
			await handleFingerprintAuthentication(() => {
				handleToggleVisibility(item.id)
			})
		} else {
			handleToggleVisibility(item.id)
		}
	}

	function handlePrepareToDelete(item: StoredPassword) {
		togglePrepareToDelete(item)
	}

	async function handleDelete(item: StoredPassword) {
		await handleFingerprintAuthentication(async () => {
			let currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')

			let currentPasswords = (JSON.parse((currentPasswordsString as string)) as StoredPasswords)
	
			currentPasswords = currentPasswords.filter(p => p.id !== item.id)
	
			currentPasswordsString = JSON.stringify(currentPasswords)
	
			await AsyncStorage.setItem('@my_pass_passwords', currentPasswordsString)
	
			ToastAndroid.show('A senha foi removida com segurança.', ToastAndroid.SHORT)
	
			loadPasswordList()
		})
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
			style={{...styles.item, backgroundColor: item.preparedToDelete ? '#421212' : item.visible ? '#38304D' : 'transparent'}}
			onPress={() => { handleOpenItem(item) }}
			onLongPress={() => { handlePrepareToDelete(item) }}
		>
			<View style={styles.header}>
				<View style={styles.appTitle}>
					{item.link ? (
						<Image 
							source={{
								uri: `https://s2.googleusercontent.com/s2/favicons?domain_url=https://${item.link}`
							}}
							style={styles.appLogoImage}
						/>
					) : (
						<View style={styles.appLogoImagePlaceholder} />
					)}

					<Text 
						style={{
							...styles.title,
							...(item.visible ? styles.visibleTitle : {})
						}}
					>
						{item.title}
					</Text>
				</View>

				{item.preparedToDelete ? (
					<TouchableOpacity onPress={() => { handleDelete(item) }}>
						<Feather name="trash" size={22} color="#FFF" />
					</TouchableOpacity>
				) : (
					<Feather name={item.visible ? 'eye-off' : 'eye'} size={21} color="#FFF" />
				)}
			</View>

			{item.visible && (
				<>
					{!!item.link && (
						<View style={styles.dataRow}>
							<Feather name="link" size={20} color="#FFF" />

							<View style={styles.hidedDataBox}>
								<Text style={styles.hidedData}>{item.link}</Text>

								<Image 
									source={{
										uri: `https://s2.googleusercontent.com/s2/favicons?domain_url=https://${item.link}`
									}}
									style={styles.linkLogoImage}
								/>
							</View>

							<TouchableOpacity onPress={() => { handleOpenLink(item.link) }}>
								<Feather name="external-link" size={26} style={styles.copyIcon} color="#FFF" />
							</TouchableOpacity>
						</View>
					)}

					{!!item.port && (
						<View style={styles.dataRow}>
							<FontAwesome name="sign-in" size={22} style={{ paddingRight: 1 }} color="#FFF" />

							<View style={styles.hidedDataBox}>
								<Text style={styles.hidedData}>{item.port}</Text>
							</View>

							<TouchableOpacity onPress={() => { handleCopyToClipboard(item.port) }}>
								<Feather name="copy" size={24} style={styles.copyIcon} color="#FFF" />
							</TouchableOpacity>
						</View>
					)}

					{!!item.username && (
						<View style={styles.dataRow}>
							<Feather name="user" size={20} color="#FFF" />

							<View style={styles.hidedDataBox}>
								<Text style={styles.hidedData}>{item.username}</Text>
							</View>

							<TouchableOpacity onPress={() => { handleCopyToClipboard(item.username) }}>
								<Feather name="copy" size={24} style={styles.copyIcon} color="#FFF" />
							</TouchableOpacity>
						</View>
					)} 

					<View style={styles.dataRow}>
						<Feather name="lock" size={20} color="#FFF" />

						<View style={styles.hidedDataBox}>
							<Text style={styles.hidedData}>{item.password}</Text>
						</View>

						<TouchableOpacity onPress={() => { handleCopyToClipboard(item.password) }}>
							<Feather name="copy" size={24} style={styles.copyIcon} color="#FFF" />
						</TouchableOpacity>
					</View>

					{item['2fa'] !== undefined && (
						<View style={styles.dataRow}>
							<MaterialIcons name="sms" size={24} color="#FFF" />

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
		borderBottomWidth: 1,
		borderBottomColor: '#FFF'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	appTitle: {
		flexDirection: 'row'
	},
	appLogoImage: {
		width: 22,
		height: 22,
		borderRadius: 2,
		marginRight: 8
	},
	appLogoImagePlaceholder: {
		width: 30
	},
	title: {
		fontSize: 16,
		marginLeft: 2,
		color: '#FFF'
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
		borderColor: '#FFF',
		padding: 8,
		borderRadius: 6,
		width: '79%',
		marginLeft: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	hidedDataBoxWithoutBorder: {
		borderWidth: 0
	},
	hidedData: {
		fontSize: 14,
		color: '#FFF'
	},
	copyIcon: {
		marginLeft: 10
	},
	linkLogoImage: {
		width: 18,
		height: 18,
		borderRadius: 2,
		position: 'relative'
	}
})
  