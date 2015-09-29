<<-DOC

Vagrantfile

Vagrant is a tool that creates and configures virtual
development environments. It is a higher-level wrapper around
virtualization software such as VirtualBox and VMware, and around
configuration management software such as Ansible, Chef and Puppet.

For more info about Vagrant visit:
https://www.vagrantup.com/

To download VirtualBox visit:
https://www.virtualbox.org/wiki/Downloads

DOC

# This is the name of this VM
$environ = 'buildersrecords'

Vagrant.configure(2) do |config|
    # Download Ubuntu for this virtual machine (VM)
    config.vm.box = 'ubuntu/trusty64'
    # Set the hostname of this VM to 'buildersrecords'
    config.vm.hostname = $environ
    # Use VirtualBox as the provider for this VM
    config.vm.provider :virtualbox do |v|
        v.name = $environ
    end
    # Run this shell script
    config.vm.provision :shell, inline: $shell
    # Open 5432 port of this VM to communicate with 5432 port of my local PC
    # 5432 port = PostgreSQL port (database port)
    config.vm.network :forwarded_port, guest: 5432, host: 5432
    # Open 5555 port of this VM to communicate with 5555 port of my local PC
    # 5555 port = Flask port (application port)
    config.vm.network :forwarded_port, guest: 5555, host: 5555
end

# This is the shell script that configures this VM
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

# Install Heroku Toolbelt
wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh

# Create database tables
cd /vagrant/
python3 manage.py create
python3 manage.py populate
CONTENTS
