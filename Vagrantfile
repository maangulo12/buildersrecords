# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
    config.vm.box = "ubuntu/trusty64"
    config.vm.hostname = $environ

    config.vm.provider :virtualbox do |v|
        v.name = $environ
    end

    config.vm.provision :shell, inline: $shell
    config.vm.network :forwarded_port, guest: 5432, host: 5432
    config.vm.network :forwarded_port, guest: 5555, host: 5555
end

$environ = "flask-angularjs-env"
$shell = <<-CONTENTS
sudo -s
export DEBIAN_FRONTEND=noninteractive

# Update apt
apt-get update
apt-get -y upgrade

# Install PostgreSQL
apt-get -y install postgresql postgresql-contrib
cp /vagrant/vagrant/pg_ident.conf /etc/postgresql/9.3/main/pg_ident.conf
cp /vagrant/vagrant/pg_hba.conf /etc/postgresql/9.3/main/pg_hba.conf
sed -i -e "s/^#listen_addresses = '.*'/listen_addresses = '*'/" /etc/postgresql/9.3/main/postgresql.conf

# Create database
service postgresql restart
sudo -u postgres psql << EOF
    ALTER ROLE postgres PASSWORD 'password';
EOF
sudo -u postgres psql << EOF
    CREATE DATABASE app_db;
EOF

# Install Python packages
apt-get -y install python3-pip
apt-get -y install libffi-dev
apt-get -y install libpq-dev
pip3 install -r /vagrant/requirements.txt

# Create database tables
cd /vagrant/
python3 manage.py create
CONTENTS
