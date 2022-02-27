# SHELL:=/bin/bash

.EXPORT_ALL_VARIABLES:

start-env-dev:
	@echo 'starting dev env'
	docker-compose -f docker-compose.yaml up

down-env-dev:
	@echo 'down dev env'
	docker-compose -f docker-compose.yaml down

down-clear-ev-dev:
	@echo 'down and clear dev env'
	docker-compose -f docker-compose.yaml down -v --rmi 'all'

stop-env-dev:
	@echo 'stop dev env'
	docker-compose -f docker-compose.yaml stop
