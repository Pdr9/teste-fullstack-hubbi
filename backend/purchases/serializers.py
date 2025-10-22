from rest_framework import serializers
from .models import Purchase, PurchaseItem
from sales.models import Sale
from .services import create_purchase_with_items
from core.serializers import BaseItemSerializer, BaseCreateWithItemsSerializer, validate_items_structure


class PurchaseItemSerializer(BaseItemSerializer):
    """
    Serializer para itens de compra.
    Herda toda a estrutura de BaseItemSerializer.
    """
    class Meta(BaseItemSerializer.Meta):
        model = PurchaseItem


class PurchaseSerializer(serializers.ModelSerializer):
    """
    Serializer para compras.
    """
    items = PurchaseItemSerializer(many=True, read_only=True)
    sale_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Purchase
        fields = ['id', 'user', 'sale', 'sale_info', 'date', 'items']
        read_only_fields = ['user', 'date']
    
    def get_sale_info(self, obj):
        """
        Retorna informações da venda relacionada.
        Import lazy para evitar circular import.
        """
        from sales.serializers import SaleSerializer
        return SaleSerializer(obj.sale).data


class CreatePurchaseSerializer(BaseCreateWithItemsSerializer):
    """
    Serializer para criação de compras com itens.
    Herda BaseCreateWithItemsSerializer aplicando Template Method Pattern.
    Adiciona validação de sale_id específica do domínio.
    """
    sale = serializers.IntegerField(help_text="ID da venda relacionada")
    # Campos de resposta (read-only)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    sale_id = serializers.SerializerMethodField()
    created_items = serializers.SerializerMethodField()
    sale_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Purchase
        fields = ['id', 'user', 'sale_id', 'sale_info', 'date', 'created_items']
        read_only_fields = ['user', 'date', 'created_items']
    
    def get_service(self):
        """Retorna o método de criação do PurchaseService"""
        return create_purchase_with_items
    
    def get_create_kwargs(self, validated_data):
        """Retorna sale_id como kwarg adicional"""
        return {'sale_id': validated_data['sale']}
    
    def to_representation(self, instance):
        """
        Controla a serialização manualmente para resolver problemas do DRF.
        Necessário devido a limitações na serialização automática de objetos complexos.
        """
        data = {
            'id': instance.id,
            'user': instance.user.id,
            'sale_id': instance.sale.id if instance.sale else None,
            'date': instance.date,
            'created_items': self.get_created_items(instance),
            'sale_info': self.get_sale_info(instance)
        }
        return data
    
    def get_sale_id(self, obj):
        """Retorna o ID da venda relacionada"""
        return obj.sale.id if obj.sale else None
    
    def get_created_items(self, obj):
        """Retorna os itens criados serializados"""
        return PurchaseItemSerializer(obj.items.all(), many=True).data
    
    def get_sale_info(self, obj):
        """
        Retorna informações da venda relacionada.
        Import lazy para evitar circular import.
        """
        from sales.serializers import SaleSerializer
        return SaleSerializer(obj.sale).data
    
    def validate_items(self, value):
        """Valida estrutura e produtos da compra"""
        # Primeiro valida a estrutura básica
        value = validate_items_structure(value)
        
        # Valida quantidade positiva
        for item in value:
            if item['quantity'] <= 0:
                raise serializers.ValidationError("Quantidade deve ser maior que zero")
        
        return value
    
    def validate(self, data):
        """
        Validação básica de Purchase.
        Validações de negócio são feitas no service.
        """
        sale_id = data.get('sale')
        items_data = data.get('items', [])
        
        # Validar venda existe (validação básica)
        try:
            sale = Sale.objects.get(id=sale_id)
        except Sale.DoesNotExist:
            raise serializers.ValidationError({"sale": "Venda não encontrada"})
        
        # Validar produtos pertencem à venda
        product_ids = [item['product_id'] for item in items_data]
        sale_product_ids = set(sale.items.values_list('product_id', flat=True))
        
        if not set(product_ids).issubset(sale_product_ids):
            raise serializers.ValidationError({"items": "Compra deve conter apenas produtos da venda relacionada"})
        
        return data
