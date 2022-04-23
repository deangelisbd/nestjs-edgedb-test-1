include .env

default: up

SERVICE_nestjs=/usr/src/startNestJSServer.sh
SERVICE_react=/usr/src/startReactServer.sh

# define standard colors
ifneq (,$(findstring xterm,${TERM}))
	BLACK        := $(shell tput -Txterm setaf 0)
	RED          := $(shell tput -Txterm setaf 1)
	GREEN        := $(shell tput -Txterm setaf 2)
	YELLOW       := $(shell tput -Txterm setaf 3)
	LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
	PURPLE       := $(shell tput -Txterm setaf 5)
	BLUE         := $(shell tput -Txterm setaf 6)
	WHITE        := $(shell tput -Txterm setaf 7)
	RESET := $(shell tput -Txterm sgr0)
else
	BLACK        := ""
	RED          := ""
	GREEN        := ""
	YELLOW       := ""
	LIGHTPURPLE  := ""
	PURPLE       := ""
	BLUE         := ""
	WHITE        := ""
	RESET        := ""
endif

## help	:	Print commands help.
.PHONY: help
ifneq (,$(wildcard docker.mk))
help : docker.mk
	@sed -n 's/^##//p' $<
else
help : Makefile
	@sed -n 's/^##//p' $<
endif

## up	:	Start up all containers and processes.
.PHONY: up
up:
	@echo "Composing up containers for $(PROJECT_NAME)"
	@docker compose up -d --remove-orphans
	@if [ "$(shell .docker/test-connection.sh ${NESTJS_HOST_PROTOCOL}://localhost:${NESTJS_APPLICATION_PORT})" != "true" ] ; then echo "${BLUE}Starting NestJS service, this may take a little while...${RESET}"; make start nestjs > /dev/null 2>&1; fi
	@if [ "$(shell .docker/test-connection.sh ${REACT_HOST_PROTOCOL}://localhost:${REACT_PORT})" != "true" ] ; then echo "${BLUE}Starting React service, this may take a little while...${RESET}"; make start react > /dev/null 2>&1; fi
	@.docker/wait-until.sh 'curl --insecure --connect-timeout 2 -s -D - ${NESTJS_HOST_PROTOCOL}://localhost:${NESTJS_APPLICATION_PORT} -o /dev/null 2>/dev/null | head -n1 | grep 200' ${MAX_STARTUP_WAIT} > /dev/null 2>&1
	@echo "${BLUE}NestJS hot reload server up. See files under directory ${WHITE}server${RESET}"
	@.docker/wait-until.sh 'curl --insecure --connect-timeout 2 -s -D - ${REACT_HOST_PROTOCOL}://localhost:${REACT_PORT} -o /dev/null 2>/dev/null | head -n1 | grep 200' ${MAX_STARTUP_WAIT} > /dev/null 2>&1
	@echo "${BLUE}React hot reload dev environment. See files under directory ${WHITE}client${RESET}"
	@echo "Containers are up, services are started. Go to ${BLUE}${REACT_HOST_PROTOCOL}://${REACT_HOST}${RESET}"

## start	:	Start processes (must be defined in variable SERVICE_param where param comes after start)
.PHONY: start
start:
	@echo "Starting up services for $(filter-out $@,$(MAKECMDGOALS))"
	$(eval SERVICE=SERVICE_$(filter-out $@,$(MAKECMDGOALS)))
	docker exec --user root `docker ps -aqf "name=$(PROJECT_NAME)_$(filter-out $@,$(MAKECMDGOALS))"` chmod 777 $($(SERVICE))
	docker exec `docker ps -aqf "name=$(PROJECT_NAME)_$(filter-out $@,$(MAKECMDGOALS))"` $($(SERVICE)) &

## stop	:	Stop containers.
.PHONY: stop
stop:
	@echo "Stopping containers for $(PROJECT_NAME)..."
	@docker compose stop

## prune	:	Remove containers and their volumes.
.PHONY: prune
prune:
	@echo "Removing containers for $(PROJECT_NAME)..."
	@docker compose down -v

## ps	:	List running containers.
.PHONY: ps
ps:
	@docker ps --filter name='$(PROJECT_NAME)*'

## shell	:	Access `php` container via shell.
##		You can optionally pass an argument with a service name to open a shell on the specified container
.PHONY: shell
shell:
	docker exec -ti -e COLUMNS=$(shell tput cols) -e LINES=$(shell tput lines) $(shell docker ps -aqf "name=$(PROJECT_NAME)_$(or $(filter-out $@,$(MAKECMDGOALS)), php)") sh

## exec	:	Executes shell commands on a specified container in the working directory
##		For example: make exec nestjs "npm install --save-dev @some/package"
.PHONY: exec
exec:
	$(eval SERVICE=$(word 2,$(MAKECMDGOALS)))
	docker exec $(shell docker ps -aqf "name=$(PROJECT_NAME)_$(SERVICE)") $(filter-out $(SERVICE),$(filter-out $@,$(MAKECMDGOALS)))

## logs	:	View containers logs.
##		You can optinally pass an argument with the service name to limit logs
##		logs nestjs	: View `nestjs` container logs.
##		logs nestjs react	: View `nestjs` and `react` containers logs.
.PHONY: logs
logs:
	@docker compose logs -f $(filter-out $@,$(MAKECMDGOALS))

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
