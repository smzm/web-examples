# Generated by Django 3.2.7 on 2021-10-03 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0020_tradeposition_rewardrisk'),
    ]

    operations = [
        migrations.AddField(
            model_name='tradeposition',
            name='ispublic',
            field=models.BooleanField(default=True),
        ),
    ]