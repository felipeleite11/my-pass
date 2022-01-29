import React from 'react'

import AppContent from './AppContent'

import GlobalProvider from './contexts/GlobalContext'

export default function App() {
	return (
		<GlobalProvider>
			<AppContent />
		</GlobalProvider>
	)
}
