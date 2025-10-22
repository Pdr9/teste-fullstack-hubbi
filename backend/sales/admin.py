from django.contrib import admin
from .models import Sale, SaleItem
from core.admin import ItemAdminMixin


class SaleAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'date']
    search_fields = ['user__username']


class SaleItemAdmin(ItemAdminMixin):
    pass


admin.site.register(Sale, SaleAdmin)
admin.site.register(SaleItem, SaleItemAdmin)
