import styles from './Video.module.scss'
import { Tooltip } from '@chakra-ui/react'
import { MutableRefObject, useEffect } from 'react'
import { BiFullscreen, BiPlayCircle } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { MdLoop } from 'react-icons/md'
import { setVideoLoop, setVideoPlayBackRate } from '../../redux/reducers/playerReducer'
import { Dropdown } from 'react-bootstrap'

type Props = {
    video: MutableRefObject<HTMLVideoElement | null>
}

export default ({ video }: Props) => {
    const player = useSelector((state: RootState) => state.player)

    const dispatch = useDispatch()

    const handleChangeSpeed = (s: number) => dispatch(setVideoPlayBackRate(s))
    const handleFullScreen = () => video.current?.requestFullscreen()
    const handleToggleLoop = () => dispatch(setVideoLoop(!player.videoLoop))

    useEffect(() => {
        if (video.current) video.current.loop = player.videoLoop
    }, [player.videoLoop])

    useEffect(() => {
        if (video.current) video.current.playbackRate = player.videoPlayBackRate
    }, [player.videoPlayBackRate])

    useEffect(() => {
        dispatch(setVideoPlayBackRate(1))
    }, [player.videoCurrentSrc])

    return (
        <div className={styles.controlsRightButtonsContainer}>
            <Dropdown drop='up'>
                <Dropdown.Toggle as={({ onClick }) =>
                    <div onClick={onClick} style={{ cursor: 'pointer' }}>
                        <BiPlayCircle />
                    </div>
                } />

                <Dropdown.Menu>
                    <Dropdown.Item active={player.videoPlayBackRate == .25} onClick={() => handleChangeSpeed(.25)}>0.25</Dropdown.Item>
                    <Dropdown.Item active={player.videoPlayBackRate == .5} onClick={() => handleChangeSpeed(.5)}>0.5</Dropdown.Item>
                    <Dropdown.Item active={player.videoPlayBackRate == .75} onClick={() => handleChangeSpeed(.75)}>0.75</Dropdown.Item>
                    <Dropdown.Item active={player.videoPlayBackRate == 1} onClick={() => handleChangeSpeed(1)}>Normal</Dropdown.Item>
                    <Dropdown.Item active={player.videoPlayBackRate == 1.25} onClick={() => handleChangeSpeed(1.25)}>1.25</Dropdown.Item>
                    <Dropdown.Item active={player.videoPlayBackRate == 1.5} onClick={() => handleChangeSpeed(1.5)}>1.5</Dropdown.Item>
                    <Dropdown.Item active={player.videoPlayBackRate == 1.75} onClick={() => handleChangeSpeed(1.75)}>1.75</Dropdown.Item>
                    <Dropdown.Item active={player.videoPlayBackRate == 2} onClick={() => handleChangeSpeed(2)}>2</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Tooltip label={player.videoLoop ? "Desativar loop" : "Ativar loop"} placement='bottom'>
                <div onClick={handleToggleLoop} style={{ cursor: 'pointer' }}>
                    <MdLoop />
                </div>
            </Tooltip>

            <Tooltip label='Voltar' placement='bottom'>
                <div onClick={handleFullScreen} style={{ cursor: 'pointer' }}>
                    <BiFullscreen />
                </div>
            </Tooltip>
        </div>
    )
}