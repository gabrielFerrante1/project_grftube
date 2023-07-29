import styles from './Playlist.module.scss'

import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import VideoItem from "../VideoItem"


export const Playlist = () => {
    const player = useSelector((state: RootState) => state.player)


    return (
        <div className={styles.cardPlaylist}>
            {player.playlistName != '' &&
                <div className={styles.cardPlaylistHeader}>
                    <h2>{player.playlistName}</h2>
                </div>
            }

            <div className={styles.cardPlaylistList}>
                {player.playlist.map((item, key) => (
                    <div key={key} className={`${styles.playlistItem} ${player.videoCurrentId == item.id ? styles.playlistItemRunning : ''}`}>
                        <VideoItem
                            data={item}
                            small
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}