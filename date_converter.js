// Convert dates from m.d.y format to m/d/yy format
function reformatDate(dateString) {
  // Split the date by periods
  const parts = dateString.split(".");

  if (parts.length !== 3) {
    return dateString; // Return original if not in expected format
  }

  const month = parts[0]; // No padding for month
  const day = parts[1]; // No padding for day
  let year = parts[2];

  // Convert year to 2-digit format
  if (year.length === 4) {
    year = year.slice(-2); // Take last 2 digits
  } else if (year.length === 3) {
    // Handle 3-digit years like 247 -> 47
    year = year.slice(-2);
  } else if (year.length === 2) {
    // Already 2 digits, keep as is
    year = year.padStart(2, "0");
  } else if (year.length === 1) {
    // Single digit year, pad with 0
    year = "0" + year;
  }

  return `${month}/${day}/${year}`;
}

// ========================================
// PASTE YOUR DATE STRING HERE:
// ========================================
const dateString = `
9.1.24
9.3.24
9.3.24
9.4.24
9.5.24
9.5.24
9.7.24
9.7.24
9.10.24
9.10.24
9.11.24
9.13.24
9.14.24
9.16.24
9.17.24
9.19.24
9.20.24
7.24.24
9.25.24
9.26.24
9.27.24
9.27.24
9.27.24
9.27.24
9.27.24
9.27.24
9.28.24
9.30.24
7.1.24
7.1.24
7.1.24
7.2.27
7.2.24

7.2.24
7.2.24
7.3.24
7.3.24
7.3.24
7.5.24
7.5.24
7.5.24
7.8.24
7.8.24
7.8.24
7.8.24
7.8.24
7.9.24
7.9.24
7.9.24
7.9.24
7.9.24
7.9.24
7.9.24
7.9.24
7.10.24
7.10.24
7.10.24
7.10.24
7.10.24
7.10.24
7.11.24
7.11.24
7.11.24
7.12.24
7.12.24
7.12.24
7.12.24
7.15.24
7.15.24
7.15.24
7.15.24
7.15.24
7.15.24
7.16.24
7.16.24
7.16.24
7.16.24
7.16.24
7.17.24
7.18.24
7.18.24
8.2.24
8.1.24
8.1.24
8.2.24
8.5.24

8.5.24
8.5.24
8.5.24
8.6.24
8.6.24
8.6.24
8.6.24
8.7.24
8.7.24
8.7.24
8.7.24
8.7.24
8.8.24
8.8.24
8.8.24
8.8.24
8.9.24
8.9.24
8.9.24
8.12.24
8.12.24
8.13.24
8.13.24
8.14.24
8.16.24
8.16.24
8.19.24
8.21.24
8.21.24
8.23.24
8.23.24
8.26.24
8.26.24
8.27.24
8.30.24
7.4.24
9.5.24
9.13.24
9.15.24
9.16.24

9.16.24
9.17.24
9.17.24
9.17.24
9.18.24
9.18.24
9.18.24
9.20.24
9.24.24
9.25.24
9.26.24
9.30.24
9.30.24
9.30.24
7.1.24
7.1.24
7.2.24
7.6.24
7.7.24
7.9.24
7.9.24
7.10.24
7.13.24
7.14.24
7.15.24
7.19.24
7.20.24
7.21.24
7.22.24
7.26.24
7.27.24
7.27.24
7.31.24
7.31.24
8.3.24
8.7.24
8.8.24
8.8.24
8.12.24
8.13.24
8.13.24
8.13.24
8.14.24
8.15.24
8.19.24
8.20.24
8.21.24
8.23.24
8.23.24
8.25.24
8.25.24
8.27.24
8.27.24
8.28.24
8.30.24
8.30.24
9.4.24
9.7.24
9.10.24
9.11.24
9.11.24
9.11.24
9.12.24
9.19.24
9.19.24
9.20.24
9.21.24
9.21.24
9.25.24
9.25.24
9.25.24
9.25.24
9.26.24
9.29.24
`;

// ========================================
// PROCESSING (don't change below this line)
// ========================================

// Split by newlines and process each line as a date
const dates = dateString.trim().split("\n");
const formattedDates = [];

dates.forEach((date) => {
  const trimmedDate = date.trim();
  if (trimmedDate) {
    // Skip empty lines
    formattedDates.push(reformatDate(trimmedDate));
  }
});

// Print results
console.log("\nFormatted dates:");
console.log("================");
formattedDates.forEach((date) => console.log(date));
