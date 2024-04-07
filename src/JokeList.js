import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ jokesNeeded = 5 }) => {
  const [jokes, setJokes] = useState([])
  const [loading, setIsLoading] = useState(true)


// get joke

useEffect(() => {
  const getJokes = async () => {
    let j = [...jokes]
    let seenJokes = new Set()
    try {
      while (j.length < jokesNeeded){
        let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }})
      
      let { ...jokeObj } = res.data

      if(!seenJokes.has(jokeObj.id)) {
        seenJokes.add(jokeObj.id)
        j.push({ ...jokeObj, votes: 0})
      } else {
        console.log('error same joke repeated')
      }
    }
    setJokes(j)
    setIsLoading(false)
    } catch (error) {
      console.log(error)
    }

  }

  if(jokes.length === 0) {
    getJokes()
  }

}, [jokes, jokesNeeded])

// get new jokes

const getNewJokes = () => {
  setJokes([])
  setIsLoading(true)
}

// change vote

const vote = (id, delta) => {
  setJokes(allJokes => allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta} :j)))
}

// render loading or jokes

if(loading) {
  return (
    <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
  )
}

let sortedJokes = [...jokes].sort((a,b) => b.votes - a.votes)

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={getNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(({joke, id, votes}) => (
          <Joke
            text={joke}
            key={id}
            id={id}
            votes={votes}
            vote={vote}
          />
        ))}
      </div>
    );
  }


export default JokeList;
