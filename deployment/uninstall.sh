#!/bin/bash

read -p "Are you sure you want to uninstall DQM? (yes/no): " uninstall

if [ "$uninstall" == "yes" ]; then
    echo "Uninstall is in progress..."
    cd terraform && terraform destroy  --var-file='example.tfvars'
else
    echo "Good choice !"
fi
