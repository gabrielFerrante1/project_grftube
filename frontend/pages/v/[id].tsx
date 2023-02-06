import { Avatar, Heading, Tooltip, useToast } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Player from "../../components/Video/Player"
import { setLayoutMenuActive } from "../../redux/reducers/appReducer"
import { setIsAuthenticated, setToggleModalLogin, setTokenAccess, setUser } from "../../redux/reducers/authReducer"
import { setMiniplayerActive, setPlaylist, setPlaylistName, setVideoIsPlaying, setVideoPlayBackRate } from "../../redux/reducers/playerReducer"
import { RootState } from "../../redux/store"
import styles from '../../styles/Video.module.scss'
import { ResponseGetUserServerSide } from "../../types/Auth"
import { ApiGetOneVideo, ApiGetVideos, Video, VideoItem } from "../../types/Video"
import { api } from "../../utils/api"
import { getUserServerSide } from "../../utils/getUserServerSide"
import { MdOutlineVerified } from 'react-icons/md'
import { BiLike, BiDislike, BiShare, BiDownload } from 'react-icons/bi';
import { formatSubscribers } from "../../utils/formatSubscribers"
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import { dateFromNow } from "../../utils/transformDateFromNow"
import VideoComment from "../../components/VideoComment"
import VideoItemComponent from "../../components/VideoItem"
import Head from "next/head"
import { Playlist } from "../../components/Playlist"

