export type SleepingArrangements = {
	text: string;
	title: string;
	icons: string[];
};

export type Amenity = {
	title: string;
	description?: string;
	icon: string;
};

export type SummaryHighlight = {
	title: string;
	description: string;
	icon: string;
	containerClass: string;
};

export type SummaryFeature = {
	text: string;
};

export type GuestAccommodation = {
	icon: string;
	text: string;
};

export type Highlight = {
	icon: string;
	text: string;
};
