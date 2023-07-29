import { GetServerSideProps } from "next"
import { useEffect } from 'react'
import { useDispatch } from "react-redux"
import styles from '../styles/VideoRates.module.scss'
import Head from "next/head"
import { setIsAuthenticated, setTokenAccess, setUser } from "../redux/reducers/authReducer"
import { ResponseGetUserServerSide } from "../types/Auth"
import { ApiGetVideoRates, VideoItem } from "../types/Video"
import { getUserServerSide } from "../utils/getUserServerSide"
import { api } from "../utils/api"
import VideoItemComponent from "../components/VideoItem"
import { Col, Row } from "react-bootstrap"

export default ({ video_dislikes, auth }: Props) => {
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
                <title>Vídeo marcados como não gostei| Grftube</title>
            </Head>

            <div className={styles.containerHeader}>Vídeos marcados como não gostei</div>
            <Row>
                {video_dislikes.map((item, key) => (
                    <Col md={5} xxl={3} key={key}>
                        <VideoItemComponent
                            data={item}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    )
}

type Props = {
    video_dislikes: VideoItem[],
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

    const videos: ApiGetVideoRates = await api(`videos/dislikes`, 'get', '', token_access)

    return {
        props: {
            video_dislikes: videos.data,
            auth: user
        }
    }
}