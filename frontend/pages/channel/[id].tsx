import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import styles from '../../styles/Channel.module.scss'
import { api } from '../../utils/api'
import { getUserServerSide } from '../../utils/getUserServerSide'
import { useDispatch } from 'react-redux'
import { setIsAuthenticated, setToggleModalLogin, setTokenAccess, setUser } from '../../redux/reducers/authReducer'
import { ResponseGetUserServerSide } from '../../types/Auth'
import { ApiGetOneChannel, Channel } from '../../types/Channel'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiGetVideos, VideoItem } from '../../types/Video'
import VideoItemComponent from '../../components/VideoItem'
import { Col, Row } from 'react-bootstrap'

export default ({ channel, auth }: Props) => {
    const dispatch = useDispatch()
    const toast = useToast()
    const router = useRouter()

    const [videos, setVideos] = useState<VideoItem[]>([])

    const handleSubscribe = async () => {
        if (auth) {
            await api(`channels/${channel.id}/subscribe`, 'post', {}, auth.jwt)
            router.push(`/channel/${channel.id}`)
            toast({
                status: 'info',
                title: 'Você se insreveu com sucesso!',
                isClosable: true,
                duration: 3000,
                position: 'bottom-left'
            })
        } else {
            dispatch(setToggleModalLogin(true))
        }
    }
    const handleResetSubscribeChannel = async () => {
        if (!auth) return;

        await api(`channels/${channel.id}/subscribe`, 'post', {}, auth.jwt)
        router.push(`/channel/${channel.id}`)
        toast({
            status: 'info',
            title: 'Você se desinscreveu com sucesso!',
            isClosable: true,
            duration: 3000,
            position: 'bottom-left'
        })
    }

    useEffect(() => {
        // Set auth from server side
        if (auth) {
            dispatch(setUser(auth.user))
            dispatch(setTokenAccess(auth.jwt))
            dispatch(setIsAuthenticated(true))
        }
    }, [])


    useEffect(() => {
        const getVideos = async () => {
            const videos: ApiGetVideos = await api('videos', 'get', `channel_id=${channel.id}`, auth?.jwt)
            setVideos(videos.data)
        }

        getVideos()
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <img
                    src={channel.banner}
                    alt={channel.name}
                />
            </div>

            <div className={styles.channelContainer}>
                <div className={styles.channel}>
                    <div className={styles.channelHeader}>
                        <div className={styles.channelHeaderAvatar}>
                            <img
                                src={channel.avatar}
                                alt={channel.name}
                            />
                        </div>
                        <div className={styles.channelHeaderInfo}>
                            <span className={styles.channelHeaderInfoName}>{channel.name}</span>
                            <span className={styles.channelHeaderInfoCountSubscribers}>{channel.subscribers} {channel.subscribers <= 1 ? 'inscrito' : 'inscritos'} • {channel.count_videos} {channel.count_videos <= 1 ? 'vídeo' : 'vídeos'}</span> 
                        </div>
                        <div className={styles.channelHeaderInfoSubscribe}>
                            {channel.user_subscribed ?
                                <button onClick={handleResetSubscribeChannel} className={styles.channelHeaderInfoDisSubscribeBtn}>Inscrito</button>
                                :
                                <button onClick={handleSubscribe} className={styles.channelHeaderInfoSubscribeBtn}>Inscrever-se</button>
                            }
                        </div>
                    </div>

                    <div className={styles.channelVideos}>
                        <Row>
                            {videos.map((item, key) => (
                                <Col className='mb-5' md={5} xxl={3} key={key}>
                                    <VideoItemComponent
                                        data={item}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>


            </div>
        </div>
    )
}

type Props = {
    channel: Channel,
    auth: ResponseGetUserServerSide | undefined
}


interface Params extends ParsedUrlQuery {
    id: string
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Get Logged User
    const user = await getUserServerSide(ctx)
    const token_access = user?.jwt ?? ''

    const { id } = ctx.params as Params

    let channel: ApiGetOneChannel | null = null;
    try {
        channel = await api(`channels/${id}`, 'get', '', token_access)
    } catch (_e) {
        return { redirect: { destination: '/', permanent: false } }
    }

    return {
        props: {
            channel: channel?.data,
            auth: user ?? false
        }
    }
}