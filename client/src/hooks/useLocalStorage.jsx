// const useLocalStorage = (key, initialValue) => {
// 	const [ storedValue, setStoredValue ] = useState(() => {	
// 		try {
// 			if (typeof window === 'undefined')
// 				return;
			
// 			const item = window.localStorage.getItem(key);

// 			return item ? JSON.parse(item) : item;
// 		} catch (err) {
// 			console.log(err);
// 			return initialValue;
// 		}
// 	});

// 	const setValue = (value) => {
// 		try {
// 			// allow a function to be passed instead
// 			const valueToStore = value instanceof Function ? value(storedValue) : value;

// 			if (typeof window !== 'undefined')
// 				window.localStorage.setItem(key, JSON.stringify(valueToStore));
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	};

// 	return [ storedValue, setValue ];
// }

// export default useLocalStorage;