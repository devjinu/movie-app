import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {Button} from 'antd';


function Favorite(props) {

    const movieId = props.movieId
    const userFrom = props.userFrom
    const movieTitle = props.movieInfo.title
    const moviePost = props.movieInfo.backdrop_path
    const movieRuntime = props.movieInfo.runtime

    const [FavoriteNumber, setFavoriteNumber] = useState(0)
    const [Favorited, setFavorited] = useState(false)

    let variables = {
        userFrom: userFrom,
        movieId: movieId,
        movieTitle: movieTitle,
        moviePost: moviePost,
        movieRuntime: movieRuntime
    }

    useEffect(() => {


        Axios.post('/api/favoriteNumber', variables)
            .then(response => {
                if (response.data.success) {

                } else {
                    alert('숫자 정보를 가져오는데 실패했습니다')
                }

            })
        Axios.post('/api/favorite/favorited', variables)
            .then(response => {
                if(response.data.success) {
                    setFavorited(response.data.favorited)
                } else {
                    alert('정보를 가져오는 데 실패했습니다.')
                }
            })
    }, [])

    const onClickFavorite = () => {

        if(Favorited) {
            Axios.post('/api/favorite/removeFromFavorite', variables)
                .then(response => {
                    if(response.data.success) {
                        setFavoriteNumber(FavoriteNumber-1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Favorite 리스트에서 삭제 실패했습니다.')
                    }
                })

        } else {
            Axios.post('/api/favorite/addToFavorite', variables)
                .then(response => {
                    if(response.data.success) {
                        setFavoriteNumber(FavoriteNumber+1)
                        setFavorited(!Favorited)
                    } else {
                        alert('Favorite 리스트에 추가 실패했습니다.')
                    }
                })
        }
    }

    return (
        <div>
            <Button onClick={onClickFavorite}> {Favorited ? "Not Favorite" : "Add to Favorite"} {FavoriteNumber} </Button>
        </div>
    )

}

export default Favorite;