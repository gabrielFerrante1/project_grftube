import { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../utils/api'
import { RootState } from '../../redux/store'
import Auth from '../Auth'
import Navbar from './Navbar'
import styles from './LayoutMain.module.scss'
import Sidebar from './Sidebar'
import { setIsAuthenticated, setTokenAccess, setUser } from '../../redux/reducers/authReducer'
import { ApiVerifyToken } from '../../types/Auth'
import { getCookie } from 'cookies-next';
import Miniplayer from '../Miniplayer'
import { useRouter } from 'next/router'
import { setMiniplayerActive, setPauseVideo, setPlayVideo } from '../../redux/reducers/playerReducer'

type Props = {
    children: ReactElement | ReactElement[]
}

export default ({ children }: Props) => {
    const player = useSelector((state: RootState) => state.player)
    const auth = useSelector((state: RootState) => state.auth)

    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        const handleLogin = async () => {
            const token_access = getCookie('access')

            if (!token_access || auth.is_authenticated) return;

            try {
                const verify: ApiVerifyToken = await api('auth/verify-token', 'get', '', token_access as string)

                dispatch(setUser(verify.user))
                dispatch(setTokenAccess(token_access as string))
                dispatch(setIsAuthenticated(true))

            } catch (error) { }
        }

        handleLogin()
    }, [])

    useEffect(() => {
        const handleStartUrl = (url: string) => {
            if (player.videoCurrentId != 0 && player.videoCurrentSrc != '' && url.search('/v/') < 0) {
                dispatch(setMiniplayerActive(true))
            }
        }

        router.events.on('routeChangeStart', handleStartUrl)

        return () => {
            router.events.off('routeChangeStart', handleStartUrl)
        }
    }, [player.videoCurrentId])

    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <Navbar />
            </div>

            <div className={styles.containerPage}>
                <div className={styles.sidebar}>
                    <Sidebar />
                </div>

                <div className={styles.app}>
                    {children}
                </div>
            </div>

            <Auth />

            <Miniplayer />
        </div>
    )
}