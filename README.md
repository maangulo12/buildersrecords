# [BuildersRecords] (http://flask-angularjs.herokuapp.com/)

Web app for budgeting home construction projects.

## Required Software

+ [VirtualBox] (https://www.virtualbox.org/wiki/Downloads)
+ [Vagrant] (https://www.vagrantup.com/downloads.html)

## To Contribute

#### Clone the project
>
```bash
$ git clone git@github.com:maangulo12/buildersrecords.git
$ cd buildersrecords
```

#### Run vagrant
>
```bash
$ vagrant up    
```

#### SSH into the virtual machine (VM)
>
```bash
$ vagrant ssh
```

#### CD into the vagrant folder
>
```bash
$ cd /vagrant/
```

#### Run app
>
```bash
$ python3 application.py    
```

#### Open [http://localhost:5555] (http://localhost:5555)

## Extras

#### Python Interpreter on VM
```
Remote Python 3.4.0 Interpreter via SSH:
Host: 127.0.0.1
Port: 2222
Username: vagrant
Authentication: Using primary key
  (located buildersrecords/.vagrant/machines/default/virtualbox/primary_key)
Python Interpreter Path: /usr/bin/python3
```

#### PostgreSQL Database Server on VM
```
Host: localhost
Port: 5432
Database: app_db
Username: postgres
Password: password
```
