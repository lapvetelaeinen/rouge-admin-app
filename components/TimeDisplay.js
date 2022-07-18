import { CSSProperties, useEffect, useState } from "react";

function TimeDisplay({ time }) {
  const [currentTime, setCurrentTime] = useState(() => {
    const hour = ("0" + new Date(time * 1000).getUTCHours()).slice(-2);
    const minutes = ("0" + new Date(time * 1000).getUTCMinutes()).slice(-2);

    return `${hour}:${minutes} UTC`;
  });

  useEffect(() => {
    setCurrentTime(() => {
      const hour = ("0" + new Date(time * 1000).getHours()).slice(-2);
      const minutes = ("0" + new Date(time * 1000).getMinutes()).slice(-2);

      return `${hour}:${minutes}`;
    });
  }, [time]);

  // optionally make this content take space, but remain invisible, to avoid layout shifts
  // it's better to use a CSS class instead
  const style = {
    visibility: currentTime.includes("UTC") ? "hidden" : "visible",
  };

  return (
    <article>
      <p style={style}>{currentTime}</p>
    </article>
  );
}

export default TimeDisplay;
