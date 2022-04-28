# React → NestJS → EdgeDB in Docker Development Containers

Minimum asset boilerplate for integrating several technologies together into a functional development environment. The installation instructions below will result in the following:

1. An EdgeDB server running in the `edgedb` container
2. A NestJS server (in hot reload mode) running in the `nestjs` container, configured to connect via http to the EdgeDB server, and exposing various REST endpoints through the http://nestjs.docker.localhost url.
3. A React hot reload development environment running in the `react` container, configured to connect via http to the NestJS REST endpoints, and exposing a sample web app running at http://react.docker.localhost, which can be used to execute arbitrary EdgeQL queries as well as the query the results.

A fourth Docker container, a `reverse-proxy` container, is also employed to ensure urls that satisfy browser CORS requirements.

Note that this has only been tested on Ubuntu 18.0.4.

## Pre-requisites
1. Docker (20.10.9+) and Docker Compose (2.0.1+)
2. GNU Make `sudo apt install make`
3. (Optional) [EdgeDB CLI](https://www.edgedb.com/install#linux-debianubuntults)

## Installation

0. Run the following to clone the repo. Note that initially, the ts files may show errors since the `node_modules` directories haven't yet been populated.

    ```bash
    git clone git@github.com:deangelisbd/nestjs-edgedb-test-1
    ```

1. Start up the all the Docker containers, including EdgeDB, NestJS, React and Reverse Proxy.

    ```bash
    $ make up
    ```
    You may see <span style="color:red">⠿ react Error</span> or <span style="color:red">⠿ nestjs Error</span> at first, but you can ignore. Additionally, in the EdgeDB logs,  you may see errors from the EdgeDB container such as `Exception occurred: the database system is shutting down`, but these too can be ignored.

    This step can take several minutes on a new installation. The startup waits for certain network endpoints to be available before showing success, up to a maximum wait time which is configurable in the `.env` file. If the max wait time is exceeded, you may get a message that looks like failure, but it could just mean services are still starting up.

3. To view the NestJS or React or EdgeDB logs in order to debug errors use

    ```bash
    $ make logs [ nestjs | react | edgedb ]
    ```

4.  Add data to DB if not already populated. This repo includes a basic Person-Movie schema corresponding to the [EdgeDB Quickstart guide](https://www.edgedb.com/docs/guides/quickstart#ref-quickstart-createdb-sdl)
    If you have the EdgeDB CLI installed locally, then run:
    ```bash
    $ edgedb --dsn=edgedb://edgedb@localhost:5656/edgedb --tls-security=insecure
    ```

    Otherwise, go into the EdgeDB docker container shell and enter the EdgeDB CLI installed there:
    ```bash
    $ make shell edgedb
    $ edgedb -I local_dev
    ```

    Then in the edgedb CLI (prompts like `edgedb>`), insert some objects as demonstrated in the [EdgeDB Quickstart guide](https://www.edgedb.com/docs/guides/quickstart#ref-quickstart-insert-data).

    To exit the EdgeDB CLI, enter:

    ```bash
    edgedb> \exit
    ```

5. Now to go to http://react.docker.localhost. In the field that reads "Enter EdgeQL", enter the query:

    ```
    select Movie { title, year };
    ```

    And then press the "Execute" button. You should see the JSON result appear below the query, if you inserted objects in the previous step:
    
    ```
    [{"title":"Blade Runner 2049","year":2017},{"title":"Dune","year":null}]
    ```

Note: to stop all the containers

    ```bash
    $ make stop
    ```

# Following is standard NestJS info

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
