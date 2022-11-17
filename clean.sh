#!/bin/bash

sudo find . -type d -not -path "*/node_modules/*" -name *storybook*
sudo find . -type d -not -path "*/node_modules/*" -name *storybook*  -prune -exec rm -rf {} \;
sudo find . -type d -not -path "*/node_modules/*" -name *tests*
sudo find . -type d -not -path "*/node_modules/*" -name *tests*  -prune -exec rm -rf {} \;
sudo find . -type d -not -path "*/node_modules/*" -name *mock*
sudo find . -type d -not -path "*/node_modules/*" -name *mock*  -prune -exec rm -rf {} \;
# sudo find . -type d -not -path "*/node_modules/*" -name *docs*  -prune -exec rm -rf {} \;
# sudo find . -type f -not -path "*/node_modules/*" -name *.png  -prune -exec rm -rf {} \;