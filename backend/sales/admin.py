from django.contrib import admin
from .models import Sale, SaleItem

class SaleAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'date']
    list_filter = ['user', 'date']
    search_fields = ['user__username']

class SaleItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'sale', 'product', 'quantity']
    list_filter = ['sale', 'product']
    search_fields = ['product__name', 'sale__id']

admin.site.register(Sale, SaleAdmin)
admin.site.register(SaleItem, SaleItemAdmin)
