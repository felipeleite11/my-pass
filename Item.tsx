import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ToastAndroid, Linking, Image } from 'react-native'
import Checkbox from 'expo-checkbox'
import { Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'

import { ItemProps, StoredPassword, PasswordTypes } from './types'

import { GlobalContext } from './contexts/GlobalContext'
import { useState } from 'react'

const defaultIcon = require('./assets/default-icon.png')

export const Item = ({ item }: ItemProps) => {
	const {
		handleToggleVisibility,
		fingerprintProtectState,
		handleFingerprintAuthentication,
		setPasswordInEdition,
		isCheckMode,
		updateItem
	} = useContext(GlobalContext)

	const [selected, setSelected] = useState(false)
	
	async function handleOpenItem(item: StoredPassword) {
		if(fingerprintProtectState && !item.visible) {
			await handleFingerprintAuthentication(() => {
				handleToggleVisibility(item.id)
			})
		} else {
			handleToggleVisibility(item.id)
		}
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

	function handleSelectItem() {
		setSelected(!selected)

		updateItem({
			...item,
			selected: !selected
		})
	}

	useEffect(() => {
		if(item) {
			setSelected(item.selected)
		}
	}, [item])

	if(item.type === PasswordTypes.SPACER) {
		return <View style={styles.bottomSpacer} />
	}

	return (
		<Pressable
			style={{...styles.item, backgroundColor: item.visible ? '#38304D' : 'transparent'}}
			onPress={isCheckMode ? 
				handleSelectItem : 
				() => { handleOpenItem(item) }
			}
			onLongPress={() => {
				setPasswordInEdition(item)
			}}
		>
			<View style={styles.header}>
				<View style={styles.appTitle}>
					{isCheckMode ? (
						<Checkbox
							value={selected}
							onValueChange={handleSelectItem}
							color={selected ? '#38304C' : undefined}
							style={styles.checkbox}
						/>
					) : (
						<>
							{item.link ? (
								<Image 
									source={{
										uri: `https://s2.googleusercontent.com/s2/favicons?domain_url=https://${item.link}`
									}}
									style={styles.appLogoImage}
								/>
							) : (
								<View style={styles.appLogoImagePlaceholder}>
									<Image source={defaultIcon} style={styles.appLogoImage} />
								</View>
							)}
						</>
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

				{!isCheckMode && (
					<Feather name={item.visible ? 'eye-off' : 'eye'} size={21} color="#FFF" />
				)}
			</View>

			{item.visible && !isCheckMode && (
				<>
					{!!item.link && (
						<View style={styles.dataRow}>
							<Feather name={item.type === PasswordTypes.LOGIN_PASSWORD || item.type === PasswordTypes.PASSWORD_ONLY ? 'link' : 'server'} size={20} color="#FFF" />

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

					{!!item.database && (
						<View style={styles.dataRow}>
							<FontAwesome name="database" size={22} style={{ paddingRight: 1 }} color="#FFF" />

							<View style={styles.hidedDataBox}>
								<Text style={styles.hidedData}>{item.database}</Text>
							</View>

							<TouchableOpacity onPress={() => { handleCopyToClipboard(item.database) }}>
								<Feather name="copy" size={24} style={styles.copyIcon} color="#FFF" />
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
		flexDirection: 'row',
		alignItems: 'center'
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
	},
	bottomSpacer: {
		height: 100
	},
	checkbox: {
		width: 22,
		height: 22,
		marginRight: 8
	}
})
  