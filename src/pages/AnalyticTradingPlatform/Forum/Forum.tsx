import {useEffect, useState} from "react";
import axios from "axios";
import {ForumList, ForumForm} from "../../../shared/ui";
import {GRAPHQL_URL} from "../../../shared/URL";
import {Post} from "shared/interfaces/Post";
import {SendHandler, EditHandler, DeleteHandler} from "../../../shared/handlers";

export function Forum(): JSX.Element {
	const [newPost, setNewPost] = useState('');
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		const fetchPosts = async (): Promise<void> => {
			const graphQuery = {
				"query": `query { getPosts { id nickname text date } }`
			}
			axios.post(GRAPHQL_URL, graphQuery).then(
				r => {
					const _posts = r.data.data.getPosts.map((p: Post) => ({
						id: p.id,
						nickname: p.nickname,
						text: p.text,
						date: p.date
					}));
					setPosts(_posts.reverse());
				}
			);
		}
		fetchPosts().then(() => console.log("post fetched"));
	}, [])

	const handleSendClick = () => {
		SendHandler(posts, newPost, setPosts, setNewPost);
	}
	const handleDeleteClick = (post: Post) => {
		DeleteHandler(post, posts, setPosts);
	}
	const handleEditClick = (post: Post) => {
		EditHandler(post, posts, setPosts, setNewPost);
	}

	return (<div className='flex flex-col items-center m-6 text-lg'>
		<div className='mb-5 text-5xl'>Форум для общения</div>
		<ForumForm handleSendClick={handleSendClick} newPost={newPost} setNewPost={setNewPost}/>
		{posts.length
			? <ForumList posts={posts} handleDeleteClick={handleDeleteClick} handleEditClick={handleEditClick}/>
			: <div>Будьте первым!</div>
		}
	</div>)
}
