"""
Admin base classes e mixins compartilhados.
"""
from django.contrib import admin


class ItemAdminMixin(admin.ModelAdmin):
    """
    Mixin base para admins de itens (SaleItem, PurchaseItem).
    """
    list_display = ['id', 'get_parent', 'product', 'quantity']
    search_fields = ['product__name']
    
    def get_parent(self, obj):
        """Retorna o objeto pai (sale ou purchase)"""
        if hasattr(obj, 'sale'):
            return obj.sale
        elif hasattr(obj, 'purchase'):
            return obj.purchase
        return None
    get_parent.short_description = 'Relacionado'

