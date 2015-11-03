# [BuildersRecords] (http://flask-angularjs.herokuapp.com/)

Web app for accounting home construction projects.

## To Do List:

+ Priorities:
```
    -Stripe (Processing Payments) (Pricing)
    -Auth0 (Security for Authentication) (Pricing)
    -AWS (ElasticBeanstalk & S3) Full Deployment (Pricing)
    -AWS Maintenance (Pricing)
    -GitHub Private Account
    -Domain Name Pricing
    -SSL Certificate
```

+ Home module:
```
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

+ Projects module: <b> Amy Lopes 10/15/2015 </b>
```
    -Delete Project ('bulk' delete everything about the project)
    -Test upload file
```

+ Overview module: <b> Miguel 10/15/2015 </b>
```
    -Think about what to show here
```

+ Budget module: <b> Amy Lopes 10/15/2015 </b>
```
    -Add, Update, Delete line items and categories
```

+ Funds module:
```
    -Edit Loan (pre-select choice in loan question in dropdown)
    -Edit Draw (after updating, table rows shift)
    -Edit Draw (date of draw needs to be correct)
    -Think about what to show for non loan funds
```

+ Expenditures module: <b> Miguel 10/15/2015 </b>
```
    -Fix table resizing
    -Fix table footer
    -Add and Update tests
    -Empty project test
```

+ Subcontractors module: <b> Miguel 10/26/2015 </b>
```
    -Display table with subcontractors
```

+ Modules to Implement:
```
    -Implement Forgot Password
    -Implement Account Settings
```

+ All modules:
```
    -Amount directive 'format' needs to allow decimals
```

+ Modules to Consider:
```
    -Implement Reports features
    -Implement Gallery module
    -Implement Send Feedback
    -Implement Help & Support
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

## Extras

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
