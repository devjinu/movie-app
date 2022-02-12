import React, {useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";

function Comment(props) {

    const movieId = props.postId;

    const user = useSelector(state => state.user);
    const [Comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: props.postId
        }
        console.log(variables);
        console.log('Comment : '+Comment);

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result);

                } else {
                    alert('댓글 저장에 실패');
                }
            })

    }

    return (
        <div>
            <br/>
            <p> Replies </p>

            {/* Comment Lists */}

            {/* Root Comment Form */}
            <form style={{display: 'flex'}} onSubmit={onSubmit}>
                <textarea
                    style={{width: '100%', borderRadius: '5px'}}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="댓글을 작성해 주세요"
                />
                <br/>
                <button style={{width: '20%', height: '52px'}} onClick={onSubmit}> Submit</button>

            </form>

        </div>
    )
}

export default Comment;