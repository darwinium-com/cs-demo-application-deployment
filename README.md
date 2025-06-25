# Darwinium Experimentation Quick Start

This repository contains the files and guides necessary to quickly deploy a simple demo application representative of a
production website (Frontend, Backend, & CDN) and integrate it with Darwinium.

> [!NOTE]
> While this quick start repository is intended to result in a simple website integrated with Darwinium, the website UI
> in its limited functionality is not the only way to experiment with Darwinium. Once the application is deployed, Darwinium
> can be configured to protect any requests sent to the demo applications backend at `/api/echo`. This means that a tool
> such as Postman could be used to generate additional network requests that the limited UI may not create.

### Repository Familiarization

Before diving into the quick start, take a moment to review the following descriptions the repository directories and files.

`/application-deployment-guide`
* `README.md`
  * Contains the Deployment Guide details for the simple demo application
* `./resources-backend`
  * Contains all the files necessary to deploy the AWS-based backed for the application
* `./resources-frontend`
  * Contains all the files necessary to deploy the GitHub pages frontend for the application
* `./resources-cloudflare`
  * Contains all the files necessary to integrate Cloudflare as the CDN for the application
* `./additional-files-for-reference`
  * Contains `.js` files that are in `.zip` files within `./resources-backend`
  * These files are not used directly in the deployment guide, but are provided for reference

`/darwinium-journey-guide`
* `README.md`
  * Contains the Journey Guide details to integrate Darwinium with the simple demo application
* `./journey-resources`
  * Contains all the files necessary to implement a simple authentication use-case journey in Darwinium

### Repository Owner / POC
James Graham, jgraham@darwinium.com

### Repository Creator
Mark Noe, mnoe@darwinium.com