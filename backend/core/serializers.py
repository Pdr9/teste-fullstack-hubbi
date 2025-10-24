"""
Serializers e validadores compartilhados entre apps.
"""
from rest_framework import serializers
from products.models import Product


class BaseItemSerializer(serializers.ModelSerializer):
    """Serializer base para itens (SaleItem, PurchaseItem)."""
    product = serializers.SerializerMethodField(read_only=True)
    product_id = serializers.IntegerField()
    subtotal = serializers.ReadOnlyField()
    
    def get_product(self, obj):
        """Retorna informações do produto."""
        from products.serializers import ProductSerializer
        return ProductSerializer(obj.product).data
    
    class Meta:
        abstract = True
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']

