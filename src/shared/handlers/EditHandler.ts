import {Post} from "../interfaces/Post";
import {Dispatch, SetStateAction} from "react";

export const EditHandler = (p: Post, posts: Post[], setPosts: Dispatch<SetStateAction<Post[]>>, setNewPost: Dispatch<SetStateAction<string>>) => {
	setPosts([...posts.filter(post => post.id !== p.id), {...p, isEditing: true}].sort((a , b) => b.id - a.id))
	setNewPost(p.text);
}