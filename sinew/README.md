# Getting Started

## Prerequisites

1. Python version > 3.8
2. [PostgreSql](https://www.pgadmin.org/download/) server installed
3. [Postman](https://www.postman.com/) installed (optional)

## Setup project environment with virtualenv and pip

```bash
# Commands for mac
cd <path to edodvis-backend>
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

```bash
# Commands for windows
cd <path to edodvis-backend>
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
```

## Environment setup

`cd edodvis/edodvis`

Copy and paste the .env file in the directory

## Create new app

`python manage.py startapp appName`

App structure:

1. **\_\_init\_\_.py**
2. **admin.py**
3. **apps.py**
4. **models.py** --> where you declare your database structure
5. **tests.py** --> where you write your test cases
6. **views.py** --> where you write your business logic
7. **serializers.py** (self-created) --> where you define your serializers
8. **urls.py** (self-created) --> where you define your urls/paths to the methods

## Migrations

Migrations are for migrating your defined models (in models.py) to the database

### Prerequisites

1. MAMP/WAMP is active and running
2. Database exists (has been created beforehand)
3. Database credentials (host, port, name) are specified and correct in settings.py and .env file

### To make migrations

```bash
# This command is so that django will create a new migration if they detect any changes in the model
python manage.py makemigrations <optional:app_name>

# This command will migrate the changes defined in the migrations file to the database
python manage.py migrate
```

## Run app

```bash
python manage.py runserver
```
