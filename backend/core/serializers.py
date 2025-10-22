"""
Serializers e validadores compartilhados entre apps.
"""
from rest_framework import serializers
from products.models import Product


class BaseItemSerializer(serializers.ModelSerializer):
    """
    Serializer base para itens (SaleItem, PurchaseItem).
    Elimina duplicação completa entre os dois serializers.
    """
    product = serializers.SerializerMethodField(read_only=True)
    product_id = serializers.IntegerField()
    subtotal = serializers.ReadOnlyField()
    
    def get_product(self, obj):
        """
        Retorna informações do produto.
        Import lazy para evitar circular import.
        """
        from products.serializers import ProductSerializer
        return ProductSerializer(obj.product).data
    
    class Meta:
        abstract = True
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']


def validate_items_structure(items):
    """
    Validador reutilizável para estrutura de items.
    
    Args:
        items: Lista de dicionários com product_id e quantity
        
    Returns:
        list: Items validados
        
    Raises:
        ValidationError: Se a estrutura for inválida
    """
    if not items:
        raise serializers.ValidationError("Deve ter pelo menos um item")
    
    for item in items:
        if 'product_id' not in item or 'quantity' not in item:
            raise serializers.ValidationError(
                "Cada item deve ter 'product_id' e 'quantity'"
            )
        if item['quantity'] <= 0:
            raise serializers.ValidationError(
                "A quantidade deve ser maior que zero"
            )
    
    return items


class BaseCreateWithItemsSerializer(serializers.Serializer):
    """
    Serializer base para criação de entidades com itens.
    
    DRY: Elimina duplicação entre CreateSaleSerializer e CreatePurchaseSerializer.
    Template Method Pattern aplicado também em serializers.
    """
    items = serializers.ListField(
        child=serializers.DictField(),
        help_text="Lista de itens com product_id e quantity",
        write_only=True  # Campo apenas para entrada, não para saída
    )
    
    def validate_items(self, value):
        """Valida estrutura dos items (comum a todos)"""
        return validate_items_structure(value)
    
    def get_service(self):
        """
        Hook method: Subclasses retornam o service específico.
        Dependency Injection pattern.
        """
        raise NotImplementedError("Subclasses devem implementar get_service()")
    
    def get_create_kwargs(self, validated_data):
        """
        Hook method: Subclasses retornam kwargs específicos.
        Open/Closed Principle: Aberto para extensão.
        """
        return {}
    
    def create(self, validated_data):
        """
        Template Method: Define o algoritmo de criação.
        Liskov Substitution: Subclasses podem substituir sem quebrar comportamento.
        """
        user = self.context['request'].user
        items = validated_data['items']
        kwargs = self.get_create_kwargs(validated_data)
        
        service = self.get_service()
        return service(user, items, **kwargs)

