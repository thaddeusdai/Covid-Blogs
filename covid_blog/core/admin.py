from django.contrib import admin
from core import models

admin.site.register(models.User)
admin.site.register(models.Comment)
admin.site.register(models.ImageClassifier)
admin.site.register(models.Blog)
admin.site.register(models.Tag)
