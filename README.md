# The World in One Day — 18 November 2026

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/Shanumameyra/news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/Shanumameyra/news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

A newspaper front page summing up the world's news of **Wednesday 18 November 2026** — one image, 36 stories. Entry for the make.fun **news-image-20261118** bounty ($250, 50 paid places).

![The World in One Day — 18 November 2026](entry.png)

## The day's stories

Featured (numbered 1–12, marked on the map):

1. **GULF WAR (lead)** — U.S. sinks five Iranian tankers; Iran hits back. CENTCOM destroyed the Kaviz, Charminar, Horizon 1 and Riesco in the Gulf of Oman and the Derya near Kharg Island after the IRGC twice targeted a U.S. warship; Iran fired missiles at the U.S. base at Al-Azraq in Jordan and at 10 ships near the Strait of Hormuz. Oil topped $100 a barrel.
2. **UKRAINE** — Kyiv hits the Kerch Bridge a second night in a row; Russia strikes bridges as Trump, Putin and Xi prepare for Thursday's trilateral summit in Shenzhen.
3. **ASIA** — Quad leaders meet in Manila: Trump joins the leaders of India, Japan and Australia for talks on security and China, ahead of his visit to Beijing.
4. **NVIDIA** — The chipmaker posts a $115.8bn quarter as AI chip sales smash forecasts again.
5. **CYCLONE AKVAN** — The storm bears down on India: landfall due Friday on the Andhra Pradesh coast, winds to 145 km/h, red alert for heavy rain.
6. **KNESSET** — Matan Kahana, an ally of Gadi Eisenkot, is elected speaker 66–52, a blow to caretaker PM Benjamin Netanyahu.
7. **EU LOAN** — The European Commission is set to propose a €45bn loan for Ukraine, covering two-thirds of Kyiv's €70bn 2027 budget gap.
8. **CHINA–CANADA** — China cuts tariffs on Canadian pork and seafood as Xi and Carney extend trade deals in Shenzhen.
9. **GAZA** — UN warns more will die of cold: 1.7 million displaced face winter without shelter; 1.4 million face acute hunger.
10. **CLIMATE** — COP31 in Antalya enters a decisive phase with 144 items still disputed.
11. **CRYPTO** — Bitcoin slumps 12% in a week, falling below its 200-week average; U.S. spot Bitcoin ETFs bled $1.07bn in a week.
12. **INDONESIA** — BMKG warns of heavy rain, lightning and strong winds — and floods — in 17 provinces from 17 to 23 November 2026.

Also on Wednesday 18 November (13–36): Romania quake 5.3 rattles Bucharest; An-12 crash kills 19 in Russia; U.S. measles cases hit a 40-year high; Dhoni retires from the IPL and becomes CSK mentor; first Xi–Trump–Putin trilateral set for APEC; Apple outage hits iCloud and the App Store; India growth seen easing to 7.5% (ICRA); Amazon to put $7bn in Indian renewables; Japan scrambles jets as Russian aircraft intrude; Pope Leo reveals details of his cancer surgery; RAYE leads Grammy nominations with 11; Baidu AI cloud revenue jumps 94%; Taiwan in close contact with the U.S. ahead of APEC; Serbia's student MPs take their seats; Mongolia's president to quit over a railway row; Pattinson named the new James Bond; North Korea fires a missile into the sea; France tests its M51.3 missile from a submarine; Voyager 1 nears one light-day from Earth; Australia sanctions settlement firms; DR Congo peace efforts fail in the east; Ecuadorian fishermen sue over a U.S. strike; French students and unions join strikes; police clash as Spaniards strike.

Every fact was checked against reporting of 18 November 2026 (CENTCOM, Al Jazeera, AP, Reuters, AFP, BBC, UN, CoinDesk, BMKG, IMD).

## How it is made

The image was composed offline with Python/PIL and DejaVu fonts (`draw_poster.py`, kept out of this repo as build tooling), enhanced with Gemini at the entrant's direction (richer colours, stronger contrast, sharper illustrations; all text kept exactly the same), then resized to 1024×1024 and saved as JPEG quality 90 — it ships here as `entry.png` (328 KB), the name the rules require for either format. The entrypoint `main.ts` (Node 22, standard library only) copies it to `/output/entry.png` and verifies it first: JPEG magic bytes, the frame header dimensions, the end marker at the file's end, the 1 MiB / 1024×1024 caps, and a byte-identical read-back. No network, no clock, no randomness — both grader runs write the same bytes.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
