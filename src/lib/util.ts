export function cc(...classes: (string | false | null | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}

export function formatTime(seconds: number) {
	seconds = Math.floor(seconds);
	if (!seconds) return "0:00";
	let minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;
	let hours = Math.floor(minutes / 60);
	minutes -= hours * 60;
	if (hours) {
		return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	}
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function shuffle<T>(array: T[]): T[] {
	const output = [...array];
	let currentIndex = output.length;

	while (currentIndex != 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[output[currentIndex], output[randomIndex]] = [
			output[randomIndex],
			output[currentIndex],
		];
	}

	return output;
}
