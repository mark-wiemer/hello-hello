# Many irons in the fire

Reflecting on 2025, excited for 2026!

2026-01-02

2025 had a weird feel to it. Our felon president demolished a third of his (our!) house, [got his administration sued over 500 times](https://www.justsecurity.org/107087/tracker-litigation-legal-challenges-trump-administration/), "liberated" us with illegal tariffs fittingly close to April Fool's Day, [signed way too many executive orders](https://www.thetimes.com/us/news-today/article/trump-polls-today-approval-zd39xzh7z#4e98473c-3029-4731-91a5-e9b1cd13b781), [illegally deported residents without criminal records (or even charges filed)](https://www.unpopularfront.news/p/60-minutess-inside-cecot), and generally made hundreds of millions of lives worse. I started reading the news in February, and I didn't really stop, to the point of dedicating the entirety of May to recreating a Trump litigation tracker, this time data-driven. I got through the data part, realized I didn't have the energy to build a system to scrape updates, and dropped the project in early July. I very much enjoyed participating in the biggest single-day protest in American history, and have arrived at a new normal of tracking this craziness and reminding myself that I can't change much of it, but I can share what I learn.

Although I don't talk about work much, you're correct when you guess my job has been building AI non-stop since late 2023. I've lost track of the number of agents, prompt templates, and systems I've designed that incorporate large language models. I could list off a dozen AI technologies I've learned in the past six months if I wanted to, but that's for another post. I'm certainly having fun with it, especially now that I learned I can [make AI go insane by mentioning the seahorse emoji](https://www.youtube.com/watch?v=W2xZxYaGlfs).

My non-technical personal life was pretty uneventful. I joined my first dating app, dated a lovely woman for a couple months, then we split and I didn't have the energy to start something new during the ICE protests. My cousin got married, and so did a friend from high school, so I spent September mostly in Wisconsin, plus a brief foray to Boston for the first time. Otherwise I spent plenty of time walking the dog, cooking, playing board games, and reading Mistborn, Red Rising, the new Hunger Games books, and Careless People.

But on the technical side? Oh boy! I started the year by finishing up my work on [docs.luanti.org](https://docs.luanti.org), the new documentation site for the [open-source boxel game creation system](https://markwiemer.com/luanti). I love Luanti, and it's been amazing to see it grow just in the past year. More on Luanti later in this post! 😉

[I started maintaining Mocha](https://mochajs.org/next/) in August! Nothing like casually becoming a maintainer of a 15-year-old test framework [downloaded ten million times a week](https://npmjs.com/package/mocha). Mocha is very fun to maintain, I use it in [AHK++](http://ahkpp.com) and will of course be using it in new small projects now that I'm a maintainer. [Josh](https://joshuakgoldberg.com) is an excellent co-maintainer so I'm always happy to chip away at notifications when I have some time to spare.

You know what else Josh does? He organizes [SquiggleConf](https://squiggleconf.com/), a Boston-based tech conference! This September was the second year of the conf and my first ever tech conference, and it was just **amazing**! I never knew that those super smart people in the tech world were happy to just talk about their experiences and their suggestions and even mingle afterwards just to chat? And everyone I spoke to was interested in coding?? Heaven! I once mentioned I had a personal website, someone asked me to see it, I pulled out my phone, and 4 people were suddenly in a circle around me looking at it! Everyone has a website at a tech conference, but everyone is also truly interested in each other's sites, it's so heartwarming. I learned a ton, and a few of the people I met are now helping me build a new PC! 🤓

The only downside is that I got bronchitis and was sick for two months.

---

And now it's 2026! Christmas went smoothly, I'm back at work, and I've finally got some time and energy to pick up on personal projects.

First off: [A Luanti documentation schema](https://github.com/luanti-org/docs.luanti.org/issues/296)! Don't you just hate it when you're trying to write code for a new system, and you're in your IDE, but your IDE has no information about this fancy system? Well, you're in luck, because I've decided to lead an effort to rewrite decades of documentation, build a custom parser, hook it into a language server, and hook that language server into IDE extensions so you can do just that! You're welcome! This is something that started really bothering me in October, and I joined the ongoing effort in November, and just yesterday shared my proposal with the Luanti team after extensive discussions. We're mostly on board and moving forward, and I'm excited to use [remark](https://remark.js.org/) extensively for the first time ([the unified collective](https://unifiedjs.com/) does great work). This project has gradually rose in my priority list and bubbled its way to the top because it's just too much fun!

Next, of course, is maintaining Mocha. Mocha 12 is on its way with lots of internal upgrades and end-user bugfixes, and we've finally triaged all 200+ issues (some filed 10+ years ago!) into milestones. This year should have a lot of great progress, including [finalizing the new site](https://github.com/mochajs/mocha/issues/5576), releasing [Mocha 12](https://github.com/mochajs/mocha/issues/5357) (and hopefully Mocha 13), and [automating a ton of paperwork](https://github.com/mochajs/mocha/issues/5601). I am extremely hyped to turn Mocha into a [DevOps](https://en.wikipedia.org/wiki/DevOps) utopia, even if it takes the rest of the decade!

The final big thing is the new PC build. I'll finally be able to play BeamNG.drive and Borderlands 4, and I'll even get a Windows VM up and running so I can [finish work on AHK++](https://github.com/mark-wiemer/ahkpp/discussions/686) and play Xbox games again (I switched to Linux Mint in August and haven't looked back). This is also a fun project to work on with my little brother, who has taught me so much about this in the few conversations we've had so far.

There are some other fun projects, like moving all my work to a [new monorepo](https://github.com/mark-wiemer/hello-hello), [modding my favorite little idle game](https://mod.io/g/melvoridle/m/cleanup-main-menu), and making recipes from [The Pasta Book](https://www.librarything.com/work/34552049/t/The-Pasta-Book-Recipes-Techniques-Inspiration) that I got for Christmas! There are secret projects, too, as always, but I'm not supposed to tell you about those.

And don't worry, I still plan to spend a ton of time with my friends, train my dog, listen to music, and read even more books. My life is not entirely code, only, like, 90% 🤓

Cheers to 2026!

---

2026-01-02: Tiny grammar fixes
