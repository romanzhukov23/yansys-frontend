import axios from "axios";
import {GRAPHQL_URL} from "../URL";
import {Post} from "../interfaces/Post";
import {Dispatch, SetStateAction} from "react";

export const SendHandler = (posts: Post[], newPost: string, setPosts: Dispatch<SetStateAction<Post[]>>, setNewPost: Dispatch<SetStateAction<string>>) => {
	const date = new Date(Date.now()).toISOString();
	const oldPost = posts.find((p) => p.isEditing)
	if (!oldPost) {
		const graphqlQuery = {
			"query": `mutation {addPost (post: { nickname: "${localStorage.getItem('nickname')}", text: "${newPost}", date: "${date}" }) {id nickname text date}}`
		}
		axios.post(GRAPHQL_URL, graphqlQuery).then(r => console.log(r.data.data));
		const nick = localStorage.getItem('nickname');
		setPosts([{
			id: posts.length + 1,
			nickname: nick ? nick : 'Anonim',
			date: date,
			text: newPost,
			isEditing: false
		}, ...posts]);
	} else {
		const graphQuery = {
			"query": `mutation {editPost (post: {nickname: "${localStorage.getItem('nickname')}", text: "${newPost}", date: "${oldPost.date}"})}`
		}
		axios.post(GRAPHQL_URL, graphQuery).then(() => console.log("edited"));
		setPosts([...posts.filter(p => !p.isEditing), {...oldPost, text: newPost, isEditing: false}].sort((a, b) => b.id - a.id))
	}
	setNewPost('');
}