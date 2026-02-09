# EconomyRPA Documentation

EconomyRPA is a premier business automation platform designed to streamline corporate workflows and financial reporting. This repository contains the official documentation for EconomyRPA, powered by [Mintlify](https://mintlify.com). It serves as the central hub for users and developers to understand the platform's "smooth" UI patterns, **Angular 20** frontend implementation, and **Django REST Framework (DRF)** backend architecture.

## How to Navigate the Documentation Structure

The documentation is organized to support different user needs:

* **Getting Started**: Provides an overview of EconomyRPA, including installation steps and basic usage guides to initiate your first automation.
* **User Guide**: Offers comprehensive instructions for EconomyRPA App, Dashboard navigation, and managing automated business units.
* **Developer Guide**: Details technical specifications for developers, covering **Angular Signals**, **Standalone Components**, and **DRF API** integration.

## To Preview Changes Locally

To ensure a "smooth" development experience, install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview your documentation changes before publishing:

1. **Install the CLI**:
```bash
npm i -g mint

```


2. **Execute the Dev Environment**:
Navigate to the root directory where `mint.json` is located and run:
```bash
mint dev

```


3. **View the Documentation**:
Access your local preview at `http://localhost:3000`.

## Deploying Changes to Production

EconomyRPA utilizes a continuous delivery model for documentation. Changes pushed to the `main` branch automatically deploy to production through Mintlify's GitHub integration, ensuring the latest features and remediation guides are always accessible.

## Adhering to the Documentation Style Guide

When contributing to this repository, please follow the **EconomyRPA Documentation Style Guide** located in the `skills/` directory. Maintaining a consistent voice is essential for our brand identity:

* **Use Verbal Constructions**: Prefer "To create a report" over "Report creation."
* **Maintain Inclusivity**: Avoid gendered pronouns and use second-person (you/your) for instructions.
* **Uphold the "Smooth" Aesthetic**: Ensure all UI-related documentation references semantic CSS variables and standardized interaction verbs.
* **Title-Case Capitalization**: Use Title Case for all headers and section titles.

## Resolving Common Issues

If you encounter difficulties during local development, consider these steps:

* **CLI Outdated**: Run `mint update` to ensure you are using the most recent version of the Mintlify CLI.
* **Page Not Found (404)**: Verify that the `mint.json` file contains the correct page path in the navigation array.
* **Build Errors**: Check that all **Angular** or **TypeScript** code snippets within the MDX files are properly formatted and escaped.

## Accessing Additional Resources

To further support your journey with EconomyRPA, please refer to:

* [EconomyRPA Main Repository](https://github.com/Pauquen/economy-pa)
* [Angular 20 Official Guides](https://angular.dev/)

---


