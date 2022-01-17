import React, { useContext, useEffect, useRef } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Modal, Text, Animated } from 'react-native'
import { Feather } from '@expo/vector-icons'

import { Item } from './Item'
import { AddForm } from './AddForm'
import { ConfirmClearPasswords } from './ConfirmClearPasswords'
import { Options } from './Options'
import { Search } from './Search'

import { GlobalContext } from './contexts/GlobalContext'
import { ModalHeader } from './ModalHeader'

export const List = () => {
	const {
		handleAdd,
		showAddForm,
		showConfirmClear,
		handleCloseAddForm,
		handleCloseConfirmClearForm,
		showOptions,
		setShowOptions,
		searchResult
	} = useContext(GlobalContext)

	const animation = useRef(new Animated.Value(80)).current

	useEffect(() => {
		if(searchResult) {
			Animated.timing(
				animation,
				{
					duration: 400,
					toValue: 0,
					useNativeDriver: true
				}
			).start()
		}
	}, [searchResult])

	return (
		<View style={styles.container}>
			<ModalHeader 
				title="Minhas senhas"
				handleClose={() => { setShowOptions(true) }}
				actionIcon="more-vertical"
			/>

			<Search />

			<View style={styles.content}>
				{searchResult?.length ? (
					<FlatList 
						data={searchResult}
						renderItem={({ item }) => 
							<Item item={item} />
						}
						keyExtractor={item => String(item.id)}
					/> 
				) : (
					<View style={styles.emptyListTextContainer}>
						<Feather name="inbox" size={80} color="#999" />

						<Text style={styles.emptyListText}>Adicione sua primeira senha</Text>
					</View>
				)}
			</View>

			<Animated.View 
				style={{
					...styles.fabContainer,
					transform: [
						{
							translateX: animation
						}
					]
				}}
			>
				<TouchableOpacity onPress={handleAdd}>
					<View style={styles.fab}>
						<Feather name="plus" size={30} />
					</View>
				</TouchableOpacity>
			</Animated.View>
			
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
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		top: 28,
		width: '100%'
	},
	content: {
	  	flex: 1,
	  	marginTop: 24
	},

	// Empty list
	emptyListTextContainer: {
	  alignItems: 'center',
	  justifyContent: 'center',
	  flex: 1
	},
	emptyListText: {
	  fontSize: 18,
	  color: '#999'
	},

	// FAB
	fabContainer: {
	  right: 20,
	  bottom: 50,
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