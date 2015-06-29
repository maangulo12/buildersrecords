#!/usr/bin/env bash

# Python
# Installing Project Dependencies

apt-get -y install python3-pip
apt-get -y install libffi-dev
apt-get -y install libpq-dev

pip3 install -r /vagrant/requirements.txt

echo "Successfully installed Python packages on this virtual machine."
