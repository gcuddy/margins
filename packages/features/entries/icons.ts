import Dice6 from 'lucide-svelte/icons/dice-6';
import Music4 from 'lucide-svelte/icons/music-4';
import FileAudio from 'lucide-svelte/icons/file-audio';
import Newspaper from 'lucide-svelte/icons/newspaper';
import Book from 'lucide-svelte/icons/book';
import Bookmark from 'lucide-svelte/icons/bookmark';
import Gamepad from 'lucide-svelte/icons/gamepad';
import FileImage from 'lucide-svelte/icons/file-image';
import Film from 'lucide-svelte/icons/film';
import Podcast from 'lucide-svelte/icons/podcast';
import Utensils from 'lucide-svelte/icons/utensils';
import RssIcon from 'lucide-svelte/icons/rss';
import TvIcon from 'lucide-svelte/icons/tv';
import TwitterIcon from 'lucide-svelte/icons/twitter';
import VideoIcon from 'lucide-svelte/icons/video';
import FileText from 'lucide-svelte/icons/file-text';

// import Dice6
import type { ComponentType } from 'svelte';
import type { Entry } from '@prisma/client';
export const entryTypeIcon: Record<Entry['type'], ComponentType> = {
	album: Music4,
	article: Newspaper,
	audio: FileAudio,
	board_game: Dice6,
	book: Book,
	bookmark: Bookmark,
	epub: Book,
	game: Gamepad,
	image: FileImage,
	movie: Film,
	pdf: FileText,
	playlist: Music4,
	podcast: Podcast,
	recipe: Utensils,
	rss: RssIcon,
	song: Music4,
	tv: TvIcon,
	tweet: TwitterIcon,
	video: VideoIcon,
};
