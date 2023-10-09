import {
    Dice6,
    FileAudio,
    Music4,
    Newspaper,
    Book,
    Bookmark,
    Gamepad,
    FileImage,
    Film,
    FileText,
    Podcast,
    Utensils,
    RssIcon,
    TvIcon,
    TwitterIcon,
    VideoIcon
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';
import type { Entry } from '@prisma/client';
import AdobeAcrobat from '$lib/icons/adobe-acrobat.svelte';
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
	pdf: AdobeAcrobat,
	podcast: Podcast,
	playlist: Music4,
	recipe: Utensils,
	rss: RssIcon,
	song: Music4,
	tv: TvIcon,
	tweet: TwitterIcon,
	video: VideoIcon,
};
