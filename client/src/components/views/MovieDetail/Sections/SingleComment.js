import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;
function SingleComment(props) {

    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)

    const handleChange = (e) => {
        if(user.userData._id) {
            setCommentValue(e.currentTarget.value)
        }else{
            alert('로그인 후 댓글을 작성할 수 있습니다.')
        }
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }

        if(user.userData._id) {
            Axios.post('/api/comment/saveComment', variables)
                .then(response => {
                    if (response.data.success) {
                        setCommentValue("")
                        setOpenReply(!OpenReply)
                        props.refreshFunction(response.data.result)
                    } else {
                        alert('댓글 입력에 실패했습니다.')
                    }
                })
        } else {
            alert('로그인 후 댓글을 작성할 수 있습니다.')
        }
    }

    const actions = [
        <LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        <span onClick={openReply} key="comment-basic-reply-to"> &nbsp;&nbsp;&nbsp;&nbsp; Reply to </span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar
                        src={props.comment.writer.image}
                        alt=""/>}
                content={ <p> {props.comment.content} </p> }
            />

            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={CommentValue}
                    placeholder="댓글을 작성해 주세요."
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}> Submit </Button>
            </form>
            }
            
        </div>
    )
}

export default SingleComment