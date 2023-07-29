import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playlist } from '../../types/Playlist';

export const slice = createSlice({
    name: 'player',
    initialState: {
        videoCurrentId: 0,
        videoCurrentSrc: '',
        videoIsPlaying: false,
        videoTime: 0,
        videoDuration: 0,
        videoVolume: 100,
        videoPlayBackRate: 1,
        videoLoop: false,

        miniplayerActive: false,

        playlistName: '',
        playlistIndex: 0,
        playlist: [] as Playlist,
        playlistBackward: false,
        playlistForward: false,
        playlisToVideoId: 0
    },
    reducers: {
        setVideoCurrentId: (state, action: PayloadAction<number>) => {
            state.videoCurrentId = action.payload
        },
        setVideoCurrentSrc: (state, action: PayloadAction<string>) => {
            state.videoCurrentSrc = action.payload
        },
        setVideoIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.videoIsPlaying = action.payload
        },
        setVideoTime: (state, action: PayloadAction<number>) => {
            state.videoTime = action.payload
        },
        setVideoDuration: (state, action: PayloadAction<number>) => {
            state.videoDuration = action.payload
        },
        setVideoVolume: (state, action: PayloadAction<number>) => {
            state.videoVolume = action.payload
        },
        setVideoPlayBackRate: (state, action: PayloadAction<number>) => {
            state.videoPlayBackRate = action.payload
        },
        setVideoLoop: (state, action: PayloadAction<boolean>) => {
            state.videoLoop = action.payload
        },
        setMiniplayerActive: (state, action: PayloadAction<boolean>) => {
            state.miniplayerActive = action.payload
        },
        setPlaylistName: (state, action: PayloadAction<string>) => {
            state.playlistName = action.payload
        },
        setPlaylistIndex: (state, action: PayloadAction<number>) => {
            state.playlistIndex = action.payload
        },
        setPlaylist: (state, action: PayloadAction<Playlist>) => {
            state.playlist = action.payload
        },
        setPlaylistBackward: (state, action: PayloadAction<boolean>) => {
            state.playlistBackward = action.payload
        },
        setPlaylistForward: (state, action: PayloadAction<boolean>) => {
            state.playlistForward = action.payload
        },
        setPlaylistSetToVideoId: (state, action: PayloadAction<number>) => {
            state.playlisToVideoId = action.payload
        },


        setPlayVideo: (state) => {
            state.videoIsPlaying = true
        },
        setPauseVideo: (state) => {
            state.videoIsPlaying = false
        },
    }
});


export const {
    setVideoCurrentId,
    setVideoCurrentSrc,
    setVideoIsPlaying,
    setVideoLoop,
    setMiniplayerActive,
    setPlayVideo,
    setPauseVideo,
    setVideoPlayBackRate,
    setVideoTime,
    setVideoDuration,
    setVideoVolume,
    setPlaylistName,
    setPlaylistIndex,
    setPlaylist,
    setPlaylistBackward,
    setPlaylistForward,
    setPlaylistSetToVideoId
} = slice.actions;

export default slice.reducer;