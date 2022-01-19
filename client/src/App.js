import axios from "axios";
import React from "react";
import './App.css'

export default function App() {
  const [post, setPost] = React.useState({});

  React.useEffect(() => {
    axios.get(`/api/getobese`).then((response) => {
      console.log(response.data)
      setPost(response.data)
    });
  }, []);

  return (
      <div>
          <div className="App-Banner">
              <h1>Obese Searcher by SMods ( idée by CAF ) <a className="App-link" href="https://github.com/SMods11/">github</a></h1>
          </div>
          <p className="App-Obese">{post.obese}</p>
      </div>
  );
}