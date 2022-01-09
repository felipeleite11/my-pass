import { Feather } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { ModalHeaderProps } from './types'

export const ModalHeader = ({ title, handleClose }: ModalHeaderProps) => {
	return (
		<View style={styles.addFormHeader}>
			<Text style={styles.addFormHeaderTitle}>{title}</Text>

			<TouchableOpacity onPress={handleClose}>
				<Feather name="x" size={30} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	addFormHeaderTitle: {
		fontSize: 24
	},
	addFormHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 20
	},
})