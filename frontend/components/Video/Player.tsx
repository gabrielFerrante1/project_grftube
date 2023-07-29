import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMiniplayerActive, setVideoCurrentId, setVideoCurrentSrc, setVideoIsPlaying, setVideoTime, setVideoVolume } from '../../redux/reducers/playerReducer';
import ControlsInsidePlayer from './ControlsInsidePlayer';
import ControlsLeft from './ControlsLeft';
import ControlsRight from './ControlsRight';
import Progressbar from './ProgressBar';
import styles from './Video.module.scss';
import { IoExpand, IoClose } from 'react-icons/io5'
import { Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { RootState } from '../../redux/store';
import { usePlaylist } from './controlsPlaylist';

type Props = {
    video_id: number;
    src: string;
    miniplayerSeconds?: number;
    miniplayerVolume?: number;
    miniplayerMode?: boolean;
    seconds?: number;
}

export default ({ src, video_id, seconds, miniplayerSeconds, miniplayerVolume, miniplayerMode = false }: Props) => {
    const player = useSelector((state: RootState) => state.player)

    const video = useRef<HTMLVideoElement | null>(null)
    const controls = useRef<HTMLDivElement | null>(null)
    const controlsInsidePlayer = useRef<HTMLDivElement | null>(null)
    const controlsMiniplayerHeader = useRef<HTMLDivElement | null>(null)

    const dispatch = useDispatch()
    const router = useRouter()

    /* Hook that controls a playlist */
    usePlaylist(video, video_id, miniplayerMode)

    const handleHoverVideo = () => {
        let el = controlsInsidePlayer.current
        let elC = controls.current
        let elM = controlsMiniplayerHeader.current

        if (!el || !elC) return;

        el.style.background = 'rgba(34, 34, 34, 0.5)'
        el.style.boxShadow = 'inset 1px -21px 116px -7px rgba(0, 0, 0, 0.75)'
        el.style.opacity = '1'
        elC.style.opacity = '1'

        if (elM) elM.style.opacity = '1'
    }

    const handleOutHoverVideo = () => {
        let el = controlsInsidePlayer.current
        let elC = controls.current
        let elM = controlsMiniplayerHeader.current

        if (!el || !elC) return;

        el.style.background = 'transparent'
        el.style.boxShadow = 'none'
        el.style.opacity = '0'
        elC.style.opacity = '0'

        if (elM) elM.style.opacity = '0'
    }

    const handleExpandMiniplayer = () => router.push(`/v/${player.videoCurrentId}`)
    const handleCloseMiniplayer = () => {
        dispatch(setVideoCurrentId(0))
        dispatch(setVideoCurrentSrc(''))
        dispatch(setVideoIsPlaying(false))
        dispatch(setVideoTime(0))
        dispatch(setMiniplayerActive(false))
    }

    useEffect(() => {
        dispatch(setVideoCurrentId(video_id))
        dispatch(setVideoCurrentSrc(src))

        if (!video.current || player.videoIsPlaying) return;
        video.current.src = src
        video.current.autoplay = false
    }, [video_id])

    useEffect(() => {
        if (seconds != undefined && video.current) {
            video.current.currentTime = seconds
            dispatch(setVideoTime(seconds))
        }

    }, [seconds])

    useEffect(() => {
        if (miniplayerSeconds != undefined && video.current) {
            video.current.currentTime = miniplayerSeconds
            dispatch(setVideoTime(miniplayerSeconds))
        }

        if (miniplayerVolume != undefined) {
            dispatch(setVideoVolume(miniplayerVolume))
        }
    }, [])

    return (
        <div className={styles.containerVideoPlayer}>
            <div
                className={styles.videoPlayer}
                onMouseEnter={handleHoverVideo}
                onMouseLeave={handleOutHoverVideo}
                style={{ borderRadius: miniplayerMode ? '10px' : 0 }}
            >
                {miniplayerMode &&
                    <div
                        className={styles.controlsMiniplayerHeader}
                        ref={controlsMiniplayerHeader}
                    >
                        <Tooltip label='Expandir' placement='auto'>
                            <div className={styles.controlsMiniplayerButton} onClick={handleExpandMiniplayer}>
                                <IoExpand />
                            </div>
                        </Tooltip>
                        <Tooltip label='Fechar' placement='auto'>
                            <div className={styles.controlsMiniplayerButton} onClick={handleCloseMiniplayer}>
                                <IoClose />
                            </div>
                        </Tooltip>
                    </div>
                }

                <div
                    className={styles.controlsInsidePlayer}
                    ref={controlsInsidePlayer}
                >
                    <ControlsInsidePlayer
                        video={video}
                    />
                </div>

                <video
                    ref={video}
                    style={{ borderRadius: miniplayerMode ? '10px' : 0 }}
                >
                    <source src={src} type='video/mp4' />
                </video>

                <div className={styles.controls} ref={controls}>
                    <div className={styles.controlsSlider} >
                        <Progressbar
                            video={video}
                            video_id={video_id}
                        />
                    </div>

                    <div className={styles.controlsOptions} hidden={miniplayerMode}>
                        <ControlsLeft
                            video={video}
                        />

                        <ControlsRight
                            video={video}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}