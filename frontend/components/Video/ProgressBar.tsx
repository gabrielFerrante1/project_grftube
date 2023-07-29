import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from '@chakra-ui/react'
import { MutableRefObject, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMiniplayerActive, setPauseVideo, setVideoCurrentId, setVideoCurrentSrc, setVideoDuration, setVideoTime } from '../../redux/reducers/playerReducer'
import { RootState } from '../../redux/store'
import { api } from '../../utils/api'

type Props = {
    video: MutableRefObject<HTMLVideoElement | null>,
    video_id: number
}

export default ({ video, video_id }: Props) => {
    const player = useSelector((state: RootState) => state.player)
    const auth = useSelector((state: RootState) => state.auth)

    const [progressBarHeight, setProgressBarHeight] = useState('4px')

    const dispatch = useDispatch()

    const handleChangeTimeVideo = (time: number) => {
        if (!video.current) return;

        video.current.currentTime = time
        dispatch(setVideoTime(time))
    }

    const handleSetUserViewed = async () => {
        if (!video.current) return;

        await api(`videos/${video_id}/views`, 'post', {
            seconds: video.current.currentTime.toString(),
        }, auth.token_access).catch(() => { })
    }

    useEffect(() => {
        if (auth.is_authenticated && auth.token_access) {
            const id = setInterval(function () {
                handleSetUserViewed()
            }, 15000)

            return () => {
                clearInterval(id)
            }
        }
    }, [auth.is_authenticated, player.playlistIndex])

    useEffect(() => {
        const handleSetCurrentTime = () => {
            if (!video.current) return;

            let currentTime = video.current.currentTime
            dispatch(setVideoTime(currentTime))

            if (currentTime == video.current.duration) {
                dispatch(setPauseVideo())
            }
        }

        video.current?.addEventListener('timeupdate', handleSetCurrentTime)
        return () => {
            video.current?.removeEventListener('timeupdate', handleSetCurrentTime)
        }
    }, [])


    useEffect(() => {
        const handleSetDuration = () => {
            if (!video.current || !video.current.duration) return;

            dispatch(setVideoDuration(video.current.duration))
        }

        handleSetDuration()

        video.current?.addEventListener('loadedmetadata', handleSetDuration)
        return () => {
            video.current?.removeEventListener('loadedmetadata', handleSetDuration)
        }
    }, [])

    return (
        <div>
            <Slider
                value={player.videoTime}
                max={player.videoDuration}
                onChange={handleChangeTimeVideo}
                onMouseEnter={() => setProgressBarHeight('6px')}
                onMouseLeave={() => setProgressBarHeight('4px')}
            >
                <SliderTrack bg='rgba(224, 224, 224, 0.363)' style={{ height: progressBarHeight }}>
                    <SliderFilledTrack bg='red' />
                </SliderTrack>
                <SliderThumb boxSize={3} bg='red' style={{ boxShadow: 'none' }} />
            </Slider>
        </div>
    )
}