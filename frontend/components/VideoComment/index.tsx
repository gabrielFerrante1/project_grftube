import { Avatar, Input, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ApiGetCommentsOfVideo, CommentItem } from '../../types/Comment';
import { api } from '../../utils/api';
import styles from './VideoComment.module.scss';
import { FiSend } from 'react-icons/fi'
import { dateFromNow } from '../../utils/transformDateFromNow';

export default ({ video_id }: { video_id: number }) => {
    const auth = useSelector((state: RootState) => state.auth)

    const toast = useToast()

    const [comments, setComments] = useState<CommentItem[]>([])
    const [commentsCount, setCommentsCount] = useState(0)
    const [userCommented, setUserCommented] = useState(true)
    const [inputComment, setInputComment] = useState('')

    const getComments = async () => {
        const comments: ApiGetCommentsOfVideo = await api(`videos/${video_id}/comments`)

        setUserCommented(comments.userCommented)
        setComments(comments.comments)
        setCommentsCount(comments.commentsCount)
    }

    const handlePublishNewComment = async () => {
        if (!inputComment) {
            toast({
                status: 'error',
                title: 'Digite algo no campo para publicar!',
                duration: 1300,
                position: 'bottom-left'
            })
            return;
        }

        await api(`videos/${video_id}/comments`, 'post', {
            body: inputComment
        }, auth.token_access)

        toast({
            status: 'success',
            title: 'Comentário publicado com sucesso!',
            duration: 1300,
            position: 'bottom-left'
        })
        getComments()
    }

    useEffect(() => {
        getComments()
    }, [video_id])

    return (
        <div className={styles.container}>
            <div className={styles.countComments}>
                <Text as='h3'>{commentsCount} comentários</Text>
            </div>

            {auth.is_authenticated && !userCommented ?
                <div className={styles.newComment}>
                    <Avatar name={auth.user?.name} />

                    <div className={styles.newCommentInput}>
                        <Input
                            variant='flushed'
                            placeholder='Adicione um comentário'
                            value={inputComment}
                            onChange={(e) => setInputComment(e.target.value)}
                        />
                    </div>

                    <FiSend onClick={handlePublishNewComment} className={styles.newCommentSendButton} />
                </div>
                : ''}

            <div className={styles.comments}>
                {comments.map((item, key) => (
                    <div className={styles.commentItem} key={key}>
                        <Avatar name={item.user.name} style={{ width: '43px', height: '43px' }} />

                        <div className={styles.commentInfo}>
                            <Text className={styles.commentInfoName}>
                                {item.user.name} • <small>há {dateFromNow(item.date)}</small>
                            </Text>
                            <Text className={styles.commentInfoBody}>{item.body}</Text>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}