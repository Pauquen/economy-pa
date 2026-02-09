# EconomyRPA Brand Voice

EconomyRPA is the premier business automation platform designed to streamline corporate workflows, financial reporting, and operational efficiency. By leveraging cutting-edge **Robotic Process Automation (RPA)** and a multilayered security approach, EconomyRPA empowers organizations to transform manual tasks into seamless, "smooth" digital experiences. Our platform focuses on high-performance automation that is accessible, transparent, and aesthetically refined.

These values must be demonstrated in all documentation, code comments, and technical communications.

---

## Unbiased and Inclusive Communication

EconomyRPA serves a global business community. Our communications must remain inclusive and diverse.

### Avoid Gendered Pronouns

* Use second person for direct instructions (**you/your/yours**).
* Use third-person references for general descriptions (**the user, the administrator, the client**).
* If a gendered pronoun is unavoidable, use **they/them/theirs**.
* **❌ Avoid:** "The developer must check his code."
* **✅ Improved:** "Developers must check their code" or "Check your code."

### Inclusive Business Terminology

Avoid nouns with gendered components:

* **Businessman** 🡪 Entrepreneur, executive, businessperson
* **Manpower** 🡪 Personnel, workforce, human resources
* **Middleman** 🡪 Intermediary, negotiator

---

## Technical Writing Style: Verbal over Nominal

Verbs state your purpose more clearly than nouns. Choosing verbal constructions improves the "smooth" readability of our documentation.

* **❌ Nominal:** "The implementation of the RPA sequence was a success."
* **✅ Verbal:** "The system successfully implemented the RPA sequence."
* **❌ Vague Header:** Recommendation for API Authentication
* **✅ Purposeful Header:** Recommend Best Practices for API Authentication

---

## Naming Conventions: EconomyRPA Features

EconomyRPA Features are proper nouns. Reference them without articles in technical writing.

**Standard Feature List:**

* **EconomyRPA Dashboard**
* **RPA Builder**
* **Financial Report Generator**
* **EconomyRPA API (Django DRF)**
* **Smooth UI System**
* **Automated Workflow Engine**
* **AI Business Analyst**
* **Theme Switcher (Smooth Mode)**
* **Role-Based Access Control (RBAC)**

---

## Smooth UI & SCSS Documentation Rules

Since the project prioritizes a **Smooth UI**, documentation regarding styling must emphasize these standards:

### Consistency in Design Tokens

When documenting styles, always reference CSS variables, never hex codes.

* **✅ Standard:** "Apply `var(--bg-surface)` to the container for theme compatibility."
* **❌ Standard:** "Set the background to #ffffff."

### Interaction Verbs

Use specific verbs for user actions to ensure a professional UX:

* **Click:** Desktop interactions (Transitive).
* **Tap:** Mobile/Touch interactions.
* **Toggle:** For the **Theme Switcher** or boolean settings.
* **Scroll:** Navigating through long automation logs.

---

## Angular 20 & TypeScript Patterns in Docs

### Documenting Reactive State

When explaining code logic, prioritize the explanation of **Signals** over legacy Observables where appropriate.

* **✅ Good:** "The `userProfile` signal automatically updates the UI when the data resource resolves."

### Title-Case Headers

All documentation headers must use Title Case for better readability and SEO.

* **Example:** How to Configure Django REST Framework CORS Settings

---

## Sentence Structure and SEO

Search engines and busy executives prioritize clear intent at the beginning of a sentence (the "Goal-Oriented" approach).

* **❌ Structure:** "Open the RPA Builder and click 'New' to create a financial automation."
* **✅ Structure (Goal-First):** "To create a financial automation, open RPA Builder and click 'New'."

---

## Non-Militaristic Language

In the context of business automation and security, we avoid violent metaphors.

* **Kill chain** 🡪 Automation lifecycle / Cyberattack chain
* **Targeting** 🡪 Addressing / Selecting
* **Attack surface** 🡪 Exposure / Vulnerabilities
* **Fight/Combat** 🡪 Mitigate / Safeguard / Protect

---

## Django DRF & API Documentation

When documenting endpoints or backend logic:

1. **Define the Resource:** Clearly state what the model represents in business terms.
2. **Action-Oriented Endpoints:** Describe what the endpoint *does* (e.g., "Retrieves monthly tax reports") rather than just the URL.
3. **Safety vs. Security:**
* Use **Safety** for data integrity and error prevention (e.g., "Data validation ensures transaction safety").
* Use **Security** for protection against unauthorized access (e.g., "JWT ensures API security").



---

## Documentation Warnings and Danger Calls

* **Note:** General info or "Smooth UI" tips (Low severity).
* **Warning:** Potential data mismatch or RPA logic errors (Moderate severity).
* **Danger:** Irreversible actions, such as "Delete All Records" or "Disable MFA" (High severity).

**Example:**
**Danger:** Resetting the **RPA Builder** database will **permanently delete all custom workflows**. Ensure you have a backup before proceeding.

---

