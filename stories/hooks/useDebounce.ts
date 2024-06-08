import { useState, useEffect } from 'react'

const useDebounce = <T>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	
	const primitiveValue =
		typeof value === 'object' ? JSON.stringify(value) : value
		useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)
		
		return () => {
			clearTimeout(handler)
		}
	}, [primitiveValue, delay])
	
	return debouncedValue
}
export default useDebounce
