import API from "./API.js";

export default class Cards {
	constructor() {
		this.api = new API();
		this.additionalInformationClickEvent();
	}

	async getPeopleCards() {
		try {
			const characters = await this.api.getAllCharacters();
			const cards = characters
				.map((character) => {
					character = this.formatCharacterInformation(character);
					return `
                    <div class="card ${character.formattedSpecies}" data-name="${character.name}" data-id="${character.id}">
                        <h2>${character.formattedName}</h2>
                        <div class="info">
                            <strong>Name:</strong> ${character.name}<br>
                            <strong>Height:</strong> ${character.height}<br>
                            <strong>Mass:</strong> ${character.mass}<br>
                            <strong>Added:</strong> ${character.created}<br>
                            <strong>Films:</strong> ${character.films.length}<br>
                            <strong>Birth Year:</strong> ${character.birth_year}<br>
                        </div>
                    </div>
                    `;
				})
				.join("");
			document.querySelector(".cards").innerHTML = cards;
		} catch (error) {
			console.error(`ERROR: ${error}`);
		}
	}

	additionalInformationClickEvent() {
		const cardsContainer = document.querySelector(".cards");
		const overlay = document.querySelector(".overlay");

		cardsContainer.addEventListener("click", (event) => {
			const body = document.querySelector("body");
			body.style.overflow = "hidden";
			const card = event.target.closest(".card");
			if (card) {
				const character = this.api.getSingleCharacter(card.dataset.id);
				const additionalInformation = document.querySelector(
					".additionalInformationCard"
				);

				character.then((data) => {
					data = this.formatCharacterInformation(data);
					const homeworld = this.api.getCharacterHomeworld(data.homeworld);
					additionalInformation.innerHTML = `
                    <div class="close"><img src="/img/cancel.png"></div>
                    <h2>${data.formattedName}</h2>
                    <div class="character">
                        <div>
                            ${data.name}<br>
                            <strong>Name</strong>
                        </div>
                        <div>
                            ${data.species}<br>
                            <strong>Species</strong>
                        </div>
                        <div>
                            ${data.height}<br>
                            <strong>Height</strong>
                        </div>
                        <div>
                            ${data.mass}<br>
                            <strong>Mass</strong>
                        </div>
                    </div>
                    <div class="apiinfo">
                        <div>
                            ${data.created}<br>
                            <strong>Added</strong>
                        </div>
                        <div>
                            ${data.films.length} Films<br>
                            <strong>Appeared In</strong>
                        </div>
                        <div>
                            ${data.birth_year}<br>
                            <strong>Birth Year</strong>
                        </div>
                    </div>
                    `;
					homeworld.then((homeworld) => {
						homeworld = this.formatHomeworldInformation(homeworld);
						additionalInformation.innerHTML += `
                            <h3>Homeworld</h3>
                            <div class="world">
                                <div>
                                    ${homeworld.name}<br>
                                    <strong>Name</strong>
                                </div>
                                <div>
                                    ${homeworld.terrain}<br>
                                    <strong>Terrain</strong>
                                </div>
                                <div>
                                    ${homeworld.climate}<br>
                                    <strong>Climate</strong>
                                </div>
                                <div>
                                    ${homeworld.population}<br>
                                    <strong>Residents</strong>
                                </div>
                            </div>
                        `;
					});
				});

				additionalInformation.classList.toggle("show");
				overlay.classList.toggle("show");

				document.addEventListener("click", (event) => {
					if (event.target.closest(".close")) {
						additionalInformation.innerHTML = "";
						additionalInformation.classList.remove("show");
						overlay.classList.remove("show");
						body.style.overflow = "auto";
					}
				});
			}
		});
	}

	formatCharacterInformation(character) {
		// format the character name so that we can manipulate the first name with CSS
		const name = character.name.split(" ");
		const formattedName =
			name.length > 1 ? `<span>${name[0]}</span><br>${name[1]}` : name[0];
		character.formattedName = formattedName;

		// format the height to m
		let heightInMeters = character.height;
		if (heightInMeters === "unknown") {
			character.height = "Unknown";
		} else {
			heightInMeters = parseFloat(character.height) / 100;
			character.height = `${heightInMeters}m`;
		}

		// format the mass to kg
		let massInKg = character.mass;
		if (massInKg === "unknown") {
			character.mass = "Unknown";
		} else {
			massInKg = parseFloat(massInKg);
			character.mass = `${massInKg}kg`;
		}

		// format the create date as MM-dd-yyyy
		const created = new Date(character.created);
		const date = new Date(created);
		const formattedCreateDate = date.toLocaleDateString("en-US", {
			month: "2-digit",
			day: "2-digit",
			year: "numeric",
		});
		character.created = formattedCreateDate;

		// format the birth year to be capitalized if unknown
		let birthYear = character.birth_year;
		if (birthYear === "unknown") {
			character.birth_year = "Unknown";
		} else {
			character.birth_year = birthYear;
		}

		// format the species to be used as a css class name
		const species = character.species.toLowerCase().replace(/\s/g, "-");
		character.formattedSpecies = species.replace(/'/g, "");

		// format the URL to return the character ID
		const id = character.url.split("/")[5];
		character.id = id;
		return character;
	}

	formatHomeworldInformation(homeworld) {
		// format the name to be capitalized
		const name = homeworld.name.split(" ");
		const formattedName = name.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});
		homeworld.name = formattedName.join(" ");

		// format the terrain to be capitalized
		const terrain = homeworld.terrain.split(" ");
		const formattedTerrain = terrain.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});
		homeworld.terrain = formattedTerrain.join(" ");

		// format the climate to be capitalized
		const climate = homeworld.climate.split(" ");
		const formattedClimate = climate.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});
		homeworld.climate = formattedClimate.join(" ");

		// format the population to have commas unless it is unknown, then display Unknown
		const population = homeworld.population;
		if (population === "unknown") {
			homeworld.population = "Unknown";
		} else {
			homeworld.population = population
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		return homeworld;
	}
}
