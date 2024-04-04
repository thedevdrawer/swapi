export default class API {
	constructor() {
		this.rootURL = "https://swapi.dev/api";
	}

	async getAllCharacters() {
		try {
			let characters = [];
			let nextPage = `${this.rootURL}/people`;
			while (nextPage) {
				try {
					const response = await fetch(nextPage);
					if (!response.ok) {
						if (response.status === 404) {
							throw new Error("API endpoint not found");
						}
						throw new Error("Failed to fetch data from API");
					}
					const data = await response.json();
					const charactersData = await Promise.all(
						data.results.map(async (character) => {
							return character;
						})
					);
					characters = [...characters, ...charactersData];
					nextPage = data.next;
				} catch (error) {
					console.error(error);
					nextPage = null;
				}
			}
			return characters;
		} catch (error) {
			console.error("Error:", error);
			return [];
		}
	}

	async getSingleCharacter(id) {
		try {
			const response = await fetch(`${this.rootURL}/people/${id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch character data");
			}
			const character = await response.json();
			const speciesData = await this.getCharacterSpecies(character.species);
			character.species = this.formatSpeciesData(speciesData);
			return character;
		} catch (error) {
			console.error("Error fetching character data:", error);
			return {};
		}
	}

	async getCharacterSpecies(speciesUrls) {
		try {
			const speciesData = await Promise.all(
				speciesUrls.map(async (speciesUrl) => {
					const response = await fetch(speciesUrl);
					if (!response.ok) {
						throw new Error(`Failed to fetch species data: ${speciesUrl}`);
					}
					return await response.json();
				})
			);
			return speciesData;
		} catch (error) {
			console.error("Error fetching species data:", error);
			return [];
		}
	}

	async getCharacterHomeworld(homeworldUrl) {
		try {
			const response = await fetch(homeworldUrl);
			if (!response.ok) {
				throw new Error("Failed to fetch homeworld data");
			}
			const homeworld = await response.json();
			return homeworld;
		} catch (error) {
			console.error("Error fetching homeworld data:", error);
			return {};
		}
	}

	formatSpeciesData(speciesData) {
		let species = speciesData.length > 0 ? speciesData[0].name : "Unknown";
		return species;
	}

}
