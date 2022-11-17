# Installation

1. Install `pipenv`
```bash
pip install pipenv
```
```bash
pipenv shell
```

2. Install dependencies
```bash
pipenv install -r requirement.txt
```

3. Create `sqlite` database
```bash
python manage.py migrate
```

4. Create Superuser
```bash
python manage.py createsuperuser
```

5. Run server
```bash
python manage.py runserver
```

6. Go to the address
```
127.0.0.1:<port>/dashboard/
```
