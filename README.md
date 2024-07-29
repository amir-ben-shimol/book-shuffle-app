# Shuffle Book App

Welcome to the Shuffle Book App! This app allows users to explore and shuffle through books based on their preferences. Additionally, users can upload their `.csv` file export of book lists from Goodreads, integrate with their Goodreads account, and utilize the Goodreads API for displaying detailed book information. Below is an overview of the app, including the technologies used, linters and CI/CD setup, and the main features.

## Getting Started

To get started with the development of this app, follow these steps:

1. Clone the repository.
2. Install the dependencies using `pnpm install`.
3. Run the app using `pnpm dev`.

## App Features

-   **Upload Goodreads CSV**: Users can upload their `.csv` file export of book lists from Goodreads.
-   **Goodreads Integration**: The app integrates with the user's Goodreads account, allowing seamless access to their book information.
-   **Goodreads API**: Utilizes the Goodreads API to display detailed book information, including cover, title, author, description and similar books.
-   **Book Search**: Users can search for books using the Goodreads API and add them to their library.
-   **Detailed Book Info**: Includes title, author, description, and reviews count for each book.
-   **Shuffle Book**: Allows users to shuffle books based on various filters.

## Technologies Used

-   **Expo**: Utilized for building the app with an app router structure.
-   **EAS Build Services**: For building the app.
-   **Renovate**: For automated dependency updates.
-   **Semantic Release**: For automated versioning and package publishing.
-   **Storybook**: An interactive environment for developing and testing UI components in isolation.
-   **Jest**: A testing framework for unit and integration tests.
-   **TypeScript**: Ensuring type safety and better development experience.
-   **ESLint**: For identifying and reporting on patterns found in ECMAScript/JavaScript code.
-   **Prettier**: An opinionated code formatter to ensure consistent code style.
-   **inflint**: For defining and insuring file name conventions.
-   **knip**: For unused files and exports.
-   **lint-staged**: To run linters on staged files before committing.
-   **Husky**: Used in combination with lint-staged to check code before committing.

## Project Environment

-   **pnpm**: >=9
-   **node**: >=20

## CI/CD Setup

-   **GitHub Actions**: Used for continuous integration and continuous deployment (CI/CD). The workflow checks code conventions based on the linter configurations.

## Storybook

-   **Storybook**: Configured for all UI components, providing an interactive environment for developing and testing components in isolation. To start Storybook, run `pnpm storybook`.

## Testing

-   **Jest**: Used for unit and integration testing. Tests are written for all components and features to ensure correctness and reliability. To run tests, use `pnpm test:storybook`.

## Screenshots

### Library View and Recently Viewed Books Section

<p align="center">
  <img src="./src/assets/images/showcase/library.png" alt="Library view showing a collection of book covers arranged in a grid layout" width="400"/>
  <img src="./src/assets/images/showcase/recently-viewed.png" alt="Recently viewed books section" width="400"/>
</p>

### Book Information Page and Similar Books Section

<p align="center">
  <img src="./src/assets/images/showcase/book-info.png" alt="Book information page" width="400"/>
  <img src="./src/assets/images/showcase/similar-books.png" alt="Similar books section showcasing a selection of book covers related to the current book" width="400"/>
</p>

### Shuffle Your Book Feature and Shuffled Book Result

<p align="center">
  <img src="./src/assets/images/showcase/shuffle.png" alt="Shuffle your book feature interface with a button to start shuffling books" width="400"/>
  <img src="./src/assets/images/showcase/result-of-shuffled.png" alt="Result of a shuffled book displaying a randomly selected book cover and its title" width="400"/>
</p>

### Filter Preferences Screen

<p align="center">
  <img src="./src/assets/images/showcase/filter-preferences.png" alt="Filter preferences screen allowing users to set criteria before shuffling books" width="400"/>
</p>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
