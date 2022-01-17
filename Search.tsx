import React, { useContext } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import { GlobalContext } from './contexts/GlobalContext'

export const Search = () => {
	const { handleClearSearch, setSearchText, searchText } = useContext(GlobalContext)

	function handleClear() {
		setSearchText('')
		
		handleClearSearch()
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.search}
				placeholder="Procurar..."
				placeholderTextColor="#767676" 
				onChangeText={setSearchText}
				value={searchText}
			/>

			{searchText ? (
				<TouchableOpacity onPress={handleClear}>
					<Feather 
						name="x" 
						size={20} 
						color="#FFF"
					/>
				</TouchableOpacity>
			) : (
				<Feather 
					name="search" 
					size={20} 
					color="#FFF"
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	search: {
		borderBottomWidth: 1,
		borderBottomColor: '#FFF',
		width: '90%',
		marginRight: 8,
		fontSize: 16,
		height: 40,
		color: '#FFF'
	}
})