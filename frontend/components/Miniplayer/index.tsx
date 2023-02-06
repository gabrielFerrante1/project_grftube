import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import Player from '../Video/Player'
import styles from './Miniplayer.module.scss'

export default () => {
    const player = useSelector((state: RootState) => state.player)
    return (
        <div className={styles.container}>
            {
                player.miniplayerActive &&
                <Player
                    video_id={player.videoCurrentId}
                    src={player.videoCurrentSrc}
                    miniplayerSeconds={player.videoTime}
                    miniplayerVolume={player.videoVolume}
                    miniplayerMode
                />
            }
        </div >
    )
}