import { VideoItem } from '../../types/Video'
import styles from './VideoItem.module.scss'
import { VscVerified } from 'react-icons/vsc'
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip } from '@chakra-ui/react'
import { dateFromNow } from '../../utils/transformDateFromNow'
import Link from 'next/link'
import { formatToSeconds } from '../../utils/time'
import { useDispatch } from 'react-redux'
import { setPauseVideo } from '../../redux/reducers/playerReducer'
import { useRouter } from 'next/router'

type Props = {
    data: VideoItem;
    small?: boolean
}

export default ({ data, small = false }: Props) => {
    const per = (+data.minutes_viewed / formatToSeconds(data.minutes)) * 100

    const dispatch = useDispatch()
    const router = useRouter()

    const onClick = () => {
        dispatch(setPauseVideo())
        router.push(`/v/${data.id}`)
    }

    return (
        <div
            className={styles.container}
            style={{ flexDirection: small ? 'row' : 'column' }}
        >
            <div onClick={onClick} style={{cursor:'pointer'}}>
                <div
                    className={styles.thumbnail}
                    style={{
                        maxWidth: small ? '180px' : '310px',
                        maxHeight: small ? '180px' : '310px'
                    }}
                >
                    <img
                        alt={data.title}
                        src={data.thumbnail}
                    />

                    <div className={styles.thumbnailMinutes}>
                        {data.minutes}
                    </div>

                    <div className={styles.progressVideo}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${per < 6 ? 6 : per}%`, borderBottomRightRadius: per >= 99 ? '10px' : 0 }}
                        >

                        </div>
                    </div>
                </div>
            </div>

            <div
                className={styles.videoInfo}
                style={{
                    marginTop: small ? '0' : '15px',
                    marginLeft: small ? '10px' : '0'
                }}
            >
                {!small &&
                    <div className={styles.channelAvatar}>
                        <Link href={`/channel/${data.channel.id}`}>
                            <img
                                alt={''}
                                src={data.channel.avatar}
                            />
                        </Link>
                    </div>
                }

                <div
                    className={styles.info}
                    style={{ marginTop: small ? '0' : '-5px' }}
                >
                    <div onClick={onClick} style={{ cursor: 'pointer' }}>
                        <div
                            className={styles.infoTitle}
                            style={{
                                fontSize: small ? '16px' : '18px',
                                width: small ? '220px' : '260px'
                            }}
                        >
                            {small ?
                                `${data.title.substring(0, 50)}${data.title.length > 50 ? '...' : ''}`
                                :
                                data.title
                            }
                        </div>
                    </div>

                    <div className={styles.infoChannel}>
                        <Link href={`/channel/${data.channel.id}`}>
                            <div
                                className={styles.infoChannelName}
                                style={{
                                    maxWidth: small ? '170px' : '200px'
                                }}
                            >
                                {data.channel.name}
                            </div>
                        </Link>

                        <Tooltip label='Verificado' placement='right'>
                            <div className={styles.infoChannelVerified}>
                                {data.channel.verified &&
                                    <VscVerified />
                                }
                            </div>
                        </Tooltip>
                    </div>

                    <div className={styles.infoVideo}>

                        {data.views} visualizações • há {dateFromNow(data.date)}

                    </div>
                </div>
            </div>
        </div>
    )
}