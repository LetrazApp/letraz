import {useRef, useCallback} from 'react'

export const useThrottle = <T extends (...args: any[]) => void>(
	callback: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	const lastRan = useRef(Date.now())
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	return useCallback(
		(...args: Parameters<T>): void => {
			const handler = (): void => {
				if (Date.now() - lastRan.current >= delay) {
					callback(...args)
					lastRan.current = Date.now()
				} else {
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current)
					}
					timeoutRef.current = setTimeout((): void => {
						callback(...args)
						lastRan.current = Date.now()
					}, delay - (Date.now() - lastRan.current))
				}
			}

			handler()
		},
		[callback, delay]
	)
}
