# MapNotes-FrontEnd

## Table of Contents

- [Demo](#demo)
- [Backend](#backend)
- [Contribution](#contribution)
  - [Getting Started](#getting-started)
  - [CI](#ci)
  - [Review](#review)
  - [Deploy](#deploy)
  
## Demo

Current version of project can be tested [here](https://map-note-frontend.herokuapp.com/)

## Backend

Information about backend part of project can be found [here](https://github.com/Kotwic4/MapNotes-Backend)

## Contribution

### Getting Started

Information about how to start are [here](README-starter.md)

### GOOGLE API

We use google maps API on our app.
One need to set environment variable REACT_APP_GOOGLE_MAP_KEY with proper key to make app works.

### Backend API URL

To run properly, app need environment variable REACT_APP_API_URL with link to backend server.

### CI

Every commmit pushed to github is verified by Travis.
Pull Request must pass check before merging to master.

### Review

Every Pull Request must have approved review from another user.

### Deploy

Master branch is automaticly deployed to heroku servers after CI check.
