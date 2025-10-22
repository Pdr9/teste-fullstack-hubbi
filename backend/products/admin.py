from django.contrib import admin
from .models import Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'user']
    list_filter = ['user']
    search_fields = ['name', 'user__username']

admin.site.register(Product, ProductAdmin)
