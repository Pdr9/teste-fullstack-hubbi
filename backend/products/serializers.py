from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer para produtos.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'user', 'username', 'created_at']
        read_only_fields = ['user', 'username', 'created_at']

