import "./SinglePost.css"
import { Link, useLocation } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { postFolder } from "../post/Post";
import { Context } from "../../context/Context";

export default function SinglePost() {
    const location = useLocation(); //get the location followed to reach this comp
    const postId = location.pathname.split("/")[2]; //get the post id
    const [post, setPost] = useState([]);
    const { user } = useContext(Context);

    //retrieve post according to postId
    useEffect(() => {
        const getPost = async () => {
        const response = await axios.get("/posts/" + postId);
        setPost(response.data);
        };
        getPost();

    }, [postId]) //rerun when postId changes

    const handleDelete = async () => {
        try {
            await axios.delete(`/posts/${postId}`, {
                data: { username: user.username }
            });
            window.location.replace("/"); // go to home page if post deleted
        } catch (error) {
            
        }
        
    };

  return (
      <div className="singlePost">
          <div className="singlePostWrapper">
              {post.photo && (
                <img
                    className="singlePostImg"
                    src={postFolder + post.photo}
                    alt="" 
                />
              )}
              <h1 className="singlePostTitle">
                  {post.title}
                  {post.username === user?.username && // ? indicates only do comparison if user != null
                    <div className="singlePostIcons">
                        <i className="singlePostIcon fa-regular fa-pen-to-square"></i>
                        <i className="singlePostIcon fa-regular fa-trash-can" onClick={handleDelete}></i>
                    </div>
                  }
              </h1>
              <div className="singlePostInfo">
                  <span className="singlePostAuthor">
                      Author:
                      <Link className="link" to={`/?username=${post.username}`}>
                          <b>
                            {post.username}
                          </b>
                      </Link>
                  </span>
                  <span className="singlePostDate">Published: <b>{new Date(post.createdAt).toDateString()}</b></span>
              </div>
              <p className="singlePostDescription">
                {post.description}
              </p>
          </div>
      </div>
  )
}
