import React from 'react';
import {Submit} from "../buttons";
import {Post} from '../../interfaces/Post'

export const ForumItem = ({post, deleteClick, editClick}: {post: Post, deleteClick: (post: Post) => void, editClick: (post: Post) => void}) => {
	return (
		<div className='m-3 w-[80vw] bg-gray-400 p-4 rounded-2xl flex'>
			<div>
				<div className='flex mb-2 w-[74vw]'>
					<div className='text-2xl'>{post.nickname}</div>
					<div className='ml-auto'>{new Date(post.date).toString()}</div>
				</div>
				<div className='ml-4'>{post.text}</div>
			</div>
			{post.nickname === localStorage.getItem('nickname') ? <div className='flex flex-row ml-auto'>
				<Submit onClick={() => editClick(post)} className='h-10 w-10'>
					<img src="/images/editing.png" className='pointer-events-none w-5 h-5' alt="edit"/>
				</Submit>
				<Submit onClick={() => deleteClick(post)} className='h-10 w-10'>
					<img src="/images/x.png" className='pointer-events-none w-5 h-5' alt="delete"/>
				</Submit>
			</div> : <div></div>}
		</div>
	);
};