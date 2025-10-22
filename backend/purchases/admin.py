from django.contrib import admin
from .models import Purchase, PurchaseItem

class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'sale', 'date']
    list_filter = ['user', 'date']
    search_fields = ['user__username', 'sale__id']

class PurchaseItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'purchase', 'product', 'quantity']
    list_filter = ['purchase', 'product']
    search_fields = ['product__name', 'purchase__id']

admin.site.register(Purchase, PurchaseAdmin)
admin.site.register(PurchaseItem, PurchaseItemAdmin)
