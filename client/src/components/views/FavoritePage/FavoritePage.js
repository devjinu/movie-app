import React, {useEffect, useState} from 'react'
import './favorite.css'
import Axios from "axios";
import {response} from "express";

function FavoritePage() {

    const [Favorites, setFavorites] = useState([])

    useEffect(()=>{

        Axios.post('/api/favorite/getFavorite', {userFrom: localStorage.getItem('userId')})
            .then(response => {
                if(response.data.success){
                    setFavorites(response.data.favorites)
                }else {
                    alert('영화 정보를 가져오는데 실패했습니다.')
                }
            })

    }, [])


    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <h2> Favorite Movies</h2>
            <hr/>
            <table>
                <thead>
                <tr></tr>
                <th>Movie Title</th>
                <th>Movie Runtime</th>
                <th>Movie from favorites</th>
                </thead>

                <tbody>
                {Favorites.map((favorite, index) =>(
                    <tr key={index}>
                        <td>{favorite.movieTitle}</td>
                        <td>{favorite.movieRunTime} mins</td>
                        <td><button>Remove</button></td>
                    </tr>
                ))}


                </tbody>
            </table>
        </div>
    )
}

export default FavoritePage