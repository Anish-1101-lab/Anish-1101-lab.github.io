import { useEffect, useState } from "react";
import profilePhoto from "./assets/profile.jpg";
import { AwardIcon, NewsIcon, ServiceIcon } from "./components/icons";
import ColumnSection from "./components/ColumnSection";
import ExperienceRow from "./components/ExperienceRow";
import { highlightName, renderInline } from "./components/inline";
import ProjectPage from "./components/ProjectPage";
import PublicationRow from "./components/PublicationRow";
import Section from "./components/Section";
import { projects } from "./data/projects";
import {
  awards,
  experience,
  news,
  profile,
  professionalDevelopment,
  publications,
} from "./data";
import { useHashRoute } from "./lib/useHashRoute";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true;
  });
  const route = useHashRoute();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const projectMatch = route.match(/^\/project\/(.+)$/);
  const activeProject = projectMatch ? projects[projectMatch[1]] : null;

  return (
    <div className="bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 md:px-0">
          <a href="#/" className="text-sm font-semibold tracking-wide hover:text-blue-700 dark:hover:text-blue-400">
            {profile.name}
          </a>
          <div className="flex items-center gap-4 text-sm">
            <a href="#research" className="nav-link">
              Research
            </a>
            <a href="#news" className="nav-link">
              News
            </a>
            <a href="#experience" className="nav-link">
              Experience
            </a>
            <a href="#awards" className="nav-link">
              Awards
            </a>
            <button
              className="text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </nav>
      </header>

      {activeProject ? (
        <main>
          <ProjectPage project={activeProject} />
        </main>
      ) : (
        <main>
          <section className="mx-auto flex w-full max-w-3xl flex-col-reverse items-center gap-8 px-6 py-14 md:flex-row md:items-start md:px-0">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {highlightName(profile.name, "hero")}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                {profile.bio}
              </p>
              <p className="mt-5 text-sm text-blue-700 dark:text-blue-400">
                <a href={`mailto:${profile.email}`} className="hover:underline">
                  Email
                </a>
                <span className="text-zinc-400 dark:text-zinc-600"> / </span>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                  LinkedIn
                </a>
                <span className="text-zinc-400 dark:text-zinc-600"> / </span>
                <a href={profile.github} target="_blank" rel="noreferrer" className="hover:underline">
                  GitHub
                </a>
                <span className="text-zinc-400 dark:text-zinc-600"> / </span>
                <a href={profile.scholar} target="_blank" rel="noreferrer" className="hover:underline">
                  Google Scholar
                </a>
              </p>
            </div>
            <img
              src={profilePhoto}
              alt={profile.name}
              className="h-36 w-36 shrink-0 rounded-full border border-zinc-200 object-cover transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 md:h-40 md:w-40"
            />
          </section>

          <Section
            title="Research & Publications"
            subtitle="Selected papers and workshop publications."
          >
            <div id="research" className="flex flex-col">
              {publications.map((paper) => (
                <PublicationRow key={paper.title} paper={paper} />
              ))}
            </div>
          </Section>

          <Section title="News" subtitle="Awards, publications, and internships as they happen.">
            <div id="news">
              <ColumnSection icon={NewsIcon} label="News">
                <div className="max-h-[360px] space-y-0 overflow-y-auto pr-2">
                  {news.map((item) => (
                    <div
                      key={`${item.date}-${item.text}`}
                      className="border-b border-zinc-200 py-2.5 text-sm leading-relaxed last:border-b-0 dark:border-zinc-800"
                    >
                      <span className="mr-2 inline-block min-w-[64px] font-semibold text-zinc-500 dark:text-zinc-400">
                        {item.date}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {renderInline(item.text, `news-${item.date}-${item.text.slice(0, 12)}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </ColumnSection>
            </div>
          </Section>

          <Section title="Experience" subtitle="Research internships and collaborations.">
            <div id="experience" className="flex flex-col">
              {experience.map((item) => (
                <ExperienceRow key={item.role + item.org} item={item} />
              ))}
            </div>
          </Section>

          <Section
            title="Fellowships & Awards"
            subtitle="Recognitions, grants, and competition results."
          >
            <div id="awards">
              <ColumnSection icon={AwardIcon} label="Awards">
                <div className="space-y-4">
                  {awards.map((award) => (
                    <div key={award.title}>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {award.href ? (
                          <a
                            href={award.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 hover:underline dark:text-blue-400"
                          >
                            {award.title}
                          </a>
                        ) : (
                          award.title
                        )}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                        {award.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ColumnSection>
            </div>
          </Section>

          <Section
            title="Professional Development & Service"
            subtitle="Peer review and scholarly service roles."
          >
            <div id="professional">
              <ColumnSection icon={ServiceIcon} label="Service">
                <div className="space-y-4">
                  {professionalDevelopment.map((item) => (
                    <div key={item.org}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.role},{" "}
                          {item.orgHref ? (
                            <a
                              href={item.orgHref}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-700 hover:underline dark:text-blue-400"
                            >
                              {item.org}
                            </a>
                          ) : (
                            item.org
                          )}
                        </h3>
                        <p className="text-xs uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
                          {item.duration}
                        </p>
                      </div>
                      <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ColumnSection>
            </div>
          </Section>
        </main>
      )}

      <footer className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800 md:px-0">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <p>{profile.name}</p>
          <p className="text-blue-700 dark:text-blue-400">
            <a href={`mailto:${profile.email}`} className="hover:underline">
              Email
            </a>
            <span className="text-zinc-400 dark:text-zinc-600"> / </span>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
              LinkedIn
            </a>
            <span className="text-zinc-400 dark:text-zinc-600"> / </span>
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:underline">
              GitHub
            </a>
            <span className="text-zinc-400 dark:text-zinc-600"> / </span>
            <a href={profile.scholar} target="_blank" rel="noreferrer" className="hover:underline">
              Google Scholar
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
