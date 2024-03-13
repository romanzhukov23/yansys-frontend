import React from 'react';
import {ForumItem} from "./ForumItem";
import {Post} from "../../interfaces/Post";

export const ForumList = ({posts, handleDeleteClick, handleEditClick}: {posts: Post[], handleEditClick: (post: Post) => void, handleDeleteClick: (post: Post) => void}) => {
	return (
		<div>
			{posts.map((p): JSX.Element => (
				<ForumItem post={p} key={p.id} editClick={handleEditClick} deleteClick={handleDeleteClick}/>
			))}
		</div>
	);
};