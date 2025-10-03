import { cva } from "class-variance-authority";
import {
  isGamblerSpellNoteworthy,
  isGamblerSpellSkip,
  useFunctions,
  useStateStore,
} from "./state";
import React from "react";
import { CookieImage } from "./components/CookieImage";

const btn = cva(
  "max-w-max cursor-pointer px-3 py-2 rounded-xl transition-all hover:-translate-y-0.5 hover:scale-[101%] active:scale-[99%] active:translate-0",
  {
    variants: {
      color: {
        primary:
          "bg-primary-700 hover:bg-primary-600 active:bg-primary-800  text-neutral-200",
        secondary:
          "bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-700 text-neutral-200",
      },
    },
    defaultVariants: {
      color: "secondary",
    },
  },
);

const input = cva(
  "transition-all bg-neutral-50 border border-neutral-500 hover:border-primary-300 focus-visible:border-primary-500 focus-visible:outline-2 focus-visible:outline-primary-600 rounded-xl px-3 py-2",
);

const columnHeader = cva(
  "border-b border-neutral-700 px-2 py-1 even:bg-neutral-100",
);
const columnHeaderTitle = cva("text-lg font-medium text-neutral-800");
const columnHeaderSubtitle = cva("text-sm text-neutral-600");
const gridCell = cva(
  "flex items-center gap-2 px-2 py-1 even:bg-neutral-100 border-b border-neutral-300",
);

const highlight = cva(undefined, {
  variants: {
    type: {
      noteworthy: "bg-emerald-300/50",
      skip: "bg-rose-300/50",
    },
  },
});

