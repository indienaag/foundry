const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const clock = document.getElementById("status-time");
if (clock) {
  const update = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    clock.dateTime = now.toISOString();
  };
  update();
  setInterval(update, 30_000);
}
