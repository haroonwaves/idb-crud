![Image](https://github.com/user-attachments/assets/0f664f1f-25d9-421d-be71-5f0a119a4005)

# idb-crud - Database Manager

This intuitive Chrome extension provides an easy-to-use drawer interface, enabling users to
effortlessly interact with website's local databases. It offers efficient and secure access to
various types of browser storage mechanisms, making it an ideal tool for developers who need quick
database interactions. Simplify your web-based database tasks with IDB CRUD – your comprehensive
solution for on-the-go database management.

# Key Features

- Beautiful and modern UI with drawer interface
- Table format data viewing with advanced features
- Comprehensive CRUD operations (Create, Read, Update, Delete)
- Advanced sorting and filtering capabilities
- Customizable column visibility
- Data export and import functionality
- Modern component architecture ready for multiple storage types

# Built with

- [Preact](https://preactjs.com/) - Fast 3kB alternative to React with the same modern API
- [CRXJS](https://crxjs.dev/vite-plugin) - Chrome Extension development tools
- [Dexie](https://dexie.org/) - A powerful wrapper for IndexedDB
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [@preact/signals](https://preactjs.com/guide/v10/signals/) - Fine-grained reactivity system
- [TanStack Table](https://tanstack.com/table/) - Headless UI for building powerful tables
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind
- [react-json-view](https://github.com/mac-s-g/react-json-view) - JSON viewer component
- [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) - Resizable panel
  groups

# Installation

To install the Database Manager extension, follow these steps:

1. Clone the repository to your local machine: `git clone https://github.com/usmanharoon98/idb-crud`
2. Run `pnpm install` then `pnpm build`
3. Navigate to `chrome://extensions` in your Chrome browser
4. Enable Developer Mode by toggling the switch at the top-right corner
5. Click on "Load unpacked" and select the directory where you cloned the repository, choosing the
   `dist` folder created by `pnpm build`

# Contributing

Fork the Project

## Branching Strategy

- Feature branches: `feature/*`
  ```bash
  git checkout -b feature/add-local-storage
  ```
- Bug fix branches: `fix/*`
  ```bash
  git checkout -b fix/table-sorting
  ```

## Commit Message Format

All commits MUST follow this format:

```
<gitmoji> type: subject

[optional body]
```

### Examples

```bash
✨ feat: add local storage support
🐛 fix: resolve table sorting issue
📝 docs: update installation guide
```

## Development Workflow

1. Create your Feature Branch `git checkout -b feature/YOUR-BRANCH-NAME` from the `main` branch
2. Push to the Branch `git push origin feature/YOUR-BRANCH-NAME`
3. Open a Pull Request against the `main` branch

# License

This project is licensed under the GNU General Public v3.0. See the [LICENSE](LICENSE) file for
details.

# Contact

Haroon – @[twitter](https://x.com/UsmanHaroon98) | @[email](mailto:<haroonusman00@gmail.com>) |
@[Linkedin](https://www.linkedin.com/in/usman-haroon/)
