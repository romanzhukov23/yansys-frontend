import React, {Dispatch, SetStateAction} from 'react';
import {TextEditor} from "./TextEditor";
import {Submit} from "../buttons";

export const ForumForm = ({handleSendClick, newPost, setNewPost}: {handleSendClick: () => void, newPost: string, setNewPost: Dispatch<SetStateAction<string>>}) => {
	return (
			<div className='mb-4 flex flex-col'>
				<TextEditor className='w-[80vw] h-[12vh] mb-4' onChange={(evt) => setNewPost(evt.target.value)} value={newPost}/>
				<Submit color='bg-[#06b6d4]' onClick={handleSendClick} label='Отправить'/>
			</div>
	);
};