import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { api } from '../utils/api';
import { getUserServerSide } from '../utils/getUserServerSide';
import { ApiGetVideos, VideoItem } from '../types/Video';
import VideoItemComponent from '../components/VideoItem';
import { Row, Col } from 'react-bootstrap';
import styles from '../styles/Home.module.scss' 

// Fet
const Home = ({ videos }: Props) => {  
    
    return (
        <div className={styles.container}>
            <Head>
                <title>GrfTube</title>
            </Head>

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
    )
}

type Props = {
    videos: VideoItem[]
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Get Logged User
    const user = await getUserServerSide(ctx)
    const token_access = user?.jwt ?? ''

    const videos: ApiGetVideos = await api('videos', 'get', '', token_access)

    return {
        props: {
            videos: videos.data
        }
    }
}

export default Home

