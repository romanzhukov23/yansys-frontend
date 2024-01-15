import {TextEditor} from "../../../shared/ui/forms/TextEditor";
import {useEffect, useState} from "react";
import {Submit} from "../../../shared/ui";
import axios from "axios";
import {GRAPHQL_URL} from "../../URL";

export interface Post {
	id: number;
	nickname: string;
	text: string;
	date: string;
	isEditing: boolean;
}

export function Forum(): JSX.Element {
	const [newPost, setNewPost] = useState('');
	const [posts, setPosts] = useState<Post[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [postsLoading, setPostsLoading] = useState(false);

	useEffect(() => {
		const fetchPosts = async () => {
			setPostsLoading(true);

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

			setPostsLoading(false);
		}

		fetchPosts();
	}, [])

	const handleSendClick = () => {
		const date = new Date(Date.now()).toISOString();
		const post = posts.find((p) => p.isEditing)
		if (post !== undefined) {
			const graphQuery = {
				"query": `mutation {editPost (post: {nickname: "${localStorage.getItem('nickname')}", text: "${newPost}", date: "${post.date}"})}`
			}
			axios.post(GRAPHQL_URL, graphQuery).then(() => console.log("edited"));
			setPosts(posts.map((p) => {
				if (p === post) {
					return {id: p.id, nickname: p.nickname, text: newPost, date: p.date, isEditing: !p.isEditing}
				} else {
					return p
				}
			}))
		} else {
			const graphqlQuery = {
				"query": `mutation {addPost (post: { nickname: "${localStorage.getItem('nickname')}", text: "${newPost}", date: "${date}" }) {id nickname text date}}`
			}
			axios.post(GRAPHQL_URL, graphqlQuery).then(r => console.log(r.data.data));
			const nick = localStorage.getItem('nickname');
			const newPosts: Post[] = [{
				id: posts.length + 1,
				nickname: nick !== null ? nick : 'Anonim',
				date: date,
				text: newPost,
				isEditing: false
			}, ...posts]
			setPosts(newPosts);
		}
		setNewPost('');
	}

	const handleDeleteClick = (p: Post) => {
		const graphQuery = {
			"query": `mutation {deletePost (post: {nickname: "${localStorage.getItem('nickname')}", text: "${p.text}", date: "${p.date}"})}`
		}
		axios.post(GRAPHQL_URL, graphQuery).then(() => console.log("deleted"));
		const deleteIndex = posts.findIndex(post => post === p);
		if (deleteIndex === 0) {
			const newPosts: Post[] = [...posts.slice(1, posts.length)];
			setPosts(newPosts);
		} else if (deleteIndex === posts.length - 1) {
			const newPosts: Post[] = [...posts.slice(0, posts.length - 1)];
			setPosts(newPosts);
		} else {
			const newPosts: Post[] = [...posts.slice(0, deleteIndex), ...posts.slice(deleteIndex + 1, posts.length)];
			setPosts(newPosts);
		}
	}

	const handleEditClick = (p: Post) => {
		setPosts(posts.map((post) => {
			if (post === p) {
				return {id: post.id, nickname: post.nickname, text: post.text, date: post.date, isEditing: !post.isEditing}
			} else {
				return post
			}
		}))
		setNewPost(p.text);
	}

	return (<div className='flex flex-col items-center m-6 text-lg'>
		<div className='mb-5 text-5xl'>Форум для общения</div>

		<div className='mb-4 flex flex-col'>
			<TextEditor className='w-[80vw] h-[12vh] mb-4' onChange={(evt) => setNewPost(evt.target.value)} value={newPost}/>
			<Submit color='bg-[#06b6d4]' onClick={handleSendClick} label='Отправить'/>
		</div>

		{posts.map((p): JSX.Element => (
			<div className='m-3 w-[80vw] bg-gray-400 p-4 rounded-2xl flex'>
				<div>
					<div className='flex mb-2 w-[74vw]'>
						<div className='mr-3 text-sm'>{`#${p.id}`}</div>
						<div className='text-2xl'>{p.nickname}</div>
						<div className='ml-auto'>{new Date(p.date).toString()}</div>
					</div>
					<div className='ml-4'>{p.text}</div>
				</div>
				{p.nickname === localStorage.getItem('nickname') ? <div className='flex flex-row ml-auto'>
					<Submit onClick={() => handleEditClick(p)} className='h-10 w-10'>
						<img src="/images/editing.png" className='pointer-events-none w-5 h-5' alt="edit"/>
					</Submit>
					<Submit onClick={() => handleDeleteClick(p)} className='h-10 w-10'>
						<img src="/images/x.png" className='pointer-events-none w-5 h-5' alt="delete"/>
					</Submit>
				</div> : <div></div>}
			</div>
		))}
	</div>)
}
