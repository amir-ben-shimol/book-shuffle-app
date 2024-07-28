# Shuffle Book App

Welcome to the Shuffle Book App! This app allows users to explore and shuffle through books based on their preferences. Additionally, users can upload their `.csv` file export of book lists from Goodreads, integrate with their Goodreads account, and utilize the Goodreads API for displaying detailed book information. Below is an overview of the app, including the technologies used, linters and CI/CD setup, and the main features.

## Technologies Used

-   **Expo**: Utilized for building the app with an app router structure.
-   **TypeScript**: Ensuring type safety and better development experience.
-   **ESLint**: For identifying and reporting on patterns found in ECMAScript/JavaScript code.
-   **Prettier**: An opinionated code formatter to ensure consistent code style.
-   **inflint**: For defining and insuring files names convensions.
-   **knip**: For unused files and exports.
-   **lint-staged**: To run linters on staged files before committing.
-   **Husky**: Used in combination with lint-staged to check code before committing.
-   **Renovate**: For automated dependency updates.
-   **Semantic Release**: For automated versioning and package publishing.
-   **EAS Build Services**: For building the app.

## Project Environment

-   **pnpm**: >=9
-   **node**: >=20

## CI/CD Setup

-   **GitHub Actions**: Used for continuous integration and continuous deployment (CI/CD). The workflow checks code conventions based on the linter configurations.

## Screenshots

### Library View

![Library view showing a collection of book covers arranged in a grid layout](./src/assets/images/showcase/library.png)

### Recently Viewed Books Section

![Recently viewed books section](./src/assets/images/showcase/recently-viewed.png)

### Book Information Page

![Book information page](./src/assets/images/showcase/book-info.png)

### Similar Books Section

![Similar books section showcasing a selection of book covers related to the current book](./src/assets/images/showcase/similar-books.png)

### Shuffle Your Book Feature

![Shuffle your book feature interface with a button to start shuffling books](./src/assets/images/showcase/shuffle.png)

### Shuffled Book Result

![Result of a shuffled book displaying a randomly selected book cover and its title](./src/assets/images/showcase/result-of-shuffled.png)

### Filter Preferences Screen

![Filter preferences screen allowing users to set criteria before shuffling books](./src/assets/images/showcase/filter-preferences.png)

## App Features

-   **Upload Goodreads CSV**: Users can upload their `.csv` file export of book lists from Goodreads.
-   **Goodreads Integration**: The app integrates with the user's Goodreads account, allowing seamless access to their book information.
-   **Goodreads API**: Utilizes the Goodreads API to display detailed book information, including cover, title, author, and description.

## Linters and Code Quality

I have configured several linters and tools to maintain code quality:

-   **lint-staged**: Runs linters on staged files before committing.
-   **Husky**: Ensures lint-staged checks are performed before commits.
-   **ESLint**: Enforces code quality and consistency.
-   **Prettier**: Formats the code to maintain a consistent style.
-   **inflint**: Inline lint checks for files names convensions.
-   **knip**: Identifies unused files and exports.

## Continuous Integration and Continuous Deployment (CI/CD)

I use GitHub Actions for our CI/CD pipeline. The workflow includes:

-   Checking code conventions based on the configured linters.
-   Building the app using EAS build services.
-   Automated dependency updates with Renovate.
-   Automated versioning and releases with Semantic Release.

## Getting Started

To get started with the development of this app, follow these steps:

1. Clone the repository.
2. Install the dependencies using `pnpm install`.
3. Run the app using `pnpm dev`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
