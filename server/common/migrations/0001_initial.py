# Generated by Django 3.1.4 on 2022-06-17 04:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('code', models.CharField(max_length=20)),
            ],
            options={
                'verbose_name_plural': 'Cities',
            },
        ),
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='districts', to='common.city')),
            ],
        ),
        migrations.CreateModel(
            name='Ward',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('prefix', models.CharField(max_length=20)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='wards', to='common.district')),
            ],
        ),
    ]
