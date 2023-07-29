import styles from './Sidebar.module.scss'
import { AiOutlineHome, AiOutlineDislike, AiOutlineLike, AiOutlineHistory, AiOutlineSetting } from 'react-icons/ai'
import { MdOutlineSubscriptions, MdHelpOutline } from 'react-icons/md'
import { BiMoviePlay } from 'react-icons/bi'
import { Text, useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import { useRouter } from 'next/router'
import { setToggleModalLogin } from '../../../redux/reducers/authReducer'
import Link from 'next/link'

export default () => {
    const auth = useSelector((state: RootState) => state.auth)
    const app = useSelector((state: RootState) => state.app)

    const dispatch = useDispatch()
    const router = useRouter()
    const toast = useToast()

    const handleToLinkWithAuth = (url: string, title: string) => {
        if (auth.is_authenticated) {
            router.push(url)
        } else {
            dispatch(setToggleModalLogin(true))
            toast({
                title,
                position: 'bottom-left',
                isClosable: true,
                duration: 3000
            })
        }
    }

    return (
        <div
            style={{ width: app.layout_menu_active ? '240px' : '71px' }}
            className={styles.container}
        >

            <div className={styles.list}>
                <Link href='/'>
                    <div className={styles.item}>
                        <div className={styles.itemIcon}>
                            <AiOutlineHome className={styles.icon} />
                        </div>
                        <div className={styles.itemLabel}>
                            <Text className={styles.label}>Início</Text>
                        </div>
                    </div>
                </Link>

                <Link href='/shorts'>
                    <div className={styles.item}>
                        <div className={styles.itemIcon}>
                            <BiMoviePlay className={styles.icon} />
                        </div>
                        <div className={styles.itemLabel}>
                            <Text className={styles.label}>Shorts</Text>
                        </div>
                    </div>
                </Link>

                <div className={`${styles.item} mb-2`} onClick={() => handleToLinkWithAuth('/inscricoes', 'Faça login para ver suas inscrições')}>
                    <div className={styles.itemIcon}>
                        <MdOutlineSubscriptions className={styles.icon} />
                    </div>
                    <div className={styles.itemLabel}>
                        <Text className={styles.label}>Inscrições</Text>
                    </div>
                </div>


                <div className={styles.itemDivisor}></div>

                <div className={styles.item} onClick={() => handleToLinkWithAuth('/historico', 'Faça login para ver seu histórico')}>
                    <div className={styles.itemIcon}>
                        <AiOutlineHistory className={styles.icon} />
                    </div>
                    <div className={styles.itemLabel}>
                        <Text className={styles.label}>Histórico</Text>
                    </div>
                </div>
                <div className={`${styles.item}`} onClick={() => handleToLinkWithAuth('/likes', 'Faça login para ver vídeos marcados como gostei')}>
                    <div className={styles.itemIcon}>
                        <AiOutlineLike className={styles.icon} />
                    </div>
                    <div className={styles.itemLabel}>
                        <Text className={styles.label}>Vídeos marcados como gostei</Text>
                    </div>
                </div>
                <div className={`${styles.item} mb-2`} onClick={() => handleToLinkWithAuth('/dislikes', 'Faça login para ver vídeos marcados como não gostei')}>
                    <div className={styles.itemIcon}>
                        <AiOutlineDislike className={styles.icon} />
                    </div>
                    <div className={styles.itemLabel}>
                        <Text className={styles.label}>Vídeos marcados como não gostei</Text>
                    </div>
                </div>

                 <div className={`${styles.itemDivisor}  `}></div>
                <div className={styles.item}>
                    <div className={styles.itemIcon}>
                        <AiOutlineSetting className={styles.icon} />
                    </div>
                    <div className={styles.itemLabel}>
                        <Text className={styles.label}>Configurações</Text>
                    </div>
                </div>
                <div className={styles.item}>
                    <div className={styles.itemIcon}>
                        <MdHelpOutline className={styles.icon} />
                    </div>
                    <div className={styles.itemLabel}>
                        <Text className={styles.label}>Ajuda</Text>
                    </div>
                </div>
            </div>

        </div>
    )
}