import { useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Room from './components/Room';
import io from 'socket.io-client'

const socket = io.connect('http://localhost:5000');

function App() {

	const [ username, setUsername ] = useState('');
	const [ room, setRoom ] = useState('');
	const [ chatScreen, setChatScreen ] = useState(false);



  return (
		<div className='App'>
			{!chatScreen ? (
				<Room
					username={username}
					setUsername={setUsername}
					room={room}
					setRoom={setRoom}
					socket={socket}
					setChatScreen={setChatScreen}
				/>
			) : (
				<Chat
					socket={socket}
					username={username}
					room={room}
				/>
			)}
		</div>
  );
}

export default App;
