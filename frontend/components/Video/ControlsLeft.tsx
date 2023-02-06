import styles from './Video.module.scss'
import { MutableRefObject, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { IoMdPlay, IoMdPause, IoMdVolumeHigh, IoMdVolumeLow, IoMdVolumeOff, IoMdSkipForward, IoMdSkipBackward } from 'react-icons/io'
import { setPauseVideo, setPlaylistBackward, setPlaylistForward, setPlaylistIndex, setPlayVideo, setVideoCurrentId, setVideoCurrentSrc, setVideoPlayBackRate, setVideoTime, setVideoVolume } from '../../redux/reducers/playerReducer'
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip,
} from '@chakra-ui/react'
import { formatCurrentTime } from '../../utils/time'
import { useRouter } from 'next/router'


type Props = {
    video: MutableRefObject<HTMLVideoElement | null>
}

export default ({ video }: Props) => {
    const player = useSelector((state: RootState) => state.player)

    const dispatch = useDispatch()
    const router = useRouter()

    const handlePlayVideo = () => dispatch(setPlayVideo())
    const handlePauseVideo = () => dispatch(setPauseVideo())
    const handleChangeVolumeVideo = (v: number) => dispatch(setVideoVolume(v))
    const handleSkipBackward = () => dispatch(setPlaylistBackward(true))
    const handleSkipForward = () => dispatch(setPlaylistForward(true)) 
 
    const conditionalSkipBackward = player.playlist.length > 0 && player.playlistIndex >= 2 && player.playlist.find((item) => item.id == player.videoCurrentId)
    const conditionalSkipForward = player.playlist.length >= player.playlistIndex + 1 && player.playlist.find((item) => item.id == player.videoCurrentId)

    useEffect(() => {
        if (player.videoIsPlaying) {
            video.current?.play()
        } else {
            video.current?.pause()
        }
    }, [player.videoIsPlaying])

    useEffect(() => {
        if (!video.current) return;

        video.current.volume = player.videoVolume / 100
    }, [player.videoVolume])

    return (
        <div className={styles.controlsLeftButtonsContainer}>
            {conditionalSkipBackward &&
                <Tooltip label='Voltar' placement='bottom'>
                    <div onClick={handleSkipBackward} style={{ cursor: 'pointer' }}>
                        <IoMdSkipBackward />
                    </div>
                </Tooltip>
            }

            {player.videoIsPlaying ?
                <Tooltip label='Pausar' placement='bottom'>
                    <div onClick={handlePauseVideo} style={{ cursor: 'pointer' }}>
                        <IoMdPause />
                    </div>
                </Tooltip>
                :
                <Tooltip label='Reproduzir' placement='bottom'>
                    <div onClick={handlePlayVideo} style={{ cursor: 'pointer' }}>
                        <IoMdPlay />
                    </div>
                </Tooltip>
            }

            {conditionalSkipForward &&
                <Tooltip label='Próxima' placement='bottom'>
                    <div onClick={handleSkipForward} style={{ cursor: 'pointer' }}>
                        <IoMdSkipForward />
                    </div>
                </Tooltip>
            }

            <div className={styles.controlsLeftVolume}>
                <Tooltip label='Volume' placement='bottom'>
                    <div>
                        {player.videoVolume < 1 ?
                            <IoMdVolumeOff onClick={() => handleChangeVolumeVideo(100)} />
                            : player.videoVolume <= 50 ?
                                <IoMdVolumeLow onClick={() => handleChangeVolumeVideo(0)} />
                                :
                                <IoMdVolumeHigh onClick={() => handleChangeVolumeVideo(0)} />
                        }
                    </div>
                </Tooltip>

                <div className={styles.controlsLeftVolumeSlider}>
                    <Slider
                        value={player.videoVolume}
                        onChange={handleChangeVolumeVideo}
                        max={100}
                    >
                        <SliderTrack bg='rgba(224, 224, 224, 0.363)'  >
                            <SliderFilledTrack bg='white' />
                        </SliderTrack>
                        <SliderThumb boxSize='3.5' bg='white' className={styles.controlsLeftVolumeSliderThumb} />
                    </Slider>
                </div>
            </div>

            <div className={styles.controlsLeftTime}>
                {formatCurrentTime(player.videoTime)} / {formatCurrentTime(player.videoDuration)}
            </div>
        </div>
    )
}