import { useRouter } from "next/router";
import { MutableRefObject, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylistBackward, setPlaylistForward, setPlaylistIndex, setPlaylistSetToVideoId, setPlayVideo, setVideoCurrentId, setVideoCurrentSrc, setVideoPlayBackRate, setVideoTime } from "../../redux/reducers/playerReducer";
import { RootState } from "../../redux/store";

export function usePlaylist(
    video: MutableRefObject<HTMLVideoElement | null>,
    video_id: number,
    miniplayerMode: boolean
) {
    const player = useSelector((state: RootState) => state.player)

    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (player.playlist.length > 0) {
            player.playlist.forEach((item, index) => {
                if (item.id == video_id) {
                    dispatch(setPlaylistIndex(index + 1))
                }
            })

            if (!video.current) return;

            video.current.currentTime = 0
            dispatch(setVideoTime(0))
        }

    }, [player.playlist, video_id])

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (!video.current) return;

            if (video.current.currentTime == video.current.duration) {
                const nextIndex = player.playlistIndex + 1

                if (player.playlist.length >= nextIndex) dispatch(setPlaylistForward(true))
            }
        }

        if (player.playlist.length > 0) {
            video.current?.addEventListener('timeupdate', handleTimeUpdate)

            return () => {
                video.current?.removeEventListener('timeupdate', handleTimeUpdate)
            }
        }
    }, [player.playlist, player.playlistIndex])


    // Action skip backward video of a playlist
    useEffect(() => {
        if (player.playlistBackward) {
            if (!video.current) return;

            if (player.playlist.length > 0 && player.playlistIndex >= 2) {
                const backIndex = player.playlistIndex - 1

                video.current.src = player.playlist[backIndex - 1].src
                video.current.currentTime = 0;
                video.current.autoplay = true

                dispatch(setVideoTime(0))
                dispatch(setPlaylistIndex(backIndex))
                dispatch(setVideoCurrentId(player.playlist[backIndex - 1].id))
                dispatch(setVideoCurrentSrc(player.playlist[backIndex - 1].src))
                dispatch(setVideoPlayBackRate(1))
                dispatch(setPlayVideo())

                dispatch(setPlaylistBackward(false))

                if (!miniplayerMode) {
                    router.push(`/v/${player.playlist[backIndex - 1].id}`)
                }
            }
        }
    }, [player.playlistBackward])

    // Action skip forward video of a playlist
    useEffect(() => {
        if (player.playlistForward) {
            if (!video.current) return;

            if (player.playlist.length >= player.playlistIndex + 1) {
                const nextIndex = player.playlistIndex + 1

                video.current.src = player.playlist[nextIndex - 1].src
                video.current.currentTime = 0;
                video.current.autoplay = true

                dispatch(setVideoTime(0))
                dispatch(setPlaylistIndex(nextIndex))
                dispatch(setVideoCurrentId(player.playlist[nextIndex - 1].id))
                dispatch(setVideoCurrentSrc(player.playlist[nextIndex - 1].src))
                dispatch(setVideoPlayBackRate(1))
                dispatch(setPlayVideo())

                dispatch(setPlaylistForward(false))

                if (!miniplayerMode) {
                    router.push(`/v/${player.playlist[nextIndex - 1].id}`)
                }
            }
        }
    }, [player.playlistForward])

    // Action skip for video_id video of a playlist
    useEffect(() => {
        if (player.playlisToVideoId) {
            if (player.playlist.length <= 0) return;

            player.playlist.forEach((item, index) => {
                if (item.id == player.playlisToVideoId) {
                    if (!video.current) return;

                    video.current.src = player.playlist[index].src
                    video.current.currentTime = 0;
                    video.current.autoplay = true
                    
                    dispatch(setVideoTime(0))
                    dispatch(setPlaylistIndex(index + 1))
                    dispatch(setVideoCurrentId(player.playlist[index].id))
                    dispatch(setVideoCurrentSrc(player.playlist[index].src))
                    dispatch(setVideoPlayBackRate(1))
                    dispatch(setPlayVideo())

                    dispatch(setPlaylistForward(false))

                    if (!miniplayerMode) {
                        router.push(`/v/${player.playlist[index].id}`)
                    }
                }
            })

            dispatch(setPlaylistSetToVideoId(0))
        }
    }, [player.playlisToVideoId])
}