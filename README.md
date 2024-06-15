![logo](./docs/brainforge-logo-dark-blue.png)

# Brainforge (POC)

Brainforge is a proof of concept for a node-based flashcard system.

TODO: DEMO VIDEO

![video](./docs/brainforge-demo.mp4)

## Development

This project is a POC to experiment with the idea of a node-based flashcard system. It is not intended to be a full-fledged product. The code is not optimized and may contain bugs.

Since I am currently busy with work and learning Japanese, I will probably not be able to maintain this project. If you are interested in this project, feel free to contact me for questions or collaboration.

### Tech Stack

The application is built very modularly, with extensibility and plugin support in mind. To achieve this, it uses dependency injection, services and various interfaces for different parts of the application.

- Frontend:
  - [Lit](https://lit.dev/) - Main Frontend Framework
  - [Shoelace](https://shoelace.style/) - Web Components
  - [React Flow](https://reactflow.dev/) - Node-based graph editor
- State management:
  - [PouchDB](https://pouchdb.com/) - JS Database with offline support
  - [Zustand](https://github.com/pmndrs/zustand) - State management for session data
  - [Tsyringe](https://github.com/microsoft/tsyringe) - Dependency Injection