export default ({ video, auth }: Props) => {
    const player = useSelector((state: RootState) => state.player)
    const authReducer = useSelector((state: RootState) => state.auth)

    const toast = useToast()
    const dispatch = useDispatch()
    const router = useRouter()

    const [seconds, setSeconds] = useState<number | undefined>(+video.user_viewed.minutes)
    const [videos, setVideos] = useState<VideoItem[]>([]) 

    const handleSubscribeChannel = async () => {
        if (auth) {
            await api(`channels/${video.channel.id}/subscribe`, 'post', {}, auth.jwt)
            router.push(`/v/${video.id}/`)
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

        await api(`channels/${video.channel.id}/subscribe`, 'post', {}, auth.jwt)
        router.push(`/v/${video.id}/`)
        toast({
            status: 'info',
            title: 'Você se desinscreveu com sucesso!',
            isClosable: true,
            duration: 3000,
            position: 'bottom-left'
        })
    }

    const handleLikeVideo = async () => {
        if (auth) {
            if (video.user_rate == 'dislike') {
                await api(`videos/${video.id}/rate/dislike`, 'post', {}, auth.jwt)
            }
            await api(`videos/${video.id}/rate/like`, 'post', {}, auth.jwt)
            router.push(`/v/${video.id}/`)
            toast({
                status: 'info',
                title: 'Você se curtiu o vídeo!',
                isClosable: true,
                duration: 2000,
                position: 'bottom-left'
            })
        } else {
            dispatch(setToggleModalLogin(true))
        }
    }

    const handleDisLikeVideo = async () => {
        if (auth) {
            if (video.user_rate == 'like') {
                await api(`videos/${video.id}/rate/like`, 'post', {}, auth.jwt)
            }
            await api(`videos/${video.id}/rate/dislike`, 'post', {}, auth.jwt)
            router.push(`/v/${video.id}/`)
            toast({
                status: 'info',
                title: 'Você avaliou o vídeo como não gostei!',
                isClosable: true,
                duration: 2000,
                position: 'bottom-left'
            })
        } else {
            dispatch(setToggleModalLogin(true))
        }
    }

    const getVideoRelateds = async () => {
        const videos: ApiGetVideos = await api('videos', 'get', '', auth?.jwt)

        setVideos(videos.data)
    }

    useEffect(() => {
        if (authReducer.is_authenticated) {
            router.push(`/v/${video.id}`)
        }
    }, [authReducer.is_authenticated])

    useEffect(() => {
        dispatch(setLayoutMenuActive(false))

        // Set auth from server side
        if (auth) {
            dispatch(setUser(auth.user))
            dispatch(setTokenAccess(auth.jwt))
            dispatch(setIsAuthenticated(true))
        }
    }, [])

    useEffect(() => { 
        dispatch(setPlaylistName('Playlist legal'))
        dispatch(setPlaylist([
            {
                "id": 1,
                "title": "Meu poeta - Feat: Arlindo Cruz",
                src: "/a.mp4",
                "thumbnail": "https://jpimg.com.br/uploads/2020/05/zeca-pagodinho-1.jpg",
                "minutes": "06:51",
                "date": new Date(),
                "channel": {
                    "id": 2,
                    "name": "Zeca pagodinho",
                    "avatar": "https://yt3.ggpht.com/ytc/AMLnZu-AZNA_ba84E8kH3R5E-H8eBqBTGETlGGQAkfgtYQ=s900-c-k-c0x00ffffff-no-rj",
                    "verified": true
                },
                "minutes_viewed": "316.046803",
                "views": 1
            }, {
                "id": 2,
                "title": "VIDEO ALEATROIO ",
                src: "/Z.mp4",
                "thumbnail": "https://jpimg.com.br/uploads/2020/05/zeca-pagodinho-1.jpg",
                "minutes": "06:51",
                "date": new Date(),
                "channel": {
                    "id": 2,
                    "name": "Zeca pagodinho",
                    "avatar": "https://yt3.ggpht.com/ytc/AMLnZu-AZNA_ba84E8kH3R5E-H8eBqBTGETlGGQAkfgtYQ=s900-c-k-c0x00ffffff-no-rj",
                    "verified": true
                },
                "minutes_viewed": "316.046803",
                "views": 1
            },
        ])) 
        
        if (player.miniplayerActive) {
            dispatch(setMiniplayerActive(false))
        }

        if (player.miniplayerActive && router.query['id'] == player.videoCurrentId.toString()) {
            setSeconds(player.videoTime)
        } else {
            setSeconds(+video.user_viewed.minutes)
            dispatch(setVideoIsPlaying(false))
            dispatch(setVideoPlayBackRate(1))
        }
    }, [])

    useEffect(() => {
        getVideoRelateds();
    }, [video.id])
 
    return (
        <div className={styles.container}>
            <Head>
                <title>{video.title} | Grftube</title>
            </Head>

            <div className={styles.containerVideoLeft}>
                <div className={styles.video}>
                    <Player
                        video_id={video.id}
                        src={video.src}
                        seconds={seconds}

                    />
                </div>
                <div className={styles.videoTags}>
                    {video.tags.map((item, key) => (
                        <div key={key} className={styles.tag}>
                            #{item}
                        </div>
                    ))}
                </div>

                <div className={styles.videoTitle} style={{ marginTop: video.tags.length > 0 ? '-1px' : '4px' }}>
                    <Heading as='h3' className={styles.title}>
                        {video.title}
                    </Heading>
                </div>

                <div className={styles.videoActions}>
                    <div className={styles.videoChannel}>
                        <Link href={`/channel/${video.channel.id}`}>
                            <Avatar src={video.channel.avatar} />
                        </Link>
                        <div className={styles.videoChannelInfo}>
                            <div className="d-flex" style={{ alignItems: 'center' }}>
                                <span className={styles.videoChannelInfoName}>{video.channel.name} </span>
                                {video.channel.verified &&
                                    <Tooltip label='Verificado'>
                                        <div style={{ marginTop: '1.5px', marginLeft: '7px' }}>
                                            <MdOutlineVerified className={styles.videoChannelInfoVerifiedIcon} />
                                        </div>
                                    </Tooltip>
                                }
                            </div>
                            <span className={styles.videoChannelInfoSubscribers}>{formatSubscribers(video.channel.subscribers)}</span>
                        </div>

                        {video.user_subscribed ?
                            <button onClick={handleResetSubscribeChannel} className={styles.videoChannelDisSubscribButton}>Inscrito</button>
                            :
                            <button onClick={handleSubscribeChannel} className={styles.videoChannelSubscribButton}>Inscrever-se</button>
                        }
                    </div>

                    <div className={styles.videoInteractions}>
                        <div className={styles.videoInteraction}>
                            <div className={styles.videoInteractionLike} onClick={handleLikeVideo}>
                                {video.user_rate == 'like' ?
                                    <AiFillLike className={styles.videoInteractionIcon} />
                                    :
                                    <BiLike className={styles.videoInteractionIcon} />
                                }
                                <span>{video.likes} likes</span>
                            </div>
                            <div className={styles.videoInteractionDislike} onClick={handleDisLikeVideo}>
                                {video.user_rate == 'dislike' ?
                                    <AiFillDislike className={styles.videoInteractionIcon} />
                                    :
                                    <BiDislike className={styles.videoInteractionIcon} />
                                }
                            </div>
                        </div>

                        <div className={styles.videoInteraction}>
                            <BiShare className={styles.videoInteractionIcon} />
                            <span>Compartilhar</span>
                        </div>
                        <div className={styles.videoInteraction}>
                            <BiDownload className={styles.videoInteractionIcon} />
                            <span>Download</span>
                        </div>
                    </div>
                </div>

                <div className={styles.description}>
                    <div className={styles.descriptionInfo}>
                        {video.views} visualizações • há {dateFromNow(video.date)}
                    </div>
                    <div className={styles.descriptionBody}>
                        {video.description}
                    </div>
                </div>

                {video.comments_area ?
                    <VideoComment
                        video_id={video.id}
                    />
                    :
                    <div className={styles.textDesactivateCommentsArea}>
                        Os comentários estão desativados.
                    </div>
                }
            </div>

            <div className={styles.containerVideoRight}>
                {player.playlist.length > 0 ?
                    <div className={styles.playlist}>
                        <Playlist />
                    </div>
                    : ''}

                {videos.map((item, key) => (
                    <div className="mt-4" key={key}>
                        <VideoItemComponent
                            data={item}
                            small
                        />
                    </div>
                ))}

            </div>
        </div>
    )
}

type Props = {
    video: Video,
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

    const video: ApiGetOneVideo = await api(`videos/${id}`, 'get', '', token_access)

    return {
        props: {
            video,
            auth: user ?? false
        }
    }
}