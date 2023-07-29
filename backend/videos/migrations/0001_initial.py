# Generated by Django 3.2 on 2023-01-12 17:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('channels', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('thumbnail', models.TextField(null=True)),
                ('src', models.TextField()),
                ('minutes', models.CharField(max_length=10)),
                ('description', models.TextField(null=True)),
                ('comments_area', models.BooleanField(default=True)),
                ('deleted', models.BooleanField(default=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('channel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='channels.channel')),
            ],
            options={
                'db_table': 'videos',
            },
        ),
        migrations.CreateModel(
            name='VideoViews',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video_volume', models.CharField(max_length=20)),
                ('video_time', models.CharField(max_length=100)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('channel', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='channels.channel')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='videos.video')),
            ],
            options={
                'db_table': 'video_views',
            },
        ),
        migrations.CreateModel(
            name='VideoTags',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.CharField(max_length=80)),
                ('hidden', models.BooleanField(default=False)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='videos.video')),
            ],
            options={
                'db_table': 'video_tags',
            },
        ),
        migrations.CreateModel(
            name='VideoLikes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='videos.video')),
            ],
            options={
                'db_table': 'video_likes',
            },
        ),
        migrations.CreateModel(
            name='VideoDislikes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='videos.video')),
            ],
            options={
                'db_table': 'video_dislikes',
            },
        ),
        migrations.CreateModel(
            name='VideoComments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('video', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='videos.video')),
            ],
            options={
                'db_table': 'video_comments',
            },
        ),
    ]