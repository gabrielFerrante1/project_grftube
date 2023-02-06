import { GetServerSideProps } from "next"
import { useEffect } from 'react'
import { useDispatch } from "react-redux"
import styles from '../styles/VideoHistory.module.scss'
import Head from "next/head"
import { setIsAuthenticated, setTokenAccess, setUser } from "../redux/reducers/authReducer"
import { ResponseGetUserServerSide } from "../types/Auth"
import { ApiGetVideoHistory, VideoItem } from "../types/Video"
import { getUserServerSide } from "../utils/getUserServerSide"
import { api } from "../utils/api"
import VideoItemComponent from "../components/VideoItem"
import { Col, Row } from "react-bootstrap"

export default ({ video_history, auth }: Props) => {
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
                <title>Vídeo assistidos| Grftube</title>
            </Head>

            <div className={styles.containerHeader}>Vídeos assistidos</div>
            <Row>
                {video_history.map((item, key) => (
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
    video_history: VideoItem[],
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

    const videos: ApiGetVideoHistory = await api(`videos/history`, 'get', '', token_access)

    return {
        props: {
            video_history: videos.data,
            auth: user
        }
    }
}