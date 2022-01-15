import React, { useContext } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Modal, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'

import { Item } from './Item'
import { AddForm } from './AddForm'
import { ConfirmClearPasswords } from './ConfirmClearPasswords'
import { Options } from './Options'

import { GlobalContext } from './contexts/GlobalContext'

export const List = () => {
	const {
		passwords,
		handleAdd,
		showAddForm,
		showConfirmClear,
		handleCloseAddForm,
		handleCloseConfirmClearForm,
		showOptions,
		setShowOptions
	} = useContext(GlobalContext)

	return (
		<>
			<View style={styles.header}>
				<Text style={styles.appTitle}>Minhas senhas</Text>

				<TouchableOpacity onPress={() => { setShowOptions(true) }}>
					<Feather name="more-vertical" size={28} color="#FFF" />
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{passwords.length ? (
					<FlatList 
						data={passwords}
						renderItem={({ item }) => 
							<Item item={item} />
						}
						keyExtractor={item => String(item.id)}
						contentContainerStyle={styles.list}
					/> 
				) : (
					<View style={styles.emptyListTextContainer}>
						<Feather name="inbox" size={80} color="#999" />

						<Text style={styles.emptyListText}>Adicione sua primeira senha</Text>
					</View>
				)}
			</View>

			<TouchableOpacity onPress={handleAdd} style={styles.fabContainer}>
				<View style={styles.fab}>
					<Feather name="plus" size={30} />
				</View>
			</TouchableOpacity>
			
			<Modal
				visible={showAddForm}
				onRequestClose={handleCloseAddForm}
				animationType="slide"
			>
				<AddForm />
			</Modal>

			<Modal
				visible={showOptions}
				onRequestClose={() => { setShowOptions(false) }}
				animationType="slide"
			>
				<Options />
			</Modal>

			<Modal
				visible={showConfirmClear}
				onRequestClose={handleCloseConfirmClearForm}
				animationType="slide"
			>
				<ConfirmClearPasswords />
			</Modal>
		</>
	)
}

const styles = StyleSheet.create({
	appTitle: {
		fontSize: 26,
		color: '#FFF'
		// color: themes[theme as 'dark'|'light'].PRIMARY
	}, 
	header: {
		position: 'absolute',
		top: 64,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 20
		// backgroundColor: themes[theme as 'dark'|'light'].BACKGROUND
	},
	content: {
	  flex: 1,
	  width: '100%',
	  paddingTop: 110
	},
	emptyListTextContainer: {
	  alignItems: 'center',
	  justifyContent: 'center',
	  flex: 1
	},
	emptyListText: {
	  fontSize: 18,
	  color: '#999'
	},
	list: {
	  paddingHorizontal: 20
	},
	fabContainer: {
	  right: 30,
	  bottom: 30,
	  position: 'absolute'
	},
	fab: {
	  backgroundColor: '#0df5e3',
	  width: 60,
	  height: 60,
	  borderRadius: 30,
	  justifyContent: 'center',
	  alignItems: 'center',
	  shadowColor: 'rgba(0, 0, 0, 0.1)',
	  shadowOpacity: 0.8,
	  elevation: 6,
	  shadowRadius: 15 ,
	  shadowOffset : { width: 1, height: 13}
	}
})