from rest_framework import serializers
from .models import Purchase, PurchaseItem
from core.services import create_entity_with_items
from core.serializers import BaseItemSerializer
from sales.models import Sale


class PurchaseItemSerializer(BaseItemSerializer):
    """Serializer para itens de compra."""
    class Meta(BaseItemSerializer.Meta):
        model = PurchaseItem


class PurchaseSerializer(serializers.ModelSerializer):
    """Serializer para compras."""
    items = PurchaseItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    total_value = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Purchase
        fields = ['id', 'user', 'username', 'sale', 'date', 'items', 'total_value', 'total_items']
        read_only_fields = ['user', 'username', 'date']


class CreatePurchaseSerializer(serializers.Serializer):
    """Serializer para criação de compras com itens."""
    sale = serializers.IntegerField(help_text="ID da venda relacionada", write_only=True)
    items = serializers.ListField(
        child=serializers.DictField(),
        help_text="Lista de itens com product_id e quantity",
        write_only=True
    )
    
    def validate(self, data):
        """Valida apenas regras críticas de negócio"""
        sale_id = data.get('sale')
        
        # Validar venda existe (única validação crítica)
        try:
            Sale.objects.get(id=sale_id)
        except Sale.DoesNotExist:
            raise serializers.ValidationError("Venda não encontrada")
        
        return data
    
    def create(self, validated_data):
        """Cria compra com itens usando service genérico"""
        user = self.context['request'].user
        items = validated_data['items']
        sale_id = validated_data['sale']
        
        return create_entity_with_items(
            entity_model=Purchase,
            item_model=PurchaseItem,
            parent_field='purchase',
            user=user,
            items_data=items,
            sale_id=sale_id
        )
