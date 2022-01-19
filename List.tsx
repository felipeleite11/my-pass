import React, { useContext, useEffect, useRef } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Modal, Text, Animated } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Checkbox from 'expo-checkbox'

import { Item } from './Item'
import { AddForm } from './AddForm'
import { ConfirmClearPasswords } from './ConfirmClearPasswords'
import { Options } from './Options'
import { Search } from './Search'

import { GlobalContext } from './contexts/GlobalContext'
import { ModalHeader } from './ModalHeader'
import { useState } from 'react'

export const List = () => {
	const {
		passwords,
		handleAdd,
		showAddForm,
		showConfirmClear,
		handleCloseAddForm,
		handleCloseConfirmClearForm,
		showOptions,
		setShowOptions,
		searchResult,
		passwordInEdition,
		handleEditionClose,
		handleDeleteMultiple,
		handleToggleSelectAll,
		isCheckMode
	} = useContext(GlobalContext)

	const [selectAllStatus, setSelectAllStatus] = useState(false)

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

	function handleToggleCheckboxSelectAll() {
		const newStatus = !selectAllStatus
		
		handleToggleSelectAll(newStatus)

		setSelectAllStatus(newStatus)
	}

	return (
		<View style={styles.container}>
			<ModalHeader 
				title="Minhas senhas"
				handleClose={() => { setShowOptions(true) }}
				actionIcon="more-vertical"
			/>

			<Search />

			<View style={styles.content}>
				{!!passwords?.length ? (
					<>
						{searchResult === null ? (
							<View style={styles.emptyListContainer}>
								<Feather name="refresh-cw" size={80} color="#999" />

								<Text style={styles.emptyListText}>Carregando...</Text>
							</View>
						) : !!searchResult.length ? (
							<>
								{isCheckMode && (
									<View style={styles.selectAllContainer}>
										<View style={styles.selectAllLeftContent}>
											<Checkbox
												value={selectAllStatus}
												onValueChange={handleToggleCheckboxSelectAll}
												color={selectAllStatus ? '#38304C' : undefined}
												style={styles.checkboxSelectAll}
											/>

											<Text style={styles.selectAllText}>Selecionar todos</Text>
										</View>

										{isCheckMode && searchResult.some(item => item.selected) && (
											<TouchableOpacity style={styles.selectAllRightContent} onPress={handleDeleteMultiple}>
												<Feather name="trash" size={22} color="#FFF" />
											</TouchableOpacity>
										)}
									</View>
								)}

								<FlatList 
									data={searchResult}
									renderItem={({ item }) => 
										<Item item={item} />
									}
									keyExtractor={item => String(item.id)}
								/> 

								{isCheckMode && (
									<Text style={styles.selectionModeTip}>Pressione voltar para sair do modo de seleção</Text>
								)}
							</>
						) : (
							<View style={styles.emptyListContainer}>
								<Feather name="inbox" size={80} color="#999" />

								<Text style={styles.emptyListText}>Nenhum serviço encontrado</Text>
							</View>
						)}
					</>
				) : (
					<View style={styles.emptyListContainer}>
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
				transparent
			>
				<View style={styles.popupOverlay}>
					<View style={styles.popup}>
						<Options />
					</View>
				</View>
			</Modal>

			<Modal
				visible={showConfirmClear}
				onRequestClose={handleCloseConfirmClearForm}
				animationType="slide"
			>
				<ConfirmClearPasswords />
			</Modal>

			<Modal
				visible={!!passwordInEdition}
				onRequestClose={handleEditionClose}
				animationType="slide"
			>
				<AddForm passwordInEdition={passwordInEdition} />
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
	  	marginTop: 24,
		paddingBottom: 24
	},

	// Select all
	selectAllContainer: {
		flexDirection: 'row',
		paddingHorizontal: 12,
		paddingBottom: 8,
		justifyContent: 'space-between'
	},
	selectAllLeftContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	selectAllRightContent: {

	},
	checkboxSelectAll: {
		width: 22,
		height: 22
	},
	selectAllText: {
		color: '#AAA',
		marginLeft: 8
	},
	selectionModeTip: {
		color: '#888',
		paddingVertical: 16,
		fontSize: 11
	},

	// Empty list
	emptyListContainer: {
	  alignItems: 'center',
	  justifyContent: 'center',
	  flex: 1,
	  marginTop: -100
	},
	emptyListText: {
	  fontSize: 16,
	  color: '#999',
	  marginTop: 8
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
	},


	// Popup
	popupOverlay: {
		backgroundColor: '#000A',
		flex: 1
	},
	popup: {
		backgroundColor: '#201A30',
		marginVertical: 50,
		marginHorizontal: 20,
		borderRadius: 10,
		padding: 20,
		flex: 1
	},
	popupContent: {
		marginTop: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: '#FFF'
	},
	popupHeader: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	popupText: {
		color: '#FFF',
		fontSize: 50
	}
})