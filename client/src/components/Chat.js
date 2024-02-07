import React, { useEffect, useState } from 'react';

const Chat = ({ socket, username, room }) => {
	const [message, setMessage] = useState('');
	const [messageList, setMessageList] = useState([]);

	useEffect(() => {
		socket.on('messageReturn', (data) => {
			setMessageList((prev) => [...prev, data]);
		});
	}, [socket]);

	const sendMesage = async () => {
		const messageContent = {
			username: username,
			message: message,
			room: room,
			date: new Date().getHours() + ':' + new Date().getMinutes(),
		};
		await socket.emit('message', messageContent);
		setMessageList((prev) => [...prev, messageContent]);
		setMessage('');
	};

	console.log(messageList);

	return (
		<div className='flex items-center justify-center h-full'>
			<div className='w-1/3 h-[600px] bg-gray-500 relative'>
				<div className='w-full h-16 bg-gray-700 flex items-center p-2'>
					<div className='w-12 h-12 bg-white rounded-full'></div>
				</div>

				<div className='w-full h-[400px] overflow-y-auto'>
					{messageList &&
						messageList.map((msg, i) => (
							<div className={username === msg.username ? 'flex justify-end' : ''}>
								<div
									className={
										username === msg.username
											? 'w-1/2 h-14 bg-white text-lg m-2 rounded-xl p-2 rounded-br-none'
											: 'w-1/2 h-14 bg-green-500 text-lg m-2 rounded-xl p-2 rounded-bl-none'
									}>
									<div className=''>{msg.message}</div>
									<div className='w-full flex justify-end text-xs'>{msg.username} - {msg.date}</div>
								</div>
							</div>
						))}
				</div>
				<div className='absolute bottom-0 left-0 w-full'>
					<input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className='w-3/4 h-12 border p-3 outline-none rounded-sm'
						type='text'
						placeholder='Message send'
					/>
					<button
						onClick={sendMesage}
						className='w-1/4 bg-indigo-600 text-white h-12 hover:opacity-70 rounded-sm'>
						SEND
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
