import styles from './Navbar.module.scss'
import { AiOutlineMenu } from 'react-icons/ai'
import { TfiSearch } from 'react-icons/tfi'
import Logo from '../../../public/logo.png'
import Image from 'next/image'
import { Avatar, Text } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../redux/store'
import { FaRegUserCircle } from 'react-icons/fa'
import { MdOutlineMicNone } from 'react-icons/md'
import { IoNotificationsOutline } from 'react-icons/io5'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { setToggleModalLogin } from '../../../redux/reducers/authReducer'
import { setLayoutMenuActive } from '../../../redux/reducers/appReducer'

export default () => {
    const auth = useSelector((state: RootState) => state.auth)
    const app = useSelector((state: RootState) => state.app)

    const dispatch = useDispatch()

    const [searchInput, setSearchInput] = useState('')
    const [listening, setListening] = useState(false)
    const [browserSuport, setBrowserSuport] = useState(false)

    const handleLogin = () => {
        dispatch(setToggleModalLogin(true))
    }

    const handleRecognition = () => {
        let recognition = null

        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition !== undefined) {
            recognition = new SpeechRecognition();
            return recognition
        } else {
            return undefined
        }
    }

    const handleMicClick = () => {
        let recognition = handleRecognition()

        if (recognition !== null) {
            recognition.onstart = () => {
                setListening(true);
            }
            recognition.onend = () => {
                setListening(false);
            }
            recognition.onresult = (e: any) => {
                setSearchInput(e.results[0][0].transcript);
            }

            recognition.start();
        }
    }

    const toggleMenu = () => dispatch(setLayoutMenuActive(!app.layout_menu_active))

    useEffect(() => {
        let check_recognition = handleRecognition()
        if (check_recognition != undefined) {
            setBrowserSuport(true)
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.containerLeft}>
                <div className={styles.menu} onClick={toggleMenu}>
                    <AiOutlineMenu className={styles.menuIcon} />
                </div>

                <Link href='/'>
                    <div className={styles.logo}>
                        <Image
                            alt="Grftube"
                            width={35}
                            src={Logo}
                        />

                        <Text className={styles.logoLabel}>GrfTube</Text>
                    </div>
                </Link>
            </div>

            <div className={styles.containerCenter}>
                <div className={styles.search}>
                    <input
                        className={styles.searchInput}
                        placeholder='Pesquisar'
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />

                    <div className={styles.searchBtn}>
                        <TfiSearch className={styles.btnIcon} />
                    </div>
                </div>

                {browserSuport &&
                    <div className={styles.searchMic} onClick={handleMicClick}>
                        <MdOutlineMicNone className={styles.searchMicIcon} style={{ color: listening ? 'red' : 'rgb(219, 219, 219)' }} />
                    </div>
                }

            </div>

            <div className={styles.containerRight}>
                <IoNotificationsOutline className={styles.notificationIcon} />

                {auth.is_authenticated ?
                    <Avatar name={auth.user?.name} className={styles.avatarUserName} />
                    :

                    <div className={styles.avatar} onClick={handleLogin}>
                        <FaRegUserCircle className={styles.avatarNotLogged} />
                        <Text fontWeight={600}  >Fazer login</Text>
                    </div>
                }
            </div>

        </div>
    )
}