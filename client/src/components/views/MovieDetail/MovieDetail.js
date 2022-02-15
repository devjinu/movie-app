import React, { useEffect, useState } from 'react'
import { Row, Button } from 'antd';
import Axios from 'axios';
import { PushpinOutlined } from '@ant-design/icons';

import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';
import { API_URL, API_KEY, IMAGE_BASE_URL } from '../../Config';
import GridCards from '../commons/GridCards';
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import Favorite from './Sections/Favorite';

function MovieDetailPage(props) {

    const movieId = props.match.params.movieId

    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [ActorToggle, setActorToggle] = useState(false)
    
    const movieVariable = { movieId: movieId }

    useEffect(() => {

        let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=ko-KR&include_image_language=ko-KR`;
        fetchDetailInfo(endpointForMovieInfo)

        Axios.post('/api/comment/getComment', movieVariable)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    console.log('response.data.comment', response.data.comments)
                    setCommentLists(response.data.comment)
                } else {
                    alert('댓글 정보를 가져오는데 실패했습니다.')
                }
            })

    }, [])

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    const fetchDetailInfo = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setMovie(result)
                setLoadingForMovie(false)

                let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR&include_image_language=ko-KR`;
                fetch(endpointForCasts)
                    .then(result => result.json())
                    .then(result => {
                        console.log(result)
                        setCasts(result.cast)
                    })

                setLoadingForCasts(false)
            })
            .catch(error => console.error('Error:', error)
            )
    }

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <div>

            {/* Header */}

            {!LoadingForMovie ?
                <MainImage
                    image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                />
                :
                <div> Loading... </div>
            }

            {/* Body */}
            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')}  />
                </div>

                {/* Movie Info */}
                {!LoadingForMovie ?
                    <MovieInfo movie={Movie} />
                    :
                    <div> Loading... </div>
                }

                <br />
                
                {/* Actors Grid */}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <Button onClick={toggleActorView}><PushpinOutlined /> Cast </Button>
                </div>


                {ActorToggle &&
                    <Row gutter={[16, 16]} >
                        {
                            !LoadingForCasts ? Casts.map((cast, index) => (
                                cast.profile_path &&
                                <GridCards
                                    image={cast.profile_path ?
                                        `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                    characterName={cast.name}
                                />)) :
                                <div> Loading... </div>
                        }
                    </Row>
                }
                <br />

                {/* likeDislikes */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LikeDislikes video videoId={movieId} userId={localStorage.getItem('userId')} />
                </div>

                {/* Comment */}
                <Comment movieTitle={Movie.original_title} CommentLists={CommentLists} postId={movieId} refreshFunction={updateComment} />

            </div>


        </div>
    )
}

export default MovieDetailPage