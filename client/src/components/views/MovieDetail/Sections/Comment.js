import React, { useState }  from 'react'
import { Button, Input, Typography } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;
const { Title } = Typography;

function Comments(props) {

    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("")

    const handleChange = (e) => {
        if(user.userData._id) {
            setComment(e.currentTarget.value)
        } else {
            alert('로그인 후 댓글을 작성할 수 있습니다.')
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }
        console.log(variables)

        if(user.userData._id) {
            Axios.post('/api/comment/saveComment', variables)
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data.result)
                        setComment("")
                        props.refreshFunction(response.data.result)
                    } else {
                        alert('댓글 입력에 실패했습니다.')
                    }
                })
        } else {
            alert('로그인 후 댓글을 작성할 수 있습니다.')
        }
    }

    return (
        <div>
            <br />
            <Title level={3} > Share your opinions about {props.movieTitle} </Title>
            <hr />

            {/* Coment Lists */}
            {console.log(props.CommentLists)}

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={comment._id}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment parentCommentId={comment._id} postId={props.postId} CommentLists={props.CommentLists} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {props.CommentLists && props.CommentLists.length === 0 &&
            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center', height:'200px'}} >
                Be the first one who shares your thought about this movie
            </div>
            }

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="댓글을 작성해 주세요."
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}> Submit </Button>
            </form>

        </div>
    )
}

export default Comments