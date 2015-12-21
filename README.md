# [BuildersRecords] (http://www.buildersrecords.com/)

[![Join the chat] (https://badges.gitter.im/Join%20Chat.svg)] (https://gitter.im/maangulo12/buildersrecords)

[![Build Status] (https://travis-ci.org/maangulo12/buildersrecords.svg)] (https://travis-ci.org/maangulo12/buildersrecords)

Web app for accounting construction projects.

## To Do List:

+ Priorities:
```
    ** Change Password
    ** Close Account

    ** Manage Account
    ** Billing
    ** Create a popup after signing up

    ** Restrict Access (active_until field & webhooks)
    ** Expired Account Page

    ** Testing on other browsers (Safari, Firefox, Chrome, Edge, Opera)
    ** Testing on mobile devices (iPad, iPhone, Android, Windows)
    ** Support / FAQs

    ** Integrate Jasmine Front-End Testing   
    ** Database Migrations
    ** Send Feedback
    ** Forgot Password
    ** Add Reports Feature
    ** Security

    ** Demo Videos

    -Stripe
    -Auth0
    -Heroku Deployment
    -Heroku Add-ons
    -AWS File Storage
    -Travis CLI
    -Domain Name
    -SSL Certificate
    -GitHub
    -Google Analytics
```

+ Home module:
```
    -Update jumbotron message
    -Update features section
    -Update jumbotron picture
    -About Us
```

+ Signup module:
```
    -Add modal for Terms of Service
    -Add modal for Privacy Policy
    -Send email notification
```

+ Login module:
```
    -Forgot Password link
```

+ Projects module:
```
    -Delete Project ('bulk' delete everything about the project)
    -Account Settings Link
    -Send Feedback Link
```

+ Overview module:
```
    *Overview Table
    -Tooltip number format
    -Colors of bar chart
    -Table scrollable
```

+ Funds module:
```
    -Bulk delete expenditure
    -Table draws shuffling
```

+ Budget module:
```
    -Tooltip number format
    -Table scrollable
```

+ Expenditures module:
```
    -Fix table resizing
    -Fix table shuffling (Add and Edit functions)
    -Create new links
```

+ All modules:
```
    -Amount directive 'format' needs to allow decimals
    -Charts tooltips currency format
```

+ Modules to Consider:
```
    -Implement Gallery module
    -Implement Send Feedback
    -Implement Help & Support

    -Initial first time setup
    -Upload receipts
```

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
$ python3 manage.py recreate
$ python3 application.py    
```

#### Open [http://localhost:5555] (http://localhost:5555)

## VM

#### Python Interpreter on the VM
```
Remote Python 3.4.0 Interpreter via SSH:
Host: 127.0.0.1
Port: 2222
Username: vagrant
Authentication: Using primary key
  (located buildersrecords/.vagrant/machines/default/virtualbox/primary_key)
Python Interpreter Path: /usr/bin/python3
```

#### PostgreSQL Database Server on the VM
```
Host: localhost
Port: 5432
Database: app_db
Username: postgres
Password: password
```

## Database Migrations

#### Read:
+ [Flask-Migrate: Documentation] (http://flask-migrate.readthedocs.org/en/latest/)
+ [Flask-Migrate: Miguel Grindberg] (http://blog.miguelgrinberg.com/post/flask-migrate-alembic-database-migration-wrapper-for-flask)
+ [Alembic Documentation] (http://alembic.readthedocs.org/en/latest/)

#### Commands:
>
```bash
# Create migrations folder
$ python3 manage.py db init
>
# Perform migration
$ python3 manage.py db migrate
>
# Upgrade database
$ python3 manage.py db upgrade
```
