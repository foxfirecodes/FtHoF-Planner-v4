import "./math-ext.ts";
import { create } from "zustand";
import { choose } from "./utils.ts";
import { SPELLS } from "./spells.ts";

interface Cookie {
	wrath: boolean;
	type: string;
	description: string;
	noteworthy?: boolean;
}

interface GamblerSpell {
	type: string;
	hasBs: boolean;
	hasEf: boolean;
	backfire: boolean;
	innerCookie1?: Cookie;
	innerCookie2?: Cookie;
}

type CookieSet = [Cookie, Cookie, Cookie, GamblerSpell];

interface Combo {
	shortest: { idx: number; length: number };
	first: { idx: number; length: number };
}

interface State {
	seed: string;
	ascensionMode: number;
	spellsCastTotal: number;
	spellsCastThisAscension: number;
	dragonflight: boolean;
	on_screen_cookies: number;
	min_combo_length: number;
	max_combo_length: number;
	max_spread: number;
	save_string: string;
	lookahead: number;
	include_ef_in_sequence: boolean;
	skip_abominations: boolean;
	skip_edifices: boolean;

	combos: Record<string, Combo>;
	cookies: CookieSet[];

	update(state: (current: State) => Partial<State>): void;
}

export const useStateStore = create<State>()((set) => ({
	seed: "",
	ascensionMode: 0,
	spellsCastTotal: 0,
	spellsCastThisAscension: 0,
	dragonflight: false,
	on_screen_cookies: 0,
	min_combo_length: 2,
	max_combo_length: 4,
	max_spread: 2,
	save_string: "",
	lookahead: 200,
	include_ef_in_sequence: true,
	skip_abominations: true,
	skip_edifices: true,

	combos: {},
	cookies: [],
	update: (state) => set(state),
}));

