import React, {useEffect, useState} from 'react'
import {API_URL, API_KEY, IMAGE_BASE_URL} from '../../Config';
import MainImage from '../../views/LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo';
import GridCards from "../commons/GridCards";
import Favorite from "./Sections/Favorite";
import Comment from "./Sections/Comment";
import axios from "axios";
import {Button, Row} from 'antd';

function MovieDetail(props) {

    const movieId = props.match.params.movieId;
    const movieVariable = {
        movieId: movieId
    }

    const [Movie, setMovie] = useState([]);
    const [Casts, setCasts] = useState([]);
    const [ActorToggle, setActorToggle] = useState(false);
    const [CommentLists, setCommentLists] = useState([]);
    const [LoadingForMovie, setLoadingForMovie] = useState(true);
    const [LoadingForCasts, setLoadingForCasts] = useState(true);


    useEffect(() => {

        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`

        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`

        axios.post('/api/comment/getComments', movieVariable)
            .then(response => {
                console.log('댓글 정보 : '+response)
                if (response.data.success) {
                    console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('댓글 정보를 가져오는데 실패');
                }
            })
    }, [])
    const fetchDetailInfo = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setMovie(result)
                setLoadingForMovie(false)

                let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
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
    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    return (
        <div>

            {/* Header */}
            {LoadingForMovie ?
                <MainImage
                    image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                />
                :
                <div> loading ... </div>
            }
            {/* Body */}

            <div style={{width: '85%', margin: '1rem auto'}}>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')}/>
                </div>
                {/* Movie Info */}

                {!LoadingForMovie ?

                    <MovieInfo
                        movie={Movie}
                    />
                    :
                    <div> loading... </div>
                }
                <br/>

                {/* Actors Grid */}

                <div style={{display: 'flex', justifyContent: 'center', margin: '2rem'}}>
                    <Button onClick={toggleActorView}> Toggle Actor View </Button>
                </div>

                {ActorToggle &&
                <Row gutter={[16, 16]}>

                    {Casts && Casts.map((cast, index) => (
                        <React.Fragment key={index}>
                            <GridCards
                                image={cast.profile_path ?
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                characterName={cast.name}
                            />
                        </React.Fragment>
                    ))}

                </Row>
                }

                {/* Comments */}
                <Comment movieTitle={Movie.original_title} CommentLists={CommentLists} postId={movieId}
                         refreshFunction={updateComment}/>

            </div>

        </div>
    )
}

export default MovieDetail