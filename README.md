# [BuildersRecords] (http://flask-angularjs.herokuapp.com/)

Web app for budgeting home construction projects.

## Recommended Instructions

It is recommended to install VirtualBox and Vagrant.

## Required Software

+ [VirtualBox] (https://www.virtualbox.org/wiki/Downloads)
+ [Vagrant] (https://www.vagrantup.com/downloads.html)

## Quick Start

#### + Clone the project:

>
```bash
$ git clone git@github.com:maangulo12/buildersrecords.git
$ cd buildersrecords
```

#### 2. Run vagrant:
>
```bash
$ vagrant up    
```

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
      (located buildersrecords/.vagrant/machines/default/virtualbox/primary_key)
    Python Interpreter Path: /usr/bin/python3

#### PostgreSQL Database Server on VM
    Host: localhost
    Port: 5432
    Database: app_db
    Username: postgres
    Password: password
