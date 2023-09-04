#!/bin/bash

read -p "Do you want to install DQM Webapp as well? (yes/no): " isDqmWebapp

REPO_ROOT_PATH=$(git rev-parse --show-toplevel)
if [ "$isDqmWebapp" == "yes" ]; then
    echo "DQM including webapp installation is in progress now... it might take ~8 mins"
    echo "Initializing Terraform..."
    cd $REPO_ROOT_PATH/deployment/terraform && terraform init
    echo "Installing Terraform..."
    terraform apply --var-file='example.tfvars'
    cd $REPO_ROOT_PATH
elif [ "$isDqmWebapp" == "no" ]; then
    echo "Only DQM without Webapp installation is in progress... it might take ~5 mins"
    cd $REPO_ROOT_PATH/deployment/terraform && terraform init;
    terraform apply -target=module.dqm  --var-file='example.tfvars'
    cd $REPO_ROOT_PATH
else
    echo "Invalid choice. Please enter 'yes' or 'no'."
fi
