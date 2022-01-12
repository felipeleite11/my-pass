import React, { useContext } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Modal, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'

import { Item } from './Item'
import { AddForm } from './AddForm'

import { GlobalContext } from './contexts/GlobalContext'
import { ModalHeader } from './ModalHeader'

export const List = () => {
	const {
		passwords,
		loadPasswordList,
		handleAdd,
		showAddForm,
		showConfirmClear,
		handleCloseAddForm,
		handleCloseConfirmClearForm,
		handleConfirmClearPasswords,
		handleClearPasswords,
		hideAllPasswords,
		showOptions,
		setShowOptions,
		fingerprintProtectState,
		handleToggleFingerprintProtect
	} = useContext(GlobalContext)

	function alertEmptyList() {
		alert('Você não possui nenhuma senha cadastrada.')
	}

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
							<Item 
								item={item}
								reload={loadPasswordList} 
							/>
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
				animationType="slide"
				visible={showAddForm}
				onRequestClose={handleCloseAddForm}
			>
				<AddForm
					handleCloseAddForm={handleCloseAddForm}
					reload={loadPasswordList}
				/>
			</Modal>

			<Modal
				animationType="slide"
				visible={showOptions}
				onRequestClose={() => { setShowOptions(false) }}
			>
				<View style={styles.optionsContainer}>
					<ModalHeader 
						title="Opções"
						handleClose={() => { setShowOptions(false) }}
					/>

					<TouchableOpacity 
						onPress={passwords.length ? handleConfirmClearPasswords : alertEmptyList}
						style={{
							...styles.confirmClearButton,
							...styles.confirmClearButtonNo
						}}
					>
						<Text style={styles.removeAllButtonText}>Excluir todas as senhas</Text>
					</TouchableOpacity>

					<TouchableOpacity 
						onPress={hideAllPasswords}
						style={{
							...styles.confirmClearButton,
							...styles.confirmClearButtonYes
						}}
					>
						<Text style={styles.hideAllButtonText}>Esconder todas as senhas</Text>
					</TouchableOpacity>

					<TouchableOpacity 
						onPress={handleToggleFingerprintProtect}
						style={{
							...styles.confirmClearButton,
							backgroundColor: '#f7fa5a'
						}}
					>
						<Text style={styles.fingerprintProtectButtonText}>Proteger senhas com digital</Text>

						<Text style={styles.fingerprintProtectButtonTextTip}>
							{fingerprintProtectState !== null ? fingerprintProtectState ? 'Habilitado' : 'Desabilitado' : ''}
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
				animationType="slide"
				visible={showConfirmClear}
				onRequestClose={handleCloseConfirmClearForm}
			>
				<View style={styles.confirmClearContainer}>
					<ModalHeader 
						title=""
						handleClose={handleCloseConfirmClearForm}
					/>

					<View style={styles.confirmClearIconContainer}>
						<Feather name="alert-triangle" size={70} color="#999" />
					</View>

					<Text style={styles.confirmClearText}>Deseja realmente excluir TODAS AS SENHAS cadastradas?</Text>

					<View style={styles.confirmClearButtonsContainer}>
						<TouchableOpacity
							onPress={handleCloseConfirmClearForm}
							style={{
								...styles.confirmClearButton,
								...styles.confirmClearButtonNo
							}}
						>
							<Text>NÃO</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleClearPasswords}
							style={{
								...styles.confirmClearButton,
								...styles.confirmClearButtonYes
							}}
						>
							<Text>SIM</Text>
						</TouchableOpacity>
					</View>
				</View>
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
	},
	addFormHeaderTitle: {
	  fontSize: 24
	},
	addFormHeader: {
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	  padding: 20
	},
	addFormContainer: {
	  padding: 20
	},
	passwordContainer: {
	  flexDirection: 'row',
	  alignItems: 'center'
	},
	togglePasswordVisibilityIcon: {
	  position: 'relative',
	  left: 10,
	  top: -10
	},
	inputText: {
	  borderWidth: 1,
	  fontSize: 18,
	  padding: 16,
	  marginBottom: 20,
	  borderRadius: 4,
	  width: '100%'
	},
	inputTextPassword: {
	  width: '88%'
	},
	btnSave: {
	  flexDirection: 'row',
	  backgroundColor: '#4caf50',
	  borderRadius: 4,
	  padding: 16,
	  justifyContent: 'center'
	},
	btnSaveText: {
	  fontSize: 16,
	  marginLeft: 8
	}, 
	confirmClearContainer: {
		padding: 20
	},
	confirmClearIconContainer: {
		alignItems: 'center'
	},
	confirmClearText: {
		fontSize: 18,
		marginTop: 14,
		textAlign: 'center'
	},
	confirmClearButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	confirmClearButton: {
		padding: 18,
		marginHorizontal: 14,
		marginTop: 40,
		borderRadius: 10,
		alignItems: 'center'
	},
	confirmClearButtonNo: {
		backgroundColor: '#de5454'
	},
	confirmClearButtonYes: {
		backgroundColor: '#0df5e3'
	},
	optionsContainer: {
		padding: 20,
		backgroundColor: '#201A30',
		flex: 1
	},
	removeAllButtonText: {
		fontSize: 16,
		color: '#FFF'
	},
	hideAllButtonText: {
		fontSize: 16
	},
	fingerprintProtectButtonText: {
		fontSize: 16
	},
	fingerprintProtectButtonTextTip: {
		fontSize: 10
	}
})