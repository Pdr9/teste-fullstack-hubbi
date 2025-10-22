from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer para produtos.
    """
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'user']
        read_only_fields = ['user']
    
    def validate_price(self, value):
        """
        Valida se o preço é positivo.
        """
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero")
        return value
