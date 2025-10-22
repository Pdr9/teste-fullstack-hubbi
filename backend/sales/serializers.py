from rest_framework import serializers
from .models import Sale, SaleItem
from .services import create_sale_with_items
from core.serializers import BaseItemSerializer, BaseCreateWithItemsSerializer, validate_items_structure
from products.models import Product


class SaleItemSerializer(BaseItemSerializer):
    """
    Serializer para itens de venda.
    Herda toda a estrutura de BaseItemSerializer.
    """
    class Meta(BaseItemSerializer.Meta):
        model = SaleItem


class SaleSerializer(serializers.ModelSerializer):
    """
    Serializer para vendas.
    """
    items = SaleItemSerializer(many=True, read_only=True)
    total_value = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Sale
        fields = [
            'id', 'user', 'date', 'items', 
            'total_value', 'total_items'
        ]
        read_only_fields = ['user', 'date']


class CreateSaleSerializer(BaseCreateWithItemsSerializer):
    """
    Serializer para criação de vendas com itens.
    Herda BaseCreateWithItemsSerializer aplicando Template Method Pattern.
    """
    # Campos de resposta (read-only)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    created_items = serializers.SerializerMethodField()
    total_value = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Sale
        fields = [
            'id', 'user', 'date', 'created_items',
            'total_value', 'total_items'
        ]
        read_only_fields = ['user', 'date', 'created_items']
    
    def get_service(self):
        """Retorna o método de criação do SaleService"""
        return create_sale_with_items
    
    def to_representation(self, instance):
        """
        Controla a serialização manualmente para resolver problemas do DRF.
        Necessário devido a limitações na serialização automática de objetos complexos.
        """
        data = {
            'id': instance.id,
            'user': instance.user.id,
            'date': instance.date,
            'created_items': self.get_created_items(instance),
            'total_value': instance.total_value,
            'total_items': instance.total_items
        }
        return data
    
    def get_created_items(self, obj):
        """Retorna os itens criados serializados"""
        return SaleItemSerializer(obj.items.all(), many=True).data
    
    def validate_items(self, value):
        """Valida estrutura e existência dos produtos"""
        # Primeiro valida a estrutura básica
        value = validate_items_structure(value)
        
        # Valida quantidade positiva
        for item in value:
            if item['quantity'] <= 0:
                raise serializers.ValidationError("Quantidade deve ser maior que zero")
        
        # Depois valida se os produtos existem e pertencem ao usuário
        product_ids = [item['product_id'] for item in value]
        user_products = Product.objects.filter(
            id__in=product_ids, 
            user=self.context['request'].user
        ).values_list('id', flat=True)
        
        for item in value:
            if item['product_id'] not in user_products:
                raise serializers.ValidationError(f"Produto com ID {item['product_id']} não encontrado ou não pertence ao usuário")
        
        return value


class SaleWithPurchasesSerializer(serializers.ModelSerializer):
    """
    Serializer para venda com compras relacionadas.
    """
    items = SaleItemSerializer(many=True, read_only=True)
    purchases = serializers.SerializerMethodField()
    total_value = serializers.ReadOnlyField()
    
    class Meta:
        model = Sale
        fields = [
            'id', 'user', 'date', 'items', 'purchases',
            'total_value'
        ]
    
    def get_purchases(self, obj):
        """
        Retorna as compras relacionadas à venda.
        Import lazy para evitar circular import.
        """
        from purchases.serializers import PurchaseSerializer
        return PurchaseSerializer(obj.purchases.all(), many=True).data


class SaleStatusSerializer(serializers.ModelSerializer):
    """
    Serializer para venda com status completo de compras.
    Única fonte de informações detalhadas sobre compras.
    """
    items = SaleItemSerializer(many=True, read_only=True)
    total_value = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    purchase_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Sale
        fields = [
            'id', 'user', 'date', 'items',
            'total_value', 'total_items', 'purchase_status'
        ]
    
    def get_purchase_status(self, obj):
        """
        Retorna o status completo de compras da venda.
        """
        return obj.get_purchase_status()
