// The app's store rating, shown in the home hero. Update both numbers here
// when the rating changes; every place that shows it reads from this file.
export const APP_RATING = { value: "4.96", count: 40 } as const;

/** The count as the hero shows it, e.g. "40+". */
export const APP_RATING_COUNT_LABEL = `${APP_RATING.count}+`;
