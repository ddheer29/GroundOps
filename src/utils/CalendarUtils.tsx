export const CalendarUtils = {
  getRandomPastelColor: () => {
    const randomChannel = () => Math.floor(Math.random() * 106) + 150; // 150–255 range

    const r = randomChannel();
    const g = randomChannel();
    const b = randomChannel();

    return `rgb(${r}, ${g}, ${b})`;
  },
};
