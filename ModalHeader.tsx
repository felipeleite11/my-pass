import { Feather } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { ModalHeaderProps } from './types'

export const ModalHeader = ({ title, handleClose, actionIcon = 'x' }: ModalHeaderProps) => {
	return (
		<View style={styles.addFormHeader}>
			<Text style={styles.addFormHeaderTitle}>{title}</Text>

			{handleClose && (
				<TouchableOpacity onPress={handleClose}>
					<Feather name={actionIcon as any} size={30} color="#FFF" />
				</TouchableOpacity>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	addFormHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 20,
		marginTop: 20
	},
	addFormHeaderTitle: {
		fontSize: 24,
		color: '#FFF'
	},
})