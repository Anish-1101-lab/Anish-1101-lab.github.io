import { useEffect, useState } from "react";

// Hash-based routing keeps project pages reachable without any server-side
// rewrite rule, since the site is deployed as static files under a subpath.
function readHash() {
  return window.location.hash.replace(/^#/, "") || "/";
}

export function useHashRoute() {
  const [path, setPath] = useState(readHash);

  useEffect(() => {
    const onHashChange = () => setPath(readHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  return path;
}
