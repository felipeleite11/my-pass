import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity, Modal, Text } from 'react-native'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Item } from './Item'
import { AddForm } from './AddForm'

import { StoredPasswords } from './types'

export default function App() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [passwordList, setPasswordList] = useState<StoredPasswords>([])

  function handleAdd() {
    setShowAddForm(true)
  }

  function handleCloseAddForm() {
		setShowAddForm(false)
	}

  async function loadPasswordList() {
    const currentPasswordsString = await AsyncStorage.getItem('@my_pass_passwords')

    if(!currentPasswordsString) {
      return
    }

    const currentPasswords = (JSON.parse(currentPasswordsString) as StoredPasswords)

    setPasswordList(currentPasswords)
  }

  useEffect(() => {
    loadPasswordList()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {passwordList.length ? (
          <FlatList 
            data={passwordList}
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    width: '100%',
    paddingTop: 50
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
    backgroundColor: 'gold',
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
  }
})
