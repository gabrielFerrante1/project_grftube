import { GetServerSideProps } from "next"
import { useEffect } from 'react'
import { useDispatch } from "react-redux"
import styles from '../styles/Subscriptions.module.scss'
import Head from "next/head"
import { setIsAuthenticated, setTokenAccess, setUser } from "../redux/reducers/authReducer"
import { ResponseGetUserServerSide } from "../types/Auth"
import { ApiGetVideoRates } from "../types/Video"
import { getUserServerSide } from "../utils/getUserServerSide"
import { api } from "../utils/api"
import { ChannelItem } from "../types/Channel"
import Link from "next/link"
 
export default ({ channels, auth }: Props) => {
    const dispatch = useDispatch() 

    useEffect(() => {
        // Set auth from server side
        if (auth) {
            dispatch(setUser(auth.user))
            dispatch(setTokenAccess(auth.jwt))
            dispatch(setIsAuthenticated(true))
        }
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>Inscrições| Grftube</title>
            </Head>

            <div className={styles.containerHeader}>Inscrições</div>
            <div className={styles.channels}>
                {channels.map((item, key) => (
                    <Link href={`/channel/${item.id}`} key={key}>
                        <div className={styles.channelItem}>
                            <div className={styles.channelItemAvatar}>
                                <img src={item.avatar} alt={item.name} />
                            </div>
                            <div className={styles.channelItemName}>
                                {item.name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

type Props = {
    channels: ChannelItem[],
    auth: ResponseGetUserServerSide | undefined
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Get Logged User
    const user = await getUserServerSide(ctx)
    const token_access = user?.jwt

    if (!user) {
        return {
            redirect: { destination: '/', permanent: true }
        }
    }

    const channels: ApiGetVideoRates = await api(`channels`, 'get', '', token_access)

    return {
        props: {
            channels: channels.data,
            auth: user
        }
    }
}