export function useFunctions() {
	const state = useStateStore();

	function load_more() {
		state.update((curr) => ({ lookahead: curr.lookahead + 50 }));
		update_cookies();
	}

	function cast_spell() {
		state.update((curr) => ({
			spellsCastThisAscension: curr.spellsCastThisAscension + 1,
			spellsCastTotal: curr.spellsCastTotal + 1,
		}));
		update_cookies();
	}

	function load_game(str: any) {
		if (!str) {
			str = state.save_string;
		}
		str = decodeURIComponent(str);
		str = str.split("!END!")[0];
		str = atob(str);
		str = str.split("|");
		let spl = str[2].split(";");
		const seed = spl[4];
		console.log(state.seed);

		spl = str[4].split(";");
		const ascensionMode = parseInt(spl[29]);
		console.log(spl);
		spl = str[5].split(";");
		console.log(spl[7]);

		const spellsCastTotal = parseInt(spl[7].split(" ")[2]) || 0;
		console.log("Total spells cast: " + state.spellsCastTotal);

		const spellsCastThisAscension = parseInt(spl[7].split(" ")[1]) || 0;
		console.log("Spells cast this ascension: " + state.spellsCastThisAscension);

		state.update(() => ({
			seed,
			ascensionMode,
			spellsCastTotal,
			spellsCastThisAscension,
		}));

		update_cookies();
	}

	function update_cookies() {
		const cookies: CookieSet[] = [];
		let bsIndices = [];
		let skipIndices = [];
		for (let i = 0; i < state.lookahead; i++) {
			let cookie1 = check_cookies(state.spellsCastTotal + i, "", false);
			let cookie2 = check_cookies(state.spellsCastTotal + i, "", true);
			let cookie3 = check_cookies(state.spellsCastTotal + i, "", true);
			let gambler = check_gambler(state.spellsCastTotal + i);
			cookies.push([
				cookie1,
				cookie2,
				cookie2, // TODO(lew): surely this is unintentional????
				gambler,
			]);

			if (
				cookiesContainBuffs(cookie1, cookie2, cookie2) ||
				gambler.hasBs ||
				(state.include_ef_in_sequence && gambler.hasEf)
			) {
				bsIndices.push(i);
			}

			if (
				(state.skip_abominations && gambler.type == "Resurrect Abomination") ||
				(state.skip_edifices &&
					gambler.type == "Spontaneous Edifice" &&
					!gambler.backfire)
			) {
				skipIndices.push(i);
			}
		}
		console.log(cookies);
		console.log(bsIndices);
		console.log(skipIndices);

		const combos: Record<string, Combo> = {};

		for (
			let combo_length = state.min_combo_length;
			combo_length <= state.max_combo_length;
			combo_length++
		) {
			combos[combo_length] = findCombos(
				combo_length,
				state.max_spread,
				bsIndices,
				skipIndices,
			);
		}

		console.log("Combos: ");
		console.log(combos);

		state.update(() => ({ cookies, combos }));
	}

	// function collapse_interface(contentId) {
	// 	console.log("content-" + contentId);
	// 	if (contentId) {
	// 		var content = document.getElementById("content-" + contentId);
	// 		if (content.style.display === "block") {
	// 			content.style.display = "none";
	// 		} else {
	// 			content.style.display = "block";
	// 		}
	// 	}
	// }

	//want to return shortest, and first sequence for a given combo_length
	//if nothing that satisfies max_spread, shortest will still be filled but first will be empty
	function findCombos(
		combo_length: number,
		max_spread: number,
		bsIndices: number[],
		skipIndices: number[],
	): Combo {
		let shortestDistance = 10000000;
		let shortestStart = -1;

		let firstDistance = 10000000;
		let firstStart = -1;

		for (let i = 0; i + combo_length <= bsIndices.length; i++) {
			let seqStart = bsIndices[i];
			let seqEnd = bsIndices[i + combo_length - 1];
			let baseDistance = seqEnd - seqStart + 1;

			let skips = skipIndices.filter(
				(idx) => idx > seqStart && idx < seqEnd && !bsIndices.includes(idx),
			);

			let distance = baseDistance - skips.length;
			if (firstStart == -1 && distance <= combo_length + max_spread) {
				firstStart = seqStart;
				firstDistance = distance;
			}

			if (distance < shortestDistance) {
				shortestStart = seqStart;
				shortestDistance = distance;
			}
		}

		return {
			shortest: { idx: shortestStart, length: shortestDistance },
			first: { idx: firstStart, length: firstDistance },
		};
	}

	function cookiesContainBuffs(...cookies: Cookie[]): boolean {
		return cookies.some((cookie) => {
			return (
				cookie.type == "Building Special" ||
				(state.include_ef_in_sequence && cookie.type == "Elder Frenzy")
			);
		});
	}

	function check_gambler(spellsCast: number): GamblerSpell {
		Math.seedrandom(state.seed + "/" + spellsCast);

		let spells = [];
		for (const [key, spell] of Object.entries(SPELLS)) {
			if (key != "gambler's fever dream") spells.push(spell);
		}

		var gfdSpell = choose(spells);
		//simplifying the below cause this isn't patched yet afaict and i'll never be playing with diminished ineptitutde backfire
		var gfdBackfire = 0.5; /*M.getFailChance(gfdSpell);
    
    if(FortuneCookie.detectKUGamblerPatch()) gfdBackfire *= 2;
    else gfdBackfire = Math.max(gfdBackfire, 0.5);*/

		let gamblerSpell: Partial<GamblerSpell> = {};
		gamblerSpell.type = gfdSpell.name;
		gamblerSpell.hasBs = false;
		gamblerSpell.hasEf = false;

		Math.seedrandom(state.seed + "/" + (spellsCast + 1));
		if (Math.random() < 1 - gfdBackfire) {
			gamblerSpell.backfire = false;

			if (gfdSpell.name == "Force the Hand of Fate") {
				gamblerSpell.innerCookie1 = check_cookies(
					spellsCast + 1,
					"",
					false,
					true,
				);
				gamblerSpell.innerCookie2 = check_cookies(
					spellsCast + 1,
					"",
					true,
					true,
				);

				gamblerSpell.hasBs =
					gamblerSpell.innerCookie1.type == "Building Special" ||
					gamblerSpell.innerCookie2.type == "Building Special";
			}

			//TODO: Do something with edifice to make it clear if it will fail or not. like this:
			//if(gfdSpell.name == "Spontaneous Edifice") spellOutcome += ' (' + FortuneCookie.gamblerEdificeChecker(spellsCast + 1, true) + ')';
		} else {
			gamblerSpell.backfire = true;

			if (gfdSpell.name == "Force the Hand of Fate") {
				gamblerSpell.innerCookie1 = check_cookies(
					spellsCast + 1,
					"",
					false,
					false,
				);
				gamblerSpell.innerCookie2 = check_cookies(
					spellsCast + 1,
					"",
					true,
					false,
				);

				gamblerSpell.hasEf =
					gamblerSpell.innerCookie1.type == "Elder Frenzy" ||
					gamblerSpell.innerCookie2.type == "Elder Frenzy";
			}

			//TODO: again, handle spontaneous edifice
			//if(gfdSpell.name == "Spontaneous Edifice") spellOutcome += ' (' + FortuneCookie.gamblerEdificeChecker(spellsCast + 1, false) + ')';
		}

		return gamblerSpell as GamblerSpell;
	}

	function check_cookies(
		spells: number,
		season: string,
		chime: boolean,
		forcedGold = false,
	): Cookie {
		Math.seedrandom(state.seed + "/" + spells);
		let roll = Math.random();
		if (
			forcedGold !== false &&
			(forcedGold || roll < 1 - 0.15 * (state.on_screen_cookies + 1))
		) {
			/* Random is called a few times in setting up the golden cookie */
			if (chime === true && state.ascensionMode != 1) Math.random();
			if (season == "valentines" || season == "easter") {
				Math.random();
			}
			Math.random();
			Math.random();
			/**/

			var choices = [];
			choices.push("Frenzy", "Lucky");
			if (!state.dragonflight) choices.push("Click Frenzy");
			if (Math.random() < 0.1)
				choices.push("Cookie Storm", "Cookie Storm", "Blab");
			if (Math.random() < 0.25) choices.push("Building Special");
			if (Math.random() < 0.15) choices = ["Cookie Storm Drop"];
			if (Math.random() < 0.0001) choices.push("Free Sugar Lump");
			let cookie: Partial<Cookie> = {};
			cookie.wrath = false;
			cookie.type = choose(choices);
			if (cookie.type == "Frenzy")
				cookie.description = "Gives x7 cookie production for 77 seconds.";
			if (cookie.type == "Lucky")
				cookie.description =
					"Gain 13 cookies plus the lesser of 15% of bank or 15 minutes of production.";
			if (cookie.type == "Click Frenzy")
				cookie.description = "Gives x777 cookies per click for 13 seconds.";
			if (cookie.type == "Blab")
				cookie.description = "Does nothing but has a funny message.";
			if (cookie.type == "Cookie Storm")
				cookie.description =
					"A massive amount of Golden Cookies appears for 7 seconds, each granting you 1–7 minutes worth of cookies.";
			if (cookie.type == "Cookie Storm Drop")
				cookie.description = "Gain cookies equal to 1-7 minutes production";
			if (cookie.type == "Building Special") {
				cookie.description =
					"Get a variable bonus to cookie production for 30 seconds.";
				cookie.noteworthy = true;
			}
			if (cookie.type == "Free Sugar Lump")
				cookie.description = "Add a free sugar lump to the pool";
			return cookie as Cookie;
		} else {
			/* Random is called a few times in setting up the golden cookie */
			if (chime === true && state.ascensionMode != 1) Math.random();
			if (season == "valentines" || season == "easter") {
				Math.random();
			}
			Math.random();
			Math.random();
			/**/

			var choices = [];
			choices.push("Clot", "Ruin");
			if (Math.random() < 0.1) choices.push("Cursed Finger", "Elder Frenzy");
			if (Math.random() < 0.003) choices.push("Free Sugar Lump");
			if (Math.random() < 0.1) choices = ["Blab"];
			let cookie: Partial<Cookie> = {};
			cookie.wrath = true;
			cookie.type = choose(choices);
			if (cookie.type == "Clot")
				cookie.description = "Reduce production by 50% for 66 seconds.";
			if (cookie.type == "Ruin")
				cookie.description =
					"Lose 13 cookies plus the lesser of 5% of bank or 15 minutes of production";
			if (cookie.type == "Cursed Finger")
				cookie.description =
					"Cookie production halted for 10 seconds, but each click is worth 10 seconds of production.";
			if (cookie.type == "Blab")
				cookie.description = "Does nothing but has a funny message.";
			if (cookie.type == "Elder Frenzy") {
				cookie.description = "Gives x666 cookie production for 6 seconds";
				cookie.noteworthy = true;
			}
			if (cookie.type == "Free Sugar Lump")
				cookie.description = "Add a free sugar lump to the pool";
			return cookie as Cookie;
		}
	}

	return { load_more, cast_spell, load_game };
}
