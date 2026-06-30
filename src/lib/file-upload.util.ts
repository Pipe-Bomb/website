export function openFilePicker(accept = "") {
	return new Promise<File | null>((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		if (accept) input.accept = accept;

		input.onchange = () => {
			const file = input.files?.[0] || null;
			resolve(file);
		};

		input.oncancel = () => {
			resolve(null);
		};

		input.click();
	});
}
