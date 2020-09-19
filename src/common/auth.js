import { useGlobal } from "reactn"
import { useLocalStorage } from '../utils/useLocalStorage'

export function useIsOnline() {
    const [user, setIsUser] = useLocalStorage('user')

    useEffect(() => {
        if (user) {
            return
        }


        return () => {

        }
    }, [user, setIsUser])

    return [user, setIsUser]
}
