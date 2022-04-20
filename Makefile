include .env

default: up

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
	docker compose up

## start	:	Start up containers.
.PHONY: start
start:
	@echo "Starting up container for $(PROJECT_NAME)"
	docker exec --user root `docker ps -aqf "name=$(PROJECT_NAME)_nestjs"` chmod 777 ./.docker/entrypointDev.sh
	docker exec $(shell docker ps -aqf "name=$(PROJECT_NAME)_nestjs") ./.docker/entrypointDev.sh

## stop	:	Stop containers.
.PHONY: stop
stop:
	@echo "Stopping containers for $(PROJECT_NAME)..."
	@docker compose stop

## prune	:	Remove containers and their volumes.
##		You can optionally pass an argument with the service name to prune single container
##		prune mariadb	: Prune `mariadb` container and remove its volumes.
##		prune mariadb solr	: Prune `mariadb` and `solr` containers and remove their volumes.
.PHONY: prune
prune:
	@echo "Removing containers for $(PROJECT_NAME)..."
	@docker compose down -v $(filter-out $@,$(MAKECMDGOALS))

## ps	:	List running containers.
.PHONY: ps
ps:
	@docker ps --filter name='$(PROJECT_NAME)*'

## shell	:	Access `php` container via shell.
##		You can optionally pass an argument with a service name to open a shell on the specified container
.PHONY: shell
shell:
	docker exec -ti -e COLUMNS=$(shell tput cols) -e LINES=$(shell tput lines) $(shell docker ps -aqf "name=$(PROJECT_NAME)_$(or $(filter-out $@,$(MAKECMDGOALS)), php)") sh

## npm	:	Executes `npm` command in a specified root directory .
##		To use "--flag" arguments include them in quotation marks.
##		For example: make npm "install --save-dev @types/react @types/react-dom"
.PHONY: npm
npm:
	docker exec $(shell docker ps -aqf "name=$(PROJECT_NAME)_nestjs") npm $(filter-out $@,$(MAKECMDGOALS))

## logs	:	View containers logs.
##		You can optinally pass an argument with the service name to limit logs
##		logs php	: View `php` container logs.
##		logs nginx php	: View `nginx` and `php` containers logs.
.PHONY: logs
logs:
	@docker compose logs -f $(filter-out $@,$(MAKECMDGOALS))

# https://stackoverflow.com/a/6273809/1826109
%:
	@:
