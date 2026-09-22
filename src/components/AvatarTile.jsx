import { initialsOf, stringToHue } from "../lib/color";

// Left-column avatar for an experience row. Given a real `logo` asset it
// shows the organization's actual mark on a white card; otherwise it falls
// back to a colored initials circle. Either way it lifts with a shadow on
// hover.
function AvatarTile({ org, href, logo }) {
  const hue = stringToHue(org);
  const style = {
    background: `linear-gradient(155deg, hsl(${hue} 65% 48%), hsl(${(hue + 30) % 360} 65% 34%))`,
  };

  const avatar = logo ? (
    <div className="thumb-tile flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2.5 shadow-sm">
      <img src={logo} alt={org} className="h-full w-full object-contain" />
    </div>
  ) : (
    <div
      style={style}
      className="thumb-tile flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white/95 shadow-sm"
    >
      {initialsOf(org)}
    </div>
  );

  if (!href) return avatar;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {avatar}
    </a>
  );
}

export default AvatarTile;
