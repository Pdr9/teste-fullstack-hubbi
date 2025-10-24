from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from core.mixins import CreateSerializerMixin, PrefetchMixin
from .models import Purchase
from .serializers import PurchaseSerializer, CreatePurchaseSerializer


class PurchaseViewSet(CreateSerializerMixin, PrefetchMixin, ModelViewSet):
    """
    ViewSet para gerenciar compras.
    Permite apenas leitura e criação (não permite edição ou exclusão).
    """
    
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    create_serializer_class = CreatePurchaseSerializer
    prefetch_fields = ['items__product', 'sale']
    
