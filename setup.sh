#!/bin/bash
sudo yum install git -y
git clone https://github.com/cdalton713/CSC_7740_Project_Spark
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16.12
nvm use 16
cd CSC_7740_Project_Spark
pip install -r requirements.txt 
cd client
npm install --global yarn
yarnpkg install
