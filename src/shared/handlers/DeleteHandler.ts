import axios from "axios";
import {GRAPHQL_URL} from "../URL";
import {Post} from "../interfaces/Post";
import {Dispatch, SetStateAction} from "react";

export const DeleteHandler = (post: Post, posts: Post[], setPosts: Dispatch<SetStateAction<Post[]>>) => {
	const graphQuery = {
		"query": `mutation {deletePost (post: {nickname: "${localStorage.getItem('nickname')}", text: "${post.text}", date: "${post.date}"})}`
	}
	axios.post(GRAPHQL_URL, graphQuery).then(() => console.log("deleted"));
	setPosts(posts.filter(p => p.id !== post.id))
}