function App() {
  const state = useStateStore();
  const functions = useFunctions();

  window.APP = { state, functions };

  return (
    <main className="grid grid-rows-[auto_1fr] min-h-screen max-w-screen @container gap-8 bg-neutral-50 text-neutral-900">
      <div className="p-4 bg-primary-200 w-full max-w-6xl mx-auto transition-all @6xl:rounded-4xl @4xl:px-8">
        <h1 className="text-neutral-800 text-xl font-semibold">
          Cookie Clicker FtHoF Planner v4
        </h1>
      </div>
      <div className="max-w-6xl w-full mx-auto px-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-neutral-700 text-sm">Save Code</label>
            <input
              className={input()}
              value={state.save_string}
              onChange={(e) =>
                state.update(() => ({ save_string: e.target.value }))
              }
            />
          </div>
          <button
            className={btn({ color: "primary" })}
            onClick={() => functions.load_game()}
          >
            Import Save
          </button>
        </div>

        {/* 
        <p></p><b>Based on FtHoF planner v1, v2, v3 by RebelKeithy, Skeezy and Eminenti. Huge thanks to them for
        creating such
        a helpful tool.</b></br>
        The current version is compatible with cookie clicker 2.052, "often imitated, never duplicated".
        <md-button className="md-raised md-primary" ng-click="collapse_interface(1)">see here</md-button>
        for the full version history, credits & contacts.</b></p>
        <div className="collapse-content" id="content-1">
            <ul>
                <li><a href="http://fthof-planner.s3-website.us-east-2.amazonaws.com/">FtHoF planner V1</a> by
                    <a href="https://www.reddit.com/user/RebelKeithy">RebelKeithy</a> (reddit)
                    <ul>
                        <li>The first version made good use of the code that you can just copy from the cookie clicker
                            website and interpreted the code in a way that made the first FtHoF planner. Basic but a
                            powerful start.
                        </li>
                    </ul>
                </li>
                <li><a href="https://messieurs.github.io/fthofplannerv2/">FtHoF planner v2</a> by
                    <a href="https://discord.gg/cookie">@skeezy</a> (discord)
                    <ul>
                        <li>The second version of the FtHoF planner with undeniable the biggest update to it to date.
                            The new version also made it possible to have a look into the Gambler's Fever Dream and a
                            combo-finder was added which made it more easy to actually find them.
                        </li>
                    </ul>
                </li>
                <li><a href="https://eminenti.github.io/FtHoF-Planner-v3/">FtHoF planner v3</a> by
                    <a href="https://discord.com/invite/r6hssr5">@eminenti</a> (discord)
                    <ul>
                        <li>The third version was mainly a bugfix because of a bugfix. The original and second FtHoF
                            planners made use (just like the original cookie clicker) of a second possible change to
                            alter the outcome of FtHoF. This was a bug and fixed by Orteil. This broke the first 2
                            planners and was fixed in V3. Later also the combo-finder was fixed not to calculate those
                            outcomes for Gambler's Fever Dream.
                        </li>
                    </ul>
                </li>
                <li><a href="https://mylaaan.github.io/FtHoF-Planner-v4/">FtHoF planner v4</a> by
                    <a href="https://discord.gg/cookie">@mylaaan</a> (discord)
                    <ul>
                        <li>The fourth version only added ease of use interface options. Like the "Cast Spell" button to
                            make it easier to keep track of where you are without importing the save again. Also updated
                            some visual features and removed Google Analytics.
                        </li>
                    </ul>
                </li>

                <md-divider style="margin: 1em 0;"></md-divider>
                <li>For added features or bugs open an issue on <a
                        href="https://github.com/mylaaan/FtHoF-Planner-v4/issues">GitHub</a> or make it yourself
                    and make a pull request. I will credit you of course.
                </li>
                <li>If you do make a bug report please add the save export. This makes it easier to visualise
                    the problem you're facing and I can make sure it is fixed instead of almost being sure.
                </li>
            </ul>
        </div>

        <p>RebelKeithy & Skeezy & I made a guide explaining the options/features we added which can be
            <md-button className="md-raised md-primary" ng-click="collapse_interface(2)">found here</md-button>
        </p>
        <div className="collapse-content" id="content-2">
            <ul>
                <pre>&lt;RebelKeithy&gt;</pre>

                <li>
                    <b>Force the Hand of Fate is not completely random, it is based on your game's seed (which changes
                        after each ascension) and on the number of spells cast this game. This means that if you know
                        the seed then you can predict the results for casting Force the Hand of Fate:</b>
                    <ul>
                        <li>There are two main things that can affect the result of FtHoF, the current season <s>and the
                            golden cookie sound selector</s>. If the season is Valentines or Easter the random seed will
                            be
                            increased once. This means there are 2 possible results for each cast of FtHoF depending on
                            the selected season. Continuing to switch between seasons will not affecting the results,
                            they only affect the result at the time the spell is cast.
                        </li>
                        <li>Dragonflight can also affect the results of casting FtHoF. If the buff is active (not just
                            possible) when FtHoF is cast then Click Frenzy is not added to the pool of possible results.
                            This can change the result even if the original result was not a Click Frenzy.
                        </li>
                        <li>Another thing that after the result is how many golden cookies are already on the screen.
                            Each one increases the chance of failure by 15%.
                        </li>
                        <li>Since the result of FtHoF is based on the number of spells cast, if the next FtHoF cookie is
                            not the one you want, you can cast a different spell to skip this one. This can be useful if
                            you are searching for a particular cookie or need to skip a wrath cookie.
                        </li>
                    </ul>
                </li>

                <pre>&lt;/RebelKeithy&gt;</pre>
                <pre>&lt;Skeezy&gt;</pre>

                <li>
                    <b>Combo search: Once you import a save file, the planner will display both the earliest and
                        shortest versions of combos. Combos are combinations of Building Specials (BS) (and optionally
                        Elder Frenzies (EF)) that are close together:</b>
                    <ul>
                        <li>Min combo is the smallest combo to search for; Max is the largest.</li>
                        <li>Spread is how much leeway to include in the combo search. For example, if you want a 3x
                            combo and are ok with a sequence of [BS, non-BS, BS, BS], that would be a combo size of 3
                            with a spread of 1, for a total length of 4.
                        </li>
                        <li>Include Elder Frenzies is asking whether to count EF spawns from FtHoF in your combos. For
                            most people these are just as good, if not better than Building Specials, so they're
                            included by default. But in some cases you may not want EF via FtHoF, so I have an option to
                            exclude it.
                        </li>
                        <li>For Skip Abominations and Skip Spontaneous Edifices, see below for more explanation, but
                            these options are just asking whether to factor in skippable rows when searching for combos.
                            Can't imagine why you'd want this off, but I have the option there at least for educational
                            purposes.
                        </li>
                    </ul>
                </li>

                <li>
                    <b>Gambler's fever dream: Added a column for this, as it's critical to getting combos:</b>
                    <ul>
                        <li>More chances for Building Special or Elder Frenzy via Gambler's -&gt; FtHoF. Plus these casts
                            end up costing significantly less mana, which can help with more spread-out combos. Hover
                            over the cookie when it's FtHoF to see what the cookie might contain
                        </li>
                        <li>Allows for more combos by skipping over certain rows when desired. (Abominations and
                            successful Spontaneous Edifice casts from Gambler's can both increment your spell counter
                            for free, i.e. without costing any mana.)
                        </li>
                        <li>For the same skipping reason as above, this can help in incrementing your spell counter
                            quickly to get to your desired combo.
                        </li>
                    </ul>
                </li>
                <li>Lookahead length: This is how many grimoire casts (rows) are loaded when you import (original had it
                    hard-coded to 10).
                </li>
                <li>Spell counter column (the one on the left) now includes indices for both your spells casts this
                    ascension, and total spells cast
                </li>
                <li>Building Specials and Elder Frenzies are highlighted yellow</li>
                <li>Rows skippable via Gambler's have their Gambler's spell highlighted blue.</li>

                <pre>&lt;/Skeezy&gt;</pre>
                <pre>&lt;Mylaaan&gt;</pre>

                <li>
                    <b>Cast Spell and Apply Settings:</b>
                    <ul>
                        <li>The Cast Spell button will forward the whole list 1 spell. It will also apply all settings
                            so if you have changed them the outcome for future spells may change. If you have to cast
                            FtHoF for a CF first you want to keep that cookie on screen, this way you can up the "Golden
                            Cookies on screen" and then cast spell
                        </li>
                        <li>If you made progress you don't want to click the Import Save button as it will reset your
                            manually cast spells. You can use Apply Settings to change stuff up without losing track.
                        </li>
                    </ul>
                </li>
                <li>For early game players the possibility to hide the One change column as they won't have Season
                    Switcher
                </li>
                <li>Added a checkbox for the "Supreme Intellect" dragon aura as this should influence the
                    positive/negative rate by 10% more negative. This is maybe a bug in the game but currently this
                    button is a placebo or a placeholder for future implementation. The game and the planner do
                    currently not step out of line when using the aura without any update to the planner.
                </li>
                <pre>&lt;/Mylaaan&gt;</pre>
            </ul>
        </div>

        */}

        <div className="bg-neutral-500/10 p-4 rounded-xl flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label>Lookahead length</label>
            <input
              className={input()}
              type="number"
              value={state.lookahead}
              onChange={(e) =>
                state.update(() => ({ lookahead: +e.target.value }))
              }
              min={10}
              max={1000}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Min Combo</label>
            <input
              className={input()}
              type="number"
              value={state.min_combo_length}
              onChange={(e) =>
                state.update(() => ({ min_combo_length: +e.target.value }))
              }
              min={1}
              max={16}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Max Combo</label>
            <input
              className={input()}
              type="number"
              value={state.max_combo_length}
              onChange={(e) =>
                state.update(() => ({ max_combo_length: +e.target.value }))
              }
              min={1}
              max={16}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Max Spread</label>
            <input
              className={input()}
              type="number"
              value={state.max_spread}
              onChange={(e) =>
                state.update(() => ({ max_spread: +e.target.value }))
              }
              min={0}
              max={99}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Golden Cookies on screen</label>
            <input
              className={input()}
              type="number"
              value={state.on_screen_cookies}
              onChange={(e) =>
                state.update(() => ({ on_screen_cookies: +e.target.value }))
              }
              min={0}
              max={10}
            />
          </div>

          <div className="flex gap-1">
            <input
              type="checkbox"
              defaultChecked
              checked={state.include_ef_in_sequence}
              onChange={(e) =>
                state.update(() => ({
                  include_ef_in_sequence: e.target.checked,
                }))
              }
            />
            <label>Include Elder Frenzies</label>
          </div>

          <div className="flex gap-1">
            <input
              type="checkbox"
              defaultChecked
              checked={state.skip_abominations}
              onChange={(e) =>
                state.update(() => ({ skip_abominations: e.target.checked }))
              }
            />
            <label>Skip Abominations</label>
          </div>

          <div className="flex gap-1">
            <input
              type="checkbox"
              defaultChecked
              checked={state.skip_edifices}
              onChange={(e) =>
                state.update(() => ({ skip_edifices: e.target.checked }))
              }
            />
            <label>Skip Spontaneous Edifices</label>
          </div>

          <div className="flex gap-1">
            <input
              type="checkbox"
              defaultChecked
              checked={state.dragonflight}
              onChange={(e) =>
                state.update(() => ({ dragonflight: e.target.checked }))
              }
            />
            <label>Dragonflight Buff Active</label>
          </div>

          {/*
          <input
          type="checkbox"
          defaultChecked
          checked={state.supremeintellect}
          onChange={(e) =>
              state.update(() => ({ supremeintellect: e.target.checked }))
          }
          />
          <label>Supreme Intellect Aura Active</label>
          */}
        </div>

        <div className="flex items-center gap-4">
          <button className={btn()} onClick={() => functions.update_cookies()}>
            Apply Settings
          </button>
          <button className={btn()} onClick={() => functions.cast_spell()}>
            Cast Spell
          </button>
        </div>

        {Object.keys(state.combos).length > 0 ? (
          <ul>
            {Object.values(state.combos).map((combo, i) => (
              <li className="combo-listitem">
                <b>{i + state.min_combo_length}x Combo</b>
                {combo.shortest.idx === -1 ? (
                  <ul>
                    <li>No combo of this length</li>
                  </ul>
                ) : (
                  <ul>
                    {combo.first.idx === -1 ? (
                      <li>
                        No combo of this length with spread &lt;={" "}
                        {state.max_spread}
                      </li>
                    ) : (
                      <li>
                        <a
                          href={`#${combo.first.idx + 1}`}
                          className="text-blue-500 underline"
                        >
                          Earliest:
                        </a>{" "}
                        Length {combo.first.length}; spread{" "}
                        {combo.first.length - (i + state.min_combo_length)};
                        starting at{" "}
                        <a
                          href={`#${combo.first.idx + 1}`}
                          className="text-blue-500 underline"
                        >
                          spell #{combo.first.idx + 1}
                        </a>
                      </li>
                    )}
                    <li>
                      <a
                        href={`#${combo.shortest.idx + 1}`}
                        className="text-blue-500 underline"
                      >
                        Shortest:
                      </a>{" "}
                      Length {combo.shortest.length}; spread{" "}
                      {combo.shortest.length - (i + state.min_combo_length)};
                      starting at{" "}
                      <a
                        href={`#${combo.shortest.idx + 1}`}
                        className="text-blue-500 underline"
                      >
                        spell #{combo.shortest.idx + 1}
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="grid grid-cols-4">
          <div className={columnHeader()}>
            <h3 className={columnHeaderTitle()}>Spell #</h3>
            <p className={columnHeaderSubtitle()}>
              Relative to now (This acension | All time)
            </p>
          </div>
          <div className={columnHeader()}>
            <h3 className={columnHeaderTitle()}>No Change</h3>
            <p className={columnHeaderSubtitle()}>
              Season is not Easter or Valentines
            </p>
          </div>
          <div className={columnHeader()}>
            <h3 className={columnHeaderTitle()}>One Change</h3>
            <p className={columnHeaderSubtitle()}>
              Season is Easter or Valentines
            </p>
            <div>
              <input type="checkbox" checked />
              <label>Show</label>
            </div>
          </div>
          <div className={columnHeader()}>
            <h1 className={columnHeaderTitle()}>Gambler's Dream</h1>
          </div>
          {state.cookies.map((cookie_list, i) => (
            <React.Fragment key={i}>
              <div className={gridCell()}>
                <a id={String(i + 1)}>
                  {`${
                    i + 1
                  } (${state.spellsCastThisAscension + i + 1} | ${state.spellsCastTotal + i + 1})`}
                </a>
              </div>
              <div className={gridCell()}>
                <CookieImage type={cookie_list[0].wrath ? "wrath" : "golden"} />
                <span
                  className={
                    cookie_list[0].noteworthy
                      ? highlight({ type: "noteworthy" })
                      : undefined
                  }
                >
                  {cookie_list[0].type}
                </span>
              </div>
              <div className={gridCell()}>
                <CookieImage type={cookie_list[1].wrath ? "wrath" : "golden"} />
                <span
                  className={
                    cookie_list[1].noteworthy
                      ? highlight({ type: "noteworthy" })
                      : undefined
                  }
                >
                  {cookie_list[1].type}
                </span>
              </div>
              <div className={gridCell()}>
                <CookieImage
                  type={cookie_list[3].backfire ? "wrath" : "golden"}
                />
                <div className="flex flex-col gap-1">
                  <span
                    className={highlight({
                      type: isGamblerSpellNoteworthy(cookie_list[3])
                        ? "noteworthy"
                        : isGamblerSpellSkip(cookie_list[3])
                          ? "skip"
                          : undefined,
                    })}
                  >
                    {cookie_list[3] ? cookie_list[3].type : "Blank"}
                  </span>
                  {cookie_list[3].innerCookie1 != null &&
                  cookie_list[3].innerCookie2 != null ? (
                    <span className="text-neutral-900">
                      {cookie_list[3].innerCookie1.type},{" "}
                      {cookie_list[3].innerCookie2.type}
                    </span>
                  ) : null}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <button className={btn()} onClick={() => functions.load_more()}>
          Load More
        </button>
      </div>
    </main>
  );
}

export default App;
