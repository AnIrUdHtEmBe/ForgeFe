export function camelToPascalWithWordSpaces(text: string) {
	if (!text) return '';

	// Insert space before capital letters, then capitalize the first letter of each word
	return text
		.replace(/([A-Z])/g, ' $1') // Add space before capital letters
		.replace(/^./, (str) => str.toUpperCase()); // Capitalize the first character
}
