#!/usr/bin/env bash

# Installing PostgreSQL Server
# Setting Up Database

apt-get -y install postgresql postgresql-contrib

cp /vagrant/vagrant/pg_ident.conf /etc/postgresql/9.3/main/pg_ident.conf
cp /vagrant/vagrant/pg_hba.conf /etc/postgresql/9.3/main/pg_hba.conf
sed -i -e "s/^#listen_addresses = '.*'/listen_addresses = '*'/" /etc/postgresql/9.3/main/postgresql.conf

service postgresql restart

sudo -u postgres psql << EOF
    ALTER ROLE postgres PASSWORD 'password';
EOF

sudo -u postgres psql << EOF
    CREATE DATABASE app_db;
EOF

echo "Successfully created PostgreSQL database server on this virtual machine."
