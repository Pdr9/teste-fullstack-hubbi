from django.contrib import admin
from .models import Purchase, PurchaseItem
from core.admin import ItemAdminMixin


class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'sale', 'date']
    search_fields = ['user__username', 'sale__id']


class PurchaseItemAdmin(ItemAdminMixin):
    pass


admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(PurchaseItem, PurchaseItemAdmin)
