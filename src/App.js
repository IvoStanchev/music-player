//Import state
import { useRef, useState } from 'react';

//Import styles
import './styles/app.scss';

//Adding components
import Player from './components/Player';
import Song from './components/Song';
import Library from './components/Library';
import Nav from './components/Nav';

//Import music library
import data from './data';

function App() {
	//!Reference
	const audioRef = useRef(null);

	//State
	const [songs, setSongs] = useState(data());
	const [currentSong, setCurrentSong] = useState(songs[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [libraryStatus, setLibraryStatus] = useState(false);

	return (
		<div className={`App ${libraryStatus ? 'library-active' : ''}`}>
			<Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
			<Song currentSong={currentSong} />
			<Player
				setSongs={setSongs}
				setCurrentSong={setCurrentSong}
				songs={songs}
				audioRef={audioRef}
				isPlaying={isPlaying}
				setIsPlaying={setIsPlaying}
				currentSong={currentSong}
			/>
			<Library
				libraryStatus={libraryStatus}
				audioRef={audioRef}
				setCurrentSong={setCurrentSong}
				songs={songs}
				isPlaying={isPlaying}
				setSongs={setSongs}
			/>
		</div>
	);
}

export default App;
