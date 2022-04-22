include .env

default: up

SERVICE_nestjs=/usr/src/startNestJSServer.sh
SERVICE_react=/usr/src/startReactServer.sh

## help	:	Print commands help.
.PHONY: help
ifneq (,$(wildcard docker.mk))
help : docker.mk
	@sed -n 's/^##//p' $<
else
help : Makefile
	@sed -n 's/^##//p' $<
endif

## up	:	Start up containers.
.PHONY: up
up:
	@echo "Starting up container for $(PROJECT_NAME)"
	docker compose up -d --remove-orphans

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
