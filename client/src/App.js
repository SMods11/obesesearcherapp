import axios from "axios";
import React from "react";
import './App.css'

export default function App() {
  const [post, setPost] = React.useState({});

  React.useEffect(() => {
    axios.get(`/api/getobese`).then(res => res.data)
        .then(json => (
            setPost(json)
        ))
  }, []);

  if(post.obese === undefined) {
      return (
          <div>
              <div className="App-Banner">
                  <h1>Obese Searcher by SMods ( idée by CAF ) <a className="App-link" href="https://github.com/SMods11/">github</a></h1>
              </div>
              <p>No obese connected</p>
          </div>
      )
  }
  return (
      <div>
          <div className="App-Banner">
              <h1>Obese Searcher by SMods ( idée by CAF ) <a className="App-link" href="https://github.com/SMods11/">github</a></h1>
          </div>
          {post.obese.map((name) => (
              <p className="App-Obese">{name}</p>
          ))}
      </div>
  );
}