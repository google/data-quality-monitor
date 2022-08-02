SHELL := /bin/bash

VENV_DIRNAME = venv

export VIRTUAL_ENV := $(abspath ${VENV_DIRNAME})
export PATH := ${VIRTUAL_ENV}/bin:${PATH}

include .env
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
endef
export PROJECT_HELP_MSG

.PHONY: help install uninstall clean lint format test verify

help:
	@echo "$$PROJECT_HELP_MSG"

install:
	python3 -m venv "$(VIRTUAL_ENV)"
	pip install -r requirements.txt
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
	find . \
		-type f -name "*.py[co]" \
		-o -type d -name __pycache__ \
		-o -type d -name .mypy_cache \
		-exec rm -rf {} +

lint:
	python3 -m flake8 .
	python3 -m mypy .

format:
	python3 -m yapf --parallel --recursive --in-place .
	python3 -m isort --atomic .

test:
	python3 -m unittest $(ARGS)

verify:
	pre-commit run --all-files
