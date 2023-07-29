import styles from './Video.module.scss';

import { MdReplay10, MdForward10 } from 'react-icons/md'
import { IoMdPlay, IoMdPause } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MutableRefObject } from 'react'
import { setPauseVideo, setPlayVideo, setVideoTime } from '../../redux/reducers/playerReducer';
import { Tooltip } from '@chakra-ui/react';

type Props = {
    video: MutableRefObject<HTMLVideoElement | null>
}

export default ({ video }: Props) => {
    const player = useSelector((state: RootState) => state.player)

    const dispatch = useDispatch()

    const handlePlayVideo = () => dispatch(setPlayVideo())
    const handlePauseVideo = () => dispatch(setPauseVideo())

    const handleReplay = () => {
        if (!video.current) return;

        if (player.videoTime >= 10) {
            video.current.currentTime = player.videoTime - 10
            dispatch(setVideoTime(player.videoTime - 10))
        }
    }

    const handleForward = () => {
        if (!video.current) return;

        video.current.currentTime = player.videoTime + 10
        dispatch(setVideoTime(player.videoTime + 10))
    }

    return (
        <div className={styles.controlsInsidePlayerContainer}>
            <MdReplay10 className={styles.controlsInsidePlayerIcon} onClick={handleReplay} />

            {player.videoIsPlaying ?
                <div
                    className={styles.controlsInsidePlayerPlayAndPause}
                    onClick={handlePauseVideo}
                >
                    <IoMdPause style={{ cursor: 'pointer' }} />
                </div>
                :
                <div
                    className={styles.controlsInsidePlayerPlayAndPause}
                    onClick={handlePlayVideo}
                >
                    <IoMdPlay style={{ paddingLeft: '4px' }} />
                </div>
            }

            <MdForward10 className={styles.controlsInsidePlayerIcon} onClick={handleForward} />

        </div>
    )
}