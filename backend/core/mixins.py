from django.db import models
from rest_framework import viewsets


class SubtotalMixin:
    """
    Mixin para calcular subtotal de itens de SaleItem e PurchaseItem.
    """
    @property
    def subtotal(self):
        """Calcula o subtotal do item"""
        return self.quantity * self.product.price


class CreateSerializerMixin:
    """
    Mixin para ViewSets que precisam de serializer específico para criação, utilizado em SaleViewSet e PurchaseViewSet.
    """
    create_serializer_class = None
    custom_serializers = {}  # Para casos especiais como 'with_purchases'
    
    def get_serializer_class(self):
        """Retorna serializer específico baseado na ação"""
        if self.action == 'create':
            return self.create_serializer_class
        elif self.action in self.custom_serializers:
            return self.custom_serializers[self.action]
        return super().get_serializer_class()


class PrefetchMixin:
    """
    Mixin para ViewSets que precisam de prefetch otimizado, utilizado em SaleViewSet e PurchaseViewSet.
    """
    prefetch_fields = []
    
    def get_queryset(self):
        """QuerySet otimizado com prefetch"""
        queryset = super().get_queryset()
        if self.prefetch_fields:
            queryset = queryset.prefetch_related(*self.prefetch_fields)
        return queryset
