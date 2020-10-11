import { useGlobal } from "reactn"


export function useUser() {
    const [user, setUser] = useGlobal('user')

    return [user, setUser]
}
