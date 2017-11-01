# todo-app
## Restful ToDo app  written in PHP(Slim Framework) and AngularJs for a practical/coding test

#Installation instructions

Step 1:

* Clone this repo into your local machine

Step 2:

* Create a database named `pc_todo`

* Find `pc_todo.sql` dump in the `db` folder and import it.

* Configure your `db creds`

* `cd` into the application's root directory

Step 3:
Install composer (more instructions can be found here:https://getcomposer.org/download/)
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
```

Step 4:
Install dependensies
```
php composer.phar install
php composer.phar update

```

Step 5:

Run the project using the command below then go to http://localhost:8080/

```php composer.phar start```


### extras

I have built this app into 2 components with an idea of making sure the code can be reused by more than one application while making sure of scalability.
I have to sides to this project as it is at the moment(Backend and Frontend)

* Backend is a RESTFUL api with the following exposed endpoints:
```
GET  api/v1/tasks/
GET  api/v1/task/:id
PUT  api/v1/task/:id
POST  api/v1/task/
DELETE  api/v1/task/:id
```
* Frontend is an AngularJs app that interacts with the above mentioned endpoints
