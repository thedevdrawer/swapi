export default class Search {
	constructor() {
		const searchInput = document.querySelector("#searchInput");
		searchInput.addEventListener("input", () => this.filterCards());
	}

	filterCards() {
		const inputValue = document.querySelector("#searchInput").value.trim();
		const cards = document.querySelectorAll(".card");

		cards.forEach((card) => {
			const cardName = card.getAttribute("data-name");
			if (
				cardName &&
				cardName.toLowerCase().includes(inputValue.toLowerCase())
			) {
				card.style.display = "block";
			} else {
				card.style.display = "none";
			}
		});
	}
}
