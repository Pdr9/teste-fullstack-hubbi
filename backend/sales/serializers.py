from rest_framework import serializers
from .models import Sale, SaleItem
from core.services import create_entity_with_items
from core.serializers import BaseItemSerializer


class SaleItemSerializer(BaseItemSerializer):
    """Serializer para itens de venda."""
    class Meta(BaseItemSerializer.Meta):
        model = SaleItem


class SaleSerializer(serializers.ModelSerializer):
    """Serializer para vendas."""
    items = SaleItemSerializer(many=True, read_only=True)
    total_value = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Sale
        fields = [
            'id', 'user', 'username', 'date', 'items', 
            'total_value', 'total_items'
        ]
        read_only_fields = ['user', 'username', 'date']


class CreateSaleSerializer(serializers.Serializer):
    """Serializer para criação de vendas com itens."""
    items = serializers.ListField(
        child=serializers.DictField(),
        help_text="Lista de itens com product_id e quantity",
        write_only=True
    )
    
    def create(self, validated_data):
        """Cria venda com itens usando service genérico"""
        user = self.context['request'].user
        items = validated_data['items']
        
        return create_entity_with_items(
            entity_model=Sale,
            item_model=SaleItem,
            parent_field='sale',
            user=user,
            items_data=items
        )


class SaleWithPurchasesSerializer(SaleSerializer):
    """Serializer para venda com compras relacionadas."""
    purchases = serializers.SerializerMethodField()
    
    class Meta(SaleSerializer.Meta):
        fields = SaleSerializer.Meta.fields + ['purchases']
    
    def get_purchases(self, obj):
        """Retorna as compras relacionadas à venda."""
        from purchases.serializers import PurchaseSerializer
        return PurchaseSerializer(obj.purchases.all(), many=True).data


class SaleStatusSerializer(SaleSerializer):
    """Serializer para venda com status completo de compras."""
    purchase_status = serializers.SerializerMethodField()
    
    class Meta(SaleSerializer.Meta):
        fields = SaleSerializer.Meta.fields + ['purchase_status']
    
    def get_purchase_status(self, obj):
        """Retorna o status completo de compras da venda."""
        return obj.get_purchase_status()
