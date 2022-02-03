import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlay,
	faAngleLeft,
	faAngleRight,
	faPause,
} from '@fortawesome/free-solid-svg-icons';

const Player = ({
	setCurrentSong,
	currentSong,
	isPlaying,
	setIsPlaying,
	audioRef,
	songs,
	setSongs,
}) => {
	//!Event handlers
	const activeLibraryHandler = (nextPrev) => {
		const newSongs = songs.map((song) => {
			if (song.id === nextPrev.id) {
				return {
					...song,
					active: true,
				};
			} else {
				return {
					...song,
					active: false,
				};
			}
		});
		setSongs(newSongs);
	};

	const playSongHandler = () => {
		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(!isPlaying);
		} else {
			audioRef.current.play();
			setIsPlaying(!isPlaying);
		}
	};

	//* Adjust the audio slider time.
	const dragHandler = (e) => {
		audioRef.current.currentTime = e.target.value;
		setSongInfo({ ...songInfo, currentTime: e.target.value });
	};

	//* Convert timestamp
	const getTime = (time) => {
		return (
			Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2)
		);
	};

	//* Skip track
	const skipTrackHandler = async (direction) => {
		let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
		let nextSong = songs[currentIndex + 1] || songs[0];
		let previousSong = songs[currentIndex - 1] || songs[songs.length - 1];

		if (direction === 'skip-forward') {
			await setCurrentSong(nextSong);
			activeLibraryHandler(nextSong);
		} else {
			await setCurrentSong(previousSong);
			activeLibraryHandler(previousSong);
		}
		if (isPlaying) audioRef.current.play();
	};

	//* Get and convert the times for the input slider and slider animation.
	const timeUpdateHandler = (e) => {
		//* store time and duration of the song
		const current = e.target.currentTime;
		const duration = e.target.duration;
		//* Caulate percentage
		const roundedCurrent = Math.round(current);
		const roundedDuration = Math.round(duration);
		const animation = Math.round((roundedCurrent / roundedDuration) * 100);

		setSongInfo({
			...songInfo,
			currentTime: current,
			duration,
			animationPercentage: animation,
		});
	};

	//!State
	const [songInfo, setSongInfo] = useState({
		currentTime: 0,
		duration: 0,
		animationPercentage: 0,
	});
	const trackAnim = {
		transform: `translateX(${songInfo.animationPercentage}%)`,
	};

	return (
		<div className='player'>
			{/* Time and slider */}
			<div className='time-control'>
				<p>{getTime(songInfo.currentTime)}</p>
				<div
					style={{
						background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
					}}
					className='track'>
					<input
						min={0}
						max={songInfo.duration || 0}
						value={songInfo.currentTime}
						onChange={dragHandler}
						type='range'
					/>
					<div style={trackAnim} className='animate-track'></div>
				</div>
				<p>{songInfo.duration ? getTime(songInfo.duration) : '0:00'}</p>
			</div>

			{/* Play, pause, next and previous controls with icons */}
			<div className='play-control'>
				<FontAwesomeIcon
					onClick={() => {
						skipTrackHandler('skip-back');
					}}
					className='skip-back'
					size='2x'
					icon={faAngleLeft}
				/>
				<FontAwesomeIcon
					onClick={playSongHandler}
					className='play'
					size='2x'
					icon={isPlaying ? faPause : faPlay}
				/>
				<FontAwesomeIcon
					onClick={() => {
						skipTrackHandler('skip-forward');
					}}
					className='skip-forward'
					size='2x'
					icon={faAngleRight}
				/>
			</div>

			{/* Audio player */}
			<audio
				//? Preload the metadata of the audiofile. This is needed for the duration of the song to load when the song is added to the player.
				onLoadedMetadata={timeUpdateHandler}
				//? Get current time and duration of the song
				onTimeUpdate={timeUpdateHandler}
				//? The ref attribure is used with the useRef hook. It allowes us to fetch the HTML audio element from the DOM tree and use is in our code.
				ref={audioRef}
				//? The source of the audiofile
				src={currentSong.audio}
				onEnded={() => {
					skipTrackHandler('skip-forward');
				}}></audio>
		</div>
	);
};

export default Player;
