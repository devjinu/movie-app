import React, {useState} from "react";
import {Comment, Avatar, Button, Input} from "antd";
import axios from "axios";
import {useSelector} from "react-redux";
import {response} from "express";

const {TextArea} = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("");
    const [OpenReply, setOpenReply] = useState(false);

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
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
        console.log('comment`s variables'+variables);
        console.log('comment value : '+ CommentValue);

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log('savecomment : '+response.data.result)
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert("댓글 저장에 실패");
                }
            })
    }
    const actions = [<sapn onClick={openReply} key="comment-basic-reply-to"> Reply to </sapn>]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={
                    <Avatar
                        src={props.comment.writer.image}
                        alt="image"/>
                }
                content={<p> {props.comment.content}</p>}
            />
            {OpenReply &&
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <Textarea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handleChange}
                    value={CommentValue}
                    placeholder="댓글을 작성해 주세요"/>
                <br/>
                <button style={{width: '20%', height: '52px'}} onClick={onSubmit}> Submit</button>
            </form>
            }

        </div>
    )

}

export default SingleComment