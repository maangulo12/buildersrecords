#!/usr/bin/env bash

# Update and upgrade all packages currently installed on the system

sudo -s
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y upgrade
