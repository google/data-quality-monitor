SHELL := /bin/bash

VENV_DIRNAME = venv
DATA_DIRNAME = data

export VIRTUAL_ENV := $(abspath ${VENV_DIRNAME})
export PATH := ${VIRTUAL_ENV}/bin:${PATH}

export DEBUG_HOST=localhost
export DEBUG_PORT=8080

-include .env
export

define PROJECT_HELP_MSG
Usage: make [target]
Targets:
	help				show this message

	install				setup virtual env & pre-commits
	uninstall			remove virtual env & pre-commits
	clean				cleanup caches
	lint				run code style & type checks
	format				run code formatter
	test				run unit tests
	verify				run pre-commit checks
	server				run local debug server
	call				make requests to local debug server
					Usage: make call ENDPOINT=route JSON=test.json
	data				generate test data into data/ folder
					Usage: make data CONFIG=config_name OUTFILE=test.csv NROWS=1000
	table				upload test data from data/ folder to BigQuery table
					Usage: make table CONFIG=config_name INFILE=test.csv TABLE=project.dataset.table ACTION=APPEND/REPLACE SAEMAIL=service@account.com
endef
export PROJECT_HELP_MSG

.PHONY: help install uninstall clean lint format test verify server call data table
.IGNORE: clean lint format

help:
	@echo "$$PROJECT_HELP_MSG"

install:
	python3 -m venv "$(VIRTUAL_ENV)"
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	pre-commit install

uninstall:
	pre-commit uninstall \
		-t pre-commit \
		-t pre-merge-commit \
		-t pre-push \
		-t prepare-commit-msg \
		-t commit-msg \
		-t post-commit \
		-t post-checkout \
		-t post-merge \
		-t post-rewrite
	rm -rf "$(VIRTUAL_ENV)"

clean:
	find . -type f -name "*.py[co]" -prune -exec rm -rf "{}" \;
	find . -type d -name __pycache__ -prune -exec rm -rf "{}" \;
	find . -type d -name .mypy_cache -prune -exec rm -rf "{}" \;

lint:
	python3 -m flake8 .
	python3 -m mypy .

format:
	python3 -m isort --atomic .
	python3 -m yapf --parallel --recursive --in-place .

test:
	python3 -m unittest $(ARGS)

verify:
	pre-commit run --all-files

server:
	functions_framework --debug \
		--host "$(DEBUG_HOST)" \
		--port "$(DEBUG_PORT)" \
		--target app

call:
	/usr/bin/time -f "\nRequest took %e seconds." \
	curl -i $(DEBUG_HOST):$(DEBUG_PORT)/$(ENDPOINT) \
		-H "Content-Type: application/json" \
		-d @$(JSON)

data:
	CONFIG=$(CONFIG) \
	OUTFILE="$(DATA_DIRNAME)/$(OUTFILE)" \
	NROWS=$(NROWS) \
		python3 -m data.generate

table:
	CONFIG=$(CONFIG) \
	INFILE="$(DATA_DIRNAME)/$(INFILE)" \
	TABLE=$(TABLE) \
	ACTION=$(ACTION) \
	SAEMAIL=$(SAEMAIL) \
		python3 -m data.upload
