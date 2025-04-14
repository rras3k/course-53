import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function LuminosityToggle() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<button
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
			className="p-2 bg-gray-800 text-white rounded"
		>
			Toggle {theme === 'dark' ? 'Light' : 'Dark'}
		</button>
	)
}