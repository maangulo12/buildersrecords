# Flask-AngularJS

Template for a Flask / AngularJS web application

## Recommended to run with Vagrant

It is recommended to run vagrant to use the Python interpreter and the PostgreSQL database server on the VM.

## Required software:

1. [VirtualBox] (https://www.virtualbox.org/wiki/Downloads)
2. [Vagrant] (https://www.vagrantup.com/downloads.html)

## Get Started:

#### 1. Clone the project:

    $ git clone git@github.com:maangulo12/flask-angularjs.git
    $ cd flask-angularjs

#### 2. Run vagrant:

    $ vagrant up

#### 3. SSH into VM:

    $ vagrant ssh

#### 4. cd into vagrant folder:

    $ cd /vagrant/

#### 5. Run app:

    $ python3 application.py

#### 6. Open [http://localhost:5555] (http://localhost:5555)

## Extras

#### Python Interpreter on VM
    Remote Python 3.4.0 Interpreter via SSH:
    Host: 127.0.0.1
    Port: 2222
    Username: vagrant
    Authentication: Using primary key
      (located flask-angularjs/.vagrant/machines/default/virtualbox/primary_key)
    Python Interpreter Path: /usr/bin/python3

#### PostgreSQL Database Server on VM
    Host: localhost
    Port: 5432
    Database: app_db
    Username: postgres
    Password: password
